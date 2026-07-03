"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { DAY_CYCLE } from "@/lib/drone/palette";
import { flight } from "../store";

// Gradient sky dome animating from morning to sunset with flight time
// (flight.dayT). Drei <Sky> can't be keyframed like this and costs a heavy
// fragment shader. Ignores scene fog by design.
const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec3 vDir;
  uniform vec3 uZenith;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  void main() {
    float y = vDir.y;
    vec3 col = mix(uMid, uZenith, smoothstep(0.04, 0.55, y));
    float band = pow(1.0 - abs(y), 5.0);
    col = mix(col, uHorizon, band * 0.65);
    col = mix(col, uZenith * 0.9, smoothstep(0.0, -0.25, y));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const M = DAY_CYCLE.morning;
const S = DAY_CYCLE.sunset;

export default function SkyDome() {
  const keys = useRef({
    zenith: [new THREE.Color(M.zenith), new THREE.Color(S.zenith)],
    mid: [new THREE.Color(M.mid), new THREE.Color(S.mid)],
    horizon: [new THREE.Color(M.horizon), new THREE.Color(S.horizon)],
  });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uZenith: { value: new THREE.Color(M.zenith) },
          uMid: { value: new THREE.Color(M.mid) },
          uHorizon: { value: new THREE.Color(M.horizon) },
        },
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
      }),
    []
  );

  useFrame(() => {
    const t = flight.dayT;
    const k = keys.current;
    (material.uniforms.uZenith.value as THREE.Color).lerpColors(k.zenith[0], k.zenith[1], t);
    (material.uniforms.uMid.value as THREE.Color).lerpColors(k.mid[0], k.mid[1], t);
    (material.uniforms.uHorizon.value as THREE.Color).lerpColors(k.horizon[0], k.horizon[1], t);
  });

  return (
    // Radius must stay under the camera far plane (260) or the dome clips.
    <mesh material={material} renderOrder={-2} frustumCulled={false}>
      <sphereGeometry args={[235, 32, 16]} />
    </mesh>
  );
}
