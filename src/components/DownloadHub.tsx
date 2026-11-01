import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {
  Download,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  QrCode,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import QRCode from 'qrcode';
import { playSound } from '../utils/audioHaptics';

interface DownloadHubProps {
  onGoToVerifier: () => void;
  onGoToControls: () => void;
}

export const DownloadHub: React.FC<DownloadHubProps> = ({
  onGoToVerifier,
  onGoToControls,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<'v0.2.0' | 'v0.1.0'>('v0.2.0');
  const [downloadStarted, setDownloadStarted] = useState(false);

  const apkDownloadUrl =
    selectedVersion === 'v0.2.0'
      ? '/downloads/DigimonWorld4-v0.2.0-arm64-v8a.apk'
      : 'https://github.com/Masterllgod/digimon-world-4-port-nativo/releases/download/v0.1.0/DigimonWorld4-v0.1.0-arm64-v8a.apk';

  const fullApkUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/downloads/DigimonWorld4-v0.2.0-arm64-v8a.apk`
      : 'https://github.com/Masterllgod/digimon-world-4-port-nativo/releases';

  useEffect(() => {
    QRCode.toDataURL(fullApkUrl, {
      width: 180,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR error', err));
  }, [fullApkUrl]);

  const handleDownload = () => {
    playSound('heal');
    setDownloadStarted(true);
    const link = document.createElement('a');
    link.href = apkDownloadUrl;
    link.download = `DigimonWorld4-${selectedVersion}-arm64-v8a.apk`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Banner */}
      <View style={styles.heroCard}>
        <View style={styles.heroBadgeRow}>
          <View style={styles.badgeLive}>
            <Text style={styles.badgeLiveText}>OFFICIAL ENGLISH PORT HUB</Text>
          </View>
          <Text style={styles.versionTag}>Release {selectedVersion} (Alpha)</Text>
        </View>

        <Text style={styles.heroTitle}>Digimon World 4</Text>
        <Text style={styles.heroSubtitle}>
          Original Xbox game recompiled statically for native ARM64 Android with Vulkan 1.1 graphics — NO CPU emulator overhead!
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>60 FPS</Text>
            <Text style={styles.statLabel}>Target Framerate</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>ARM64</Text>
            <Text style={styles.statLabel}>Native CPU</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>Vulkan</Text>
            <Text style={styles.statLabel}>Direct3D 8 Core</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>34 MB</Text>
            <Text style={styles.statLabel}>APK Package</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.heroActions}>
          <TouchableOpacity
            style={styles.primaryDownloadBtn}
            onPress={handleDownload}
            accessibilityRole="button"
            accessibilityLabel={`Download APK version ${selectedVersion}`}
          >
            <Download size={20} color="#ffffff" />
            <Text style={styles.primaryDownloadText}>
              Download APK ({selectedVersion})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={onGoToVerifier}
            accessibilityRole="button"
            accessibilityLabel="Verify Game Files Hash"
          >
            <FileCheck size={18} color="#f97316" />
            <Text style={styles.secondaryBtnText}>Verify default.xbe</Text>
          </TouchableOpacity>
        </View>

        {downloadStarted && (
          <View style={styles.downloadNotification}>
            <CheckCircle2 size={16} color="#22c55e" />
            <Text style={styles.downloadNotificationText}>
              Download started! After downloading, tap the APK in your notification bar to install on your phone.
            </Text>
          </View>
        )}
      </View>

      {/* QR Code Section for Phone Scan */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <QrCode size={20} color="#f97316" />
            <Text style={styles.cardTitle}>Direct Phone Install (QR Code)</Text>
          </View>
          <Text style={styles.cardSubtitle}>Scan with phone camera</Text>
        </View>

        <View style={styles.qrRow}>
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="Scan to download APK"
              className="w-36 h-36 rounded-xl border-4 border-slate-700 bg-white p-1 shadow-md"
            />
          ) : (
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrPlaceholderText}>Generating QR...</Text>
            </View>
          )}

          <View style={styles.qrInstructions}>
            <Text style={styles.qrHeading}>Instant Phone Download:</Text>
            <Text style={styles.qrStep}>1. Open your phone's camera app or QR scanner.</Text>
            <Text style={styles.qrStep}>2. Point camera at the QR code to immediately download the APK.</Text>
            <Text style={styles.qrStep}>3. In Android settings, enable &quot;Install Unknown Apps&quot; if prompted.</Text>
            <Text style={styles.qrStep}>4. Launch Digimon World 4 and select your game directory.</Text>
          </View>
        </View>
      </View>

      {/* 4-Step English Quick Start Guide */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <FolderOpen size={20} color="#38bdf8" />
            <Text style={styles.cardTitle}>Complete English Setup Instructions</Text>
          </View>
          <View style={styles.badgeEnglish}>
            <Text style={styles.badgeEnglishText}>Translated from Portuguese</Text>
          </View>
        </View>

        <View style={styles.stepsList}>
          {/* Step 1 */}
          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Install the Android APK</Text>
              <Text style={styles.stepDesc}>
                Tap the download button above or scan the QR code. Open the downloaded file (<Text style={styles.codeText}>DigimonWorld4-v0.2.0-arm64-v8a.apk</Text>) on your phone and tap <Text style={styles.boldText}>Install</Text>.
              </Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Create the &quot;DIGIMON4&quot; Folder on Your Phone</Text>
              <Text style={styles.stepDesc}>
                In your phone's internal storage root (e.g. using Files app or ZArchiver), create a folder named:
              </Text>
              <View style={styles.pathBox}>
                <Text style={styles.pathBoxText}>Internal Storage / DIGIMON4</Text>
              </View>
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Copy the 4 Required Game Files</Text>
              <Text style={styles.stepDesc}>
                Copy the following 4 files from your original Xbox USA game disc dump into <Text style={styles.codeText}>DIGIMON4</Text>:
              </Text>
              <View style={styles.fileGrid}>
                <View style={styles.fileTag}>
                  <Text style={styles.fileTagName}>default.xbe</Text>
                  <Text style={styles.fileTagSize}>3,887,104 B (Executable)</Text>
                </View>
                <View style={styles.fileTag}>
                  <Text style={styles.fileTagName}>area.afs</Text>
                  <Text style={styles.fileTagSize}>Maps & Dungeons</Text>
                </View>
                <View style={styles.fileTag}>
                  <Text style={styles.fileTagName}>ndmw.afs</Text>
                  <Text style={styles.fileTagSize}>Music & Audio</Text>
                </View>
                <View style={styles.fileTag}>
                  <Text style={styles.fileTagName}>ndmw.igb</Text>
                  <Text style={styles.fileTagSize}>3D Models & Graphics</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Step 4 */}
          <View style={styles.stepItem}>
            <View style={styles.stepNumberBadge}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Launch &amp; Select Game Directory</Text>
              <Text style={styles.stepDesc}>
                Open the app on your phone. If it doesn't automatically detect your files, tap <Text style={styles.boldText}>ESCOLHER PASTA</Text> (&quot;Choose Folder&quot;), grant storage permissions, and choose your <Text style={styles.codeText}>DIGIMON4</Text> folder. Tap <Text style={styles.boldText}>JOGAR</Text> (&quot;Play&quot;) to start!
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Portuguese to English Reference Table */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Layers size={20} color="#a855f7" />
            <Text style={styles.cardTitle}>App Language Reference (PT → EN)</Text>
          </View>
          <Text style={styles.cardSubtitle}>Quick Translation Guide</Text>
        </View>

        <View style={styles.transTable}>
          <View style={styles.transHeaderRow}>
            <Text style={[styles.transHeaderCell, { flex: 1.2 }]}>In App (Portuguese)</Text>
            <Text style={[styles.transHeaderCell, { flex: 1.2 }]}>English Meaning</Text>
            <Text style={[styles.transHeaderCell, { flex: 2 }]}>What It Does</Text>
          </View>
          <View style={styles.transRow}>
            <Text style={[styles.transCellPt, { flex: 1.2 }]}>ESCOLHER PASTA</Text>
            <Text style={[styles.transCellEn, { flex: 1.2 }]}>CHOOSE FOLDER</Text>
            <Text style={[styles.transCellDesc, { flex: 2 }]}>Opens Android file selector to pick /DIGIMON4</Text>
          </View>
          <View style={styles.transRow}>
            <Text style={[styles.transCellPt, { flex: 1.2 }]}>JOGAR</Text>
            <Text style={[styles.transCellEn, { flex: 1.2 }]}>PLAY GAME</Text>
            <Text style={[styles.transCellDesc, { flex: 2 }]}>Starts the game engine</Text>
          </View>
          <View style={styles.transRow}>
            <Text style={[styles.transCellPt, { flex: 1.2 }]}>Armazenamento</Text>
            <Text style={[styles.transCellEn, { flex: 1.2 }]}>Internal Storage</Text>
            <Text style={[styles.transCellDesc, { flex: 2 }]}>Root storage directory on phone</Text>
          </View>
          <View style={styles.transRow}>
            <Text style={[styles.transCellPt, { flex: 1.2 }]}>Resolução</Text>
            <Text style={[styles.transCellEn, { flex: 1.2 }]}>Resolution Scale</Text>
            <Text style={[styles.transCellDesc, { flex: 2 }]}>Internal render resolution (50% to 150%)</Text>
          </View>
          <View style={styles.transRow}>
            <Text style={[styles.transCellPt, { flex: 1.2 }]}>Antisserrilhado</Text>
            <Text style={[styles.transCellEn, { flex: 1.2 }]}>Anti-Aliasing</Text>
            <Text style={[styles.transCellDesc, { flex: 2 }]}>SMAA / FXAA edge smoothing</Text>
          </View>
        </View>
      </View>

      {/* System Requirements */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Cpu size={20} color="#22c55e" />
            <Text style={styles.cardTitle}>Hardware Requirements</Text>
          </View>
        </View>

        <View style={styles.reqGrid}>
          <View style={styles.reqCol}>
            <Text style={styles.reqColTitle}>Minimum Requirements</Text>
            <Text style={styles.reqItem}>• Android 11 (API 30)</Text>
            <Text style={styles.reqItem}>• 64-bit ARM CPU (arm64-v8a)</Text>
            <Text style={styles.reqItem}>• Vulkan 1.1 Support</Text>
            <Text style={styles.reqItem}>• 4 GB RAM</Text>
            <Text style={styles.reqItem}>• 1.2 GB Free Internal Storage</Text>
          </View>
          <View style={styles.reqColRecommended}>
            <Text style={styles.reqColTitleRec}>Recommended for 60 FPS</Text>
            <Text style={styles.reqItemRec}>• Android 13 or newer</Text>
            <Text style={styles.reqItemRec}>• Snapdragon 7 Gen 1 / Dimensity 8000+</Text>
            <Text style={styles.reqItemRec}>• Adreno 730 / Mali-G710 or higher</Text>
            <Text style={styles.reqItemRec}>• 6 GB to 8 GB+ RAM</Text>
            <Text style={styles.reqItemRec}>• Bluetooth Gamepad (Xbox / DualSense / Kishi)</Text>
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
  heroCard: {
    backgroundColor: '#0b1329',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    shadowColor: '#f97316',
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  heroBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeLive: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeLiveText: {
    color: '#4ade80',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  versionTag: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  heroSubtitle: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    minWidth: 70,
    backgroundColor: '#111c38',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e3a5f',
  },
  statNum: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '800',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  primaryDownloadBtn: {
    flex: 1,
    minWidth: 160,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ea580c',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#ea580c',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  primaryDownloadText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  secondaryBtnText: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '700',
  },
  downloadNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  downloadNotificationText: {
    color: '#86efac',
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
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
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  cardSubtitle: {
    color: '#94a3b8',
    fontSize: 11,
  },
  badgeEnglish: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeEnglishText: {
    color: '#38bdf8',
    fontSize: 9,
    fontWeight: '700',
  },
  qrRow: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  qrPlaceholder: {
    width: 144,
    height: 144,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrPlaceholderText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  qrInstructions: {
    flex: 1,
    minWidth: 180,
    gap: 6,
  },
  qrHeading: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  qrStep: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 16,
  },
  stepsList: {
    gap: 14,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ea580c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepDesc: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 17,
  },
  codeText: {
    color: '#38bdf8',
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  boldText: {
    color: '#f97316',
    fontWeight: '700',
  },
  pathBox: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginTop: 6,
  },
  pathBoxText: {
    color: '#facc15',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
  },
  fileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  fileTag: {
    backgroundColor: '#111c38',
    borderWidth: 1,
    borderColor: '#1e3a5f',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 110,
  },
  fileTagName: {
    color: '#38bdf8',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
  },
  fileTagSize: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 2,
  },
  transTable: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  transHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  transHeaderCell: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
  },
  transRow: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  transCellPt: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  transCellEn: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '600',
  },
  transCellDesc: {
    color: '#94a3b8',
    fontSize: 11,
  },
  reqGrid: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  reqCol: {
    flex: 1,
    minWidth: 160,
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 4,
  },
  reqColTitle: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  reqItem: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 16,
  },
  reqColRecommended: {
    flex: 1,
    minWidth: 160,
    backgroundColor: 'rgba(34, 197, 94, 0.05)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    gap: 4,
  },
  reqColTitleRec: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
  },
  reqItemRec: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
  },
});
