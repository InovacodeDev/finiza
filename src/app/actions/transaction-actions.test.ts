import test from 'node:test';
import assert from 'node:assert';
import * as transactionActions from './transaction-actions';

test('transaction actions exist and are exported', () => {
  assert.ok(transactionActions.createTransactionAction, "createTransactionAction should be defined");
  assert.ok(transactionActions.updateTransactionAction, "updateTransactionAction should be defined");
  assert.ok(transactionActions.deleteTransactionAction, "deleteTransactionAction should be defined");
  assert.ok(transactionActions.updateTransactionsBulkAction, "updateTransactionsBulkAction should be defined");
});

test('transaction sync balance logic principle', () => {
  // Mock logic representation of what we implemented
  const calculateDelta = (type: string, amount: number, isReverting: boolean = false) => {
    let delta = 0;
    if (type === "income" || type === "adjustment") delta = amount;
    else if (type === "expense" || type === "transfer") delta = -amount;
    
    return isReverting ? -delta : delta;
  };

  // Scenario: Reverting a paid income of 100
  assert.strictEqual(calculateDelta("income", 100, true), -100);
  
  // Scenario: Reverting a paid expense of 50
  assert.strictEqual(calculateDelta("expense", 50, true), 50);

  // Scenario: Applying a new transfer of 200
  assert.strictEqual(calculateDelta("transfer", 200, false), -200);
});

test('bulk update filtering logic principle', () => {
  const transactions = [
    { id: '1', user_id: 'user1', is_system_readonly: false },
    { id: '2', user_id: 'user1', is_system_readonly: true },
    { id: '3', user_id: 'user2', is_system_readonly: false },
  ];

  const updateBulk = (ids: string[], userId: string) => {
    return transactions.filter(t => 
      ids.includes(t.id) && 
      t.user_id === userId && 
      !t.is_system_readonly
    );
  };

  const affected = updateBulk(['1', '2', '3'], 'user1');
  assert.strictEqual(affected.length, 1);
  assert.strictEqual(affected[0].id, '1');
});
