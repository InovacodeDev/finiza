-- Add settings columns to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL',
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'pt-BR',
ADD COLUMN IF NOT EXISTS reserva_meses INTEGER DEFAULT 6,
ADD COLUMN IF NOT EXISTS notifications_enabled BOOLEAN DEFAULT TRUE;
