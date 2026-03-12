import test from 'node:test';
import assert from 'node:assert';
import { updateSettingsSchema } from './profile-schema';

test('updateSettingsSchema validation - valid data', () => {
  const validData = {
    currency: "USD",
    language: "en-US",
    reserva_meses: 12,
    notifications_enabled: false
  };

  const result = updateSettingsSchema.safeParse(validData);
  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(result.data.currency, "USD");
    assert.strictEqual(result.data.reserva_meses, 12);
  }
});

test('updateSettingsSchema validation - defaults', () => {
  const emptyData = {};

  const result = updateSettingsSchema.safeParse(emptyData);
  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(result.data.currency, "BRL");
    assert.strictEqual(result.data.reserva_meses, 6);
    assert.strictEqual(result.data.notifications_enabled, true);
  }
});

test('updateSettingsSchema validation - invalid reserva_meses', () => {
  const invalidData = {
    reserva_meses: 0
  };

  const result = updateSettingsSchema.safeParse(invalidData);
  assert.strictEqual(result.success, false);
});

test('updateSettingsSchema validation - too many reserva_meses', () => {
  const invalidData = {
    reserva_meses: 61
  };

  const result = updateSettingsSchema.safeParse(invalidData);
  assert.strictEqual(result.success, false);
});
