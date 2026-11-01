/**
 * Digimon World 4 Mobile Controls Mapping & Engine Input Definitions
 */

export interface ControlButton {
  id: string;
  nameEn: string;
  namePt: string;
  xboxButton: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconType: 'sword' | 'arrow' | 'shield' | 'plus' | 'backpack' | 'wand' | 'pause' | 'joystick';
  descriptionEn: string;
  descriptionPt: string;
  keyboardKey: string;
  soundEffect: 'slash' | 'jump' | 'guard' | 'heal' | 'menu' | 'cast';
}

export const GAME_CONTROLS: ControlButton[] = [
  {
    id: 'btn-attack',
    nameEn: 'ATTACK (A)',
    namePt: 'ATACAR (A)',
    xboxButton: 'A Button',
    color: '#22c55e',
    bgColor: 'rgba(34, 197, 94, 0.25)',
    borderColor: '#16a34a',
    iconType: 'sword',
    descriptionEn: 'Melee weapon strike / Combo slash. Confirms menu selections.',
    descriptionPt: 'Atacar com arma / confirmar.',
    keyboardKey: 'J / Space',
    soundEffect: 'slash',
  },
  {
    id: 'btn-jump',
    nameEn: 'JUMP (B)',
    namePt: 'PULAR (B)',
    xboxButton: 'B Button',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: '#dc2626',
    iconType: 'arrow',
    descriptionEn: 'Jump over chasms, traps, and hazards. Cancels or goes back in menus.',
    descriptionPt: 'Pular / cancelar.',
    keyboardKey: 'K / Backspace',
    soundEffect: 'jump',
  },
  {
    id: 'btn-defend',
    nameEn: 'DEFEND (X)',
    namePt: 'DEFESA (X)',
    xboxButton: 'X Button',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.25)',
    borderColor: '#2563eb',
    iconType: 'shield',
    descriptionEn: 'Raise defensive shield to mitigate damage and resist knockback.',
    descriptionPt: 'Defender / escudo.',
    keyboardKey: 'U',
    soundEffect: 'guard',
  },
  {
    id: 'btn-heal',
    nameEn: 'QUICK HEAL (Y)',
    namePt: 'CURA (Y)',
    xboxButton: 'Y Button',
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.25)',
    borderColor: '#ca8a04',
    iconType: 'plus',
    descriptionEn: 'Instantly cast restorative HP item or recovery technique.',
    descriptionPt: 'Cura rápida.',
    keyboardKey: 'I',
    soundEffect: 'heal',
  },
  {
    id: 'btn-items',
    nameEn: 'ITEMS (LT)',
    namePt: 'ITENS (LT)',
    xboxButton: 'Left Trigger (LT)',
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.25)',
    borderColor: '#9333ea',
    iconType: 'backpack',
    descriptionEn: 'Open real-time item pouch (disks, booster capsules, antidote).',
    descriptionPt: 'Menu de itens.',
    keyboardKey: 'Q',
    soundEffect: 'menu',
  },
  {
    id: 'btn-spells',
    nameEn: 'SPELLS (RT)',
    namePt: 'MAGIAS (RT)',
    xboxButton: 'Right Trigger (RT)',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.25)',
    borderColor: '#0891b2',
    iconType: 'wand',
    descriptionEn: 'Open magic tech wheel (Fire Ball, Ice Blast, Bolt, Venom).',
    descriptionPt: 'Menu de magias.',
    keyboardKey: 'E',
    soundEffect: 'cast',
  },
  {
    id: 'btn-pause',
    nameEn: 'MAIN MENU (Start)',
    namePt: 'MENU (⏸)',
    xboxButton: 'Start Button',
    color: '#94a3b8',
    bgColor: 'rgba(148, 163, 184, 0.25)',
    borderColor: '#64748b',
    iconType: 'pause',
    descriptionEn: 'Pause the game to view Digivolve tree, equipment, quests, and status.',
    descriptionPt: 'Menu principal.',
    keyboardKey: 'Escape / Enter',
    soundEffect: 'menu',
  },
];

export interface PlayableDigimon {
  id: string;
  name: string;
  starterWeapon: string;
  signatureSkill: string;
  baseHp: number;
  baseMp: number;
  attackType: 'Blunt' | 'Slash' | 'Stab' | 'Bash';
  color: string;
  badge: string;
  description: string;
}

export const PLAYABLE_DIGIMON: PlayableDigimon[] = [
  {
    id: 'dorumon',
    name: 'Dorumon',
    starterWeapon: 'Battle Axe (Blunt)',
    signatureSkill: 'Metal Cannon',
    baseHp: 560,
    baseMp: 280,
    attackType: 'Blunt',
    color: '#a855f7',
    badge: 'Beast Core',
    description: 'Balanced warrior with high physical strength, heavy axes, and metal devastation.',
  },
  {
    id: 'agumon',
    name: 'Agumon',
    starterWeapon: 'Blunt Club / Mace',
    signatureSkill: 'Spitfire Blast',
    baseHp: 580,
    baseMp: 240,
    attackType: 'Bash',
    color: '#f97316',
    badge: 'Fire Dragon',
    description: 'High HP brawler with powerful fiery explosive skills and devastating clubs.',
  },
  {
    id: 'veemon',
    name: 'Veemon',
    starterWeapon: 'Long Sword (Slash)',
    signatureSkill: 'Vee-Headbutt',
    baseHp: 520,
    baseMp: 310,
    attackType: 'Slash',
    color: '#3b82f6',
    badge: 'Blue Courage',
    description: 'Agile bladesman wielding rapid sword combos and high MP recovery.',
  },
  {
    id: 'guilmon',
    name: 'Guilmon',
    starterWeapon: 'Spear / Polearm (Stab)',
    signatureSkill: 'Pyro Sphere',
    baseHp: 540,
    baseMp: 320,
    attackType: 'Stab',
    color: '#ef4444',
    badge: 'Digital Hazard',
    description: 'Long-range reach with piercing polearms and lethal fiery magic spheres.',
  },
];

export function getControlById(id: string): ControlButton | undefined {
  return GAME_CONTROLS.find((c) => c.id === id);
}
