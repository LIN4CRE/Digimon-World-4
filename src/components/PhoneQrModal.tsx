import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { QrCode, X, Smartphone, Download, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';
import { playSound } from '../utils/audioHaptics';

interface PhoneQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PhoneQrModal: React.FC<PhoneQrModalProps> = ({ isOpen, onClose }) => {
  const [appQr, setAppQr] = useState<string>('');
  const [apkQr, setApkQr] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'app' | 'apk'>('apk');
  const [copiedUrl, setCopiedUrl] = useState(false);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const apkUrl = typeof window !== 'undefined' ? `${window.location.origin}/downloads/DigimonWorld4-v0.2.0-arm64-v8a.apk` : '';

  useEffect(() => {
    if (currentUrl) {
      QRCode.toDataURL(currentUrl, {
        width: 220,
        margin: 1,
        color: { dark: '#090d16', light: '#ffffff' },
      })
        .then((url) => setAppQr(url))
        .catch(console.error);
    }

    if (apkUrl) {
      QRCode.toDataURL(apkUrl, {
        width: 220,
        margin: 1,
        color: { dark: '#090d16', light: '#ffffff' },
      })
        .then((url) => setApkQr(url))
        .catch(console.error);
    }
  }, [currentUrl, apkUrl]);

  if (!isOpen) return null;

  const currentQr = activeTab === 'apk' ? apkQr : appQr;
  const currentLink = activeTab === 'apk' ? apkUrl : currentUrl;

  const handleCopy = () => {
    playSound('menu');
    navigator.clipboard.writeText(currentLink);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl flex flex-col items-center text-center">
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

        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400 mb-3">
          <QrCode size={24} />
        </div>

        <h3 className="text-base font-black text-white">Scan with Your Phone</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Point your mobile camera to open or download directly
        </p>

        {/* Tab switch: Direct APK vs Web App */}
        <div className="flex w-full bg-slate-800 p-1 rounded-xl mb-4">
          <button
            onClick={() => {
              playSound('menu');
              setActiveTab('apk');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'apk'
                ? 'bg-orange-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download size={13} />
            Direct APK File
          </button>
          <button
            onClick={() => {
              playSound('menu');
              setActiveTab('app');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'app'
                ? 'bg-orange-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={13} />
            Mobile App Web
          </button>
        </div>

        {/* QR Code image */}
        <div className="p-3 bg-white rounded-2xl shadow-inner mb-4">
          {currentQr ? (
            <img src={currentQr} alt="QR Code" className="w-48 h-48" />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-slate-600 text-xs font-bold">
              Loading QR...
            </div>
          )}
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 text-xs font-medium border border-slate-700 transition"
        >
          {copiedUrl ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          <span>{copiedUrl ? 'Link Copied!' : 'Copy Direct Link'}</span>
        </button>
      </div>
    </div>
  );
};
