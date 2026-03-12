import test from 'node:test';
import assert from 'node:assert';
import { TransactionFilters } from '@/types/transactions';

test('transaction filters type validation', () => {
  const filters: TransactionFilters = {
    search: "test",
    type: "income",
    status: "paid",
    accountId: "123",
    categoryId: "456",
    startDate: "2026-03-01",
    endDate: "2026-03-31"
  };

  assert.strictEqual(filters.search, "test");
  assert.strictEqual(filters.type, "income");
  assert.strictEqual(filters.status, "paid");
  assert.strictEqual(filters.accountId, "123");
  assert.strictEqual(filters.categoryId, "456");
  assert.strictEqual(filters.startDate, "2026-03-01");
  assert.strictEqual(filters.endDate, "2026-03-31");
});

test('transaction filters with "all" values', () => {
    const filters: TransactionFilters = {
      type: "all",
      status: "all",
      accountId: "all",
      categoryId: "all"
    };
  
    assert.strictEqual(filters.type, "all");
    assert.strictEqual(filters.status, "all");
    assert.strictEqual(filters.accountId, "all");
    assert.strictEqual(filters.categoryId, "all");
});
