import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_TAMER_DATA,
  mergePendingMutations,
  UserTamerData,
} from './storageService';

test('merges pending offline mutations correctly', () => {
  const base: UserTamerData = { ...DEFAULT_TAMER_DATA };

  const mutations: Partial<UserTamerData>[] = [
    { displayName: 'Digital Hero' },
    { starterDigimon: 'veemon' },
    { resolutionScale: 100 },
  ];

  const merged = mergePendingMutations(base, mutations);
  assert.equal(merged.displayName, 'Digital Hero');
  assert.equal(merged.starterDigimon, 'veemon');
  assert.equal(merged.resolutionScale, 100);
  // Preserved untouched properties
  assert.equal(merged.buttonScale, 'medium');
});

test('default tamer data conforms to requirements', () => {
  assert.equal(DEFAULT_TAMER_DATA.starterDigimon, 'dorumon');
  assert.equal(DEFAULT_TAMER_DATA.resolutionScale, 67);
  assert.equal(DEFAULT_TAMER_DATA.antiAliasing, 'SMAA 2x');
});
