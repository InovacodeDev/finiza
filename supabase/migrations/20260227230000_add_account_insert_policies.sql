CREATE OR REPLACE FUNCTION public.handle_new_account() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.account_members (account_id, user_id, role)
  VALUES (NEW.id, auth.uid(), 'owner');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_account_created
  AFTER INSERT ON public.accounts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_account();

CREATE POLICY "contas_insercao_permitida" ON accounts 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "membros_insercao_permitida" ON account_members
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "membros_modificacao_restrita" ON account_members
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM account_members am
      WHERE am.account_id = account_members.account_id 
      AND am.user_id = auth.uid() 
      AND am.role = 'owner'
    )
  );

CREATE POLICY "membros_eliminacao_proprietario" ON account_members
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM account_members am
      WHERE am.account_id = account_members.account_id 
      AND am.user_id = auth.uid() 
      AND am.role = 'owner'
    )
  );
