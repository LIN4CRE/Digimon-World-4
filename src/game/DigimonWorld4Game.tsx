import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  Swords,
  Shield,
  Heart,
  Briefcase,
  Flame,
  Pause,
  RotateCcw,
  Trophy,
  Zap,
  Volume2,
  VolumeX,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import {
  DigimonStarterId,
  PlayerStats,
  Enemy,
  DropItem,
  Projectile,
} from './engine/types';
import {
  getStarterDigimonStats,
  calculateMeleeDamage,
  calculatePlayerDamageTaken,
  checkCollision,
  addExpAndCheckLevelUp,
  generateWaveEnemies,
} from './engine/gameLogic';
import {
  createDigimonMesh,
  createEnemyMesh,
  createArenaEnvironment,
} from './engine/proceduralModels';
import { playSound, triggerHaptic } from '../utils/audioHaptics';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface DigimonWorld4GameProps {
  onBackToHub?: () => void;
}

export const DigimonWorld4Game: React.FC<DigimonWorld4GameProps> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { tamerData, updateTamerSettings } = useAuth();

  // Active Starter Digimon
  const [selectedStarter, setSelectedStarter] = useState<DigimonStarterId>(
    tamerData.starterDigimon || 'dorumon'
  );

  // Live game UI state
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameover'>('menu');
  const [wave, setWave] = useState(1);
  const [stats, setStats] = useState<PlayerStats>(getStarterDigimonStats(selectedStarter));
  const [isGuarding, setIsGuarding] = useState(false);
  const [waveAnnounce, setWaveAnnounce] = useState<string | null>('Wave 1: Digital Gate Open');
  const [levelUpPopup, setLevelUpPopup] = useState<number | null>(null);

  // Mutable refs for high-frequency render loop (avoids React re-renders tearing down WebGL)
  const playerPosRef = useRef({ x: 0, z: 0, rotY: 0, isJumping: false, jumpY: 0, vy: 0 });
  const playerMeshRef = useRef<THREE.Group | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const stickInputRef = useRef({ x: 0, y: 0 });
  const enemiesRef = useRef<Enemy[]>([]);
  const dropsRef = useRef<DropItem[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const statsRef = useRef<PlayerStats>(getStarterDigimonStats(selectedStarter));
  const isGuardingRef = useRef(false);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const weaponSwingRef = useRef({ swinging: false, timer: 0, comboIndex: 0 });
  const waveRef = useRef(1);
  const scoreRef = useRef(0);

  // Sync state ref
  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    isGuardingRef.current = isGuarding;
  }, [isGuarding]);

  // Handle character choice switch
  const handleSelectStarter = (starterId: DigimonStarterId) => {
    playSound('menu');
    setSelectedStarter(starterId);
    updateTamerSettings({ starterDigimon: starterId });
    const newStats = getStarterDigimonStats(starterId);
    setStats(newStats);
    statsRef.current = newStats;
  };

  // Start new game
  const startGame = useCallback(() => {
    playSound('success');
    setGameState('playing');
    setWave(1);
    waveRef.current = 1;
    const initialStats = getStarterDigimonStats(selectedStarter);
    setStats(initialStats);
    statsRef.current = initialStats;
    playerPosRef.current = { x: 0, z: 0, rotY: 0, isJumping: false, jumpY: 0, vy: 0 };
    setWaveAnnounce('Wave 1: Digital Security Incursion');
    setTimeout(() => setWaveAnnounce(null), 2500);

    // Spawn wave 1
    if (sceneRef.current) {
      spawnEnemiesForWave(1, sceneRef.current);
    }
  }, [selectedStarter]);

  // Spawn wave helper
  const spawnEnemiesForWave = (waveNum: number, scene: THREE.Scene) => {
    // Clear old enemy meshes
    enemiesRef.current.forEach((e) => {
      if (e.meshGroup) scene.remove(e.meshGroup);
    });
    enemiesRef.current = [];

    const generated = generateWaveEnemies(waveNum);
    generated.forEach((gen) => {
      const mesh = createEnemyMesh(gen.type);
      mesh.position.set(gen.x, 0, gen.z);
      scene.add(mesh);
      enemiesRef.current.push({
        ...gen,
        meshGroup: mesh,
      });
    });
  };

  // Action: Melee Combo Attack (Button A / J / Space)
  const triggerAttack = () => {
    if (gameState !== 'playing') return;
    playSound('slash');
    triggerHaptic(25);

    const comboIdx = (weaponSwingRef.current.comboIndex + 1) % 3;
    weaponSwingRef.current = { swinging: true, timer: 0.25, comboIndex: comboIdx };

    // Check hit radius in front of player
    const px = playerPosRef.current.x;
    const pz = playerPosRef.current.z;
    const prot = playerPosRef.current.rotY;
    const hitX = px + Math.sin(prot) * 2.2;
    const hitZ = pz + Math.cos(prot) * 2.2;

    enemiesRef.current.forEach((enemy) => {
      if (enemy.hp <= 0) return;
      if (checkCollision(hitX, hitZ, 1.8, enemy.x, enemy.z, 1.2)) {
        const { damage, isCritical } = calculateMeleeDamage(
          statsRef.current.attackPower,
          enemy.defense,
          comboIdx,
          false
        );
        enemy.hp -= damage;
        enemy.isHit = true;
        enemy.hitTimer = 0.2;

        // Knockback enemy slightly
        enemy.x += Math.sin(prot) * 0.8;
        enemy.z += Math.cos(prot) * 0.8;

        if (enemy.hp <= 0) {
          handleEnemyDefeated(enemy);
        }
      }
    });
  };

  // Action: Jump (Button B / K)
  const triggerJump = () => {
    if (gameState !== 'playing' || playerPosRef.current.isJumping) return;
    playSound('jump');
    triggerHaptic(20);
    playerPosRef.current.isJumping = true;
    playerPosRef.current.vy = 12.0;
  };

  // Action: Quick Heal (Button Y / I)
  const triggerHeal = () => {
    if (gameState !== 'playing') return;
    if (statsRef.current.hp >= statsRef.current.maxHp) return;
    playSound('heal');
    triggerHaptic(30);
    setStats((prev) => ({
      ...prev,
      hp: Math.min(prev.maxHp, prev.hp + 180),
    }));
  };

  // Action: Cast Magic Spell (Button RT / E)
  const triggerSpell = () => {
    if (gameState !== 'playing') return;
    if (statsRef.current.mp < 30) return;
    playSound('cast');
    triggerHaptic(40);

    setStats((prev) => ({
      ...prev,
      mp: Math.max(0, prev.mp - 30),
    }));

    // AoE burst around player
    const px = playerPosRef.current.x;
    const pz = playerPosRef.current.z;

    enemiesRef.current.forEach((enemy) => {
      if (enemy.hp <= 0) return;
      if (checkCollision(px, pz, 6.5, enemy.x, enemy.z, 1.2)) {
        const dmg = Math.floor(statsRef.current.attackPower * 2.4);
        enemy.hp -= dmg;
        enemy.isHit = true;
        enemy.hitTimer = 0.3;
        if (enemy.hp <= 0) {
          handleEnemyDefeated(enemy);
        }
      }
    });
  };

  // Defeat enemy & drops
  const handleEnemyDefeated = (enemy: Enemy) => {
    playSound('success');
    if (enemy.meshGroup && sceneRef.current) {
      sceneRef.current.remove(enemy.meshGroup);
    }

    const exp = enemy.expYield;
    const bits = enemy.bitsYield;

    const { stats: updatedStats, leveledUp } = addExpAndCheckLevelUp(statsRef.current, exp);
    updatedStats.score += exp * 10;
    updatedStats.bits += bits;
    updatedStats.kills += 1;
    scoreRef.current = updatedStats.score;

    if (leveledUp) {
      playSound('success');
      setLevelUpPopup(updatedStats.level);
      confetti({ particleCount: 70, spread: 60 });
      setTimeout(() => setLevelUpPopup(null), 2000);
    }

    setStats(updatedStats);

    // Check if wave cleared
    const remaining = enemiesRef.current.filter((e) => e.hp > 0);
    if (remaining.length === 0) {
      const nextWave = waveRef.current + 1;
      waveRef.current = nextWave;
      setWave(nextWave);
      setWaveAnnounce(`Wave ${nextWave} Incoming!`);
      playSound('heal');
      confetti({ particleCount: 50, spread: 80 });
      setTimeout(() => {
        setWaveAnnounce(null);
        if (sceneRef.current) {
          spawnEnemiesForWave(nextWave, sceneRef.current);
        }
      }, 2000);
    }
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const code = e.code.toLowerCase();
      keysRef.current[code] = true;

      if (e.code === 'Space' || code === 'keyj') triggerAttack();
      if (code === 'keyk') triggerJump();
      if (code === 'keyu') setIsGuarding(true);
      if (code === 'keyi') triggerHeal();
      if (code === 'keye') triggerSpell();
      if (code === 'escape') {
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const code = e.code.toLowerCase();
      keysRef.current[code] = false;
      if (code === 'keyu') setIsGuarding(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Main Three.js Scene Setup & Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect Software WebGL (AI Studio headless browser or software fallback)
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x050814);
    scene.fog = new THREE.FogExp2(0x050814, 0.022);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 16, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = !isSoftwareGl;

    container.appendChild(renderer.domElement);

    // Warm Key Light & Cool Fill
    const dirLight = new THREE.DirectionalLight(0xfff7ed, 2.0);
    dirLight.position.set(12, 24, 15);
    dirLight.castShadow = !isSoftwareGl;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x090d16, 1.2);
    scene.add(hemiLight);

    // Build Cyber Arena Environment
    createArenaEnvironment(scene);

    // Create Player Digimon Model
    const playerMesh = createDigimonMesh(selectedStarter);
    scene.add(playerMesh);
    playerMeshRef.current = playerMesh;

    // Responsive window resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation & Physics Game Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.05);

      // Player Movement Logic
      let moveX = 0;
      let moveZ = 0;

      // Virtual Joystick or Keyboard Input
      if (stickInputRef.current.x !== 0 || stickInputRef.current.y !== 0) {
        moveX = stickInputRef.current.x;
        moveZ = stickInputRef.current.y;
      } else {
        if (keysRef.current['keyw'] || keysRef.current['arrowup']) moveZ -= 1;
        if (keysRef.current['keys'] || keysRef.current['arrowdown']) moveZ += 1;
        if (keysRef.current['keya'] || keysRef.current['arrowleft']) moveX -= 1;
        if (keysRef.current['keyd'] || keysRef.current['arrowright']) moveX += 1;
      }

      const inputLen = Math.hypot(moveX, moveZ);
      if (inputLen > 0.05) {
        const normX = (moveX / inputLen);
        const normZ = (moveZ / inputLen);
        const speed = statsRef.current.speed;

        playerPosRef.current.x += normX * speed * delta;
        playerPosRef.current.z += normZ * speed * delta;
        playerPosRef.current.rotY = Math.atan2(normX, normZ);

        // Keep inside arena boundary
        const distFromCenter = Math.hypot(playerPosRef.current.x, playerPosRef.current.z);
        if (distFromCenter > 22) {
          playerPosRef.current.x = (playerPosRef.current.x / distFromCenter) * 22;
          playerPosRef.current.z = (playerPosRef.current.z / distFromCenter) * 22;
        }
      }

      // Jump Physics
      if (playerPosRef.current.isJumping) {
        playerPosRef.current.jumpY += playerPosRef.current.vy * delta;
        playerPosRef.current.vy -= 32 * delta; // Gravity
        if (playerPosRef.current.jumpY <= 0) {
          playerPosRef.current.jumpY = 0;
          playerPosRef.current.isJumping = false;
          playerPosRef.current.vy = 0;
        }
      }

      // Update Player Mesh Position
      if (playerMeshRef.current) {
        playerMeshRef.current.position.set(
          playerPosRef.current.x,
          playerPosRef.current.jumpY,
          playerPosRef.current.z
        );
        playerMeshRef.current.rotation.y = playerPosRef.current.rotY;

        // Weapon Swing Animation
        const weaponGroup = playerMeshRef.current.getObjectByName('weaponGroup');
        if (weaponGroup) {
          if (weaponSwingRef.current.swinging) {
            weaponSwingRef.current.timer -= delta;
            weaponGroup.rotation.x = -Math.sin(weaponSwingRef.current.timer * 12) * 1.5;
            if (weaponSwingRef.current.timer <= 0) {
              weaponSwingRef.current.swinging = false;
              weaponGroup.rotation.x = 0;
            }
          }
        }
      }

      // Smooth Isometric Camera Follow
      const targetCamX = playerPosRef.current.x * 0.4;
      const targetCamZ = playerPosRef.current.z * 0.4 + 20;
      camera.position.x += (targetCamX - camera.position.x) * 4 * delta;
      camera.position.z += (targetCamZ - camera.position.z) * 4 * delta;
      camera.lookAt(playerPosRef.current.x * 0.3, 1.2, playerPosRef.current.z * 0.3);

      // Enemy AI & Movement
      enemiesRef.current.forEach((enemy) => {
        if (enemy.hp <= 0) return;

        // Flash red when hit
        if (enemy.isHit) {
          enemy.hitTimer -= delta;
          if (enemy.hitTimer <= 0) enemy.isHit = false;
        }

        const dx = playerPosRef.current.x - enemy.x;
        const dz = playerPosRef.current.z - enemy.z;
        const dist = Math.hypot(dx, dz);

        if (dist > 1.4) {
          // Move towards player
          enemy.x += (dx / dist) * enemy.speed * delta;
          enemy.z += (dz / dist) * enemy.speed * delta;
        } else {
          // Attack player on cooldown
          enemy.attackCooldown -= delta;
          if (enemy.attackCooldown <= 0) {
            enemy.attackCooldown = 1.2;
            const dmg = calculatePlayerDamageTaken(
              enemy.attack,
              statsRef.current.defense,
              isGuardingRef.current
            );
            triggerHaptic(dmg > 10 ? 40 : 15);
            playSound(isGuardingRef.current ? 'guard' : 'slash');

            statsRef.current.hp -= dmg;
            setStats({ ...statsRef.current });

            if (statsRef.current.hp <= 0) {
              setGameState('gameover');
              playSound('guard');
            }
          }
        }

        if (enemy.meshGroup) {
          enemy.meshGroup.position.set(enemy.x, 0, enemy.z);
          enemy.meshGroup.rotation.y = Math.atan2(dx, dz);
        }
      });

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedStarter]);

  // Touch Virtual Stick handlers
  const handleTouchStickMove = (e: React.TouchEvent | React.MouseEvent, rect: DOMRect) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.min(35, Math.hypot(dx, dy));
    const angle = Math.atan2(dy, dx);
    const nx = (Math.cos(angle) * dist) / 35;
    const ny = (Math.sin(angle) * dist) / 35;
    stickInputRef.current = { x: nx, y: ny };
  };

  return (
    <div className="relative w-full h-[calc(100vh-120px)] min-h-[520px] bg-black select-none overflow-hidden flex flex-col">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Top Game HUD Overlay (HP/MP Bars, Wave, Level, Bits) */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-20 pointer-events-none">
        {/* Player Digimon Status */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2.5 backdrop-blur-md shadow-2xl flex flex-col gap-1.5 min-w-[200px]">
          <div className="flex items-center justify-between">
            <span className="text-white font-black text-xs capitalize tracking-wide flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              {selectedStarter} • Lv. {stats.level}
            </span>
            <span className="text-yellow-400 font-mono text-[11px] font-bold">
              {stats.bits} Bits
            </span>
          </div>

          {/* HP Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-emerald-400 w-5">HP</span>
            <div className="flex-1 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-green-400 transition-all duration-150"
                style={{ width: `${Math.max(0, (stats.hp / stats.maxHp) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-300 w-14 text-right">
              {stats.hp}/{stats.maxHp}
            </span>
          </div>

          {/* MP Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-sky-400 w-5">MP</span>
            <div className="flex-1 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-sky-600 to-cyan-400 transition-all duration-150"
                style={{ width: `${Math.max(0, (stats.mp / stats.maxMp) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-300 w-14 text-right">
              {stats.mp}/{stats.maxMp}
            </span>
          </div>
        </div>

        {/* Wave Banner & Score */}
        <div className="flex flex-col items-end gap-1.5">
          <div className="bg-orange-600/90 text-white font-black px-3 py-1 rounded-xl text-xs shadow-lg border border-orange-400/50 flex items-center gap-1.5">
            <Trophy size={13} />
            Wave {wave}
          </div>
          <div className="bg-slate-900/80 text-slate-300 font-mono text-[11px] px-2.5 py-0.5 rounded-lg border border-slate-700">
            Score: {stats.score}
          </div>
        </div>
      </div>

      {/* Floating Announcements */}
      {waveAnnounce && (
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="bg-black/90 border-2 border-orange-500 text-yellow-300 font-black text-base px-6 py-2.5 rounded-2xl shadow-2xl tracking-wider text-center animate-bounce">
            {waveAnnounce}
          </div>
        </div>
      )}

      {levelUpPopup && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
          <div className="bg-emerald-950/95 border-2 border-emerald-400 text-emerald-200 font-black text-lg px-8 py-3 rounded-2xl shadow-2xl tracking-widest text-center animate-pulse">
            LEVEL UP! (Lv. {levelUpPopup})
            <div className="text-xs text-white mt-1">+HP • +MP • +ATK • +DEF</div>
          </div>
        </div>
      )}

      {/* Guard Barrier Visual */}
      {isGuarding && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div className="w-64 h-64 border-4 border-blue-400/60 rounded-full animate-ping opacity-30" />
        </div>
      )}

      {/* Main Menu Screen (Play Now) */}
      {gameState === 'menu' && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-orange-600/20 border-2 border-orange-500 flex items-center justify-center text-orange-400 mb-3 shadow-xl">
            <Swords size={32} />
          </div>

          <h2 className="text-2xl font-black text-white tracking-wider">DIGIMON WORLD 4</h2>
          <p className="text-xs text-slate-400 max-w-sm mt-1 mb-5">
            Instant 3D Hack &amp; Slash Action RPG in your browser! Zero downloads or setup required to play.
          </p>

          {/* Starter Digimon Selection */}
          <div className="flex gap-2 mb-6">
            {(['dorumon', 'agumon', 'veemon', 'guilmon'] as const).map((id) => (
              <button
                key={id}
                onClick={() => handleSelectStarter(id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition border ${
                  selectedStarter === id
                    ? 'bg-orange-600 text-white border-orange-400 shadow-lg scale-105'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {id}
              </button>
            ))}
          </div>

          {/* Instant Play Button */}
          <button
            onClick={startGame}
            className="w-full max-w-xs py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-sm tracking-wide shadow-2xl shadow-orange-600/40 flex items-center justify-center gap-2 transition hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles size={18} />
            PLAY NOW (INSTANT BROWSER PLAY)
          </button>

          <p className="text-[11px] text-slate-500 mt-4">
            Supports on-screen mobile touch buttons, keyboard (WASD + Space), and controllers!
          </p>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
          <div className="text-red-500 font-black text-3xl mb-2">DIGIMON FAINTED</div>
          <p className="text-slate-300 text-xs mb-4">
            Survived to Wave {wave} • Final Score: {stats.score} • Kills: {stats.kills}
          </p>

          <button
            onClick={startGame}
            className="py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-sm flex items-center gap-2 shadow-xl cursor-pointer"
          >
            <RotateCcw size={16} />
            PLAY AGAIN
          </button>
        </div>
      )}

      {/* Touch Screen On-Screen Gamepad Overlay (Active during gameplay) */}
      {gameState === 'playing' && (
        <div className="absolute inset-0 pointer-events-none z-20 flex justify-between items-end p-4">
          {/* Left Side: Virtual Analog Stick */}
          <div className="pointer-events-auto select-none">
            <div
              className="relative w-28 h-28 rounded-full border-2 border-orange-500/50 bg-black/40 flex items-center justify-center shadow-2xl"
              onTouchStart={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleTouchStickMove(e, rect);
              }}
              onTouchMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                handleTouchStickMove(e, rect);
              }}
              onTouchEnd={() => {
                stickInputRef.current = { x: 0, y: 0 };
              }}
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 border-2 border-amber-300 shadow-md flex items-center justify-center text-[10px] font-black text-black">
                MOVE
              </div>
            </div>
          </div>

          {/* Right Side: Action Diamond Buttons */}
          <div className="pointer-events-auto select-none relative w-40 h-40">
            {/* Y Button: QUICK HEAL (Gold, Top) */}
            <button
              onClick={triggerHeal}
              className="absolute top-0 left-14 w-12 h-12 rounded-full bg-yellow-500/30 border-2 border-yellow-400 flex flex-col items-center justify-center text-yellow-300 active:scale-90 transition shadow-lg backdrop-blur-xs"
              aria-label="Quick Heal Y"
            >
              <Heart size={16} />
              <span className="text-[8px] font-black">HEAL</span>
            </button>

            {/* X Button: DEFEND / GUARD (Blue, Left) */}
            <button
              onTouchStart={() => setIsGuarding(true)}
              onTouchEnd={() => setIsGuarding(false)}
              onMouseDown={() => setIsGuarding(true)}
              onMouseUp={() => setIsGuarding(false)}
              className={`absolute top-14 left-0 w-12 h-12 rounded-full border-2 flex flex-col items-center justify-center active:scale-90 transition shadow-lg backdrop-blur-xs ${
                isGuarding
                  ? 'bg-blue-600 text-white border-blue-300'
                  : 'bg-blue-500/30 text-blue-300 border-blue-400'
              }`}
              aria-label="Guard Shield X"
            >
              <Shield size={16} />
              <span className="text-[8px] font-black">GUARD</span>
            </button>

            {/* B Button: JUMP (Red, Right) */}
            <button
              onClick={triggerJump}
              className="absolute top-14 right-0 w-12 h-12 rounded-full bg-red-500/30 border-2 border-red-400 flex flex-col items-center justify-center text-red-300 active:scale-90 transition shadow-lg backdrop-blur-xs"
              aria-label="Jump B"
            >
              <Zap size={16} />
              <span className="text-[8px] font-black">JUMP</span>
            </button>

            {/* A Button: ATTACK COMBO (Green, Bottom) */}
            <button
              onClick={triggerAttack}
              className="absolute bottom-0 left-14 w-14 h-14 rounded-full bg-green-500/40 border-2 border-green-400 flex flex-col items-center justify-center text-green-300 active:scale-90 transition shadow-xl backdrop-blur-xs"
              aria-label="Attack Weapon A"
            >
              <Swords size={20} />
              <span className="text-[9px] font-black">ATTACK</span>
            </button>

            {/* Spell Trigger (RT) */}
            <button
              onClick={triggerSpell}
              className="absolute -top-10 right-2 px-3 py-1.5 rounded-xl bg-cyan-600/40 border border-cyan-400 text-cyan-200 text-[10px] font-bold flex items-center gap-1 active:scale-90 transition"
              aria-label="Spells RT"
            >
              <Flame size={12} />
              SPELL (RT)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
