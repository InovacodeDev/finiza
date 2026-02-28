-- supabase/migrations/00003_transactions_schema.sql

-- -----------------------------------------------------------------------------
-- Tipos de Domínio
-- -----------------------------------------------------------------------------
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer', 'adjustment');
CREATE TYPE transaction_status AS ENUM ('pending', 'paid');

-- -----------------------------------------------------------------------------
-- Tabela de Categorias (Auxiliar)
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_slug TEXT NOT NULL,
  color_hex VARCHAR(7),
  is_system BOOLEAN DEFAULT false, -- True para categorias imutáveis (ex: "Ajuste de Saldo")
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Tabela Principal de Transações
-- -----------------------------------------------------------------------------
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id), -- Quem criou (Sincronia Doméstica)
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  destination_account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  
  type transaction_type NOT NULL,
  status transaction_status NOT NULL DEFAULT 'paid',
  
  -- Valor absoluto. O sinal matemático é inferido pela aplicação baseada no 'type'
  amount NUMERIC(15, 2) NOT NULL CHECK (amount >= 0),
  description TEXT NOT NULL,
  transaction_date DATE NOT NULL,
  
  -- Metadados de Parcelamento e Recorrência (Bússola Temporal)
  group_id UUID, -- Agrupa transações recorrentes ou parceladas (gerado via app)
  installment_current INTEGER CHECK (installment_current > 0),
  installment_total INTEGER CHECK (installment_total >= installment_current),
  is_recurring BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Restrições de Integridade Lógica
  CONSTRAINT valid_transfer CHECK (
    (type = 'transfer' AND destination_account_id IS NOT NULL AND account_id != destination_account_id) OR
    (type != 'transfer' AND destination_account_id IS NULL)
  )
);

-- Índices para otimização de consultas da Bússola Temporal e Buscas
CREATE INDEX idx_transactions_account_date ON transactions(account_id, transaction_date);
CREATE INDEX idx_transactions_group_id ON transactions(group_id) WHERE group_id IS NOT NULL;
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

-- -----------------------------------------------------------------------------
-- Segurança em Nível de Linha (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Categorias de sistema são visíveis para todos os usuários autenticados
CREATE POLICY "categorias_leitura_global" ON categories 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Transações: O usuário só acessa transações de contas onde ele é membro (via account_members)
CREATE POLICY "transacoes_acesso_membros" ON transactions 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM account_members 
      WHERE account_members.account_id = transactions.account_id 
      AND account_members.user_id = auth.uid()
    )
    AND 
    (
      destination_account_id IS NULL OR EXISTS (
        SELECT 1 FROM account_members 
        WHERE account_members.account_id = transactions.destination_account_id 
        AND account_members.user_id = auth.uid()
      )
    )
  );

-- -----------------------------------------------------------------------------
-- View Otimizada para o Dashboard (Projeções)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW monthly_cashflow AS
SELECT 
  account_id,
  date_trunc('month', transaction_date)::date AS month_reference,
  SUM(CASE WHEN type = 'income' AND status = 'paid' THEN amount ELSE 0 END) AS realized_income,
  SUM(CASE WHEN type = 'expense' AND status = 'paid' THEN amount ELSE 0 END) AS realized_expense,
  SUM(CASE WHEN type = 'income' AND status = 'pending' THEN amount ELSE 0 END) AS projected_income,
  SUM(CASE WHEN type = 'expense' AND status = 'pending' THEN amount ELSE 0 END) AS projected_expense
FROM transactions
WHERE type IN ('income', 'expense')
GROUP BY account_id, date_trunc('month', transaction_date);

-- Trigger de Auditoria (reaproveitando função da migration anterior)
CREATE TRIGGER update_transactions_modtime
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
