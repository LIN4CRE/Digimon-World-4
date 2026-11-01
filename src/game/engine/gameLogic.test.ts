import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getStarterDigimonStats,
  calculateMeleeDamage,
  calculatePlayerDamageTaken,
  checkCollision,
  addExpAndCheckLevelUp,
  generateWaveEnemies,
} from './gameLogic';

test('initializes starter stats for Dorumon and Agumon', () => {
  const dorumon = getStarterDigimonStats('dorumon');
  assert.equal(dorumon.attackPower, 40);
  assert.equal(dorumon.hp, 580);

  const agumon = getStarterDigimonStats('agumon');
  assert.equal(agumon.attackPower, 38);
  assert.equal(agumon.hp, 600);
});

test('calculates combo damage with multiplier', () => {
  const hit1 = calculateMeleeDamage(40, 10, 0, false);
  const hit3 = calculateMeleeDamage(40, 10, 2, false);
  assert.ok(hit3.damage > hit1.damage);
});

test('reduces damage by 80% when player is guarding', () => {
  const unblocked = calculatePlayerDamageTaken(50, 20, false);
  const blocked = calculatePlayerDamageTaken(50, 20, true);
  assert.ok(blocked < unblocked);
  assert.equal(blocked, Math.floor((50 - 10) * 0.2));
});

test('detects circle collision accurately', () => {
  assert.equal(checkCollision(0, 0, 1.5, 2, 0, 1.0), true);
  assert.equal(checkCollision(0, 0, 1.0, 10, 10, 1.0), false);
});

test('triggers level up when experience reaches threshold', () => {
  const stats = getStarterDigimonStats('veemon');
  const result = addExpAndCheckLevelUp(stats, 150);
  assert.equal(result.leveledUp, true);
  assert.equal(result.stats.level, 2);
  assert.equal(result.stats.exp, 50);
});

test('generates balanced enemies per wave', () => {
  const wave1 = generateWaveEnemies(1);
  assert.equal(wave1.length, 5); // 3 + 1*2

  const wave5 = generateWaveEnemies(5);
  const hasBoss = wave5.some((e) => e.type === 'mecharogue');
  assert.equal(hasBoss, true);
});
