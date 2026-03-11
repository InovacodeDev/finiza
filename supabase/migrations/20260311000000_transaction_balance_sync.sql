-- supabase/migrations/20260311000000_transaction_balance_sync.sql

-- Função para atualizar saldo de conta de forma atômica
-- SECURITY INVOKER (padrão) para respeitar as políticas de RLS da tabela 'accounts'
CREATE OR REPLACE FUNCTION update_account_balance(
  p_account_id UUID,
  p_amount_delta NUMERIC
) RETURNS VOID AS $$
BEGIN
  UPDATE public.accounts
  SET balance = balance + p_amount_delta,
      updated_at = NOW()
  WHERE id = p_account_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Conta não encontrada ou acesso negado para atualização de saldo.';
  END IF;
END;
$$ LANGUAGE plpgsql;
