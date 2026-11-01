import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserTamerData {
  userId?: string;
  email?: string;
  displayName: string;
  starterDigimon: 'dorumon' | 'agumon' | 'veemon' | 'guilmon';
  tamerRank: string;
  resolutionScale: number;
  antiAliasing: string;
  buttonScale: 'small' | 'medium' | 'large';
  buttonOpacity: number;
  lastSyncedAt?: string;
}

export const DEFAULT_TAMER_DATA: UserTamerData = {
  displayName: 'Tamer One',
  starterDigimon: 'dorumon',
  tamerRank: 'Rookie Defender',
  resolutionScale: 67,
  antiAliasing: 'SMAA 2x',
  buttonScale: 'medium',
  buttonOpacity: 0.85,
};

const STORAGE_KEYS = {
  TAMER_PROFILE: '@digimon_dw4_tamer_profile',
  PENDING_MUTATIONS: '@digimon_dw4_pending_mutations',
  LAST_SYNC: '@digimon_dw4_last_sync',
};

export async function getLocalTamerData(): Promise<UserTamerData> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TAMER_PROFILE);
    if (!raw) return DEFAULT_TAMER_DATA;
    return { ...DEFAULT_TAMER_DATA, ...JSON.parse(raw) };
  } catch (error) {
    console.warn('Failed reading local tamer data, falling back to defaults:', error);
    return DEFAULT_TAMER_DATA;
  }
}

export async function saveLocalTamerData(data: Partial<UserTamerData>): Promise<UserTamerData> {
  try {
    const existing = await getLocalTamerData();
    const updated = { ...existing, ...data };
    await AsyncStorage.setItem(STORAGE_KEYS.TAMER_PROFILE, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed saving local tamer data:', error);
    throw error;
  }
}

export async function enqueueOfflineMutation(mutation: Partial<UserTamerData>): Promise<void> {
  try {
    const rawQueue = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_MUTATIONS);
    const queue: Partial<UserTamerData>[] = rawQueue ? JSON.parse(rawQueue) : [];
    queue.push({ ...mutation, lastSyncedAt: new Date().toISOString() });
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_MUTATIONS, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed enqueuing offline mutation:', error);
  }
}

export async function getPendingMutations(): Promise<Partial<UserTamerData>[]> {
  try {
    const rawQueue = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_MUTATIONS);
    return rawQueue ? JSON.parse(rawQueue) : [];
  } catch {
    return [];
  }
}

export async function clearPendingMutations(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_MUTATIONS);
  } catch (error) {
    console.error('Failed clearing pending mutations:', error);
  }
}

export function mergePendingMutations(
  base: UserTamerData,
  mutations: Partial<UserTamerData>[]
): UserTamerData {
  return mutations.reduce<UserTamerData>((acc, curr) => ({ ...acc, ...curr }), { ...base });
}
