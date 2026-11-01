import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {
  Gamepad2,
  Swords,
  Shield,
  Heart,
  Briefcase,
  Flame,
  Pause,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sliders,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  GAME_CONTROLS,
  PLAYABLE_DIGIMON,
  ControlButton,
  PlayableDigimon,
} from '../utils/controlsMap';
import { playSound, triggerHaptic } from '../utils/audioHaptics';

export const ControlsSimulator: React.FC = () => {
  const [selectedDigimon, setSelectedDigimon] = useState<PlayableDigimon>(PLAYABLE_DIGIMON[0]);
  const [currentHp, setCurrentHp] = useState<number>(selectedDigimon.baseHp);
  const [currentMp, setCurrentMp] = useState<number>(selectedDigimon.baseMp);
  const [activeAction, setActiveAction] = useState<string>('Idle in Lobby');
  const [actionEffect, setActionEffect] = useState<'slash' | 'jump' | 'guard' | 'heal' | 'cast' | null>(null);
  const [damagePopup, setDamagePopup] = useState<string | null>(null);

  // Touch button customization settings (same as Android port launcher!)
  const [buttonScale, setButtonScale] = useState<'small' | 'medium' | 'large'>('medium');
  const [buttonOpacity, setButtonOpacity] = useState<number>(0.85);

  // Analog stick position
  const [stickPos, setStickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingStick, setIsDraggingStick] = useState(false);
  const stickBaseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentHp(selectedDigimon.baseHp);
    setCurrentMp(selectedDigimon.baseMp);
  }, [selectedDigimon]);

  const handleButtonPress = (control: ControlButton) => {
    playSound(control.soundEffect);
    triggerHaptic(30);

    switch (control.id) {
      case 'btn-attack':
        setActiveAction(`${selectedDigimon.name} performed 3-Hit Combo!`);
        setActionEffect('slash');
        setDamagePopup(`CRITICAL HIT! -${Math.floor(120 + Math.random() * 80)}`);
        break;
      case 'btn-jump':
        setActiveAction(`${selectedDigimon.name} leaped over obstacle!`);
        setActionEffect('jump');
        break;
      case 'btn-defend':
        setActiveAction(`${selectedDigimon.name} raised Guard Shield! (-80% DMG)`);
        setActionEffect('guard');
        break;
      case 'btn-heal': {
        const healAmt = 150;
        setCurrentHp((prev) => Math.min(selectedDigimon.baseHp, prev + healAmt));
        setActiveAction(`Used Recovery Disk (+${healAmt} HP)`);
        setActionEffect('heal');
        setDamagePopup(`+${healAmt} HP RECOVERED!`);
        break;
      }
      case 'btn-items':
        setActiveAction('Opened Quick-Item Belt (Disks, Gate Disk)');
        break;
      case 'btn-spells': {
        if (currentMp >= 25) {
          setCurrentMp((prev) => prev - 25);
          setActiveAction(`Cast ${selectedDigimon.signatureSkill}!`);
          setActionEffect('cast');
          setDamagePopup(`MAGIC BURST -${Math.floor(220 + Math.random() * 100)}`);
        } else {
          setActiveAction('Not enough MP to cast magic!');
        }
        break;
      }
      case 'btn-pause':
        setActiveAction('Paused — Digivolution Tree & Equipment');
        break;
    }

    setTimeout(() => {
      setActionEffect(null);
      setDamagePopup(null);
    }, 1200);
  };

  // Touch analog stick handling
  const handleStickMove = (clientX: number, clientY: number) => {
    if (!stickBaseRef.current) return;
    const rect = stickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.min(36, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    setStickPos({ x, y });
    setActiveAction(`Moving character (X: ${Math.round(x)}, Y: ${Math.round(y)})`);
  };

  const scaleMultiplier = buttonScale === 'small' ? 0.85 : buttonScale === 'large' ? 1.2 : 1.0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title & Overview */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Gamepad2 size={22} color="#f97316" />
            <Text style={styles.cardTitle}>Interactive Touch Controls Simulator</Text>
          </View>
          <View style={styles.badgeHaptic}>
            <Text style={styles.badgeHapticText}>Haptics &amp; Audio Enabled</Text>
          </View>
        </View>
        <Text style={styles.cardDesc}>
          Test the exact on-screen control scheme used in the native Android port. Tap buttons, move the stick, and watch the Digimon react with authentic sound effects!
        </Text>

        {/* Digimon Selector & Reset */}
        <View style={styles.digimonSelectRow}>
          {PLAYABLE_DIGIMON.map((d) => {
            const isSelected = d.id === selectedDigimon.id;
            return (
              <TouchableOpacity
                key={d.id}
                onPress={() => {
                  playSound('menu');
                  setSelectedDigimon(d);
                }}
                style={[
                  styles.digimonTab,
                  isSelected && { borderColor: d.color, backgroundColor: 'rgba(255,255,255,0.08)' },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Select Digimon ${d.name}`}
              >
                <Text
                  style={[
                    styles.digimonTabText,
                    isSelected && { color: d.color, fontWeight: '800' },
                  ]}
                >
                  {d.name}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={() => {
              playSound('heal');
              setCurrentHp(selectedDigimon.baseHp);
              setCurrentMp(selectedDigimon.baseMp);
              setActiveAction('Recovered full HP & MP!');
            }}
            style={styles.resetStatsBtn}
            accessibilityRole="button"
            accessibilityLabel="Restore Full HP and MP"
          >
            <RotateCcw size={12} color="#38bdf8" />
            <Text style={styles.resetStatsText}>Restore HP/MP</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Virtual Phone Screen Frame */}
      <View style={styles.virtualPhoneFrame}>
        {/* Virtual Phone HUD */}
        <View style={styles.hudOverlay}>
          <View style={styles.hudLeft}>
            <View style={styles.digimonBadgeRow}>
              <View
                style={[styles.digimonBadgeColor, { backgroundColor: selectedDigimon.color }]}
              />
              <Text style={styles.hudDigimonName}>{selectedDigimon.name}</Text>
              <Text style={styles.hudWeapon}>[{selectedDigimon.starterWeapon}]</Text>
            </View>

            {/* HP Bar */}
            <View style={styles.barContainer}>
              <Text style={styles.barLabel}>HP</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFillHp,
                    { width: `${(currentHp / selectedDigimon.baseHp) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>
                {currentHp} / {selectedDigimon.baseHp}
              </Text>
            </View>

            {/* MP Bar */}
            <View style={styles.barContainer}>
              <Text style={styles.barLabel}>MP</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFillMp,
                    { width: `${(currentMp / selectedDigimon.baseMp) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>
                {currentMp} / {selectedDigimon.baseMp}
              </Text>
            </View>
          </View>

          <View style={styles.hudRight}>
            <View style={styles.fpsBadge}>
              <Text style={styles.fpsText}>60.0 FPS</Text>
            </View>
            <Text style={styles.resolutionBadge}>Vulkan 1.1 / 1080p</Text>
          </View>
        </View>

        {/* 3D Battle/Lobby Visual Center */}
        <View style={styles.gameViewSurface}>
          {/* Real In-Game Screenshot Background */}
          <img
            src="/screenshots/jogo.jpg"
            alt="Digimon World 4 gameplay scene"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />

          {/* Action Popups / Visual Effect */}
          {damagePopup && (
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-orange-500 px-4 py-2 rounded-xl text-yellow-300 font-black text-sm tracking-wide animate-bounce shadow-2xl z-20">
              {damagePopup}
            </div>
          )}

          {actionEffect === 'slash' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-48 h-48 border-4 border-green-400 rounded-full animate-ping opacity-60" />
            </div>
          )}

          {actionEffect === 'guard' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-56 h-56 bg-blue-500/30 border-2 border-blue-400 rounded-2xl animate-pulse backdrop-blur-xs" />
            </div>
          )}

          {actionEffect === 'heal' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-48 h-48 bg-yellow-400/20 border-2 border-yellow-300 rounded-full animate-pulse" />
            </div>
          )}

          {actionEffect === 'cast' && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="w-64 h-64 bg-cyan-400/25 border-4 border-cyan-300 rounded-full animate-spin" />
            </div>
          )}

          {/* Action Status Bar on phone */}
          <View style={styles.actionBanner}>
            <Text style={styles.actionBannerText}>STATUS: {activeAction}</Text>
          </View>
        </View>

        {/* Virtual On-Screen Controls Layout */}
        <View
          style={[
            styles.touchControlsLayer,
            { opacity: buttonOpacity },
          ]}
        >
          {/* Left Side: Analog Stick (Orange) & D-Pad */}
          <View style={styles.touchLeftArea}>
            {/* Orange Left Analog Stick */}
            <div
              ref={stickBaseRef}
              className="relative w-24 h-24 rounded-full border-2 border-orange-500/60 bg-black/40 flex items-center justify-center cursor-pointer shadow-lg select-none"
              onMouseDown={() => setIsDraggingStick(true)}
              onMouseUp={() => {
                setIsDraggingStick(false);
                setStickPos({ x: 0, y: 0 });
                setActiveAction('Idle in Lobby');
              }}
              onMouseMove={(e) => {
                if (isDraggingStick) handleStickMove(e.clientX, e.clientY);
              }}
              onTouchStart={() => setIsDraggingStick(true)}
              onTouchEnd={() => {
                setIsDraggingStick(false);
                setStickPos({ x: 0, y: 0 });
                setActiveAction('Idle in Lobby');
              }}
              onTouchMove={(e) => {
                if (e.touches[0]) {
                  handleStickMove(e.touches[0].clientX, e.touches[0].clientY);
                }
              }}
            >
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 border border-amber-300 shadow-md flex items-center justify-center text-[10px] font-black text-black pointer-events-none"
                style={{
                  transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
                  transition: isDraggingStick ? 'none' : 'transform 0.15s ease-out',
                }}
              >
                MOVE
              </div>
            </div>

            {/* Items (LT) & Spells (RT) Trigger Buttons */}
            <View style={styles.triggerRow}>
              <TouchableOpacity
                onPress={() => handleButtonPress(GAME_CONTROLS[4])}
                style={[styles.triggerBtn, { borderColor: GAME_CONTROLS[4].color }]}
                accessibilityRole="button"
                accessibilityLabel="Items LT"
              >
                <Briefcase size={14} color={GAME_CONTROLS[4].color} />
                <Text style={[styles.triggerText, { color: GAME_CONTROLS[4].color }]}>
                  ITEMS (LT)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleButtonPress(GAME_CONTROLS[5])}
                style={[styles.triggerBtn, { borderColor: GAME_CONTROLS[5].color }]}
                accessibilityRole="button"
                accessibilityLabel="Spells RT"
              >
                <Flame size={14} color={GAME_CONTROLS[5].color} />
                <Text style={[styles.triggerText, { color: GAME_CONTROLS[5].color }]}>
                  SPELLS (RT)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right Side: Attack, Jump, Defend, Heal Action Diamond */}
          <View style={styles.touchRightArea}>
            <View
              style={[
                styles.diamondCluster,
                { transform: [{ scale: scaleMultiplier }] },
              ]}
            >
              {/* Top: QUICK HEAL (Y, Gold) */}
              <TouchableOpacity
                onPress={() => handleButtonPress(GAME_CONTROLS[3])}
                style={[styles.actionBtn, styles.btnTop, { borderColor: GAME_CONTROLS[3].color }]}
                accessibilityRole="button"
                accessibilityLabel="Quick Heal Y"
              >
                <Heart size={16} color={GAME_CONTROLS[3].color} />
                <Text style={[styles.btnLabel, { color: GAME_CONTROLS[3].color }]}>HEAL</Text>
                <Text style={styles.btnLetter}>Y</Text>
              </TouchableOpacity>

              {/* Left: DEFENSE (X, Blue) */}
              <TouchableOpacity
                onPress={() => handleButtonPress(GAME_CONTROLS[2])}
                style={[styles.actionBtn, styles.btnLeft, { borderColor: GAME_CONTROLS[2].color }]}
                accessibilityRole="button"
                accessibilityLabel="Defend X"
              >
                <Shield size={16} color={GAME_CONTROLS[2].color} />
                <Text style={[styles.btnLabel, { color: GAME_CONTROLS[2].color }]}>GUARD</Text>
                <Text style={styles.btnLetter}>X</Text>
              </TouchableOpacity>

              {/* Right: JUMP (B, Red) */}
              <TouchableOpacity
                onPress={() => handleButtonPress(GAME_CONTROLS[1])}
                style={[styles.actionBtn, styles.btnRight, { borderColor: GAME_CONTROLS[1].color }]}
                accessibilityRole="button"
                accessibilityLabel="Jump B"
              >
                <ArrowUp size={16} color={GAME_CONTROLS[1].color} />
                <Text style={[styles.btnLabel, { color: GAME_CONTROLS[1].color }]}>JUMP</Text>
                <Text style={styles.btnLetter}>B</Text>
              </TouchableOpacity>

              {/* Bottom: ATTACK (A, Green) */}
              <TouchableOpacity
                onPress={() => handleButtonPress(GAME_CONTROLS[0])}
                style={[styles.actionBtn, styles.btnBottom, { borderColor: GAME_CONTROLS[0].color }]}
                accessibilityRole="button"
                accessibilityLabel="Attack A"
              >
                <Swords size={18} color={GAME_CONTROLS[0].color} />
                <Text style={[styles.btnLabel, { color: GAME_CONTROLS[0].color }]}>ATTACK</Text>
                <Text style={styles.btnLetter}>A</Text>
              </TouchableOpacity>
            </View>

            {/* Menu (Start) */}
            <TouchableOpacity
              onPress={() => handleButtonPress(GAME_CONTROLS[6])}
              style={styles.pauseBtn}
              accessibilityRole="button"
              accessibilityLabel="Pause Start Menu"
            >
              <Pause size={14} color="#94a3b8" />
              <Text style={styles.pauseText}>START (⏸)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Customization Options Bar (Mirroring in-game settings) */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Sliders size={20} color="#38bdf8" />
            <Text style={styles.cardTitle}>Touch Controls Configuration</Text>
          </View>
        </View>

        <View style={styles.controlsConfigGrid}>
          {/* Button Scale */}
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>On-Screen Button Size</Text>
            <View style={styles.scaleBtnGroup}>
              {(['small', 'medium', 'large'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => {
                    playSound('menu');
                    setButtonScale(s);
                  }}
                  style={[
                    styles.scaleToggle,
                    buttonScale === s && styles.scaleToggleActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.scaleToggleText,
                      buttonScale === s && styles.scaleToggleTextActive,
                    ]}
                  >
                    {s.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Opacity Slider */}
          <View style={styles.configItem}>
            <Text style={styles.configLabel}>
              Button Opacity: {Math.round(buttonOpacity * 100)}%
            </Text>
            <input
              type="range"
              min="0.3"
              max="1.0"
              step="0.05"
              value={buttonOpacity}
              onChange={(e) => setButtonOpacity(parseFloat(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </View>
        </View>
      </View>

      {/* Button Reference Cards */}
      <View style={styles.card}>
        <Text style={styles.subheading}>Action Mapping &amp; Keyboard Controls</Text>
        <View style={styles.controlsList}>
          {GAME_CONTROLS.map((c) => (
            <View key={c.id} style={styles.controlRow}>
              <View
                style={[
                  styles.controlColorDot,
                  { backgroundColor: c.color, borderColor: c.borderColor },
                ]}
              />
              <View style={styles.controlMeta}>
                <View style={styles.controlNameRow}>
                  <Text style={styles.controlNameEn}>{c.nameEn}</Text>
                  <Text style={styles.controlNamePt}>[In Portuguese: {c.namePt}]</Text>
                </View>
                <Text style={styles.controlDesc}>{c.descriptionEn}</Text>
              </View>
              <View style={styles.controlKeys}>
                <Text style={styles.keyTag}>{c.keyboardKey}</Text>
              </View>
            </View>
          ))}
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
    marginBottom: 8,
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
    fontSize: 16,
    fontWeight: '800',
  },
  badgeHaptic: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeHapticText: {
    color: '#4ade80',
    fontSize: 10,
    fontWeight: '700',
  },
  cardDesc: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  digimonSelectRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  digimonTab: {
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
  digimonTabText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
  },
  resetStatsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  resetStatsText: {
    color: '#38bdf8',
    fontSize: 10,
    fontWeight: '700',
  },
  virtualPhoneFrame: {
    backgroundColor: '#000000',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#334155',
    overflow: 'hidden',
    height: 380,
    position: 'relative',
    shadowColor: '#f97316',
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  hudOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 15,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  hudLeft: {
    gap: 4,
  },
  digimonBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  digimonBadgeColor: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  hudDigimonName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },
  hudWeapon: {
    color: '#94a3b8',
    fontSize: 10,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  barLabel: {
    color: '#cbd5e1',
    fontSize: 10,
    fontWeight: '800',
    width: 18,
  },
  barTrack: {
    width: 90,
    height: 6,
    backgroundColor: '#1e293b',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFillHp: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  barFillMp: {
    height: '100%',
    backgroundColor: '#38bdf8',
  },
  barValue: {
    color: '#94a3b8',
    fontSize: 9,
    fontFamily: 'monospace',
  },
  hudRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  fpsBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  fpsText: {
    color: '#4ade80',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  resolutionBadge: {
    color: '#94a3b8',
    fontSize: 9,
  },
  gameViewSurface: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBanner: {
    position: 'absolute',
    bottom: 12,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  actionBannerText: {
    color: '#facc15',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  touchControlsLayer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    pointerEvents: 'box-none',
    zIndex: 20,
  },
  touchLeftArea: {
    gap: 10,
  },
  triggerRow: {
    flexDirection: 'row',
    gap: 6,
  },
  triggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  triggerText: {
    fontSize: 9,
    fontWeight: '800',
  },
  touchRightArea: {
    alignItems: 'center',
    gap: 8,
  },
  diamondCluster: {
    width: 140,
    height: 140,
    position: 'relative',
  },
  actionBtn: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  btnTop: {
    top: 0,
    left: 48,
  },
  btnLeft: {
    top: 48,
    left: 0,
  },
  btnRight: {
    top: 48,
    right: 0,
  },
  btnBottom: {
    bottom: 0,
    left: 48,
  },
  btnLabel: {
    fontSize: 7,
    fontWeight: '900',
    marginTop: -2,
  },
  btnLetter: {
    position: 'absolute',
    top: 2,
    right: 4,
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '900',
    opacity: 0.7,
  },
  pauseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderWidth: 1,
    borderColor: '#475569',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pauseText: {
    color: '#cbd5e1',
    fontSize: 9,
    fontWeight: '700',
  },
  controlsConfigGrid: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  configItem: {
    flex: 1,
    minWidth: 140,
    gap: 6,
  },
  configLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  scaleBtnGroup: {
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 6,
    padding: 2,
  },
  scaleToggle: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
  },
  scaleToggleActive: {
    backgroundColor: '#ea580c',
  },
  scaleToggleText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
  },
  scaleToggleTextActive: {
    color: '#ffffff',
  },
  subheading: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  controlsList: {
    gap: 10,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: 8,
  },
  controlColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  controlMeta: {
    flex: 1,
  },
  controlNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  controlNameEn: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  controlNamePt: {
    color: '#f97316',
    fontSize: 11,
  },
  controlDesc: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  controlKeys: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  keyTag: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
});
