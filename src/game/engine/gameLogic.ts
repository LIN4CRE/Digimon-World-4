import { DigimonStarterId, PlayerStats, Enemy } from './types';

export function getStarterDigimonStats(starterId: DigimonStarterId): PlayerStats {
  switch (starterId) {
    case 'agumon':
      return {
        hp: 600,
        maxHp: 600,
        mp: 240,
        maxMp: 240,
        level: 1,
        exp: 0,
        nextExp: 100,
        bits: 50,
        attackPower: 38,
        defense: 22,
        speed: 7.0,
        comboCount: 0,
        score: 0,
        kills: 0,
      };
    case 'veemon':
      return {
        hp: 530,
        maxHp: 530,
        mp: 310,
        maxMp: 310,
        level: 1,
        exp: 0,
        nextExp: 100,
        bits: 50,
        attackPower: 34,
        defense: 18,
        speed: 7.8,
        comboCount: 0,
        score: 0,
        kills: 0,
      };
    case 'guilmon':
      return {
        hp: 550,
        maxHp: 550,
        mp: 320,
        maxMp: 320,
        level: 1,
        exp: 0,
        nextExp: 100,
        bits: 50,
        attackPower: 36,
        defense: 19,
        speed: 7.2,
        comboCount: 0,
        score: 0,
        kills: 0,
      };
    case 'dorumon':
    default:
      return {
        hp: 580,
        maxHp: 580,
        mp: 280,
        maxMp: 280,
        level: 1,
        exp: 0,
        nextExp: 100,
        bits: 50,
        attackPower: 40,
        defense: 24,
        speed: 6.8,
        comboCount: 0,
        score: 0,
        kills: 0,
      };
  }
}

export function calculateMeleeDamage(
  attackPower: number,
  enemyDefense: number,
  comboIndex: number = 0,
  isCrit: boolean = false
): { damage: number; isCritical: boolean } {
  // DW4 combo multiplier: 1st hit = 1.0x, 2nd hit = 1.25x, 3rd finisher = 1.75x
  const comboMultiplier = comboIndex === 2 ? 1.75 : comboIndex === 1 ? 1.25 : 1.0;
  const base = Math.max(12, attackPower * comboMultiplier - enemyDefense * 0.4);
  const variance = (Math.random() * 0.2 - 0.1) * base;
  let finalDamage = Math.floor(base + variance);

  const critical = isCrit || Math.random() < 0.2;
  if (critical) {
    finalDamage = Math.floor(finalDamage * 1.6);
  }

  return { damage: Math.max(8, finalDamage), isCritical: critical };
}

export function calculatePlayerDamageTaken(
  enemyAttack: number,
  playerDefense: number,
  isGuarding: boolean
): number {
  const baseDmg = Math.max(5, enemyAttack - playerDefense * 0.5);
  if (isGuarding) {
    // Shield blocks 80% of damage
    return Math.max(1, Math.floor(baseDmg * 0.2));
  }
  return Math.floor(baseDmg);
}

export function checkCollision(
  x1: number,
  z1: number,
  r1: number,
  x2: number,
  z2: number,
  r2: number
): boolean {
  const dx = x1 - x2;
  const dz = z1 - z2;
  const distSq = dx * dx + dz * dz;
  const minDist = r1 + r2;
  return distSq <= minDist * minDist;
}

export function addExpAndCheckLevelUp(
  stats: PlayerStats,
  expGained: number
): { stats: PlayerStats; leveledUp: boolean } {
  const newStats = { ...stats };
  newStats.exp += expGained;
  let leveledUp = false;

  while (newStats.exp >= newStats.nextExp) {
    newStats.exp -= newStats.nextExp;
    newStats.level += 1;
    newStats.nextExp = Math.floor(newStats.nextExp * 1.45);
    newStats.maxHp += 45;
    newStats.hp = newStats.maxHp;
    newStats.maxMp += 25;
    newStats.mp = newStats.maxMp;
    newStats.attackPower += 6;
    newStats.defense += 4;
    leveledUp = true;
  }

  return { stats: newStats, leveledUp };
}

export function generateWaveEnemies(wave: number): Omit<Enemy, 'meshGroup'>[] {
  const enemies: Omit<Enemy, 'meshGroup'>[] = [];
  const count = 3 + wave * 2;

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const distance = 14 + Math.random() * 10;
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;

    const isBoss = wave % 5 === 0 && i === 0;
    if (isBoss) {
      enemies.push({
        id: `enemy-${wave}-${i}-boss`,
        name: `Mecha Rogue Core (Wave ${wave} Boss)`,
        type: 'mecharogue',
        x,
        z,
        hp: 350 + wave * 90,
        maxHp: 350 + wave * 90,
        attack: 28 + wave * 4,
        defense: 20 + wave * 2,
        speed: 3.2,
        expYield: 180 + wave * 40,
        bitsYield: 250 + wave * 60,
        attackCooldown: 1.5,
        isHit: false,
        hitTimer: 0,
      });
      continue;
    }

    const typeRoll = Math.random();
    if (typeRoll < 0.45) {
      enemies.push({
        id: `enemy-${wave}-${i}`,
        name: 'Goburimon',
        type: 'goburimon',
        x,
        z,
        hp: 60 + wave * 18,
        maxHp: 60 + wave * 18,
        attack: 16 + wave * 2,
        defense: 8 + wave,
        speed: 4.2,
        expYield: 25 + wave * 5,
        bitsYield: 20 + wave * 4,
        attackCooldown: 1.0,
        isHit: false,
        hitTimer: 0,
      });
    } else if (typeRoll < 0.75) {
      enemies.push({
        id: `enemy-${wave}-${i}`,
        name: 'Numemon',
        type: 'numemon',
        x,
        z,
        hp: 85 + wave * 22,
        maxHp: 85 + wave * 22,
        attack: 14 + wave * 2,
        defense: 12 + wave,
        speed: 3.0,
        expYield: 32 + wave * 6,
        bitsYield: 30 + wave * 6,
        attackCooldown: 1.4,
        isHit: false,
        hitTimer: 0,
      });
    } else {
      enemies.push({
        id: `enemy-${wave}-${i}`,
        name: 'Sukamon',
        type: 'sukamon',
        x,
        z,
        hp: 110 + wave * 26,
        maxHp: 110 + wave * 26,
        attack: 20 + wave * 3,
        defense: 14 + wave * 2,
        speed: 3.8,
        expYield: 45 + wave * 8,
        bitsYield: 45 + wave * 8,
        attackCooldown: 1.2,
        isHit: false,
        hitTimer: 0,
      });
    }
  }

  return enemies;
}
