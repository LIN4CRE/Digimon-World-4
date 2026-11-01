import * as THREE from 'three';
import { DigimonStarterId } from './types';

export function createDigimonMesh(starterId: DigimonStarterId): THREE.Group {
  const group = new THREE.Group();

  let bodyColor = 0xa855f7; // Dorumon purple
  let accentColor = 0xffffff;
  let weaponType = 'axe';

  if (starterId === 'agumon') {
    bodyColor = 0xf97316; // Orange
    accentColor = 0xfef08a; // Light yellow belly
    weaponType = 'club';
  } else if (starterId === 'veemon') {
    bodyColor = 0x2563eb; // Royal blue
    accentColor = 0xffffff;
    weaponType = 'sword';
  } else if (starterId === 'guilmon') {
    bodyColor = 0xdc2626; // Crimson red
    accentColor = 0x18181b; // Black digital markings
    weaponType = 'spear';
  }

  // 1. Torso / Body (Grounded bottom center)
  const bodyGeo = new THREE.SphereGeometry(0.7, 16, 16);
  bodyGeo.scale(1, 1.2, 0.9);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    roughness: 0.5,
    metalness: 0.1,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.position.y = 1.0;
  bodyMesh.castShadow = true;
  group.add(bodyMesh);

  // 2. Chest / Belly Accent
  const bellyGeo = new THREE.SphereGeometry(0.5, 12, 12);
  bellyGeo.scale(0.8, 0.9, 0.4);
  const bellyMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.7,
  });
  const bellyMesh = new THREE.Mesh(bellyGeo, bellyMat);
  bellyMesh.position.set(0, 0.9, 0.45);
  group.add(bellyMesh);

  // 3. Head & Snout
  const headGeo = new THREE.SphereGeometry(0.55, 16, 16);
  const headMesh = new THREE.Mesh(headGeo, bodyMat);
  headMesh.position.set(0, 1.85, 0.15);
  headMesh.castShadow = true;
  group.add(headMesh);

  const snoutGeo = new THREE.BoxGeometry(0.4, 0.28, 0.4);
  const snoutMesh = new THREE.Mesh(snoutGeo, bodyMat);
  snoutMesh.position.set(0, 1.75, 0.55);
  group.add(snoutMesh);

  // 4. Eyes (Glowing digital pupils)
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0284c7,
    emissiveIntensity: 0.8,
  });
  const eyeGeo = new THREE.SphereGeometry(0.1, 8, 8);
  const eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
  eyeLeft.position.set(-0.22, 1.95, 0.52);
  const eyeRight = new THREE.Mesh(eyeGeo, eyeMat);
  eyeRight.position.set(0.22, 1.95, 0.52);
  group.add(eyeLeft, eyeRight);

  // 5. Ears / Horns (Distinct per starter)
  if (starterId === 'dorumon') {
    // Long furry ears
    const earGeo = new THREE.ConeGeometry(0.18, 0.6, 8);
    const earL = new THREE.Mesh(earGeo, bodyMat);
    earL.position.set(-0.4, 2.25, 0.0);
    earL.rotation.z = 0.5;
    const earR = new THREE.Mesh(earGeo, bodyMat);
    earR.position.set(0.4, 2.25, 0.0);
    earR.rotation.z = -0.5;
    group.add(earL, earR);

    // Red beast gem on forehead
    const gemGeo = new THREE.OctahedronGeometry(0.12);
    const gemMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xdc2626,
      emissiveIntensity: 0.9,
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.set(0, 2.1, 0.52);
    group.add(gem);
  } else if (starterId === 'veemon') {
    // V-shaped courage crest
    const hornGeo = new THREE.ConeGeometry(0.12, 0.4, 8);
    const horn = new THREE.Mesh(hornGeo, bodyMat);
    horn.position.set(0, 2.3, 0.2);
    horn.rotation.x = -0.3;
    group.add(horn);
  }

  // 6. Arms and Legs (Positioned relative to bottom center)
  const limbMat = bodyMat;
  const legGeo = new THREE.CylinderGeometry(0.16, 0.2, 0.6, 8);
  const legL = new THREE.Mesh(legGeo, limbMat);
  legL.position.set(-0.35, 0.3, 0);
  legL.castShadow = true;
  const legR = new THREE.Mesh(legGeo, limbMat);
  legR.position.set(0.35, 0.3, 0);
  legR.castShadow = true;
  group.add(legL, legR);

  // Feet
  const footGeo = new THREE.BoxGeometry(0.26, 0.15, 0.42);
  const footL = new THREE.Mesh(footGeo, limbMat);
  footL.position.set(-0.35, 0.08, 0.1);
  const footR = new THREE.Mesh(footGeo, limbMat);
  footR.position.set(0.35, 0.08, 0.1);
  group.add(footL, footR);

  // 7. Right Hand Weapon Attachment
  const weaponGroup = new THREE.Group();
  weaponGroup.name = 'weaponGroup';
  weaponGroup.position.set(0.65, 1.0, 0.3);

  if (weaponType === 'axe') {
    // Double-headed battle axe
    const shaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
    const shaftMat = new THREE.MeshStandardMaterial({ color: 0x713f12, roughness: 0.8 });
    const shaft = new THREE.Mesh(shaftGeo, shaftMat);
    weaponGroup.add(shaft);

    const bladeGeo = new THREE.BoxGeometry(0.5, 0.35, 0.06);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.85,
      roughness: 0.2,
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(0, 0.45, 0);
    weaponGroup.add(blade);
  } else if (weaponType === 'sword') {
    // Shining Longsword
    const hiltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8);
    const hiltMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.8 });
    const hilt = new THREE.Mesh(hiltGeo, hiltMat);
    weaponGroup.add(hilt);

    const bladeGeo = new THREE.BoxGeometry(0.12, 1.1, 0.04);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.1,
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(0, 0.65, 0);
    weaponGroup.add(blade);
  } else if (weaponType === 'club') {
    // Heavy Spiked Mace
    const handleGeo = new THREE.CylinderGeometry(0.05, 0.08, 1.0, 8);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.5 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    weaponGroup.add(handle);

    const headGeo = new THREE.SphereGeometry(0.24, 8, 8);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      emissive: 0xc2410c,
      emissiveIntensity: 0.5,
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 0.5, 0);
    weaponGroup.add(head);
  } else {
    // Long Polearm / Spear
    const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x57534e, metalness: 0.6 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    weaponGroup.add(pole);

    const tipGeo = new THREE.ConeGeometry(0.12, 0.4, 6);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xef4444, metalness: 0.9 });
    const tip = new THREE.Mesh(tipGeo, tipMat);
    tip.position.set(0, 0.85, 0);
    weaponGroup.add(tip);
  }

  group.add(weaponGroup);

  // Soft contact shadow circle beneath character
  const shadowGeo = new THREE.CircleGeometry(0.7, 16);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.02;
  group.add(shadowMesh);

  return group;
}

export function createEnemyMesh(type: string): THREE.Group {
  const group = new THREE.Group();

  if (type === 'mecharogue') {
    // Boss: Floating mechanical core with laser spikes
    const coreGeo = new THREE.IcosahedronGeometry(1.2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      emissive: 0x9333ea,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.15,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.y = 1.8;
    group.add(core);

    const ringGeo = new THREE.TorusGeometry(1.6, 0.1, 8, 24);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7e22ce,
      emissiveIntensity: 1.0,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    ring.position.y = 1.8;
    group.add(ring);
  } else if (type === 'numemon') {
    // Slime snail
    const bodyGeo = new THREE.SphereGeometry(0.8, 12, 12);
    bodyGeo.scale(1.2, 0.7, 1.4);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.2,
      metalness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.55;
    group.add(body);

    const eyeL = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    eyeL.position.set(-0.3, 1.1, 0.6);
    const eyeR = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    eyeR.position.set(0.3, 1.1, 0.6);
    group.add(eyeL, eyeR);
  } else if (type === 'sukamon') {
    // Coiled creature
    const coilGeo = new THREE.TorusGeometry(0.65, 0.35, 8, 16);
    const coilMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 });
    const coil = new THREE.Mesh(coilGeo, coilMat);
    coil.rotation.x = Math.PI / 2;
    coil.position.y = 0.5;
    group.add(coil);

    const headGeo = new THREE.SphereGeometry(0.5, 12, 12);
    const head = new THREE.Mesh(headGeo, coilMat);
    head.position.y = 1.0;
    group.add(head);
  } else {
    // Goburimon (standard green brawler)
    const bodyGeo = new THREE.BoxGeometry(0.9, 1.1, 0.6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.0;
    group.add(body);

    const headGeo = new THREE.SphereGeometry(0.45, 12, 12);
    const head = new THREE.Mesh(headGeo, bodyMat);
    head.position.set(0, 1.7, 0.1);
    group.add(head);

    const clubGeo = new THREE.CylinderGeometry(0.1, 0.18, 1.1, 8);
    const clubMat = new THREE.MeshStandardMaterial({ color: 0x522e11 });
    const club = new THREE.Mesh(clubGeo, clubMat);
    club.position.set(0.65, 1.0, 0.3);
    group.add(club);
  }

  // Shadow
  const shadowGeo = new THREE.CircleGeometry(0.8, 16);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.4,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  group.add(shadow);

  return group;
}

export function createArenaEnvironment(scene: THREE.Scene) {
  // 1. Digital Central Arena Floor with circular tech markings
  const floorGeo = new THREE.CylinderGeometry(24, 24, 0.4, 32);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x111c38,
    roughness: 0.35,
    metalness: 0.45,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.position.y = -0.2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Digital Cyber Grid Overlay
  const gridHelper = new THREE.GridHelper(36, 18, 0x38bdf8, 0x1e3a5f);
  gridHelper.position.y = 0.01;
  scene.add(gridHelper);

  // Glowing Outer Digital Ring
  const ringGeo = new THREE.RingGeometry(23.0, 24.0, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.03;
  scene.add(ring);

  // Inner Hexagonal Battle Ring
  const innerRingGeo = new THREE.RingGeometry(11.6, 12.2, 6);
  const innerRingMat = new THREE.MeshBasicMaterial({
    color: 0xf97316,
    side: THREE.DoubleSide,
  });
  const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
  innerRing.rotation.x = Math.PI / 2;
  innerRing.position.y = 0.03;
  scene.add(innerRing);

  // 2. Surrounding Tech Pillars with energy rings
  const pillarGeo = new THREE.CylinderGeometry(0.7, 0.9, 7, 8);
  const pillarMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.3,
    metalness: 0.8,
  });

  const conduitMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

  const pillarPositions = [
    [-18, -12],
    [18, -12],
    [-18, 12],
    [18, 12],
    [0, -21],
    [0, 21],
    [-21, 0],
    [21, 0],
  ];

  pillarPositions.forEach(([px, pz]) => {
    const pillar = new THREE.Mesh(pillarGeo, pillarMat);
    pillar.position.set(px, 3.5, pz);
    pillar.castShadow = true;
    scene.add(pillar);

    // Glowing energy band
    const bandGeo = new THREE.TorusGeometry(0.85, 0.08, 8, 16);
    const band = new THREE.Mesh(bandGeo, conduitMat);
    band.rotation.x = Math.PI / 2;
    band.position.set(px, 3.5, pz);
    scene.add(band);
  });
}
