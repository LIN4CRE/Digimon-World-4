/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, useWindowDimensions } from 'react-native';
import {
  Download,
  FileCheck,
  Gamepad2,
  Film,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { DownloadHub } from './components/DownloadHub';
import { RomVerifier } from './components/RomVerifier';
import { ControlsSimulator } from './components/ControlsSimulator';
import { MediaGallery } from './components/MediaGallery';
import { ConfigOptimizer } from './components/ConfigOptimizer';
import { ManualFaq } from './components/ManualFaq';
import { PWAInstallModal } from './components/PWAInstallModal';
import { PhoneQrModal } from './components/PhoneQrModal';
import { AuthModal } from './components/AuthModal';
import { usePWAInstall } from './utils/usePWAInstall';
import { playSound } from './utils/audioHaptics';

type TabKey = 'downloads' | 'verifier' | 'controls' | 'media' | 'config' | 'faq';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('downloads');
  const [isMuted, setIsMuted] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { width } = useWindowDimensions();
  const isTabletOrDesktop = width >= 768;

  const handleTabChange = (tab: TabKey) => {
    if (!isMuted) playSound('menu');
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const tabs = [
    { key: 'downloads' as TabKey, label: 'Get Game', icon: Download },
    { key: 'verifier' as TabKey, label: 'Verifier', icon: FileCheck },
    { key: 'controls' as TabKey, label: 'Controls', icon: Gamepad2 },
    { key: 'media' as TabKey, label: 'Trailer', icon: Film },
    { key: 'config' as TabKey, label: 'Graphics', icon: Sliders },
    { key: 'faq' as TabKey, label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainContainer}>
        {/* Responsive Header */}
        <Header
          onInstallPwa={() => setShowPwaModal(true)}
          canInstallPwa={!isInstalled}
          onShowQr={() => setShowQrModal(true)}
          onShowAuth={() => setShowAuthModal(true)}
          isMuted={isMuted}
          onToggleMute={() => setIsMuted((prev) => !prev)}
        />

        {/* Tab Body Content */}
        <View style={styles.tabContentArea}>
          {activeTab === 'downloads' && (
            <DownloadHub
              onGoToVerifier={() => handleTabChange('verifier')}
              onGoToControls={() => handleTabChange('controls')}
            />
          )}
          {activeTab === 'verifier' && <RomVerifier />}
          {activeTab === 'controls' && <ControlsSimulator />}
          {activeTab === 'media' && <MediaGallery />}
          {activeTab === 'config' && <ConfigOptimizer />}
          {activeTab === 'faq' && <ManualFaq />}
        </View>

        {/* Responsive Bottom Navigation Bar */}
        <View style={[styles.bottomNav, isTabletOrDesktop && styles.bottomNavWide]}>
          {tabs.map((t) => {
            const isActive = activeTab === t.key;
            const Icon = t.icon;
            return (
              <TouchableOpacity
                key={t.key}
                onPress={() => handleTabChange(t.key)}
                style={styles.navTabItem}
                accessibilityRole="button"
                accessibilityLabel={t.label}
              >
                <View
                  style={[
                    styles.navIconContainer,
                    isActive && styles.navIconContainerActive,
                  ]}
                >
                  <Icon
                    size={17}
                    color={isActive ? '#ffffff' : '#94a3b8'}
                  />
                </View>
                <Text
                  style={[
                    styles.navTabLabel,
                    isActive && styles.navTabLabelActive,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Tamer Authentication & Offline Sync Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* PWA Home Screen Installation Modal */}
      <PWAInstallModal
        isOpen={showPwaModal}
        onClose={() => setShowPwaModal(false)}
        isIOS={isIOS}
        onInstallClick={() => {
          install();
          setShowPwaModal(false);
        }}
      />

      {/* Mobile QR Scanner Modal */}
      <PhoneQrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#030712',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#030712',
  },
  tabContentArea: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#090d16',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 8,
    paddingBottom: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 40,
  },
  bottomNavWide: {
    maxWidth: 720,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  navTabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    flex: 1,
  },
  navIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconContainerActive: {
    backgroundColor: '#ea580c',
  },
  navTabLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  navTabLabelActive: {
    color: '#f97316',
    fontWeight: '800',
  },
});
