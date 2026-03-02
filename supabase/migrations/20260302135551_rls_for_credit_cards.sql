-- Enable RLS on the new tables
ALTER TABLE credit_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Credit Cards Policies
-- Users can view credit cards if they have access to the linked account
CREATE POLICY "Users can view their credit cards"
  ON credit_cards FOR SELECT
  USING (
    account_id IN (
      SELECT account_id FROM account_members WHERE user_id = auth.uid()
    )
  );

-- Users can insert credit cards if they own the linked account
CREATE POLICY "Users can insert their credit cards"
  ON credit_cards FOR INSERT
  WITH CHECK (
    account_id IN (
      SELECT account_id FROM account_members WHERE user_id = auth.uid()
    )
  );

-- Users can update credit cards if they have access to the linked account
CREATE POLICY "Users can update their credit cards"
  ON credit_cards FOR UPDATE
  USING (
    account_id IN (
      SELECT account_id FROM account_members WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    account_id IN (
      SELECT account_id FROM account_members WHERE user_id = auth.uid()
    )
  );

-- Users can delete credit cards if they have access to the linked account
CREATE POLICY "Users can delete their credit cards"
  ON credit_cards FOR DELETE
  USING (
    account_id IN (
      SELECT account_id FROM account_members WHERE user_id = auth.uid()
    )
  );


-- Invoices Policies
-- Users can view invoices if they have access to the credit card
CREATE POLICY "Users can view their invoices"
  ON invoices FOR SELECT
  USING (
    credit_card_id IN (
      SELECT id FROM credit_cards WHERE account_id IN (
        SELECT account_id FROM account_members WHERE user_id = auth.uid()
      )
    )
  );

-- Users can insert invoices if they have access to the credit card
CREATE POLICY "Users can insert their invoices"
  ON invoices FOR INSERT
  WITH CHECK (
    credit_card_id IN (
      SELECT id FROM credit_cards WHERE account_id IN (
        SELECT account_id FROM account_members WHERE user_id = auth.uid()
      )
    )
  );

-- Users can update invoices if they have access to the credit card
CREATE POLICY "Users can update their invoices"
  ON invoices FOR UPDATE
  USING (
    credit_card_id IN (
      SELECT id FROM credit_cards WHERE account_id IN (
        SELECT account_id FROM account_members WHERE user_id = auth.uid()
      )
    )
  );

-- Users can delete invoices if they have access to the credit card
CREATE POLICY "Users can delete their invoices"
  ON invoices FOR DELETE
  USING (
    credit_card_id IN (
      SELECT id FROM credit_cards WHERE account_id IN (
        SELECT account_id FROM account_members WHERE user_id = auth.uid()
      )
    )
  );
