-- supabase/migrations/20260302095344_credit_cards_invoices.sql

-- 1. Criação das Entidades de Cartão de Crédito e Fatura
CREATE TABLE credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE, -- Conta corrente vinculada para pagamento
  name TEXT NOT NULL,
  closing_day INTEGER NOT NULL CHECK (closing_day BETWEEN 1 AND 31),
  due_day INTEGER NOT NULL CHECK (due_day BETWEEN 1 AND 31),
  limit_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  credit_card_id UUID NOT NULL REFERENCES credit_cards(id) ON DELETE CASCADE,
  reference_month DATE NOT NULL,
  due_date DATE NOT NULL,
  amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  status transaction_status NOT NULL DEFAULT 'pending',
  system_transaction_id UUID, -- FK condicional (referência à transação na conta corrente)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(credit_card_id, reference_month)
);

-- 2. Extensão do Schema de Transações
ALTER TABLE transactions
  ADD COLUMN credit_card_id UUID REFERENCES credit_cards(id) ON DELETE CASCADE,
  ADD COLUMN invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  ADD COLUMN is_system_readonly BOOLEAN NOT NULL DEFAULT false;

-- 3. Proteção e Imutabilidade (Bloqueio de API)
CREATE OR REPLACE FUNCTION prevent_system_tx_mutation()
RETURNS TRIGGER AS $$
BEGIN
  -- A função current_setting avalia se a requisição originou-se da API (PostgREST)
  -- Impede que o usuário edite ou apague a fatura "pré-criada" manualmente
  IF OLD.is_system_readonly = true AND current_setting('request.jwt.claims', true) IS NOT NULL THEN
    RAISE EXCEPTION 'Transações de sistema (Faturas) são gerenciadas automaticamente e não podem ser alteradas.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_readonly_system_tx
  BEFORE UPDATE OR DELETE ON transactions
  FOR EACH ROW EXECUTE PROCEDURE prevent_system_tx_mutation();

-- 4. Motor de Roteamento de Faturas (Cálculo de Ciclo e Shadow Transaction)
CREATE OR REPLACE FUNCTION route_cc_transaction()
RETURNS TRIGGER AS $$
DECLARE
  v_closing_day INTEGER;
  v_due_day INTEGER;
  v_checking_account_id UUID;
  v_invoice_month DATE;
  v_due_date DATE;
  v_invoice_id UUID;
  v_shadow_tx_id UUID;
BEGIN
  -- Bypass para transações normais (débito/dinheiro)
  IF NEW.credit_card_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT closing_day, due_day, account_id 
  INTO v_closing_day, v_due_day, v_checking_account_id
  FROM credit_cards WHERE id = NEW.credit_card_id;

  -- Lógica de particionamento de ciclo: Compras feitas após o dia de fechamento caem no mês subsequente
  IF EXTRACT(DAY FROM NEW.transaction_date) >= v_closing_day THEN
    v_invoice_month := date_trunc('month', NEW.transaction_date) + INTERVAL '1 month';
  ELSE
    v_invoice_month := date_trunc('month', NEW.transaction_date);
  END IF;

  -- Padroniza o vencimento da fatura com base no due_day
  v_due_date := v_invoice_month + (v_due_day - 1) * INTERVAL '1 day';

  -- Upsert: Tenta localizar a fatura alvo
  SELECT id, system_transaction_id INTO v_invoice_id, v_shadow_tx_id
  FROM invoices 
  WHERE credit_card_id = NEW.credit_card_id AND reference_month = v_invoice_month;

  IF v_invoice_id IS NULL THEN
    -- Injeta a "Shadow Transaction" na conta corrente alvo. is_system_readonly = true garante segurança.
    INSERT INTO transactions (
      user_id, account_id, type, status, amount, description, transaction_date, is_system_readonly
    ) VALUES (
      NEW.user_id, v_checking_account_id, 'expense', 'pending', 0.00, 
      'Fatura Cartão - ' || to_char(v_invoice_month, 'MM/YYYY'), 
      v_due_date, true
    ) RETURNING id INTO v_shadow_tx_id;

    -- Cria o registro físico da fatura vinculada à transação sombra
    INSERT INTO invoices (
      credit_card_id, reference_month, due_date, amount, system_transaction_id
    ) VALUES (
      NEW.credit_card_id, v_invoice_month, v_due_date, 0.00, v_shadow_tx_id
    ) RETURNING id INTO v_invoice_id;
  END IF;

  -- Vincula a transação (ou a parcela atual) à fatura alocada
  NEW.invoice_id := v_invoice_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_route_cc_transaction
  BEFORE INSERT OR UPDATE OF transaction_date, amount, credit_card_id ON transactions
  FOR EACH ROW EXECUTE PROCEDURE route_cc_transaction();

-- 5. Atualização Reativa de Saldos (After Trigger)
-- Declarada com SECURITY DEFINER para que possua privilégios internos capazes de transpor o bloqueio de edição
CREATE OR REPLACE FUNCTION update_invoice_totals()
RETURNS TRIGGER AS $$
DECLARE
  v_invoice_id UUID;
  v_shadow_tx_id UUID;
  v_total NUMERIC(15, 2);
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_invoice_id := OLD.invoice_id;
  ELSE
    v_invoice_id := NEW.invoice_id;
  END IF;

  IF v_invoice_id IS NOT NULL THEN
    -- Agregação do somatório da fatura
    SELECT COALESCE(SUM(amount), 0.00) INTO v_total
    FROM transactions
    WHERE invoice_id = v_invoice_id AND id != (SELECT system_transaction_id FROM invoices WHERE id = v_invoice_id);

    -- Propaga a alteração de estado para a Fatura
    UPDATE invoices SET amount = v_total WHERE id = v_invoice_id 
    RETURNING system_transaction_id INTO v_shadow_tx_id;

    -- Propaga a alteração de estado para a Shadow Transaction (refletindo no Fluxo de Caixa global)
    IF v_shadow_tx_id IS NOT NULL THEN
      UPDATE transactions SET amount = v_total WHERE id = v_shadow_tx_id;
    END IF;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_invoice_totals
  AFTER INSERT OR UPDATE OF amount, invoice_id OR DELETE ON transactions
  FOR EACH ROW EXECUTE PROCEDURE update_invoice_totals();
