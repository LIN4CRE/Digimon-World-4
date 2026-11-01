import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Smartphone, Share2, PlusSquare, X, CheckCircle2 } from 'lucide-react';
import { playSound } from '../utils/audioHaptics';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  onInstallClick: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  onInstallClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl">
        <button
          onClick={() => {
            playSound('menu');
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Smartphone size={22} />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Add App to Home Screen</h3>
            <p className="text-xs text-slate-400">Install as standalone mobile app</p>
          </div>
        </div>

        {isIOS ? (
          <div className="space-y-3 text-xs text-slate-300">
            <p className="leading-relaxed">
              To install Digimon World 4 Hub on your iPhone / iPad:
            </p>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <Share2 size={18} className="text-blue-400 shrink-0" />
              <span>
                1. Tap the <strong className="text-white">Share</strong> button in Safari&apos;s bottom toolbar.
              </span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <PlusSquare size={18} className="text-green-400 shrink-0" />
              <span>
                2. Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.
              </span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
              <CheckCircle2 size={18} className="text-orange-400 shrink-0" />
              <span>
                3. Tap <strong className="text-white">Add</strong> in the top right to complete!
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Install this app directly on your phone for full-screen standalone mode, offline access to guides, and quick APK downloads without browser chrome.
            </p>
            <button
              onClick={() => {
                playSound('heal');
                onInstallClick();
              }}
              className="w-full py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition"
            >
              <Smartphone size={16} />
              Install Digimon Mobile Hub
            </button>
          </div>
        )}

        <button
          onClick={() => {
            playSound('menu');
            onClose();
          }}
          className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
