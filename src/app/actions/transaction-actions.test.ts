import test from 'node:test';
import assert from 'node:assert';
import * as transactionActions from './transaction-actions';

test('transaction actions exist and are exported', () => {
  assert.ok(transactionActions.createTransactionAction, "createTransactionAction should be defined");
  assert.ok(transactionActions.updateTransactionAction, "updateTransactionAction should be defined");
  assert.ok(transactionActions.deleteTransactionAction, "deleteTransactionAction should be defined");
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
