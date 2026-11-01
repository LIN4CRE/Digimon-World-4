import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Copy,
  Check,
  Upload,
  Sparkles,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  validateXbeFile,
  REQUIRED_GAME_FILES,
  HashValidationResult,
} from '../utils/romValidator';
import { playSound } from '../utils/audioHaptics';

export const RomVerifier: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<HashValidationResult | null>(null);
  const [copiedSha1, setCopiedSha1] = useState(false);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    size: number;
    sha1?: string;
  } | null>(null);

  const expectedSpec = REQUIRED_GAME_FILES[0];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    setResult(null);
    playSound('menu');

    try {
      // Calculate SHA-1 hash via Web Crypto API
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const sha1 = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

      const res = validateXbeFile(file.name, file.size, sha1);
      setFileDetails({ name: file.name, size: file.size, sha1 });
      setResult(res);

      if (res.isValid) {
        playSound('success');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } else {
        playSound('guard');
      }
    } catch (err) {
      console.error(err);
      setResult({
        fileName: file.name,
        sizeMatches: false,
        sha1Matches: false,
        isValid: false,
        message: 'Error computing hash. Please try again.',
      });
      playSound('guard');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSimulateValid = () => {
    playSound('success');
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
    setFileDetails({
      name: 'default.xbe',
      size: 3887104,
      sha1: expectedSpec.expectedSha1,
    });
    setResult({
      fileName: 'default.xbe',
      sizeMatches: true,
      sha1Matches: true,
      isValid: true,
      message: '100% MATCH: Digimon World 4 (Xbox Original, USA Retail)',
    });
  };

  const copyToClipboard = (text: string) => {
    playSound('menu');
    navigator.clipboard.writeText(text);
    setCopiedSha1(true);
    setTimeout(() => setCopiedSha1(false), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Info */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <FileCheck size={22} color="#f97316" />
          <Text style={styles.cardTitle}>default.xbe Hash Verifier</Text>
        </View>
        <Text style={styles.cardDesc}>
          The native Android port recompiles x86 machine code specifically for the{' '}
          <Text style={styles.boldWhite}>Digimon World 4 (USA)</Text> release. Check your file below to verify it before transferring to your phone!
        </Text>

        {/* Expected Specs Box */}
        <View style={styles.specBox}>
          <Text style={styles.specBoxTitle}>REQUIRED FILE SIGNATURE (USA RETAIL):</Text>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>File Name:</Text>
            <Text style={styles.specValue}>default.xbe</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Exact Size:</Text>
            <Text style={styles.specValue}>3,887,104 bytes (approx 3.7 MB)</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Title ID:</Text>
            <Text style={styles.specValue}>42410002</Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>SHA-1 Hash:</Text>
            <TouchableOpacity
              onPress={() => copyToClipboard(expectedSpec.expectedSha1!)}
              style={styles.hashCopyBtn}
            >
              <Text style={styles.hashValueText}>
                {expectedSpec.expectedSha1}
              </Text>
              {copiedSha1 ? (
                <Check size={14} color="#22c55e" />
              ) : (
                <Copy size={14} color="#94a3b8" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Upload & Drop Zone */}
      <View style={styles.card}>
        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-orange-500/40 rounded-xl bg-slate-900/50 hover:bg-slate-900/80 cursor-pointer transition">
          <Upload size={32} color="#f97316" className="mb-2" />
          <span className="text-white font-bold text-sm text-center">
            {analyzing ? 'Computing SHA-1 Checksum...' : 'Select or Drop your "default.xbe" file'}
          </span>
          <span className="text-slate-400 text-xs mt-1 text-center">
            Verification is computed 100% locally in your browser. No files are uploaded to any server.
          </span>
          <input
            type="file"
            className="hidden"
            accept=".xbe"
            onChange={handleFileChange}
            disabled={analyzing}
          />
        </label>

        <View style={styles.simRow}>
          <Text style={styles.simText}>Don&apos;t have your disc dump on this device?</Text>
          <TouchableOpacity
            style={styles.simButton}
            onPress={handleSimulateValid}
            accessibilityRole="button"
            accessibilityLabel="Test Sample File"
          >
            <Sparkles size={14} color="#f97316" />
            <Text style={styles.simBtnText}>Test Sample File</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Verification Results Card */}
      {result && (
        <View
          style={[
            styles.card,
            result.isValid ? styles.cardSuccess : styles.cardFail,
          ]}
        >
          <View style={styles.resultHeader}>
            {result.isValid ? (
              <CheckCircle2 size={24} color="#22c55e" />
            ) : (
              <XCircle size={24} color="#ef4444" />
            )}
            <Text
              style={[
                styles.resultTitle,
                result.isValid ? styles.textSuccess : styles.textFail,
              ]}
            >
              {result.isValid ? 'Compatible & Verified!' : 'File Incompatible'}
            </Text>
          </View>

          <Text style={styles.resultMessage}>{result.message}</Text>

          {fileDetails && (
            <View style={styles.detailsBox}>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>File Name:</Text>
                <Text style={styles.specValue}>{fileDetails.name}</Text>
              </View>
              <View style={styles.specRow}>
                <Text style={styles.specLabel}>Detected Size:</Text>
                <Text
                  style={[
                    styles.specValue,
                    result.sizeMatches ? styles.textSuccess : styles.textFail,
                  ]}
                >
                  {fileDetails.size.toLocaleString()} bytes{' '}
                  {result.sizeMatches ? '(Matches)' : '(Mismatch!)'}
                </Text>
              </View>
              {fileDetails.sha1 && (
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Detected SHA-1:</Text>
                  <Text
                    style={[
                      styles.specValueMono,
                      result.sha1Matches ? styles.textSuccess : styles.textFail,
                    ]}
                  >
                    {fileDetails.sha1}
                  </Text>
                </View>
              )}
            </View>
          )}

          {result.isValid && (
            <View style={styles.nextStepBox}>
              <Text style={styles.nextStepTitle}>Next Step for Phone:</Text>
              <Text style={styles.nextStepText}>
                Copy this <Text style={styles.boldWhite}>default.xbe</Text> along with{' '}
                <Text style={styles.boldWhite}>area.afs</Text>,{' '}
                <Text style={styles.boldWhite}>ndmw.afs</Text>, and{' '}
                <Text style={styles.boldWhite}>ndmw.igb</Text> into your phone&apos;s{' '}
                <Text style={styles.codeHighlight}>Internal Storage / DIGIMON4</Text> folder.
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Required Files Summary */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Info size={20} color="#38bdf8" />
          <Text style={styles.cardTitle}>Complete 4-File Package Checklist</Text>
        </View>

        <View style={styles.checklist}>
          {REQUIRED_GAME_FILES.map((f) => (
            <View key={f.name} style={styles.checkItem}>
              <View style={styles.checkIcon}>
                <CheckCircle2 size={16} color="#38bdf8" />
              </View>
              <View style={styles.checkContent}>
                <Text style={styles.checkName}>{f.name}</Text>
                <Text style={styles.checkDesc}>{f.description}</Text>
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
  cardSuccess: {
    borderColor: 'rgba(34, 197, 94, 0.4)',
    backgroundColor: 'rgba(6, 78, 59, 0.15)',
  },
  cardFail: {
    borderColor: 'rgba(239, 68, 68, 0.4)',
    backgroundColor: 'rgba(127, 29, 29, 0.15)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
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
  boldWhite: {
    color: '#f8fafc',
    fontWeight: '700',
  },
  specBox: {
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    gap: 6,
  },
  specBoxTitle: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  specLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  },
  specValue: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  specValueMono: {
    color: '#ffffff',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  hashCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  hashValueText: {
    color: '#38bdf8',
    fontSize: 10,
    fontFamily: 'monospace',
  },
  simRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  simText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  simButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  simBtnText: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: '700',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  textSuccess: {
    color: '#4ade80',
  },
  textFail: {
    color: '#f87171',
  },
  resultMessage: {
    color: '#e2e8f0',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  detailsBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 6,
  },
  nextStepBox: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    marginTop: 10,
  },
  nextStepTitle: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  nextStepText: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
  },
  codeHighlight: {
    color: '#facc15',
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  checklist: {
    gap: 10,
  },
  checkItem: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: 8,
  },
  checkIcon: {
    marginTop: 2,
  },
  checkContent: {
    flex: 1,
  },
  checkName: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  checkDesc: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 15,
  },
});
