-- Atualiza a função de bloqueio de mutação para permitir bypass interno através do config customizado 'finiza.bypass_readonly'
CREATE OR REPLACE FUNCTION prevent_system_tx_mutation()
RETURNS TRIGGER AS $$
BEGIN
  -- A função current_setting avalia se a requisição originou-se da API (PostgREST)
  -- Impede que o usuário edite ou apague a fatura "pré-criada" manualmente
  IF OLD.is_system_readonly = true AND current_setting('request.jwt.claims', true) IS NOT NULL AND current_setting('finiza.bypass_readonly', true) IS DISTINCT FROM 'true' THEN
    RAISE EXCEPTION 'Transações de sistema (Faturas) são gerenciadas automaticamente e não podem ser alteradas.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Atualiza o agregador para definir a configuração de bypass da transação de sistema readonly temporalmente
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
      PERFORM set_config('finiza.bypass_readonly', 'true', true);
      UPDATE transactions SET amount = v_total WHERE id = v_shadow_tx_id;
      PERFORM set_config('finiza.bypass_readonly', 'false', true);
    END IF;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
