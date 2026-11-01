import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {
  Sliders,
  Tv,
  Eye,
  Cpu,
  Zap,
  Check,
  Copy,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { playSound } from '../utils/audioHaptics';

export const ConfigOptimizer: React.FC = () => {
  const [resolutionScale, setResolutionScale] = useState<number>(67);
  const [antiAliasing, setAntiAliasing] = useState<'Off' | 'FXAA' | 'SMAA 2x' | 'SMAA 4x'>('SMAA 2x');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | 'Fill'>('16:9');
  const [textureFilter, setTextureFilter] = useState<'Bilinear' | 'Trilinear' | 'Aniso 8x' | 'Aniso 16x'>('Bilinear');
  const [copiedConfig, setCopiedConfig] = useState(false);

  const applyPreset = (preset: 'balanced' | 'flagship' | 'battery') => {
    playSound('heal');
    if (preset === 'flagship') {
      setResolutionScale(100);
      setAntiAliasing('SMAA 4x');
      setAspectRatio('16:9');
      setTextureFilter('Aniso 16x');
    } else if (preset === 'balanced') {
      setResolutionScale(67);
      setAntiAliasing('SMAA 2x');
      setAspectRatio('16:9');
      setTextureFilter('Bilinear');
    } else {
      setResolutionScale(50);
      setAntiAliasing('Off');
      setAspectRatio('16:9');
      setTextureFilter('Bilinear');
    }
  };

  const configSummary = `[Digimon World 4 Mobile Graphics Profile]
Resolution Scale = ${resolutionScale}%
Anti-Aliasing = ${antiAliasing}
Aspect Ratio = ${aspectRatio}
Texture Filtering = ${textureFilter}
Target FPS = 60 FPS
Vulkan Driver = System Default`;

  const copyConfig = () => {
    playSound('menu');
    navigator.clipboard.writeText(configSummary);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Overview Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Sliders size={20} color="#f97316" />
            <Text style={styles.cardTitle}>Graphics &amp; Performance Settings</Text>
          </View>
        </View>
        <Text style={styles.cardDesc}>
          Configure your graphics options in English. The native Android port lets you adjust resolution scaling and Vulkan shaders to achieve a locked 60 FPS.
        </Text>

        {/* 1-Tap Quick Presets */}
        <Text style={styles.subheading}>One-Tap Device Presets</Text>
        <View style={styles.presetRow}>
          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => applyPreset('battery')}
            accessibilityRole="button"
            accessibilityLabel="Battery Saver Preset"
          >
            <Zap size={14} color="#facc15" />
            <Text style={styles.presetBtnTitle}>Battery Saver</Text>
            <Text style={styles.presetBtnSub}>50% Scale • Entry Phones</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.presetBtn, styles.presetBtnActive]}
            onPress={() => applyPreset('balanced')}
            accessibilityRole="button"
            accessibilityLabel="Balanced Preset Recommended"
          >
            <Sparkles size={14} color="#38bdf8" />
            <Text style={styles.presetBtnTitleActive}>Balanced (Rec.)</Text>
            <Text style={styles.presetBtnSubActive}>67% Scale • Locked 60 FPS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.presetBtn}
            onPress={() => applyPreset('flagship')}
            accessibilityRole="button"
            accessibilityLabel="Ultra Quality Preset"
          >
            <Cpu size={14} color="#a855f7" />
            <Text style={styles.presetBtnTitle}>Ultra Quality</Text>
            <Text style={styles.presetBtnSub}>100% Native • SMAA 4x</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Interactive Options Configuration */}
      <View style={styles.card}>
        <Text style={styles.subheading}>Detailed Parameter Controls</Text>

        {/* Resolution Scale */}
        <View style={styles.optionSection}>
          <View style={styles.optionHeader}>
            <Text style={styles.optionTitle}>Internal Resolution Scale</Text>
            <Text style={styles.optionValueHighlight}>{resolutionScale}%</Text>
          </View>
          <Text style={styles.optionDesc}>
            In Portuguese app: &quot;Resolução&quot;. 67% renders with crisp clarity while cutting GPU draw overhead in half for smooth 60 FPS.
          </Text>
          <View style={styles.scaleTabs}>
            {[50, 67, 100, 125, 150].map((scale) => (
              <TouchableOpacity
                key={scale}
                onPress={() => {
                  playSound('menu');
                  setResolutionScale(scale);
                }}
                style={[
                  styles.scalePill,
                  resolutionScale === scale && styles.scalePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.scalePillText,
                    resolutionScale === scale && styles.scalePillTextActive,
                  ]}
                >
                  {scale}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Anti-Aliasing */}
        <View style={styles.optionSection}>
          <View style={styles.optionHeader}>
            <Text style={styles.optionTitle}>Anti-Aliasing (Edge Smoothing)</Text>
            <Text style={styles.optionValueHighlight}>{antiAliasing}</Text>
          </View>
          <Text style={styles.optionDesc}>
            In Portuguese app: &quot;Antisserrilhado&quot;. SMAA 2x provides pristine sub-pixel smoothing without blurring HUD elements.
          </Text>
          <View style={styles.scaleTabs}>
            {(['Off', 'FXAA', 'SMAA 2x', 'SMAA 4x'] as const).map((aa) => (
              <TouchableOpacity
                key={aa}
                onPress={() => {
                  playSound('menu');
                  setAntiAliasing(aa);
                }}
                style={[
                  styles.scalePill,
                  antiAliasing === aa && styles.scalePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.scalePillText,
                    antiAliasing === aa && styles.scalePillTextActive,
                  ]}
                >
                  {aa}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Aspect Ratio */}
        <View style={styles.optionSection}>
          <View style={styles.optionHeader}>
            <Text style={styles.optionTitle}>Display Aspect Ratio</Text>
            <Text style={styles.optionValueHighlight}>{aspectRatio}</Text>
          </View>
          <Text style={styles.optionDesc}>
            In Portuguese app: &quot;Formato de tela&quot;. 16:9 modern wide display expands FOV; 4:3 preserves original retro Xbox proportions.
          </Text>
          <View style={styles.scaleTabs}>
            {(['16:9', '4:3', 'Fill'] as const).map((ratio) => (
              <TouchableOpacity
                key={ratio}
                onPress={() => {
                  playSound('menu');
                  setAspectRatio(ratio);
                }}
                style={[
                  styles.scalePill,
                  aspectRatio === ratio && styles.scalePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.scalePillText,
                    aspectRatio === ratio && styles.scalePillTextActive,
                  ]}
                >
                  {ratio}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* In-Game Overlay Instructions (Shadow Emblem) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Eye size={20} color="#a855f7" />
            <Text style={styles.cardTitle}>In-Game Shadow Overlay Menu</Text>
          </View>
        </View>

        <View style={styles.overlayGuideBox}>
          <Text style={styles.overlayGuideText}>
            While playing the game on your phone, notice the <Text style={styles.boldOrange}>Shadow Emblem</Text> located at the very top-center of the screen. Tap this emblem at any time to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Toggle live FPS, frametime, and GPU vertex counters</Text>
            <Text style={styles.bulletItem}>• Adjust screen brightness, resolution scale, and filters</Text>
            <Text style={styles.bulletItem}>• Re-calibrate touch button positions and sizing</Text>
            <Text style={styles.bulletItem}>• Safely exit the game back to the Android launcher</Text>
          </View>
        </View>
      </View>

      {/* Copy Config Summary */}
      <View style={styles.card}>
        <View style={styles.copyHeader}>
          <Text style={styles.copyTitle}>Generated Profile Summary</Text>
          <TouchableOpacity
            style={styles.copyBtn}
            onPress={copyConfig}
          >
            {copiedConfig ? (
              <Check size={14} color="#22c55e" />
            ) : (
              <Copy size={14} color="#f97316" />
            )}
            <Text style={styles.copyBtnText}>
              {copiedConfig ? 'Copied!' : 'Copy Settings'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.codeBox}>
          <Text style={styles.codeContent}>{configSummary}</Text>
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
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  cardDesc: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  subheading: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  presetBtn: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 4,
  },
  presetBtnActive: {
    borderColor: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  presetBtnTitle: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '700',
  },
  presetBtnTitleActive: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '800',
  },
  presetBtnSub: {
    color: '#94a3b8',
    fontSize: 10,
  },
  presetBtnSubActive: {
    color: '#cbd5e1',
    fontSize: 10,
  },
  optionSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    gap: 8,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  optionValueHighlight: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  optionDesc: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
  },
  scaleTabs: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  scalePill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#111827',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  scalePillActive: {
    backgroundColor: '#ea580c',
    borderColor: '#ea580c',
  },
  scalePillText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  scalePillTextActive: {
    color: '#ffffff',
  },
  overlayGuideBox: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 8,
  },
  overlayGuideText: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 18,
  },
  boldOrange: {
    color: '#f97316',
    fontWeight: '700',
  },
  bulletList: {
    gap: 4,
    paddingLeft: 4,
  },
  bulletItem: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
  },
  copyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  copyTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  copyBtnText: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: '700',
  },
  codeBox: {
    backgroundColor: '#050914',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  codeContent: {
    color: '#38bdf8',
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});
