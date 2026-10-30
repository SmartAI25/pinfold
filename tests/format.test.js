const test = require('node:test');
const assert = require('node:assert');
const { formatMemory, formatTimeAgo } = require('../utils/storage.js');

test('formatMemory handles zero, negative, and invalid inputs', () => {
  assert.strictEqual(formatMemory(0), '0 MB');
  assert.strictEqual(formatMemory(-10), '0 MB');
  assert.strictEqual(formatMemory(undefined), '0 MB');
  assert.strictEqual(formatMemory(null), '0 MB');
});

test('formatMemory formats megabytes below 1024', () => {
  assert.strictEqual(formatMemory(100), '100 MB');
  assert.strictEqual(formatMemory(512.4), '512 MB');
  assert.strictEqual(formatMemory(1023), '1023 MB');
});

test('formatMemory formats gigabytes at 1024 boundary and above', () => {
  assert.strictEqual(formatMemory(1024), '1.0 GB');
  assert.strictEqual(formatMemory(1536), '1.5 GB');
  assert.strictEqual(formatMemory(2048), '2.0 GB');
});

test('formatTimeAgo handles falsy inputs', () => {
  assert.strictEqual(formatTimeAgo(0), '');
  assert.strictEqual(formatTimeAgo(undefined), '');
  assert.strictEqual(formatTimeAgo(null), '');
});

test('formatTimeAgo handles future timestamps and recent seconds', () => {
  const now = Date.now();
  assert.strictEqual(formatTimeAgo(now + 5000), 'Just now');
  assert.strictEqual(formatTimeAgo(now - 10000), 'Just now');
  assert.strictEqual(formatTimeAgo(now - 59 * 1000), 'Just now');
});

test('formatTimeAgo handles minute boundaries', () => {
  const now = Date.now();
  assert.strictEqual(formatTimeAgo(now - 60 * 1000), '1m ago');
  assert.strictEqual(formatTimeAgo(now - 5 * 60 * 1000), '5m ago');
  assert.strictEqual(formatTimeAgo(now - 59 * 60 * 1000), '59m ago');
});

test('formatTimeAgo handles hour and yesterday boundaries', () => {
  const now = Date.now();
  assert.strictEqual(formatTimeAgo(now - 60 * 60 * 1000), '1h ago');
  assert.strictEqual(formatTimeAgo(now - 23 * 3600 * 1000), '23h ago');
  assert.strictEqual(formatTimeAgo(now - 24 * 3600 * 1000), 'Yesterday');
  assert.strictEqual(formatTimeAgo(now - 47 * 3600 * 1000), 'Yesterday');
});

test('formatTimeAgo handles day boundaries', () => {
  const now = Date.now();
  assert.strictEqual(formatTimeAgo(now - 48 * 3600 * 1000), '2d ago');
  assert.strictEqual(formatTimeAgo(now - 6 * 86400 * 1000), '6d ago');
});

test('formatTimeAgo falls through to locale date string for 7+ days', () => {
  const ts = Date.now() - 7 * 86400 * 1000;
  const expectedDate = new Date(ts);
  const expectedStr = expectedDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: expectedDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
  assert.strictEqual(formatTimeAgo(ts), expectedStr);
});
