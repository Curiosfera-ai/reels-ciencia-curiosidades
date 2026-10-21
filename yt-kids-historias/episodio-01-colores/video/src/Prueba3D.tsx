import { Audio } from "@remotion/media";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { hop, PlanoStart, ramp } from "./anim";
import { Subtitulos } from "./components/Textos";
import { colors as c } from "./theme";
import { blinkOf, gestureOf, line, MouthShape, mouthShapeOf } from "./timeline";

// Prueba 3D: el plano 7 (pregunta de la manzana, 0:56–1:08) con Pino armado con
// formas 3D simples (esferas, conos, cápsulas), luz suave y sombras.
export const PRUEBA_3D = { desde: 56, hasta: 68 };

type Estado = {
  t: number;
  shape: MouthShape;
  point: number;
  cheer: number;
  blink: number;
  esperando: number;
  salto: number;
};

const Mat: React.FC<{ color: string; rough?: number }> = ({ color, rough = 0.62 }) => (
  <meshStandardMaterial color={color} roughness={rough} metalness={0} />
);

const Camara: React.FC<{ t: number }> = ({ t }) => {
  const { camera } = useThree();
  const p = (t - PRUEBA_3D.desde) / (PRUEBA_3D.hasta - PRUEBA_3D.desde);
  camera.position.set(0.9 + 0.25 * Math.sin(p * 2), 2.2, 7.6 - 0.6 * p);
  camera.lookAt(0.9, 1.75, 0);
  return null;
};

const Arbol3D: React.FC<{ x: number; z: number; s?: number }> = ({ x, z, s = 1 }) => (
  <group position={[x, 0, z]} scale={s}>
    <mesh position={[0, 0.9, 0]} castShadow>
      <cylinderGeometry args={[0.16, 0.2, 1.8, 16]} />
      <Mat color={c.tronco} />
    </mesh>
    <mesh position={[0, 2.3, 0]} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <Mat color={c.copa} />
    </mesh>
  </group>
);

const Manzana3D: React.FC<{ y: number; s: number }> = ({ y, s }) => (
  <group position={[2.35, y, 0.3]} scale={s}>
    <mesh scale={[1.1, 0.95, 1]} castShadow>
      <sphereGeometry args={[0.42, 48, 48]} />
      <Mat color={c.rojo} rough={0.35} />
    </mesh>
    <mesh position={[0, 0.4, 0]} rotation={[0, 0, -0.25]}>
      <cylinderGeometry args={[0.03, 0.035, 0.25, 8]} />
      <Mat color={c.tronco} />
    </mesh>
    <mesh position={[0.17, 0.44, 0]} rotation={[0, 0, -0.5]} scale={[1, 0.4, 0.6]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <Mat color="#8CCB7E" />
    </mesh>
  </group>
);

const Pino3D: React.FC<{ e: Estado }> = ({ e }) => {
  const open = Math.max(0.1, 1 - e.blink);
  const respira = 1 + 0.012 * Math.sin(e.t * 2);
  const brazoD = -(e.point * (1 - e.cheer) * 1.5 + e.cheer * 2.1);
  const brazoI = e.cheer * 2.1;
  const cabeza = 0.12 * e.esperando + 0.05 * Math.max(e.point, e.cheer) * Math.sin(e.t * 9);
  const cola = 0.25 * Math.sin(e.t * 2.4);
  const naranja = c.naranja;
  return (
    <group position={[0, e.salto * 0.35, 0]}>
      {/* patas */}
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.12, 0.12]} scale={[1, 0.6, 1.2]} castShadow>
          <sphereGeometry args={[0.2, 24, 24]} />
          <Mat color={c.naranjaOscuro} />
        </mesh>
      ))}
      {/* cuerpo y panza */}
      <mesh position={[0, 0.78, 0]} scale={[1, 0.95 * respira, 0.85]} castShadow>
        <sphereGeometry args={[0.62, 48, 48]} />
        <Mat color={naranja} />
      </mesh>
      <mesh position={[0, 0.72, 0.36]} scale={[1, 1.05, 0.55]}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial color="#FFF7EC" emissive="#FFF1DF" emissiveIntensity={0.25} roughness={0.7} />
      </mesh>
      {/* cola */}
      <group position={[0.3, 0.45, -0.45]} rotation={[-0.7, 0, -0.45 + cola]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <capsuleGeometry args={[0.26, 0.7, 12, 24]} />
          <Mat color={naranja} />
        </mesh>
        <mesh position={[0, 1.02, 0]}>
          <sphereGeometry args={[0.25, 24, 24]} />
          <meshStandardMaterial color="#FFF7EC" emissive="#FFF1DF" emissiveIntensity={0.25} roughness={0.7} />
        </mesh>
      </group>
      {/* brazos: giran desde el hombro */}
      <group position={[-0.6, 1.1, 0.15]} rotation={[0, 0, -0.3 - brazoI]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.32, 8, 16]} />
          <Mat color={c.naranjaOscuro} />
        </mesh>
      </group>
      <group position={[0.6, 1.1, 0.15]} rotation={[0, 0, 0.3 - brazoD]}>
        <mesh position={[0, -0.28, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.32, 8, 16]} />
          <Mat color={c.naranjaOscuro} />
        </mesh>
      </group>
      {/* cabeza */}
      <group position={[0, 1.95, 0]} rotation={[0, 0, cabeza]}>
        <mesh scale={[1.08, 0.95, 0.92]} castShadow>
          <sphereGeometry args={[0.85, 64, 64]} />
          <Mat color={naranja} />
        </mesh>
        {[-1, 1].map((s) => (
          <group key={s}>
            {/* oreja */}
            <mesh position={[s * 0.55, 0.78, -0.05]} rotation={[0, 0, -s * 0.35]} castShadow>
              <coneGeometry args={[0.3, 0.62, 32]} />
              <Mat color={naranja} />
            </mesh>
            <mesh position={[s * 0.53, 0.74, 0.12]} rotation={[0, 0, -s * 0.35]} scale={[1, 1, 0.4]}>
              <coneGeometry args={[0.18, 0.42, 24]} />
              <Mat color="#FFD7BE" />
            </mesh>
            {/* mejilla blanca */}
            <mesh position={[s * 0.36, -0.25, 0.5]} scale={[1, 0.85, 0.75]}>
              <sphereGeometry args={[0.42, 32, 32]} />
              <meshStandardMaterial color="#FFF7EC" emissive="#FFF1DF" emissiveIntensity={0.25} roughness={0.7} />
            </mesh>
            {/* ojo */}
            <mesh position={[s * 0.32, 0.08, 0.74]} scale={[1, 1.25 * open, 0.55]}>
              <sphereGeometry args={[0.16, 32, 32]} />
              <Mat color={c.ojos} rough={0.15} />
            </mesh>
            {open > 0.5 ? (
              <mesh position={[s * 0.32 + 0.06, 0.15, 0.84]}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            ) : null}
            {/* rubor */}
            <mesh position={[s * 0.6, -0.22, 0.58]} scale={[1, 0.6, 0.3]}>
              <sphereGeometry args={[0.13, 16, 16]} />
              <Mat color={c.rubor} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, -0.32, 0.72]} scale={[1, 0.9, 0.8]}>
          <sphereGeometry args={[0.36, 32, 32]} />
          <meshStandardMaterial color="#FFF7EC" emissive="#FFF1DF" emissiveIntensity={0.25} roughness={0.7} />
        </mesh>
        {/* nariz */}
        <mesh position={[0, -0.15, 1.02]} scale={[1.25, 0.9, 0.9]}>
          <sphereGeometry args={[0.09, 24, 24]} />
          <Mat color={c.ojos} rough={0.2} />
        </mesh>
        {/* boca: sonrisa cerrada o abierta según el sonido */}
        {e.shape.open < 0.08 ? (
          <mesh position={[0, -0.34, 1.0]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.11, 0.022, 8, 24, Math.PI]} />
            <Mat color={c.ojos} />
          </mesh>
        ) : (
          <mesh position={[0, -0.38, 0.98]} scale={[0.15 * e.shape.wide, 0.04 + 0.13 * e.shape.open, 0.05]}>
            <sphereGeometry args={[1, 24, 24]} />
            <Mat color={c.boca} />
          </mesh>
        )}
      </group>
    </group>
  );
};

// Burbujitas mientras Pino espera la respuesta
const Pensando: React.FC<{ e: Estado }> = ({ e }) => (
  <group position={[1.15, 3.2, 0.3]} scale={e.esperando}>
    {[0, 1, 2].map((i) => (
      <mesh key={i} position={[i * 0.28, i * 0.22 + 0.05 * Math.sin(e.t * 5 - i), 0]}>
        <sphereGeometry args={[0.07 + i * 0.04, 16, 16]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
    ))}
  </group>
);

const Escena: React.FC<{ e: Estado }> = ({ e }) => {
  const bounce = hop(e.t, line("07-respuesta").start, 0.6);
  return (
    <>
      <color attach="background" args={[c.cieloArriba]} />
      <fog attach="fog" args={[c.cieloAbajo, 9, 26]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#FFF6E5", "#8FBF7A", 1.1]} />
      <directionalLight
        position={[-4, 7, 5]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-radius={6}
      />
      <Camara t={e.t} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[40, 64]} />
        <Mat color={c.pasto} />
      </mesh>
      {/* lomas y árboles al fondo */}
      {[
        [-9, -14, 6],
        [0, -18, 8],
        [10, -15, 7],
      ].map(([x, z, r]) => (
        <mesh key={x} position={[x, -r * 0.45, z]}>
          <sphereGeometry args={[r, 48, 48]} />
          <Mat color={c.lomaMedio} />
        </mesh>
      ))}
      <Arbol3D x={-3.2} z={-3} />
      <Arbol3D x={4.6} z={-4} s={1.2} />
      <Arbol3D x={-6} z={-7} s={1.3} />
      <Arbol3D x={1.6} z={-8} s={1.1} />
      <Pino3D e={e} />
      <Manzana3D y={1.9 + 0.05 * Math.sin(e.t * 1.8) + bounce * 0.35} s={1 + 0.06 * e.esperando * Math.sin(e.t * 5.6)} />
      <Pensando e={e} />
    </>
  );
};

export const Prueba3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = PRUEBA_3D.desde + frame / fps;
  const g = gestureOf("pino", t);
  const desde = line("07-pregunta").end;
  const hasta = line("07-respuesta").start;
  const e: Estado = {
    t,
    shape: mouthShapeOf("pino", t),
    point: g.point,
    cheer: g.cheer,
    blink: blinkOf("pino", t),
    esperando: Math.min(ramp(t, desde, desde + 0.5), 1 - ramp(t, hasta - 0.2, hasta + 0.3)),
    salto: hop(t, hasta, 0.6),
  };
  const at = (s: number) => Math.round((s - PRUEBA_3D.desde) * fps);
  return (
    <AbsoluteFill style={{ backgroundColor: c.cieloArriba }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 32, position: [0.9, 2.2, 7.6] }}>
        <Escena e={e} />
      </ThreeCanvas>
      <PlanoStart.Provider value={PRUEBA_3D.desde}>
        <Subtitulos />
      </PlanoStart.Provider>
      <Audio
        src={staticFile("audio/musica-bosque.wav")}
        loop
        volume={(f) => 0.22 * interpolate(f, [0, fps], [0, 1], { extrapolateRight: "clamp" })}
      />
      {["07-pregunta", "07-respuesta"].map((id) => (
        <Sequence key={id} from={at(line(id).start)}>
          <Audio src={staticFile(`voces/${id}.mp3`)} />
        </Sequence>
      ))}
      <Sequence from={at(line("07-respuesta").end)}>
        <Audio src={staticFile("audio/campanita-3.wav")} volume={0.35} />
      </Sequence>
    </AbsoluteFill>
  );
};
