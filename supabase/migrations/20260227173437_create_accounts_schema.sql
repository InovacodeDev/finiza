-- Criação de tipos estritos para integridade de domínio
CREATE TYPE account_category AS ENUM ('checking', 'savings', 'wallet', 'vault', 'credit');
CREATE TYPE access_role AS ENUM ('owner', 'editor', 'viewer');

-- Tabela principal de liquidez
CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  institution TEXT,
  category account_category NOT NULL DEFAULT 'checking',
  balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
  color_hex VARCHAR(7),
  icon_slug TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT valid_color_hex CHECK (color_hex ~* '^#[a-f0-9]{6}$')
);

-- Tabela pivô para Sincronia Doméstica (Compartilhamento)
CREATE TABLE account_members (
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role access_role NOT NULL DEFAULT 'owner',
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (account_id, user_id)
);

-- Índices de performance para as consultas RLS
CREATE INDEX idx_account_members_user_id ON account_members(user_id);
CREATE INDEX idx_account_members_account_id ON account_members(account_id);

-- Ativação estrita de segurança em nível de linha
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_members ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- Políticas RLS (Row Level Security)
-- -----------------------------------------------------------------------------

-- Membros: O utilizador apenas vê os registos de partilha onde está envolvido
CREATE POLICY "membros_isolamento_leitura" ON account_members 
  FOR SELECT USING (auth.uid() = user_id);

-- Contas: O utilizador lê apenas as contas que lhe foram atribuídas
CREATE POLICY "contas_leitura_permitida" ON accounts 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM account_members 
      WHERE account_id = accounts.id 
      AND user_id = auth.uid()
    )
  );

-- Contas: Apenas 'owner' ou 'editor' podem modificar metadados ou saldos manuais
CREATE POLICY "contas_modificacao_restrita" ON accounts 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM account_members 
      WHERE account_id = accounts.id 
      AND user_id = auth.uid() 
      AND role IN ('owner', 'editor')
    )
  );

-- Contas: Apenas o 'owner' pode eliminar a conta física
CREATE POLICY "contas_eliminacao_proprietario" ON accounts 
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM account_members 
      WHERE account_id = accounts.id 
      AND user_id = auth.uid() 
      AND role = 'owner'
    )
  );

-- -----------------------------------------------------------------------------
-- Trigger Automático de Auditoria
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_accounts_modtime
BEFORE UPDATE ON accounts
FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
