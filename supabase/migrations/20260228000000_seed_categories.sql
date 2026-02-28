-- supabase/migrations/20260228000000_seed_categories.sql

INSERT INTO categories (name, icon_slug, color_hex, is_system) VALUES
  ('Ajuste de Saldo', 'adjustment', '#52525b', true),
  ('Conta Inicial', 'dollar-sign', '#10b981', true),
  ('Salário', 'dollar-sign', '#10b981', false),
  ('Rendimentos', 'trending-up', '#3b82f6', false),
  ('Renda Extra', 'plus-circle', '#10b981', false),
  ('Vendas', 'shopping-bag', '#10b981', false),
  ('Alimentação', 'coffee', '#f59e0b', false),
  ('Mercado', 'shopping-cart', '#84cc16', false),
  ('Moradia', 'home', '#3b82f6', false),
  ('Transporte', 'car', '#6366f1', false),
  ('Saúde', 'heart', '#ef4444', false),
  ('Educação', 'book-open', '#8b5cf6', false),
  ('Lazer', 'gamepad', '#ec4899', false),
  ('Compras', 'shopping-bag', '#f43f5e', false),
  ('Contas & Serviços', 'zap', '#eab308', false),
  ('Assinaturas', 'tv', '#a855f7', false),
  ('Pets', 'paw-print', '#f97316', false),
  ('Viagem', 'plane', '#14b8a6', false),
  ('Presentes', 'gift', '#ec4899', false),
  ('Impostos & Taxas', 'file-text', '#64748b', false),
  ('Outros', 'more-horizontal', '#94a3b8', false);
