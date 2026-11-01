import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import {
  Smartphone,
  Volume2,
  VolumeX,
  QrCode,
  User as UserIcon,
  Cloud,
  CloudOff,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { playSound } from '../utils/audioHaptics';

interface HeaderProps {
  onInstallPwa: () => void;
  canInstallPwa: boolean;
  onShowQr: () => void;
  onShowAuth: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onInstallPwa,
  canInstallPwa,
  onShowQr,
  onShowAuth,
  isMuted,
  onToggleMute,
}) => {
  const { width } = useWindowDimensions();
  const isCompact = width < 480;
  const { user, isOnline, pendingSyncCount } = useAuth();

  return (
    <View style={styles.container}>
      {/* App Branding */}
      <View style={styles.left}>
        <View style={styles.iconWrapper}>
          <img
            src="/icon.png"
            alt="Digimon World 4"
            className="w-10 h-10 rounded-xl shadow-lg border border-orange-500/40 object-cover"
          />
          <View
            style={[
              styles.onlineBadge,
              { backgroundColor: isOnline ? '#22c55e' : '#f59e0b' },
            ]}
          />
        </View>

        <View style={styles.titles}>
          <View style={styles.badgeRow}>
            <Text style={styles.titleText}>DIGIMON WORLD 4</Text>
            <View style={styles.pillBadge}>
              <Text style={styles.pillText}>NATIVE ARM64</Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.subtitleText}>Mobile Port &amp; English Companion</Text>
            <View style={styles.syncStatusPill}>
              {isOnline ? (
                <Cloud size={10} color="#34d399" />
              ) : (
                <CloudOff size={10} color="#fbbf24" />
              )}
              <Text
                style={[
                  styles.syncStatusText,
                  { color: isOnline ? '#34d399' : '#fbbf24' },
                ]}
              >
                {isOnline ? (pendingSyncCount > 0 ? `${pendingSyncCount} queued` : 'Online') : 'Offline'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Header Actions */}
      <View style={styles.right}>
        {/* User Account / Profile Button */}
        <TouchableOpacity
          onPress={() => {
            playSound('menu');
            onShowAuth();
          }}
          style={[
            styles.authButton,
            user && styles.authButtonLoggedIn,
          ]}
          accessibilityLabel={user ? `Signed in as ${user.displayName || user.email}` : 'Sign In or Sign Up'}
          accessibilityRole="button"
        >
          {user ? (
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarLetter}>
                {(user.displayName || user.email || 'T')[0].toUpperCase()}
              </Text>
            </View>
          ) : (
            <UserIcon size={16} color="#f97316" />
          )}
          {!isCompact && (
            <Text style={styles.authButtonText}>
              {user ? (user.displayName || 'Tamer') : 'Tamer Auth'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Audio Mute Toggle */}
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
            <VolumeX size={16} color="#94a3b8" />
          ) : (
            <Volume2 size={16} color="#38bdf8" />
          )}
        </TouchableOpacity>

        {/* Scan to Phone QR */}
        <TouchableOpacity
          onPress={() => {
            playSound('menu');
            onShowQr();
          }}
          style={styles.iconButton}
          accessibilityLabel="Scan to Phone"
          accessibilityRole="button"
        >
          <QrCode size={16} color="#fb923c" />
        </TouchableOpacity>

        {/* Install PWA Button */}
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
            <Smartphone size={14} color="#ffffff" />
            {!isCompact && <Text style={styles.installText}>Install PWA</Text>}
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#090d16',
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    flexWrap: 'wrap',
    gap: 8,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
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
    borderWidth: 2,
    borderColor: '#090d16',
  },
  titles: {
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pillBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  pillText: {
    color: '#f97316',
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  subtitleText: {
    color: '#94a3b8',
    fontSize: 10.5,
    fontWeight: '500',
  },
  syncStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#111827',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  syncStatusText: {
    fontSize: 9,
    fontWeight: '700',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'nowrap',
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1e293b',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  authButtonLoggedIn: {
    borderColor: 'rgba(249, 115, 22, 0.5)',
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
  },
  avatarCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ea580c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  authButtonText: {
    color: '#f8fafc',
    fontSize: 11,
    fontWeight: '700',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  installButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ea580c',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  installText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
