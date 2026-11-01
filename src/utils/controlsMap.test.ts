import test from 'node:test';
import assert from 'node:assert/strict';
import { GAME_CONTROLS, PLAYABLE_DIGIMON, getControlById } from './controlsMap';

test('defines all standard DW4 action buttons', () => {
  const ids = GAME_CONTROLS.map((c) => c.id);
  assert.ok(ids.includes('btn-attack'));
  assert.ok(ids.includes('btn-jump'));
  assert.ok(ids.includes('btn-defend'));
  assert.ok(ids.includes('btn-heal'));
  assert.ok(ids.includes('btn-items'));
  assert.ok(ids.includes('btn-spells'));
  assert.ok(ids.includes('btn-pause'));
});

test('retrieves control by id correctly', () => {
  const attack = getControlById('btn-attack');
  assert.ok(attack);
  assert.equal(attack?.nameEn, 'ATTACK (A)');
  assert.equal(attack?.soundEffect, 'slash');
});

test('defines the 4 iconic starter Digimon', () => {
  assert.equal(PLAYABLE_DIGIMON.length, 4);
  const names = PLAYABLE_DIGIMON.map((d) => d.name);
  assert.deepEqual(names, ['Dorumon', 'Agumon', 'Veemon', 'Guilmon']);
});
