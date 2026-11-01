export type DigimonStarterId = 'dorumon' | 'agumon' | 'veemon' | 'guilmon';

export type WeaponType = 'sword' | 'axe' | 'club' | 'spear';

export interface PlayerStats {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  level: number;
  exp: number;
  nextExp: number;
  bits: number;
  attackPower: number;
  defense: number;
  speed: number;
  comboCount: number;
  score: number;
  kills: number;
}

export interface Enemy {
  id: string;
  name: string;
  type: 'goburimon' | 'numemon' | 'sukamon' | 'minotarumon' | 'mecharogue';
  x: number;
  z: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  expYield: number;
  bitsYield: number;
  meshGroup?: any;
  attackCooldown: number;
  isHit: boolean;
  hitTimer: number;
}

export interface Projectile {
  id: string;
  x: number;
  z: number;
  vx: number;
  vz: number;
  damage: number;
  life: number;
  isPlayer: boolean;
  type: 'fire' | 'ice' | 'thunder' | 'acid';
  mesh?: any;
}

export interface DropItem {
  id: string;
  x: number;
  z: number;
  type: 'bits' | 'health_disk' | 'mp_capsule' | 'power_chip';
  value: number;
  mesh?: any;
}

export interface DamagePopup {
  id: string;
  x: number;
  y: number;
  z: number;
  text: string;
  color: string;
  life: number;
}
