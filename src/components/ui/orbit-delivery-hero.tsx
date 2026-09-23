// @ts-nocheck — generated single-file distribution; typed sources live in the app.
"use client";
// Orbit Delivery — self-contained 3D hero. Configurable hosted GLB models; all application code and styles in one file.
// Dependencies: React, Three.js, @react-three/fiber.
// Drag to rotate. Pause to greet. Supports .dark and data-theme="dark".

"use client";
import { Component, createContext, lazy, Suspense, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AnimationClip, AnimationMixer, Bone, Euler, FrontSide, LoopRepeat, MathUtils, Matrix4, Mesh, MeshStandardMaterial, NumberKeyframeTrack, Quaternion, QuaternionKeyframeTrack, SkinnedMesh, Texture, Vector3, VectorKeyframeTrack } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

// Motion helpers
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const damp = (value, target, lambda, dt) => value + (target - value) * (1 - Math.exp(-lambda * dt));
const smoothstep = (value, min, max) => {
  const t = clamp((value - min) / (max - min), 0, 1);
  return t * t * (3 - 2 * t);
};
const GAIT_DISTANCE = 0.44;

function createMotion() {
  return {
    planetAngle: 0,
    planetVelocity: 0,
    dragTarget: 0,
    characterTarget: 0,
    characterAngle: 0,
    characterVelocity: 0,
    phase: 0,
    activity: 0,
    direction: 1,
    time: 0,
    dragging: false,
    lastInteraction: 0,
    pitchAngle: 0,
    pitchVelocity: 0,
    pitchTarget: 0
  };
}

function stepPlanet(m, dt, auto, reduced, autoRoll = -0.032) {
  m.time += dt;
  if (!auto) {
    m.dragging = false;
    m.planetVelocity = m.pitchVelocity = 0;
    m.dragTarget = m.planetAngle;
    m.pitchTarget = m.pitchAngle;
    return;
  }
  if (m.dragging) {
    const acceleration = 90 * (m.dragTarget - m.planetAngle) - 18 * m.planetVelocity;
    m.planetVelocity += acceleration * dt;
  } else {
    const desired = auto && !reduced && m.time - m.lastInteraction > 3.5 ? autoRoll : 0;
    m.planetVelocity = damp(m.planetVelocity, desired, reduced ? 12 : 5, dt);
  }
  m.planetVelocity = clamp(m.planetVelocity, -1.15, 1.15);
  m.planetAngle += m.planetVelocity * dt;
}

function stepRunner(m, dt, screenTopLocal, reduced) {
  m.characterTarget += Math.atan2(Math.sin(screenTopLocal - m.characterTarget), Math.cos(screenTopLocal - m.characterTarget));
  const error = m.characterTarget - m.characterAngle;
  const stiffness = reduced ? 110 : 48;
  const damping = reduced ? 21 : 11;
  m.characterVelocity += (stiffness * error - damping * m.characterVelocity) * dt;
  m.characterAngle += m.characterVelocity * dt;
  const speed = Math.abs(m.characterVelocity);
  m.activity = damp(m.activity, smoothstep(speed, 4e-3, 0.022), 9, dt);
  if (speed > 0.025) m.direction = Math.sign(m.characterVelocity);
  m.phase += (speed * 2.25) / GAIT_DISTANCE * Math.PI * 2 * dt;
}

function createGlobeMotion() {
  return { delta: new Quaternion(), orientation: new Quaternion().setFromEuler(new Euler(0.1, 0.5, 0)), angular: new Vector3(), route: 0 };
}

function stepGlobeMotion(globe, m, dt, auto, reduced) {
  const roaming = auto && !reduced && !m.dragging && m.time - m.lastInteraction > 3.5;
  if (roaming) globe.route += 0.24 * dt;
  stepPlanet(m, dt, auto, reduced, -0.24 * Math.cos(globe.route));
  if (!auto) {
    globe.angular.set(0, 0, 0);
    return;
  }
  if (m.dragging) m.pitchVelocity += (70 * (m.pitchTarget - m.pitchAngle) - 17 * m.pitchVelocity) * dt;
  else m.pitchVelocity = MathUtils.damp(m.pitchVelocity, roaming ? 0.24 * Math.sin(globe.route) : 0, 6, dt);
  m.pitchVelocity = MathUtils.clamp(m.pitchVelocity, -0.55, 0.55);
  m.pitchAngle += m.pitchVelocity * dt;
  globe.angular.set(m.pitchVelocity, m.planetVelocity * 0.45, -m.planetVelocity);
  const speed = globe.angular.length();
  if (speed > 1e-8) {
    globe.delta.setFromAxisAngle(globe.angular.multiplyScalar(1 / speed), speed * dt);
    globe.orientation.premultiply(globe.delta).normalize();
  }
}

function createSurfaceMotion() {
  return {
    current: new Vector3(0, 1, 0),
    target: new Vector3(0, 1, 0),
    velocity: new Vector3(),
    error: new Vector3(),
    worldNormal: new Vector3(),
    worldVelocity: new Vector3(),
    inverse: new Quaternion(),
    initialized: false
  };
}

function stepSurface(s, m, rotation, screenUp, dt, reduced, paused = false) {
  s.inverse.copy(rotation).invert();
  s.target.copy(screenUp).applyQuaternion(s.inverse).normalize();
  if (!s.initialized) {
    s.current.copy(s.target);
    s.initialized = true;
  }
  if (paused) {
    s.velocity.set(0, 0, 0);
    s.worldVelocity.set(0, 0, 0);
    s.worldNormal.copy(s.current).applyQuaternion(rotation);
    m.characterVelocity = 0;
    m.activity = MathUtils.damp(m.activity, 0, 10, dt);
    return;
  }
  const cosine = MathUtils.clamp(s.current.dot(s.target), -1, 1);
  const angle = Math.acos(cosine);
  s.error.copy(s.target).addScaledVector(s.current, -cosine);
  if (s.error.lengthSq() > 1e-12) s.error.normalize().multiplyScalar(angle);
  const stiffness = reduced ? 110 : 48, damping = reduced ? 21 : 11;
  s.velocity.addScaledVector(s.error, stiffness * dt).multiplyScalar(Math.exp(-damping * dt));
  s.velocity.addScaledVector(s.current, -s.velocity.dot(s.current));
  s.current.addScaledVector(s.velocity, dt).normalize();
  s.velocity.addScaledVector(s.current, -s.velocity.dot(s.current));
  s.worldNormal.copy(s.current).applyQuaternion(rotation);
  s.worldVelocity.copy(s.velocity).applyQuaternion(rotation);
  const speed = s.velocity.length();
  m.characterTarget = Math.atan2(s.target.x, s.target.y);
  m.characterAngle = Math.atan2(s.current.x, s.current.y);
  if (Math.abs(s.worldVelocity.x) > 0.012) m.direction = Math.sign(s.worldVelocity.x);
  m.characterVelocity = speed * m.direction;
  m.activity = MathUtils.damp(m.activity, MathUtils.smoothstep(speed, 4e-3, 0.022), 9, dt);
  m.phase += (speed * 2.25) / GAIT_DISTANCE * Math.PI * 2 * dt;
}

const AssetBaseContext = createContext("");
const surfaceData = "https://cdn.jsdelivr.net/gh/fadeichev2121/planet@b3f70fbf4b577845b1d9d5947c9410fb4d925dae/models/surface.json";

function disposeScene(scene) {
  const textures = new Set();
  const materials = new Set();
  const geometries = new Set();
  const skeletons = new Set();
  scene.traverse((node) => {
    if (!(node instanceof Mesh)) return;
    geometries.add(node.geometry);
    if (node instanceof SkinnedMesh) skeletons.add(node.skeleton);
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
      materials.add(material);
      for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value);
    }
  });
  geometries.forEach((g) => g.dispose());
  skeletons.forEach((s) => s.dispose());
  materials.forEach((m) => m.dispose());
  textures.forEach((t) => {
    t.dispose();
    if (typeof ImageBitmap !== "undefined" && t.image instanceof ImageBitmap) t.image.close();
  });
}

function surfaceRadius(surface2, x, y, z) {
  if (!surface2 || !surface2.radii) return 2.2;
  const u = ((Math.atan2(x, z) / (2 * Math.PI)) % 1 + 1) % 1 * surface2.width;
  const v = Math.acos(Math.max(-1, Math.min(1, y))) / Math.PI * (surface2.height - 1);
  const x0 = Math.floor(u), x1 = (x0 + 1) % surface2.width;
  const y0 = Math.floor(v), y1 = Math.min(y0 + 1, surface2.height - 1);
  const tx = u - x0, ty = v - y0;
  const a = surface2.radii[y0 * surface2.width + x0] * (1 - tx) + surface2.radii[y0 * surface2.width + x1] * tx;
  const b = surface2.radii[y1 * surface2.width + x0] * (1 - tx) + surface2.radii[y1 * surface2.width + x1] * tx;
  return a * (1 - ty) + b * ty;
}

function usePlanetAsset(onReady) {
  const base = useContext(AssetBaseContext);
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abort = new AbortController();
    const draco = new DRACOLoader().setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/").setDecoderConfig({ type: "wasm" }).setWorkerLimit(2);
    const loader = new GLTFLoader().setDRACOLoader(draco);
    let disposed = false;
    let scene;

    const fetchChecked = async (path) => {
      const response = await fetch(path, { signal: abort.signal });
      if (!response.ok) throw new Error(`Planet asset could not load (${response.status})`);
      return response;
    };

    onReady?.(false);
    Promise.all([
      fetchChecked(`${base}models/whimsical-world.glb`).then((r) => r.arrayBuffer()),
      fetch(surfaceData, { signal: abort.signal }).then((r) => r.json()).catch(() => ({ width: 128, height: 65, radii: new Array(128 * 65).fill(0.9355) }))
    ]).then(async ([buffer, surface2]) => {
      if (disposed) return;
      const gltf = await loader.parseAsync(buffer, `${base}models/`);
      scene = gltf.scene;
      if (disposed) {
        disposeScene(scene);
        return;
      }
      scene.traverse((node) => {
        node.updateMatrix();
        node.matrixAutoUpdate = false;
        if (!(node instanceof Mesh)) return;
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        for (const mat of materials) if (mat instanceof MeshStandardMaterial) {
          mat.side = FrontSide;
          mat.metalness = 0;
          mat.roughness = 0.86;
          mat.normalScale.setScalar(0.65);
          if (mat.map) mat.map.anisotropy = 4;
        }
      });
      setAsset({ scene, surface: surface2 });
      onReady?.(true);
    }).catch((reason) => {
      if (!disposed) setError(reason instanceof Error ? reason : new Error(String(reason)));
    }).finally(() => {
      if (!disposed) draco.dispose();
    });

    return () => {
      disposed = true;
      abort.abort();
      draco.dispose();
      if (scene) disposeScene(scene);
    };
  }, [onReady, base]);

  if (error) throw error;
  return asset;
}

function makeSeamlessRun(source) {
  const reference = source.tracks.reduce((best, track) => track.times.length > best.times.length ? track : best);
  const start = reference.times[0];
  const last = reference.times[reference.times.length - 1];
  const intervals = Array.from(reference.times).slice(1).map((time, i) => time - reference.times[i]).sort((a, b) => a - b);
  const step = intervals.length ? intervals[Math.floor(intervals.length / 2)] : 1 / 24;
  const period = Math.max(step, last - start + step);
  const frames = Math.max(40, Math.ceil(period * 120));
  const quaternion = new Quaternion();
  const tracks = source.tracks.map((track) => {
    const count = track.times.length, size = track.getValueSize();
    const knots = Array.from(track.times, (time) => time - start);
    const samples = Array.from(track.values);
    const isRotation = track.name.endsWith(".quaternion");
    const isMorph = track.name.endsWith(".morphTargetInfluences");
    if (isRotation) for (let i = 1; i < count; i++) {
      let dot = 0;
      for (let c = 0; c < 4; c++) dot += samples[(i - 1) * 4 + c] * samples[i * 4 + c];
      if (dot < 0) for (let c = 0; c < 4; c++) samples[i * 4 + c] *= -1;
    }
    const times = [], values = [];
    for (let frame = 0; frame <= frames; frame++) {
      const time = frame === frames ? 0 : (frame / frames) * period;
      times.push((frame / frames) * period);
      let index = 0;
      while (index < count - 1 && knots[index + 1] <= time) index++;
      const previous = (index - 1 + count) % count, next = (index + 1) % count, after = (index + 2) % count;
      const t1 = knots[index], t2 = next === 0 ? period + knots[0] : knots[next];
      const t0 = previous > index ? knots[previous] - period : knots[previous];
      const t3 = after <= next ? knots[after] + period : knots[after];
      const afterTime = t3 <= t2 ? t3 + period : t3;
      const length = Math.max(t2 - t1, 1e-6), u = Math.max(0, Math.min(1, (time - t1) / length));
      for (let c = 0; c < size; c++) {
        const p0 = samples[previous * size + c], p1 = samples[index * size + c], p2 = samples[next * size + c], p3 = samples[after * size + c];
        const a = count < 3 ? 0 : (p2 - p0) / Math.max(t2 - t0, 1e-6) * length;
        const b = count < 3 ? 0 : (p3 - p1) / Math.max(afterTime - t1, 1e-6) * length;
        values.push(count === 1 ? p1 : isMorph ? p1 + (p2 - p1) * u : (2 * u ** 3 - 3 * u ** 2 + 1) * p1 + (u ** 3 - 2 * u ** 2 + u) * a + (-2 * u ** 3 + 3 * u ** 2) * p2 + (u ** 3 - u ** 2) * b);
      }
      if (isRotation) {
        quaternion.fromArray(values, values.length - 4).normalize();
        quaternion.toArray(values, values.length - 4);
      }
    }
    const result = track.clone();
    result.times = new Float32Array(times);
    result.values = new Float32Array(values);
    return result;
  });
  return new AnimationClip("Courier_Run_Seamless", period, tracks);
}

class BagSuspension {
  constructor(scene) {
    this.scene = scene;
    const bone = scene.getObjectByName("CourierBag");
    if (!(bone instanceof Bone)) throw new Error("Courier bag attachment is missing.");
    this.bone = bone;
    scene.updateWorldMatrix(true, true);
    scene.getWorldQuaternion(this.sceneOrientation);
    bone.getWorldQuaternion(this.restOrientation);
    this.restOrientation.premultiply(this.sceneOrientation.invert());
    this.inverseRest.copy(this.restOrientation).invert();
  }
  bone;
  restOrientation = new Quaternion();
  animatedOrientation = new Quaternion();
  animatedPosition = new Vector3();
  localAnchor = new Vector3();
  gravityTilt = new Quaternion();
  pelvisYaw = new Quaternion();
  inverseRest = new Quaternion();
  xAxis = new Vector3(1, 0, 0);
  hangingOrientation = new Quaternion();
  sceneOrientation = new Quaternion();
  parentOrientation = new Quaternion();
  swing = new Quaternion();
  angles = new Euler();
  inverseScene = new Matrix4();
  anchor = new Vector3();
  previousAnchor = new Vector3();
  velocity = new Vector3();
  previousVelocity = new Vector3();
  acceleration = new Vector3();
  initialized = false;
  applied = false;
  pitch = 0;
  roll = 8e-3;
  pitchVelocity = 0;
  rollVelocity = 0;

  restore() {
    if (!this.applied) return;
    this.bone.position.copy(this.animatedPosition);
    this.bone.quaternion.copy(this.animatedOrientation);
    this.applied = false;
  }

  update(dt, activity, _phase, turnRate, reduced, bodyLean = 0) {
    if (dt <= 0 || !this.bone.parent) return;
    this.animatedPosition.copy(this.bone.position);
    this.animatedOrientation.copy(this.bone.quaternion);
    this.inverseScene.copy(this.scene.matrixWorld).invert();
    this.bone.getWorldPosition(this.anchor).applyMatrix4(this.inverseScene);
    if (!this.initialized) {
      this.previousAnchor.copy(this.anchor);
      this.initialized = true;
    }
    this.velocity.copy(this.anchor).sub(this.previousAnchor).divideScalar(dt);
    this.acceleration.copy(this.velocity).sub(this.previousVelocity).divideScalar(dt);
    this.previousVelocity.lerp(this.velocity, 1 - Math.exp(-14 * dt));
    this.previousAnchor.copy(this.anchor);
    const gravity = Math.max(4, 9.81 + this.acceleration.y);
    const targetPitch = reduced ? 0 : MathUtils.clamp(Math.atan2(this.acceleration.z, gravity), -0.1, 0.1);
    const targetRoll = reduced ? 0 : MathUtils.clamp(Math.atan2(-this.acceleration.x, gravity) + Math.abs(turnRate) * 1e-3, -0.012, 0.045);
    const steps = Math.ceil(dt / (1 / 120)), h = dt / steps;
    for (let i = 0; i < steps; i++) {
      this.pitchVelocity += ((targetPitch - this.pitch) * 72 - this.pitchVelocity * 11) * h;
      this.rollVelocity += ((targetRoll - this.roll) * 64 - this.rollVelocity * 10) * h;
      this.pitch = MathUtils.clamp(this.pitch + this.pitchVelocity * h, -0.12, 0.12);
      this.roll = MathUtils.clamp(this.roll + this.rollVelocity * h, -0.012, 0.05);
    }
    this.scene.getWorldQuaternion(this.sceneOrientation);
    this.bone.getWorldQuaternion(this.pelvisYaw).premultiply(this.parentOrientation.copy(this.sceneOrientation).invert()).multiply(this.inverseRest);
    this.pelvisYaw.set(0, this.pelvisYaw.y, 0, this.pelvisYaw.w).normalize();
    this.bone.parent.getWorldQuaternion(this.parentOrientation).invert();
    this.swing.setFromEuler(this.angles.set(this.pitch, 0, this.roll));
    this.gravityTilt.setFromAxisAngle(this.xAxis, -bodyLean);
    this.hangingOrientation.copy(this.parentOrientation).multiply(this.sceneOrientation).multiply(this.gravityTilt).multiply(this.pelvisYaw).multiply(this.swing).multiply(this.restOrientation);
    this.bone.quaternion.copy(this.animatedOrientation).slerp(this.hangingOrientation, 1 - activity * 0.3);
    this.localAnchor.copy(this.anchor).addScaledVector(this.xAxis, -9e-3 * (1 - activity * 0.5));
    this.localAnchor.y -= 0.027;
    this.localAnchor.applyMatrix4(this.scene.matrixWorld);
    this.bone.parent.worldToLocal(this.localAnchor);
    this.bone.position.copy(this.localAnchor);
    this.bone.updateWorldMatrix(false, true);
    this.applied = true;
  }
}

class CourierGreeting {
  constructor(scene) {
    this.scene = scene;
    scene.updateWorldMatrix(true, true);
    const inverseScene = scene.getWorldQuaternion(new Quaternion()).invert();
    const up = new Vector3(0, 1, 0);
    this.joints = ["RightArm", "RightForeArm", "RightHand"].map((name) => {
      const bone = scene.getObjectByName(name);
      if (!(bone instanceof Bone)) throw new Error(`Greeting joint ${name} is missing.`);
      const rest = bone.getWorldQuaternion(new Quaternion()).premultiply(inverseScene);
      const direction = up.clone().applyQuaternion(rest).normalize();
      const palm = new Vector3(1, 0, 0).addScaledVector(direction, -direction.x).normalize();
      return { bone, rest, direction, palm, animated: bone.quaternion.clone() };
    });
    this.restBendNormal.crossVectors(this.joints[0].direction, this.joints[1].direction).normalize();
  }
  joints;
  sceneRotation = new Quaternion();
  inverseParent = new Quaternion();
  aim = new Quaternion();
  twist = new Quaternion();
  target = new Quaternion();
  direction = new Vector3();
  palm = new Vector3();
  wantedPalm = new Vector3();
  cross = new Vector3();
  restBendNormal = new Vector3();
  bendNormal = new Vector3();
  upperDirection = new Vector3(-0.55, -0.65, 0.52).normalize();
  forearmDirection = new Vector3();
  phase = 0;
  applied = false;
  weight = 0;

  restore() {
    if (!this.applied) return;
    for (const joint of this.joints) joint.bone.quaternion.copy(joint.animated);
    this.applied = false;
  }

  step(dt, ready, reduced) {
    this.weight = MathUtils.damp(this.weight, ready ? 1 : 0, ready ? 4 : 9, dt);
    if (this.weight < 1e-4) {
      this.weight = 0;
      this.phase = 0;
    }
    if (ready && this.weight > 0.85 && !reduced) this.phase += dt * Math.PI * 2 * 0.9;
  }

  apply(reduced) {
    if (this.weight === 0) return;
    this.scene.getWorldQuaternion(this.sceneRotation);
    const wave = Math.sin(this.phase) * (reduced ? 0 : 0.12) * MathUtils.smoothstep(this.weight, 0.85, 0.99);
    this.forearmDirection.set(-0.08 + wave * 0.35, 0.94, 0.33).normalize();
    this.bendNormal.crossVectors(this.upperDirection, this.forearmDirection).normalize();
    this.joints.forEach((joint, index) => {
      joint.animated.copy(joint.bone.quaternion);
      if (index === 0) this.direction.copy(this.upperDirection);
      else if (index === 1) this.direction.copy(this.forearmDirection);
      else this.direction.set(-0.06 + wave, 0.97, 0.22);
      this.direction.normalize();
      this.aim.setFromUnitVectors(joint.direction, this.direction);
      this.target.copy(this.aim).multiply(joint.rest);
      this.palm.copy(this.restBendNormal).addScaledVector(joint.direction, -this.restBendNormal.dot(joint.direction)).normalize().applyQuaternion(this.aim);
      this.wantedPalm.copy(this.bendNormal).addScaledVector(this.direction, -this.bendNormal.dot(this.direction)).normalize();
      const angle = Math.atan2(this.direction.dot(this.cross.crossVectors(this.palm, this.wantedPalm)), this.palm.dot(this.wantedPalm));
      this.twist.setFromAxisAngle(this.direction, angle);
      this.target.premultiply(this.twist);
      joint.bone.parent.getWorldQuaternion(this.inverseParent).invert();
      this.target.premultiply(this.sceneRotation).premultiply(this.inverseParent);
      joint.bone.quaternion.slerp(this.target, this.weight);
      joint.bone.updateWorldMatrix(false, true);
    });
    this.applied = true;
  }
}

function optimizeRigidBag(scene) {
  scene.updateWorldMatrix(true, true);
  const candidates = [];
  scene.traverse((node) => {
    if (node instanceof SkinnedMesh && node.name.startsWith("Delivery_Bag")) candidates.push(node);
  });
  for (const mesh of candidates) {
    if (Object.keys(mesh.geometry.morphAttributes || {}).length) continue;
    const weights = mesh.geometry.getAttribute("skinWeight");
    const indices = mesh.geometry.getAttribute("skinIndex");
    if (!weights || !indices) continue;
    let joint = -1, rigid = true;
    for (let vertex = 0; vertex < weights.count && rigid; vertex++) {
      let total = 0;
      for (let channel = 0; channel < 4; channel++) {
        const weight = weights.getComponent(vertex, channel);
        if (weight < 1e-6) continue;
        const index = indices.getComponent(vertex, channel);
        if (joint < 0) joint = index;
        if (index !== joint) {
          rigid = false;
          break;
        }
        total += weight;
      }
      if (Math.abs(total - 1) > 1e-4) rigid = false;
    }
    if (!rigid || joint < 0) continue;
    const bone = mesh.skeleton.bones[joint];
    const bind = new Matrix4().multiplyMatrices(mesh.skeleton.boneInverses[joint], mesh.bindMatrix);
    const geometry = mesh.geometry.clone().applyMatrix4(bind);
    geometry.deleteAttribute("skinIndex");
    geometry.deleteAttribute("skinWeight");
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    const bag = new Mesh(geometry, mesh.material);
    bag.name = mesh.name;
    bag.castShadow = mesh.castShadow;
    bag.receiveShadow = mesh.receiveShadow;
    bag.renderOrder = mesh.renderOrder;
    bag.matrixAutoUpdate = false;
    mesh.removeFromParent();
    bone.add(bag);
    let shared = false;
    scene.traverse((node) => {
      if (node instanceof Mesh && node.geometry === mesh.geometry) shared = true;
    });
    if (!shared) mesh.geometry.dispose();
  }
}

function makeIdle(scene) {
  const tracks = [];
  const breath = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), 9e-3);
  scene.traverse((node) => {
    if (node instanceof Mesh && node.morphTargetInfluences?.length) {
      const zeros = new Array(node.morphTargetInfluences.length).fill(0);
      tracks.push(new NumberKeyframeTrack(`${node.name}.morphTargetInfluences`, [0, 3], [...zeros, ...zeros]));
    }
    if (!(node instanceof Bone)) return;
    const q = node.quaternion.clone(), middle = q.clone();
    if (node.name === "Spine02" || node.name === "neck") middle.multiply(breath);
    tracks.push(new QuaternionKeyframeTrack(`${node.name}.quaternion`, [0, 1.5, 3], [...q.toArray(), ...middle.toArray(), ...q.toArray()]));
    const p = node.position.clone(), inhale = p.clone();
    if (node.name === "Hips") inhale.y += 4e-3;
    tracks.push(new VectorKeyframeTrack(`${node.name}.position`, [0, 1.5, 3], [...p.toArray(), ...inhale.toArray(), ...p.toArray()]));
    tracks.push(new VectorKeyframeTrack(`${node.name}.scale`, [0, 3], [...node.scale.toArray(), ...node.scale.toArray()]));
  });
  return new AnimationClip("Courier_Idle", 3, tracks);
}

const MODEL_SCALE = 0.76 / 1.7;

function Courier({ motion, paused, reduced, onReady }) {
  const base = useContext(AssetBaseContext);
  const facing = useRef(null), lean = useRef(null);
  const greetingTurn = useRef(false);
  const turnVelocity = useRef(0);
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abort = new AbortController();
    const draco = new DRACOLoader().setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/").setDecoderConfig({ type: "wasm" }).setWorkerLimit(1);
    const loader = new GLTFLoader().setDRACOLoader(draco);
    let cancelled = false;
    let owned;
    onReady?.(false);
    const modelFile = "courier.glb";

    fetch(`${base}models/${modelFile}`, { signal: abort.signal }).then(async (response) => {
      if (!response.ok) throw new Error(`Courier could not load (${response.status})`);
      const data = await response.arrayBuffer();
      if (cancelled) return;
      const gltf = await loader.parseAsync(data, `${base}models/`);
      if (cancelled) {
        disposeScene(gltf.scene);
        return;
      }
      optimizeRigidBag(gltf.scene);
      gltf.scene.traverse((node) => {
        if (!(node instanceof Mesh)) return;
        node.morphTargetInfluences?.fill(0);
        if (node instanceof SkinnedMesh) node.frustumCulled = false;
        for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
          if (material instanceof MeshStandardMaterial) {
            material.metalness = 0;
            material.roughness = 0.9;
            material.roughnessMap = null;
            material.normalScale.setScalar(0.25);
            if (material.map) material.map.anisotropy = 8;
          }
        }
      });
      const clips = gltf.animations.filter((animation) => animation.duration > 0.3);
      if (!clips.length) {
        disposeScene(gltf.scene);
        throw new Error("The courier run animation is missing.");
      }
      const clip = new AnimationClip("Courier_Run_Source", -1, clips.flatMap((animation) => animation.tracks));
      const mixer = new AnimationMixer(gltf.scene);
      const bag = new BagSuspension(gltf.scene);
      const greeting = new CourierGreeting(gltf.scene);
      const idle = mixer.clipAction(makeIdle(gltf.scene)).play();
      const seamless = makeSeamlessRun(clip);
      const run = mixer.clipAction(seamless).setLoop(LoopRepeat, Infinity).play();
      run.zeroSlopeAtStart = false;
      run.zeroSlopeAtEnd = false;
      run.setEffectiveTimeScale(0);
      run.setEffectiveWeight(0);
      mixer.update(0);
      owned = { scene: gltf.scene, mixer, idle, run, duration: seamless.duration, bag, greeting };
      setAsset(owned);
      onReady?.(true);
    }).catch((reason) => {
      if (!cancelled) setError(reason instanceof Error ? reason : new Error(String(reason)));
    }).finally(() => {
      if (!cancelled) draco.dispose();
    });

    return () => {
      cancelled = true;
      abort.abort();
      draco.dispose();
      if (owned) {
        owned.mixer.stopAllAction();
        owned.mixer.uncacheRoot(owned.scene);
        disposeScene(owned.scene);
      }
    };
  }, [onReady, base]);

  useFrame((_, delta) => {
    if (!asset) return;
    const dt = Math.min(delta, 0.05), m = motion.current;
    if (!paused) greetingTurn.current = false;
    else if (m.activity < 0.06) greetingTurn.current = true;
    const desired = paused ? greetingTurn.current ? m.cameraHeading ?? 0 : facing.current.rotation.y : (m.heading ?? 0) + Math.PI / 2;
    const turn = Math.atan2(Math.sin(desired - facing.current.rotation.y), Math.cos(desired - facing.current.rotation.y));
    if (paused) {
      const acceleration = MathUtils.clamp(18 * turn - 8.5 * turnVelocity.current, -5.5, 5.5);
      turnVelocity.current = MathUtils.clamp(turnVelocity.current + acceleration * dt, -2.2, 2.2);
      if (Math.abs(turn) < 3e-3 && Math.abs(turnVelocity.current) < 0.025) turnVelocity.current = 0;
      facing.current.rotation.y += turnVelocity.current * dt;
    } else {
      const rotation = turn * (1 - Math.exp(-12 * dt));
      facing.current.rotation.y += rotation;
      turnVelocity.current = rotation / dt;
    }
    const turning = paused && greetingTurn.current && !reduced ? MathUtils.smoothstep(Math.abs(turnVelocity.current), 0.08, 1.2) : 0;
    asset.greeting.step(dt, paused && greetingTurn.current && Math.abs(turn) < 0.055 && Math.abs(turnVelocity.current) < 0.13, reduced);
    lean.current.rotation.x = MathUtils.damp(lean.current.rotation.x, Math.min(Math.abs(m.characterVelocity) * 0.065, 0.09) * (reduced ? 0.35 : 1), 9, dt);
    const activity = Math.max(m.activity, turning * 0.3) * (1 - asset.greeting.weight);
    asset.run.setEffectiveWeight(activity);
    asset.idle.setEffectiveWeight(1 - activity);
    asset.idle.paused = reduced;
    const playback = Math.max(Math.abs(m.characterVelocity) * 2.25 / GAIT_DISTANCE * asset.duration, turning * 0.72);
    asset.run.setEffectiveTimeScale(MathUtils.damp(asset.run.timeScale, playback, 10, dt));
    asset.greeting.restore();
    asset.bag.restore();
    asset.mixer.update(dt);
    asset.scene.updateWorldMatrix(true, true);
    asset.greeting.apply(reduced);
    asset.bag.update(dt, activity, m.phase, turnVelocity.current, reduced, lean.current.rotation.x);
  });

  if (error) throw error;
  return <group ref={facing} rotation={[0, Math.PI / 2, 0]}><group ref={lean}><group scale={MODEL_SCALE}>{asset && <primitive object={asset.scene} dispose={null} />}</group></group></group>;
}

const upVector = new Vector3(0, 1, 0);

function ResponsiveCamera() {
  const { size, camera } = useThree();
  useEffect(() => {
    const ortho = camera;
    ortho.zoom = size.width / (size.width < 700 ? 5.65 : 5.25);
    ortho.updateProjectionMatrix();
  }, [size.width, size.height, camera]);
  return null;
}

function World2({ motion, auto, reduced, onReady }) {
  const planet = useRef(null), runner = useRef(null);
  const asset = usePlanetAsset();
  const [courierReady, setCourierReady] = useState(false);

  useEffect(() => {
    onReady?.(!!asset && courierReady);
  }, [asset, courierReady, onReady]);

  const radius = useRef(2.2);
  const surface2 = useRef(createSurfaceMotion());
  const globe = useMemo(createGlobeMotion, []);
  const frame = useMemo(() => ({ screenUp: new Vector3(), localVelocity: new Vector3(), cameraFront: new Vector3(), inverseRunner: new Quaternion() }), []);
  const size = useThree((state) => state.size);
  const small = size.width < 700;
  const zoom = size.width / (small ? 5.65 : 5.25);
  const centerY = size.height / zoom * (small ? 0.08 : 0.19) - 2.17;

  useFrame(({ camera }, delta) => {
    if (!asset || !courierReady) return;
    const m = motion.current;
    const elapsed = Math.min(delta, 0.05), count = Math.ceil(elapsed / (1 / 120));
    frame.screenUp.copy(upVector).applyQuaternion(camera.quaternion);
    for (let i = 0; i < count; i++) {
      const dt = elapsed / count;
      stepGlobeMotion(globe, m, dt, auto, reduced);
      stepSurface(surface2.current, m, globe.orientation, frame.screenUp, dt, reduced, !auto);
    }
    planet.current.quaternion.copy(globe.orientation);
    const s = surface2.current;
    const r = surfaceRadius(asset.surface, s.current.x, s.current.y, s.current.z) * 2.25;
    radius.current = MathUtils.damp(radius.current, r + 8e-3, 25, elapsed);
    runner.current.position.copy(s.worldNormal).multiplyScalar(radius.current);
    runner.current.quaternion.setFromUnitVectors(upVector, s.worldNormal);
    frame.inverseRunner.copy(runner.current.quaternion).invert();
    frame.cameraFront.set(0, 0, 1).applyQuaternion(camera.quaternion).applyQuaternion(frame.inverseRunner);
    m.cameraHeading = Math.atan2(frame.cameraFront.x, frame.cameraFront.z);
    if (s.velocity.lengthSq() > 1e-4) {
      frame.localVelocity.copy(s.worldVelocity).applyQuaternion(frame.inverseRunner);
      m.heading = Math.atan2(-frame.localVelocity.z, frame.localVelocity.x);
    }
  }, -1);

  return <group position={[0, centerY, 0]}>
    <group ref={planet} scale={2.25}>{asset && <primitive object={asset.scene} dispose={null} />}</group>
    <group ref={runner} visible={!!asset && courierReady}><Courier motion={motion} paused={!auto} reduced={reduced} onReady={setCourierReady} /></group>
  </group>;
}

function PlanetScene({ motion, active, auto, reduced, onReady }) {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 9], zoom: 150, near: 0.1, far: 30 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true }}
    >
      <ResponsiveCamera />
      <ambientLight intensity={1.4} />
      <hemisphereLight args={["#67e8f9", "#070d1e", 2.2]} />
      <directionalLight position={[-3, 5, 5]} intensity={3.6} color="#ffffff" />
      <directionalLight position={[3, 2, -2]} intensity={2.4} color="#38bdf8" />
      <World2 motion={motion} auto={auto} reduced={reduced} onReady={onReady} />
    </Canvas>
  );
}

function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error, _info) {
    console.error("3D scene failed:", error);
  }
  render() {
    return this.state.failed ? <div className="scene-fallback"><p>We couldn’t load this little world.</p><button onClick={() => location.reload()}>Try again</button></div> : this.props.children;
  }
}

const stories = {
  "Como Funciona": { title: "Do seu briefing ao site no ar.", paragraphs: ["Cada site incrível começa com o que o seu negócio tem de melhor. Preencha o Briefing Mestre, gere os prompts e veja a mágica acontecer.", "Nosso método guiado dá vida a páginas modernas e que convertem de verdade."] },
  "Para Negócios": { title: "Seu negócio encontrado no Google.", paragraphs: ["Mais de 50% das pequenas empresas ainda não têm site. Ter um site próprio conecta você diretamente a quem pesquisa pelos seus serviços.", "Seu Site Único coloca a sua marca em destaque sem depender apenas de redes sociais."] },
  "Renda Extra": { title: "Crie sites para negócios locais.", paragraphs: ["Aprenda o método e ofereça criação de sites para empresas da sua cidade.", "Sites simples e rápidos cobrando de R$ 200 a R$ 800 por projeto."] }
};

function App() {
  const motion = useRef(createMotion());
  const interaction = useRef(null);
  const drag = useRef(null);
  const [visible, setVisible] = useState(true), [tabVisible, setTabVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [sceneMounted, setSceneMounted] = useState(false);
  const [auto, setAuto] = useState(true), [dragging, setDragging] = useState(false), [ready, setReady] = useState(false);
  const [story, setStory] = useState(null);

  useEffect(() => {
    setTabVisible(!document.hidden);
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    change();
    query.addEventListener("change", change);
    const onVisibility = () => {
      setTabVisible(!document.hidden);
      if (document.hidden) {
        motion.current.dragging = false;
        drag.current = null;
        setDragging(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.01 });
    if (interaction.current) observer.observe(interaction.current);
    return () => {
      query.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    let frame = 0, timeout = 0;
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        timeout = window.setTimeout(() => setSceneMounted(true), 100);
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, []);

  const release = (id) => {
    if (drag.current?.id !== id) return;
    drag.current = null;
    motion.current.dragging = false;
    motion.current.lastInteraction = motion.current.time;
    setDragging(false);
  };

  const toggleMotion = () => {
    const next = !auto;
    setAuto(next);
    const m = motion.current;
    m.dragging = false;
    if (drag.current && interaction.current?.hasPointerCapture(drag.current.id)) interaction.current.releasePointerCapture(drag.current.id);
    drag.current = null;
    setDragging(false);
    m.planetVelocity = m.pitchVelocity = 0;
    m.dragTarget = m.planetAngle;
    m.pitchTarget = m.pitchAngle;
    if (next) m.lastInteraction = m.time - 4;
  };

  const nudge = (direction) => {
    if (!auto) return;
    motion.current.planetVelocity += direction * 0.65;
    motion.current.lastInteraction = motion.current.time;
  };

  const explore = () => {
    interaction.current?.focus({ preventScroll: true });
    if (window.innerWidth < 760) interaction.current?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "center" });
    if (!reduced) nudge(1);
  };

  return (
    <div className="page">
      <header className="site-header">
        <a href="./" className="wordmark" aria-label="Seu Site Único home">
          <svg viewBox="0 0 38 38" aria-hidden="true">
            <defs>
              <radialGradient id="logo-light" cx="30%" cy="20%">
                <stop stopColor="#7d9efa" />
                <stop offset="1" stopColor="#4674e9" />
              </radialGradient>
            </defs>
            <circle cx="23" cy="15" r="14" fill="url(#logo-light)" />
            <circle cx="10" cy="27" r="8" fill="#6389f0" />
            <circle cx="15" cy="8" r="3.5" fill="#b2c7ff" opacity=".45" />
          </svg>
          <span className="brand-type">seu site<small>único</small></span>
        </a>
        <nav aria-label="Navegação principal">
          <button onClick={explore}>Método</button>
          {["Como Funciona", "Para Negócios", "Renda Extra"].map((item) => (
            <button key={item} onClick={() => setStory(item)}>{item}</button>
          ))}
        </nav>
        <button className="header-cta" onClick={explore}>Começar Agora</button>
      </header>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">Método Guiado com IA</p>
            <h1 id="hero-title">Crie o site do seu negócio.<br />Coloque no ar.<br /><em>Apareça no Google.</em></h1>
            <p className="hero-description">Um manual prático com prompts prontos para criar o site da sua marca com IA — único, rápido e sem código.</p>
            <button className="explore-button" onClick={explore}>Quero Meu Site Único <Arrow /></button>
          </div>
          <div className="visual-column">
            <div
              ref={interaction}
              id="planet"
              className={`planet-stage ${dragging ? "dragging" : ""}`}
              tabIndex={0}
              role="group"
              aria-roledescription="interactive 3D planet"
              aria-label="Gire o planeta 3D"
              onPointerDown={(event) => {
                if (!auto || !event.isPrimary || event.button !== 0) return;
                event.currentTarget.setPointerCapture(event.pointerId);
                drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
                const m = motion.current;
                m.dragTarget = m.planetAngle;
                m.pitchTarget = m.pitchAngle;
                m.dragging = true;
                m.lastInteraction = m.time;
                setDragging(true);
              }}
              onPointerMove={(event) => {
                if (!auto || drag.current?.id !== event.pointerId) return;
                const dx = event.clientX - drag.current.x, dy = event.clientY - drag.current.y;
                const sensitivity = 5 / Math.max(360, event.currentTarget.clientWidth);
                const m = motion.current;
                m.dragTarget = Math.max(m.planetAngle - 0.5, Math.min(m.planetAngle + 0.5, m.dragTarget + dx * sensitivity));
                m.pitchTarget = Math.max(m.pitchAngle - 0.4, Math.min(m.pitchAngle + 0.4, m.pitchTarget + dy * sensitivity * 0.7));
                drag.current.x = event.clientX;
                drag.current.y = event.clientY;
                m.lastInteraction = m.time;
              }}
              onPointerUp={(event) => release(event.pointerId)}
              onPointerCancel={(event) => release(event.pointerId)}
              onLostPointerCapture={(event) => release(event.pointerId)}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  nudge(event.key === "ArrowRight" ? 1 : -1);
                }
                if (event.key === " ") {
                  event.preventDefault();
                  if (!event.repeat) toggleMotion();
                }
              }}
            >
              {sceneMounted && (
                <SceneBoundary>
                  <Suspense fallback={null}>
                    <PlanetScene motion={motion} active={visible && tabVisible && !story} auto={auto} reduced={reduced} onReady={setReady} />
                  </Suspense>
                </SceneBoundary>
              )}
              {!ready && <div className="loading" role="status"><span />Carregando o universo 3D…</div>}
            </div>
          </div>
          <div className={`planet-caption ${dragging ? "is-dragging" : ""}`} aria-hidden="true">
            <p>{!auto ? "Clique Iniciar" : dragging ? "Seu negócio." : "Arraste para girar"}<br />{!auto ? "para continuar" : dragging ? "No mapa." : "o mundo"}</p>
            <svg viewBox="0 0 180 165" fill="none"><path d="M161 148C137 82 103 39 28 14m0 0 6 16m-6-16 19-2" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="cloud-bank" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        </section>
      </main>
      <footer className="site-footer">
        <p className="footer-left">Sem código<br />100% Personalizado</p>
        <button className="motion-button" onClick={toggleMotion} aria-pressed={!auto} aria-label={auto ? "Pausar e saudar" : "Iniciar rotação"}>
          {auto ? (
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5v10m6-10v10" stroke="currentColor" strokeWidth="1.5" /></svg>
          ) : (
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m7 4 8 6-8 6Z" fill="currentColor" /></svg>
          )}
          <span>{auto ? "Pausar" : "Girar"}</span>
        </button>
        <p className="footer-right">Seu negócio<br />visível<br />no Google</p>
      </footer>
      {story && <StoryDialog story={story} onClose={() => setStory(null)} />}
    </div>
  );
}

function StoryDialog({ story, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    return () => node?.close();
  }, []);

  return (
    <dialog ref={dialog} className="about-dialog" onCancel={onClose} onClick={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <button className="close-dialog" aria-label="Fechar" onClick={onClose}>×</button>
      <span className="eyebrow">{story}</span>
      <h2>{stories[story].title}</h2>
      {stories[story].paragraphs.map((p) => <p key={p}>{p}</p>)}
      <button className="explore-button" onClick={onClose}>Conhecer o Método <Arrow /></button>
    </dialog>
  );
}

const css = `
.orbit-delivery{font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#f8fafc;background:#070d1e;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;font-weight:400;color-scheme:dark;width:100%;isolation:isolate;--orbit-bg:radial-gradient(ellipse at 20% 20%,#0d1738 0%,#070d1e 50%,#020617 100%);--orbit-ink:#ffffff;--orbit-muted:#94a3b8;--orbit-nav:#cbd5e1;--orbit-accent:#38bdf8;--orbit-cloud:0.4;color:var(--orbit-ink)}
.orbit-delivery *{box-sizing:border-box}.orbit-delivery{margin:0}.orbit-delivery button,.orbit-delivery a{-webkit-tap-highlight-color:transparent}.orbit-delivery button{font:inherit;color:inherit;cursor:pointer;border:0;background:none}.orbit-delivery button:focus-visible,.orbit-delivery a:focus-visible{outline:2px solid #38bdf8;outline-offset:6px}.orbit-delivery a{color:inherit;text-decoration:none}.orbit-delivery svg{display:block}.orbit-delivery button svg{width:22px;height:22px}
.orbit-delivery .page{height:100svh;min-height:760px;position:relative;overflow:hidden;background:var(--orbit-bg);display:flex;flex-direction:column}
.orbit-delivery .site-header{height:104px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:0 6.5%;position:relative;z-index:5}
.orbit-delivery .wordmark{display:flex;align-items:center;gap:13px;font-size:30px;font-weight:700;letter-spacing:-1.2px;color:#ffffff}
.orbit-delivery .wordmark>svg{width:35px;height:35px}
.orbit-delivery .brand-type{display:flex;flex-direction:column;line-height:1;gap:4px}
.orbit-delivery .brand-type small{font-size:9px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:#38bdf8}
.orbit-delivery .site-header nav{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:40px;align-items:center}
.orbit-delivery .site-header nav button{font-size:15px;color:var(--orbit-nav);padding:12px 0;transition:color .2s;font-weight:500}
.orbit-delivery .site-header nav button:hover{color:#38bdf8}
.orbit-delivery .header-cta{background:linear-gradient(135deg,#06b6d4,#3b82f6);color:white;border-radius:23px;padding:13px 25px;font-size:14px;font-weight:600;box-shadow:0 4px 20px rgba(6,182,212,0.4);transition:all .2s}
.orbit-delivery .header-cta:hover{background:linear-gradient(135deg,#0891b2,#2563eb);transform:translateY(-1px);box-shadow:0 6px 24px rgba(6,182,212,0.6)}
.orbit-delivery main{flex:1;min-height:0;display:flex}
.orbit-delivery .hero{width:100%;position:relative}
.orbit-delivery .hero-copy{position:relative;z-index:3;margin-left:6.5%;padding-top:clamp(70px,11vh,135px);width:46%;pointer-events:none}
.orbit-delivery .hero-copy button{pointer-events:auto}
.orbit-delivery .eyebrow{text-transform:uppercase;letter-spacing:.32em;font-size:12px;font-weight:700;color:#38bdf8;margin:0 0 18px}
.orbit-delivery h1{font-size:clamp(48px,4.8vw,80px);font-weight:800;letter-spacing:-.045em;line-height:1.06;margin:0 0 22px;color:#ffffff}
.orbit-delivery h1 em{font-style:italic;font-weight:400;color:#38bdf8;font-family:Georgia,serif;text-shadow:0 0 30px rgba(56,189,248,0.5)}
.orbit-delivery .hero-description{color:var(--orbit-muted);font-size:clamp(16px,1.2vw,19px);line-height:1.5;letter-spacing:-.2px;margin:0 0 28px;max-width:440px}
.orbit-delivery .explore-button{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:16px 30px;border-radius:32px;background:linear-gradient(135deg,#06b6d4,#2563eb);color:white;font-size:16px;font-weight:600;min-height:54px;box-shadow:0 8px 30px rgba(6,182,212,0.45);transition:all .2s}
.orbit-delivery .explore-button:hover{background:linear-gradient(135deg,#0891b2,#1d4ed8);transform:translateY(-2px);box-shadow:0 12px 36px rgba(6,182,212,0.6)}
.orbit-delivery .visual-column{position:absolute;right:-5%;top:0;width:76%;height:calc(100% + 12px);z-index:1}
.orbit-delivery .planet-stage{height:100%;width:100%;position:relative;cursor:grab;touch-action:none;user-select:none;outline:none}
.orbit-delivery .planet-stage.dragging{cursor:grabbing}
.orbit-delivery .planet-caption{position:absolute;right:6.2%;top:17%;z-index:3;width:160px;pointer-events:none;color:#64748b;transition:opacity .2s}
.orbit-delivery .planet-caption p{font-size:14px;line-height:1.35;font-style:italic;text-align:right;margin:0;color:#94a3b8}
.orbit-delivery .planet-caption svg{width:150px;height:140px;margin-top:-15px;margin-left:-25px;color:#38bdf8}
.orbit-delivery .cloud-bank{position:absolute;z-index:2;inset:auto -12% -90px 24%;height:250px;pointer-events:none;filter:blur(24px);opacity:0.35}
.orbit-delivery .cloud-bank i{position:absolute;bottom:0;background:radial-gradient(ellipse at 42% 34%,rgba(14,165,233,0.3) 27%,rgba(7,13,30,0.8) 59%,rgba(2,6,23,0.95) 75%,transparent 80%);border-radius:50%}
.orbit-delivery .cloud-bank i:nth-child(1){width:390px;height:200px;left:0;bottom:-28px;transform:rotate(-25deg)}
.orbit-delivery .cloud-bank i:nth-child(2){width:265px;height:195px;left:14%;bottom:32px}
.orbit-delivery .cloud-bank i:nth-child(3){width:270px;height:170px;left:29%;bottom:-2px}
.orbit-delivery .cloud-bank i:nth-child(4){width:350px;height:200px;right:7%;bottom:-20px}
.orbit-delivery .cloud-bank i:nth-child(5){width:280px;height:215px;right:-2%;bottom:70px}
.orbit-delivery .site-footer{position:absolute;bottom:35px;left:6.5%;right:5.1%;z-index:4;display:flex;align-items:flex-end;justify-content:space-between;pointer-events:none}
.orbit-delivery .site-footer p{margin:0;text-transform:uppercase;font-size:10px;letter-spacing:.22em;line-height:1.8;color:#64748b;font-weight:600}
.orbit-delivery .footer-left::before{content:'';display:block;width:25px;height:1px;background:#334155;margin-bottom:12px}
.orbit-delivery .footer-right{text-align:right}
.orbit-delivery .motion-button{display:flex;gap:7px;align-items:center;color:#94a3b8;pointer-events:auto;font-size:11px;font-weight:600;letter-spacing:.04em;padding:8px 12px;border-radius:16px;background:rgba(15,23,42,0.7);backdrop-filter:blur(10px);border:1px solid rgba(51,65,85,0.8);transition:all .2s}
.orbit-delivery .motion-button:hover{color:#38bdf8;background:rgba(30,41,59,0.9);border-color:rgba(56,189,248,0.6)}
.orbit-delivery .loading{position:absolute;top:42%;left:25%;right:20%;display:flex;align-items:center;justify-content:center;gap:12px;color:#94a3b8;font-size:13px;pointer-events:none}
.orbit-delivery .loading>span{width:18px;height:18px;border:2px solid #334155;border-top-color:#38bdf8;border-radius:50%;animation:loading 1s linear infinite}
@keyframes loading{to{transform:rotate(360deg)}}
.orbit-delivery .about-dialog{border:1px solid #1e293b;border-radius:22px;padding:40px;max-width:500px;width:calc(100% - 32px);background:#0b112c;color:#ffffff;box-shadow:0 25px 120px rgba(0,0,0,0.8)}
.orbit-delivery .about-dialog::backdrop{background:rgba(2,6,23,0.8);backdrop-filter:blur(12px)}
.orbit-delivery .about-dialog h2{font-size:32px;font-weight:700;letter-spacing:-1.2px;line-height:1.15;margin:18px 0 16px;color:#ffffff}
.orbit-delivery .about-dialog p{font-size:15px;line-height:1.7;color:#94a3b8}
.orbit-delivery .close-dialog{position:absolute;right:18px;top:14px;font-size:26px;color:#94a3b8;cursor:pointer}
@media(max-width:900px){.orbit-delivery .site-header nav{display:none}.orbit-delivery .hero-copy{width:calc(100% - 40px);margin:0 20px;padding-top:20px}.orbit-delivery .visual-column{position:relative;width:120%;left:-10%;height:450px}}
`;

export default function OrbitDeliveryHero({ theme = "auto", assetBaseUrl = "https://cdn.jsdelivr.net/gh/fadeichev2121/planet@b3f70fbf4b577845b1d9d5947c9410fb4d925dae" }) {
  return (
    <AssetBaseContext.Provider value={assetBaseUrl.replace(/\/$/, "") + "/"}>
      <div className="orbit-delivery" data-theme={theme}>
        <style>{css}</style>
        <App />
      </div>
    </AssetBaseContext.Provider>
  );
}
