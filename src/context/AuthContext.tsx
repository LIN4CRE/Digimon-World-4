import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  getLocalTamerData,
  saveLocalTamerData,
  enqueueOfflineMutation,
  getPendingMutations,
  UserTamerData,
  DEFAULT_TAMER_DATA,
} from '../services/storageService';
import { fetchCloudProfile, syncUserDataToCloud } from '../services/syncService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isOnline: boolean;
  tamerData: UserTamerData;
  pendingSyncCount: number;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateTamerSettings: (settings: Partial<UserTamerData>) => Promise<void>;
  syncNow: () => Promise<void>;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [tamerData, setTamerData] = useState<UserTamerData>(DEFAULT_TAMER_DATA);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [authError, setAuthError] = useState<string | null>(null);

  // Check pending mutation count
  const refreshPendingCount = useCallback(async () => {
    const queue = await getPendingMutations();
    setPendingSyncCount(queue.length);
  }, []);

  // Sync logic when online and user is authenticated
  const syncNow = useCallback(async () => {
    if (!user || !isOnline) return;
    try {
      const synced = await syncUserDataToCloud(user.uid, tamerData);
      setTamerData(synced);
      await refreshPendingCount();
    } catch (err) {
      console.warn('Sync attempt deferred:', err);
    }
  }, [user, isOnline, tamerData, refreshPendingCount]);

  // Load initial local data from AsyncStorage
  useEffect(() => {
    getLocalTamerData().then((local) => {
      setTamerData(local);
      refreshPendingCount();
    });
  }, [refreshPendingCount]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (user) {
        syncNow();
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user, syncNow]);

  // Firebase auth state subscriber
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const cloud = await fetchCloudProfile(currentUser.uid);
          if (cloud) {
            setTamerData(cloud);
            await saveLocalTamerData(cloud);
          } else {
            // First time login: create cloud record from current local data
            const initial = {
              ...tamerData,
              email: currentUser.email || '',
              displayName: currentUser.displayName || tamerData.displayName,
            };
            await syncUserDataToCloud(currentUser.uid, initial);
            setTamerData(initial);
          }
        } catch {
          // If offline or permission issue, rely on local cached data
          console.warn('Unable to retrieve cloud profile, using offline AsyncStorage cache');
        }
      }
      setLoading(false);
      refreshPendingCount();
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      setAuthError(error.message || 'Failed to authenticate with Google.');
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error('Email Login Error:', error);
      setAuthError(error.message || 'Invalid email or password.');
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user && name) {
        await updateProfile(cred.user, { displayName: name });
      }
    } catch (error: any) {
      console.error('Sign Up Error:', error);
      setAuthError(error.message || 'Sign up failed.');
      throw error;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout Error:', error);
      setAuthError(error.message || 'Failed to log out.');
    }
  };

  const updateTamerSettings = async (settings: Partial<UserTamerData>) => {
    const updated = await saveLocalTamerData(settings);
    setTamerData(updated);

    if (user && isOnline) {
      try {
        await syncUserDataToCloud(user.uid, updated);
        await refreshPendingCount();
      } catch {
        await enqueueOfflineMutation(settings);
        await refreshPendingCount();
      }
    } else {
      await enqueueOfflineMutation(settings);
      await refreshPendingCount();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isOnline,
        tamerData,
        pendingSyncCount,
        authError,
        signInWithGoogle,
        loginWithEmail,
        signUpWithEmail,
        logout,
        updateTamerSettings,
        syncNow,
        clearAuthError: () => setAuthError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
