import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateXbeFile,
  translateLauncherString,
  getRecommendedConfigForDevice,
  REQUIRED_GAME_FILES,
} from './romValidator';

test('validates authentic default.xbe USA release', () => {
  const result = validateXbeFile(
    'default.xbe',
    3887104,
    'c270c083befccbc78f5294436984b7593b0f5d63'
  );
  assert.equal(result.isValid, true);
  assert.equal(result.sizeMatches, true);
  assert.equal(result.sha1Matches, true);
});

test('detects size mismatch in default.xbe', () => {
  const result = validateXbeFile('default.xbe', 2000000, 'abc');
  assert.equal(result.isValid, false);
  assert.equal(result.sizeMatches, false);
});

test('detects sha1 hash mismatch', () => {
  const result = validateXbeFile('default.xbe', 3887104, 'wronghash1234567890');
  assert.equal(result.isValid, false);
  assert.equal(result.sizeMatches, true);
  assert.equal(result.sha1Matches, false);
});

test('translates Portuguese launcher strings to English', () => {
  assert.equal(translateLauncherString('ESCOLHER PASTA'), 'CHOOSE FOLDER');
  assert.equal(translateLauncherString('JOGAR'), 'PLAY GAME');
  assert.equal(translateLauncherString('ATACAR'), 'ATTACK (A)');
  assert.equal(translateLauncherString('PULAR'), 'JUMP (B)');
  assert.equal(translateLauncherString('DEFESA'), 'DEFEND (X)');
  assert.equal(translateLauncherString('CURA'), 'HEAL (Y)');
});

test('provides recommended config based on device specs', () => {
  const highEnd = getRecommendedConfigForDevice(8, 'high');
  assert.equal(highEnd.resolutionScale, 100);
  assert.equal(highEnd.antiAliasing, 'SMAA 2x');

  const midTier = getRecommendedConfigForDevice(6, 'mid');
  assert.equal(midTier.resolutionScale, 67);
  assert.equal(midTier.targetFps, 60);

  const budget = getRecommendedConfigForDevice(3, 'budget');
  assert.equal(budget.resolutionScale, 50);
});

test('specifies all 4 required game files', () => {
  assert.equal(REQUIRED_GAME_FILES.length, 4);
  const names = REQUIRED_GAME_FILES.map((f) => f.name);
  assert.ok(names.includes('default.xbe'));
  assert.ok(names.includes('area.afs'));
  assert.ok(names.includes('ndmw.afs'));
  assert.ok(names.includes('ndmw.igb'));
});
