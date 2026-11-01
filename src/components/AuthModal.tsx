import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  LogOut,
  LogIn,
  UserPlus,
  Cloud,
  CloudOff,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playSound } from '../utils/audioHaptics';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
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
    syncNow,
    clearAuthError,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    clearAuthError();
    setSuccessMsg(null);
    playSound('menu');

    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password, displayName || 'Digimon Tamer');
        setSuccessMsg('Account created successfully! Profile synced with cloud.');
      } else {
        await loginWithEmail(email, password);
        setSuccessMsg('Welcome back! Cloud settings loaded.');
      }
      playSound('success');
    } catch (err) {
      playSound('guard');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    clearAuthError();
    playSound('menu');
    try {
      await signInWithGoogle();
      playSound('success');
      setSuccessMsg('Google sign-in successful!');
    } catch {
      playSound('guard');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    playSound('menu');
    try {
      await syncNow();
      playSound('heal');
      setSuccessMsg('All offline changes successfully synced to cloud!');
    } catch {
      playSound('guard');
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    playSound('menu');
    await logout();
    setSuccessMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={() => {
            playSound('menu');
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Close Authentication Modal"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-inner">
            <Shield size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Tamer Authentication</h3>
            <p className="text-xs text-slate-400">Firebase Cloud Save &amp; Offline Sync</p>
          </div>
        </div>

        {/* Connectivity & Offline Sync Status Banner */}
        <div className="mb-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isOnline ? (
              <Cloud size={18} className="text-emerald-400 shrink-0" />
            ) : (
              <CloudOff size={18} className="text-amber-400 shrink-0" />
            )}
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{isOnline ? 'Online (Connected)' : 'Offline Mode (AsyncStorage)'}</span>
                {!isOnline && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-semibold">
                    Local Cache Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {pendingSyncCount > 0
                  ? `${pendingSyncCount} changes queued to sync upon connection.`
                  : 'All tamer settings and controls are up to date.'}
              </p>
            </div>
          </div>

          {user && isOnline && pendingSyncCount > 0 && (
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
              aria-label="Sync offline changes now"
            >
              <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
              Sync
            </button>
          )}
        </div>

        {/* Feedback Messages */}
        {authError && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Signed In State */}
        {user ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-black text-white text-base">
                  {(user.displayName || user.email || 'T')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">
                    {user.displayName || 'Digimon Tamer'}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Partner Digimon:</span>{' '}
                  <span className="font-bold text-orange-400 capitalize">
                    {tamerData.starterDigimon}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Tamer Rank:</span>{' '}
                  <span className="font-bold text-sky-400">{tamerData.tamerRank}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleManualSync}
                disabled={syncing || !isOnline}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <RefreshCw size={14} className={syncing ? 'animate-spin text-orange-400' : ''} />
                Sync Cloud Save
              </button>
              <button
                onClick={handleLogout}
                className="py-2.5 px-4 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 text-xs font-bold border border-red-800/40 flex items-center justify-center gap-2 transition"
                aria-label="Log Out"
              >
                <LogOut size={14} />
                Log Out
              </button>
            </div>
          </div>
        ) : (
          /* Sign In / Sign Up Tabs & Form */
          <div className="space-y-4">
            {/* Tab Toggle */}
            <div className="flex bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  playSound('menu');
                  setMode('login');
                  clearAuthError();
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn size={13} />
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound('menu');
                  setMode('signup');
                  clearAuthError();
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  mode === 'signup'
                    ? 'bg-orange-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus size={13} />
                Sign Up
              </button>
            </div>

            {/* Google One-Click Login */}
            <button
              onClick={handleGoogleSignIn}
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow flex items-center justify-center gap-2.5 transition disabled:opacity-60"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-2 my-2">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[11px] text-slate-500 uppercase font-semibold">
                Or with email
              </span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Tamer Display Name
                  </label>
                  <div className="relative">
                    <UserIcon
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Master Tamer"
                      className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tamer@example.com"
                    className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-orange-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : mode === 'signup' ? (
                  <>
                    <UserPlus size={14} />
                    Create Free Account
                  </>
                ) : (
                  <>
                    <LogIn size={14} />
                    Log In to Tamer Profile
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500">
            Offline first: Your progress and settings are continuously saved to your device. Cloud
            sync safely backs up your configuration across all your devices.
          </p>
        </div>
      </div>
    </div>
  );
};
