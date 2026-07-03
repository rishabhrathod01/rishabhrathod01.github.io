"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Instances, Instance } from "@react-three/drei";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { getWorldData } from "@/lib/drone/terrain";
import { P } from "@/lib/drone/palette";

// Low-poly pine merged into one geometry (vertex-coloured trunk + canopy) so
// all ~90 trees are a single instanced draw call. Rocks and grass tufts get
// one draw call each too.

function colorize(geo: THREE.BufferGeometry, color: string): THREE.BufferGeometry {
  const c = new THREE.Color(color);
  const count = geo.attributes.position.count;
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

function buildPine(): THREE.BufferGeometry {
  const trunk = colorize(
    new THREE.CylinderGeometry(0.12, 0.2, 1.1, 5).translate(0, 0.55, 0),
    P.trunk
  );
  const lower = colorize(
    new THREE.ConeGeometry(1.15, 2.0, 6).translate(0, 1.9, 0),
    P.canopy
  );
  const upper = colorize(
    new THREE.ConeGeometry(0.72, 1.5, 6).translate(0, 3.1, 0),
    P.grassTip
  );
  const merged = mergeGeometries([trunk, lower, upper]);
  merged.computeVertexNormals();
  return merged;
}

export default function Vegetation() {
  const { trees, rocks, grass } = getWorldData();
  const pine = useMemo(buildPine, []);
  const rock = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const tuft = useMemo(() => new THREE.ConeGeometry(0.32, 0.7, 4), []);

  return (
    <>
      <Instances geometry={pine} limit={trees.length} frustumCulled={false}>
        <meshStandardMaterial vertexColors flatShading roughness={0.9} />
        {trees.map((t, i) => (
          <Instance
            key={i}
            position={[t.x, t.y - 0.1, t.z]}
            scale={t.scale}
            rotation={[0, t.rotation, 0]}
          />
        ))}
      </Instances>

      <Instances geometry={rock} limit={rocks.length} frustumCulled={false}>
        <meshStandardMaterial color={P.rock} flatShading roughness={0.95} />
        {rocks.map((r, i) => (
          <Instance
            key={i}
            position={[r.x, r.y + 0.15 * r.scale, r.z]}
            scale={[r.scale, r.scale * 0.7, r.scale]}
            rotation={[0, r.rotation, 0]}
          />
        ))}
      </Instances>

      <Instances geometry={tuft} limit={grass.length} frustumCulled={false}>
        <meshStandardMaterial
          color={P.grassTip}
          flatShading
          roughness={1}
          emissive="#16302e"
          emissiveIntensity={0.15}
        />
        {grass.map((g, i) => (
          <Instance
            key={i}
            position={[g.x, g.y + 0.3 * g.scale, g.z]}
            scale={g.scale}
            rotation={[0, g.rotation, 0]}
          />
        ))}
      </Instances>
    </>
  );
}
