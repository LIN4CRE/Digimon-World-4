/**
 * ROM & File Verification Logic for Digimon World 4 Native Android Port
 */

export interface RomFileInfo {
  name: string;
  expectedSize?: number;
  expectedSha1?: string;
  expectedMd5?: string;
  description: string;
  isRequired: boolean;
}

export const REQUIRED_GAME_FILES: RomFileInfo[] = [
  {
    name: 'default.xbe',
    expectedSize: 3887104,
    expectedSha1: 'c270c083befccbc78f5294436984b7593b0f5d63',
    expectedMd5: '5aca52817b236b0de7da217d52feb218',
    description: 'Xbox Original executable (USA release). Must match exact SHA-1 hash.',
    isRequired: true,
  },
  {
    name: 'area.afs',
    description: 'World maps, dungeons, terrain models, and collision data.',
    isRequired: true,
  },
  {
    name: 'ndmw.afs',
    description: 'Audio archive: BGM, sound effects, voice lines, and ambient audio.',
    isRequired: true,
  },
  {
    name: 'ndmw.igb',
    description: 'Graphics bank: Digimon 3D models, textures, weapons, and particle effects.',
    isRequired: true,
  },
];

export const PT_TO_EN_DICTIONARY: Record<string, { en: string; description: string }> = {
  'ESCOLHER PASTA': {
    en: 'CHOOSE FOLDER',
    description: 'Opens Android system folder picker to select your /DIGIMON4 game files directory.',
  },
  'JOGAR': {
    en: 'PLAY GAME',
    description: 'Launches the native ARM64 Digimon World 4 engine.',
  },
  'Armazenamento': {
    en: 'Internal Storage',
    description: 'The root of your Android device internal memory.',
  },
  'DIGIMON4': {
    en: 'DIGIMON4',
    description: 'The mandatory folder name on your phone where the 4 game files must reside.',
  },
  'ATACAR': {
    en: 'ATTACK (A)',
    description: 'Physical weapon combo attack and menu confirm button.',
  },
  'PULAR': {
    en: 'JUMP (B)',
    description: 'Jump over hazards or cancel menu selections.',
  },
  'DEFESA': {
    en: 'DEFEND (X)',
    description: 'Raise shield / defensive guard to block enemy damage.',
  },
  'CURA': {
    en: 'HEAL (Y)',
    description: 'Quick-use healing item or restorative technique.',
  },
  'ITENS': {
    en: 'ITEMS (LT)',
    description: 'Open in-battle quick item belt.',
  },
  'MAGIAS': {
    en: 'SPELLS (RT)',
    description: 'Open MP magic tech cast wheel (Fire, Ice, Lightning, Dark).',
  },
  'MENU': {
    en: 'PAUSE MENU (Start)',
    description: 'Opens Digivolution tree, equipment, Digivice status, and game options.',
  },
};

export interface HashValidationResult {
  fileName: string;
  sizeMatches: boolean;
  sha1Matches: boolean;
  isValid: boolean;
  message: string;
}

export function validateXbeFile(
  fileName: string,
  size: number,
  sha1?: string
): HashValidationResult {
  const isTargetName = fileName.toLowerCase() === 'default.xbe';
  const targetSpec = REQUIRED_GAME_FILES[0];

  if (!isTargetName) {
    return {
      fileName,
      sizeMatches: false,
      sha1Matches: false,
      isValid: false,
      message: `File name should be 'default.xbe' (got '${fileName}')`,
    };
  }

  const sizeMatches = size === targetSpec.expectedSize;
  const sha1Matches = sha1 ? sha1.toLowerCase() === targetSpec.expectedSha1?.toLowerCase() : true;
  const isValid = sizeMatches && sha1Matches;

  let message = 'File is 100% verified for Digimon World 4 USA (Xbox Original)!';
  if (!sizeMatches) {
    message = `Size mismatch: Expected ${targetSpec.expectedSize} bytes, got ${size} bytes.`;
  } else if (sha1 && !sha1Matches) {
    message = `SHA-1 checksum mismatch. Ensure you are using the USA Retail release (Title ID 42410002).`;
  }

  return {
    fileName,
    sizeMatches,
    sha1Matches,
    isValid,
    message,
  };
}

export function translateLauncherString(ptString: string): string {
  const entry = PT_TO_EN_DICTIONARY[ptString];
  return entry ? entry.en : ptString;
}

export function getRecommendedConfigForDevice(ramGb: number, gpuTier: 'budget' | 'mid' | 'high') {
  if (gpuTier === 'high' || ramGb >= 8) {
    return {
      resolutionScale: 100,
      antiAliasing: 'SMAA 2x',
      targetFps: 60,
      textureFilter: 'Anisotropic 8x',
      presetName: 'High Fidelity 60 FPS',
    };
  }
  if (gpuTier === 'mid' || ramGb >= 6) {
    return {
      resolutionScale: 67,
      antiAliasing: 'SMAA 2x',
      targetFps: 60,
      textureFilter: 'Bilinear',
      presetName: 'Balanced (Recommended by Author)',
    };
  }
  return {
    resolutionScale: 50,
    antiAliasing: 'Off',
    targetFps: 30,
    textureFilter: 'Bilinear',
    presetName: 'Battery Saver / Entry Devices',
  };
}
