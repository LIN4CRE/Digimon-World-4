import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';
import {
  getLocalTamerData,
  saveLocalTamerData,
  getPendingMutations,
  clearPendingMutations,
  mergePendingMutations,
  UserTamerData,
} from './storageService';

export async function fetchCloudProfile(userId: string): Promise<UserTamerData | null> {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as UserTamerData;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function syncUserDataToCloud(
  userId: string,
  localData: UserTamerData
): Promise<UserTamerData> {
  const path = `users/${userId}`;
  try {
    // 1. Fetch any pending mutations that occurred while offline
    const pending = await getPendingMutations();
    const finalData = mergePendingMutations(localData, pending);

    const payload = {
      ...finalData,
      userId,
      lastSyncedAt: new Date().toISOString(),
    };

    // 2. Upload merged state to Firestore
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, payload, { merge: true });

    // 3. Clear pending mutations queue and update local cache
    await clearPendingMutations();
    await saveLocalTamerData(payload);

    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
