import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Gamepad,
  HardDrive,
  Cpu,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { playSound } from '../utils/audioHaptics';

interface FaqItem {
  question: string;
  answer: string;
  category: 'gameplay' | 'technical' | 'files';
}

export const ManualFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'files',
      question: 'Does this port work with the PS2 or GameCube releases of Digimon World 4?',
      answer:
        'No. This native port is specifically engineered via static x86 binary recompilation of the original Microsoft Xbox (USA) executable (Title ID 42410002). The PS2 uses MIPS and the GameCube uses PowerPC, which have completely different machine instructions. Only the exact USA Xbox default.xbe is supported.',
    },
    {
      category: 'technical',
      question: 'How is this different from running an Xbox emulator like Xemu?',
      answer:
        'Traditional emulators interpret CPU instructions instruction-by-instruction in real time, causing massive thermal throttling and low framerates on mobile processors. This port statically translates the original x86 machine code directly into native ARM64 instructions prior to compilation. The Direct3D 8 and DirectSound subsystems are rewritten on top of Vulkan 1.1 and SDL3, resulting in raw native speed (~60 FPS).',
    },
    {
      category: 'gameplay',
      question: 'Can I connect a physical Bluetooth or USB controller to my phone?',
      answer:
        'Yes! Full HID gamepad support is integrated. You can connect an Xbox Wireless Controller, PlayStation DualSense/DualShock 4, Nintendo Switch Pro Controller, Razer Kishi, Backbone One, or GameSir. The on-screen touch overlay automatically disappears the moment controller input is detected.',
    },
    {
      category: 'files',
      question: 'The app shows a Portuguese error message about folder selection. What does it mean?',
      answer:
        '"Escolha a pasta onde estão o default.xbe e os arquivos area.afs": This means the game cannot find your game files in /Armazenamento/DIGIMON4. Tap "ESCOLHER PASTA" (Choose Folder), grant storage access when Android prompts, and tap the DIGIMON4 directory.',
    },
    {
      category: 'technical',
      question: 'How do in-app updates work?',
      answer:
        'The Android launcher includes an integrated update checker that queries the GitHub releases upon launch. Whenever a new optimization build (e.g. v0.3.0) is released, an update prompt will appear on the main menu allowing you to update directly without losing your save data or settings.',
    },
    {
      category: 'gameplay',
      question: 'How do saves, memory cards, and digivolutions work?',
      answer:
        'Saves are stored locally inside the app data directory under your phone storage. You can save at the terminal stations located in the Main Lobby (Central City) or at save gates in dungeons.',
    },
  ];

  const toggleFaq = (index: number) => {
    playSound('menu');
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <HelpCircle size={22} color="#f97316" />
          <Text style={styles.cardTitle}>English Manual &amp; Troubleshooting FAQ</Text>
        </View>
        <Text style={styles.cardDesc}>
          Everything you need to know about the native ARM64 port, compiled from the developer notes and translated into clear English.
        </Text>
      </View>

      {/* Accordion FAQ List */}
      <View style={styles.faqList}>
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <View key={idx} style={styles.faqCard}>
              <TouchableOpacity
                onPress={() => toggleFaq(idx)}
                style={styles.faqQuestionBtn}
                accessibilityRole="button"
                accessibilityLabel={faq.question}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                {isOpen ? (
                  <ChevronUp size={18} color="#f97316" />
                ) : (
                  <ChevronDown size={18} color="#94a3b8" />
                )}
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Credits & Open Source Notice */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <ShieldCheck size={20} color="#22c55e" />
          <Text style={styles.cardTitle}>Open-Source Components &amp; Credits</Text>
        </View>

        <Text style={styles.cardDesc}>
          This fan port was created by developer <Text style={styles.boldWhite}>SHADOWll</Text> using the following open-source frameworks:
        </Text>

        <View style={styles.creditsList}>
          <View style={styles.creditItem}>
            <Text style={styles.creditName}>XboxXBE-Recomp (by TGP482)</Text>
            <Text style={styles.creditRole}>Xbox original static recompiler, portable D3D8, and DirectSound kernel runtime.</Text>
          </View>
          <View style={styles.creditItem}>
            <Text style={styles.creditName}>DW5-XBERecomp (by datfooldive)</Text>
            <Text style={styles.creditRole}>Dynasty Warriors 5 Android port that provided the mobile foundation.</Text>
          </View>
          <View style={styles.creditItem}>
            <Text style={styles.creditName}>SDL 3 &amp; Dear ImGui</Text>
            <Text style={styles.creditRole}>Cross-platform audio, input handling, and on-screen HUD configuration overlay.</Text>
          </View>
          <View style={styles.creditItem}>
            <Text style={styles.creditName}>Vulkan Memory Allocator &amp; Zydis</Text>
            <Text style={styles.creditRole}>Fast GPU buffer management and x86 machine instruction disassembly.</Text>
          </View>
        </View>

        <View style={styles.legalBox}>
          <Text style={styles.legalTitle}>LEGAL DISCLAIMER:</Text>
          <Text style={styles.legalText}>
            This is an unofficial fan project with no commercial affiliation with Bandai Namco, Toei Animation, or Microsoft. Digimon and Digimon World 4 are registered trademarks of their respective owners. Users must supply their own legitimately owned copy of the original Xbox game.
          </Text>
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
    marginBottom: 10,
  },
  boldWhite: {
    color: '#ffffff',
    fontWeight: '700',
  },
  faqList: {
    gap: 10,
  },
  faqCard: {
    backgroundColor: '#090e1d',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
    overflow: 'hidden',
  },
  faqQuestionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  faqQuestionText: {
    color: '#f8fafc',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    lineHeight: 18,
  },
  faqAnswerContainer: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 10,
    backgroundColor: '#070b16',
  },
  faqAnswerText: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 18,
  },
  creditsList: {
    gap: 10,
    marginTop: 6,
  },
  creditItem: {
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  creditName: {
    color: '#38bdf8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  creditRole: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 15,
  },
  legalBox: {
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  legalTitle: {
    color: '#ef4444',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 2,
  },
  legalText: {
    color: '#94a3b8',
    fontSize: 10,
    lineHeight: 14,
  },
});
