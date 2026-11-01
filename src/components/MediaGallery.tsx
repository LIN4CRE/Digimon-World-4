import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {
  Film,
  Image as ImageIcon,
  Maximize2,
  X,
  Play,
  Volume2,
  VolumeX,
  ShieldAlert,
  Sparkles,
  Info,
} from 'lucide-react';
import { PLAYABLE_DIGIMON, PlayableDigimon } from '../utils/controlsMap';
import { playSound } from '../utils/audioHaptics';

export const MediaGallery: React.FC = () => {
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [activeDigimon, setActiveDigimon] = useState<PlayableDigimon>(PLAYABLE_DIGIMON[0]);

  const screenshots = [
    {
      src: '/screenshots/jogo.jpg',
      title: 'Real-Time Combat & On-Screen Controls',
      caption: 'POCO X7 Pro running native Vulkan Direct3D 8 renderer with on-screen touch buttons.',
    },
    {
      src: '/screenshots/jogo2.jpg',
      title: 'Main Lobby (Central City)',
      caption: 'V0.2.0 optimization: batch draw-calls render the city at solid 60 FPS.',
    },
    {
      src: '/screenshots/titulo.jpg',
      title: 'Title Screen & Native Launcher',
      caption: 'Original Xbox boot sequence running natively on Android ARM64.',
    },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Video Trailer Section */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Film size={20} color="#f97316" />
            <Text style={styles.cardTitle}>Official Game Opening Trailer</Text>
          </View>
          <View style={styles.badgeVideo}>
            <Text style={styles.badgeVideoText}>Extracted from APK</Text>
          </View>
        </View>

        <div className="relative w-full rounded-xl overflow-hidden bg-black border border-slate-800 shadow-xl aspect-video">
          <video
            src="/media/trailer.mp4"
            controls
            playsInline
            className="w-full h-full object-contain"
            poster="/screenshots/titulo.jpg"
          />
        </div>
        <Text style={styles.videoCaption}>
          This original opening sequence is bundled directly inside the APK and plays as the trailer on the native Android launcher menu.
        </Text>
      </View>

      {/* In-Game Screenshots Gallery */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <ImageIcon size={20} color="#38bdf8" />
            <Text style={styles.cardTitle}>Real In-Game Screenshots (Native Android)</Text>
          </View>
        </View>

        <View style={styles.screenshotGrid}>
          {screenshots.map((s, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => {
                playSound('menu');
                setSelectedScreenshot(s.src);
              }}
              style={styles.screenshotItem}
              accessibilityRole="button"
              accessibilityLabel={`View full size: ${s.title}`}
            >
              <div className="relative aspect-video w-full rounded-lg overflow-hidden group">
                <img
                  src={s.src}
                  alt={s.title}
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                  <Maximize2 size={24} color="#ffffff" />
                </div>
              </div>
              <Text style={styles.screenshotTitle}>{s.title}</Text>
              <Text style={styles.screenshotDesc}>{s.caption}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lightbox Modal */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div className="relative max-w-4xl w-full flex flex-col items-center">
            <button
              onClick={() => setSelectedScreenshot(null)}
              className="absolute -top-12 right-0 p-2 text-white bg-slate-800 rounded-full hover:bg-slate-700 transition"
              aria-label="Close Preview"
            >
              <X size={20} />
            </button>
            <img
              src={selectedScreenshot}
              alt="Full size screenshot"
              className="max-h-[80vh] w-auto rounded-xl shadow-2xl border border-slate-700"
            />
          </div>
        </div>
      )}

      {/* Starter Digimon Profiles */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Sparkles size={20} color="#a855f7" />
            <Text style={styles.cardTitle}>Starter Digimon &amp; Combat Affinities</Text>
          </View>
        </View>

        <View style={styles.charTabsRow}>
          {PLAYABLE_DIGIMON.map((d) => {
            const isSelected = d.id === activeDigimon.id;
            return (
              <TouchableOpacity
                key={d.id}
                onPress={() => {
                  playSound('menu');
                  setActiveDigimon(d);
                }}
                style={[
                  styles.charTab,
                  isSelected && { borderColor: d.color, backgroundColor: 'rgba(255,255,255,0.08)' },
                ]}
              >
                <Text
                  style={[
                    styles.charTabText,
                    isSelected && { color: d.color, fontWeight: '800' },
                  ]}
                >
                  {d.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.charProfileCard}>
          <View style={styles.charHeader}>
            <View>
              <Text style={[styles.charName, { color: activeDigimon.color }]}>
                {activeDigimon.name}
              </Text>
              <Text style={styles.charBadgeText}>{activeDigimon.badge}</Text>
            </View>
            <View style={styles.charStatsPills}>
              <View style={styles.statPill}>
                <Text style={styles.statPillLabel}>HP:</Text>
                <Text style={styles.statPillVal}>{activeDigimon.baseHp}</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statPillLabel}>MP:</Text>
                <Text style={styles.statPillVal}>{activeDigimon.baseMp}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.charDescText}>{activeDigimon.description}</Text>

          <View style={styles.weaponInfoBox}>
            <View style={styles.weaponRow}>
              <Text style={styles.weaponKey}>Default Weapon Class:</Text>
              <Text style={styles.weaponVal}>{activeDigimon.starterWeapon}</Text>
            </View>
            <View style={styles.weaponRow}>
              <Text style={styles.weaponKey}>Damage Type:</Text>
              <Text style={styles.weaponVal}>{activeDigimon.attackType}</Text>
            </View>
            <View style={styles.weaponRow}>
              <Text style={styles.weaponKey}>Signature Technique:</Text>
              <Text style={styles.weaponValGold}>{activeDigimon.signatureSkill}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  content: {
    padding: 16,
    paddingBottom: 90,
    gap: 16,
  },
  card: {
    backgroundColor: '#090e1d',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  badgeVideo: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeVideoText: {
    color: '#f97316',
    fontSize: 10,
    fontWeight: '700',
  },
  videoCaption: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 10,
  },
  screenshotGrid: {
    gap: 16,
  },
  screenshotItem: {
    gap: 6,
  },
  screenshotTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 4,
  },
  screenshotDesc: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
  },
  charTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  charTab: {
    flex: 1,
    minWidth: 70,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
    backgroundColor: '#111827',
    alignItems: 'center',
  },
  charTabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  charProfileCard: {
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 10,
  },
  charHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  charName: {
    fontSize: 18,
    fontWeight: '900',
  },
  charBadgeText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  },
  charStatsPills: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statPillLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  statPillVal: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  charDescText: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 18,
  },
  weaponInfoBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  weaponRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },
  weaponKey: {
    color: '#94a3b8',
    fontSize: 11,
  },
  weaponVal: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  weaponValGold: {
    color: '#facc15',
    fontSize: 11,
    fontWeight: '700',
  },
});
