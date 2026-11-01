import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Smartphone, Download, Volume2, VolumeX, ShieldCheck, Sparkles, QrCode } from 'lucide-react';
import { playSound } from '../utils/audioHaptics';

interface HeaderProps {
  onInstallPwa: () => void;
  canInstallPwa: boolean;
  onShowQr: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onInstallPwa,
  canInstallPwa,
  onShowQr,
  isMuted,
  onToggleMute,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.iconWrapper}>
          <img
            src="/icon.png"
            alt="Digimon World 4"
            className="w-10 h-10 rounded-xl shadow-lg border border-orange-500/40 object-cover"
          />
          <View style={styles.onlineBadge} />
        </View>
        <View style={styles.titles}>
          <View style={styles.badgeRow}>
            <Text style={styles.titleText}>DIGIMON WORLD 4</Text>
            <View style={styles.pillBadge}>
              <Text style={styles.pillText}>NATIVE ARM64</Text>
            </View>
          </View>
          <Text style={styles.subtitleText}>Mobile Port & English Companion</Text>
        </View>
      </View>

      <View style={styles.right}>
        <TouchableOpacity
          onPress={() => {
            playSound('menu');
            onToggleMute();
          }}
          style={styles.iconButton}
          accessibilityLabel={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          accessibilityRole="button"
        >
          {isMuted ? (
            <VolumeX size={18} color="#94a3b8" />
          ) : (
            <Volume2 size={18} color="#38bdf8" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            playSound('menu');
            onShowQr();
          }}
          style={styles.iconButton}
          accessibilityLabel="Scan to Phone"
          accessibilityRole="button"
        >
          <QrCode size={18} color="#fb923c" />
        </TouchableOpacity>

        {canInstallPwa && (
          <TouchableOpacity
            onPress={() => {
              playSound('menu');
              onInstallPwa();
            }}
            style={styles.installButton}
            accessibilityLabel="Install App to Phone"
            accessibilityRole="button"
          >
            <Smartphone size={15} color="#ffffff" />
            <Text style={styles.installText}>Install PWA</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#090d16',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    position: 'relative',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    borderWidth: 2,
    borderColor: '#090d16',
  },
  titles: {
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pillBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pillText: {
    color: '#f97316',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitleText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  installButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ea580c',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    shadowColor: '#ea580c',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  installText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
