import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { hop, popIn, ramp, sway, tween, useTime } from "./anim";
import { Bosque, SUELO, TILT_PX } from "./components/Bosque";
import {
  Arcoiris,
  Brillitos,
  CieloIcono,
  Circulo,
  FlorAzul,
  Frutilla,
  Girasol,
  Hongo,
  Laguna,
  Manzana,
  Manzano,
  Mariposa,
  Obj,
  Plato,
  Sol,
} from "./components/Objetos";
import { Beto, Nube, Pino, caparazonArriba } from "./components/Personajes";
import { ColorWord, Esperando, Notas, Titulo } from "./components/Textos";
import { colors as c } from "./theme";
import { BEAT, LYRICS, line, wordAt } from "./timeline";

const out = Easing.out(Easing.cubic);

// Mientras Pino espera la respuesta: del final de la pregunta al comienzo de la respuesta
const pausa = (pregunta: string, respuesta: string) => [line(pregunta).end, line(respuesta).start] as const;

// Saludo con la mano mientras dura una frase
const saludo = (t: number, id: string, dur = 2) => {
  const s = line(id).start;
  return Math.min(ramp(t, s - 0.3, s + 0.2), 1 - ramp(t, s + dur - 0.4, s + dur));
};

// Primer plano de Pino haciendo la pregunta a cámara, con el objeto al lado
const Pregunta: React.FC<{
  pregunta: string;
  respuesta: string;
  fondo: React.ReactNode;
  objeto: (pulse: number, bounce: number) => React.ReactNode;
  brillo: { x: number; y: number };
}> = ({ pregunta, respuesta, fondo, objeto, brillo }) => {
  const { t } = useTime();
  const [desde, hasta] = pausa(pregunta, respuesta);
  const esperando = Math.min(ramp(t, desde, desde + 0.5), 1 - ramp(t, hasta - 0.2, hasta + 0.3));
  const pulse = esperando * 0.05 * (0.5 + 0.5 * Math.sin(2 * Math.PI * 0.9 * t));
  const bounce = hop(t, line(respuesta).start, 0.6);
  return (
    <AbsoluteFill>
      {fondo}
      {objeto(pulse, bounce)}
      <Pino x={640} y={1190} h={820} tilt={7 * esperando} bounce={bounce * 0.6} />
      <Esperando x={930} y={250} from={desde} to={hasta} />
      <Brillitos x={brillo.x} y={brillo.y} at={line(respuesta).start} />
    </AbsoluteFill>
  );
};

// --- 1. Saludo y tema -----------------------------------------------------

export const P01: React.FC = () => (
  <AbsoluteFill>
    <Bosque />
    <Titulo at={0.8} />
  </AbsoluteFill>
);

export const P02: React.FC = () => {
  const { t, lt } = useTime();
  return (
    <AbsoluteFill>
      <Bosque />
      <Pino x={tween(lt, 0, 3.2, -220, 860, out)} y={SUELO + 10} h={470} walking={lt < 3.1} wave={saludo(t, "02-hola", 1.8)} />
    </AbsoluteFill>
  );
};

export const P03: React.FC = () => {
  const { t } = useTime();
  const circulos = [
    ["rojo", c.rojo, 1130],
    ["azul", c.azul, 1420],
    ["amarillo", c.amarillo, 1710],
  ] as const;
  return (
    <AbsoluteFill>
      <Bosque />
      {circulos.map(([w, color, x], i) => (
        <Obj key={w} x={x} y={480 + 10 * sway(t, 3, i * 0.7)} size={230} scale={popIn(t, wordAt("03-tres", w))}>
          <Circulo color={color} />
        </Obj>
      ))}
      <Pino x={620} y={SUELO + 10} h={470} />
    </AbsoluteFill>
  );
};

export const P04: React.FC = () => {
  const { lt } = useTime();
  return (
    <AbsoluteFill>
      <Bosque pan={tween(lt, 0.3, 8.4, 0, 1400)} />
      <Pino x={tween(lt, 0, 8, 760, 980)} y={SUELO + 10} h={470} walking={lt > 0.3} />
    </AbsoluteFill>
  );
};

// --- 2. Rojo, con Nube ----------------------------------------------------

export const P05: React.FC = () => {
  const { t } = useTime();
  const brilla = ramp(t, wordAt("05-nube", "manzana"), wordAt("05-nube", "manzana") + 0.6);
  const arriba = ramp(t, wordAt("05-nube", "arriba"), wordAt("05-nube", "arriba") + 0.6);
  return (
    <AbsoluteFill>
      <Bosque pan={1400} />
      <Obj x={1380} y={SUELO + 10 - 380} size={600} ratio={760 / 600}>
        <Manzano />
      </Obj>
      <Obj x={1340} y={480} size={96} glow={brilla * (0.8 + 0.2 * sway(t, 1.4))} scale={1 + 0.12 * brilla}>
        <Manzana />
      </Obj>
      <Nube x={1300} y={SUELO + 5} h={280} lookUp={arriba} />
      <Pino x={tween(t, 36, 38.5, 380, 560, out)} y={SUELO + 10} h={440} walking={t < 38.4} lookUp={arriba} />
    </AbsoluteFill>
  );
};

export const P06: React.FC = () => {
  const { lt } = useTime();
  return (
    <AbsoluteFill>
      <Bosque pan={1400} tilt={0.3} zoom={1.25} />
      <Obj x={960} y={620 + 12 * sway(lt, 3.5)} size={440} rotate={3 * sway(lt, 5)} glow={0.6}>
        <Manzana />
      </Obj>
      <ColorWord text="ROJO" color={c.rojo} at={wordAt("06-nube", "roja")} y={190} />
      <Brillitos x={960} y={620} at={wordAt("06-pino", "rojo")} radius={300} />
    </AbsoluteFill>
  );
};

export const P07: React.FC = () => (
  <Pregunta
    pregunta="07-pregunta"
    respuesta="07-respuesta"
    fondo={<Bosque pan={1400} zoom={1.5} />}
    brillo={{ x: 1340, y: 520 }}
    objeto={(pulse, bounce) => (
      <Obj x={1340} y={520 - bounce * 40} size={300} glow={0.7} scale={1 + pulse}>
        <Manzana />
      </Obj>
    )}
  />
);

export const P08: React.FC = () => {
  const { t, lt } = useTime();
  const rojo = (k: number) => hop(t, wordAt("08-pino", "rojo", k), 0.5) * 50;
  return (
    <AbsoluteFill>
      <Bosque pan={1400} />
      <Obj x={820} y={SUELO - 80 - rojo(1)} size={190} scale={popIn(t, wordAt("08-nube", "hongo"))}>
        <Hongo />
      </Obj>
      <Obj x={1070} y={SUELO - 75 - rojo(2)} size={170} scale={popIn(t, wordAt("08-nube", "frutilla"))}>
        <Frutilla />
      </Obj>
      <Obj x={1310} y={SUELO - 80 - rojo(3)} size={160} scale={popIn(lt, 0.3)}>
        <Manzana />
      </Obj>
      <Nube x={1620} y={SUELO + 5} h={280} />
      <Pino x={400} y={SUELO + 10} h={440} />
    </AbsoluteFill>
  );
};

// --- 3. Azul, con Beto ----------------------------------------------------

export const P09: React.FC = () => {
  const { t, lt } = useTime();
  const tilt = tween(lt, 6, 9.6, 0, 1);
  const down = tilt * TILT_PX;
  const nube = { x: 1100, h: 280 };
  const lomo = caparazonArriba(nube.x, SUELO + 5, nube.h);
  const llega = ramp(lt, 0, 1.5, out);
  const sube = ramp(lt, 5.8, 9.2);
  const betoX = tween(lt, 0, 1.5, 2100, lomo.x, out) + sube * 300;
  const betoY = (1 - sube) * (tween(lt, 0, 1.5, -80, lomo.y + 4, out) - 160 * Math.sin(Math.PI * llega) + down) + sube * 470;
  const arriba = ramp(t, wordAt("09-beto", "arriba"), wordAt("09-beto", "arriba") + 0.6);
  return (
    <AbsoluteFill>
      <Bosque pan={2600} tilt={tilt} />
      <Pino x={620} y={SUELO + 10 + down} h={440} lookUp={arriba} wave={saludo(t, "09-pino", 1.4)} />
      <Nube x={nube.x} y={SUELO + 5 + down} h={nube.h} lookUp={arriba} />
      <Beto x={betoX} y={betoY} h={130 + 60 * sube} flying={lt < 1.5 || lt > 5.8} />
    </AbsoluteFill>
  );
};

export const P10: React.FC = () => {
  const { lt } = useTime();
  return (
    <AbsoluteFill>
      <Bosque pan={2600} tilt={1} />
      <ColorWord text="AZUL" color={c.azul} at={wordAt("10-pino", "azul")} y={200} />
      <Beto x={tween(lt, 0, 10.6, 260, 1700, Easing.linear)} y={640 + 50 * Math.sin(lt * 1.1)} h={220} flying />
    </AbsoluteFill>
  );
};

export const P11: React.FC = () => {
  const { lt } = useTime();
  return (
    <Pregunta
      pregunta="11-pregunta"
      respuesta="11-respuesta"
      fondo={<Bosque pan={2600} tilt={0.45} zoom={1.3} />}
      brillo={{ x: 1380, y: 400 }}
      objeto={(pulse, bounce) => (
        <Beto x={1380 + 40 * Math.sin(lt * 0.8)} y={470 - bounce * 30} h={190 * (1 + pulse)} flying />
      )}
    />
  );
};

export const P12: React.FC = () => {
  const { t } = useTime();
  const azul = (k: number) => hop(t, wordAt("12-pino", "azul", k), 0.5);
  const flores = wordAt("12-beto", "flores");
  return (
    <AbsoluteFill>
      <Bosque pan={2600} />
      <Obj x={1180} y={SUELO - 40} size={760} ratio={180 / 700} scale={1 + 0.04 * azul(1)}>
        <Laguna ripple={azul(1)} />
      </Obj>
      {[
        [760, 150, 0, 2],
        [1660, 130, 0.25, 3],
        [1800, 150, 0.45, 3],
      ].map(([x, size, delay, k]) => (
        <Obj key={x} x={x} y={SUELO - 70 - azul(k) * 40} size={size} ratio={1.3} scale={popIn(t, flores + delay)}>
          <FlorAzul />
        </Obj>
      ))}
      <Beto x={1480} y={SUELO - 10} h={130} bounce={azul(2) + azul(3)} />
      <Pino x={430} y={SUELO + 10} h={440} />
    </AbsoluteFill>
  );
};

// --- 4. Amarillo, con Nube y Beto ----------------------------------------

export const P13: React.FC = () => {
  const { t, lt } = useTime();
  const lomo = caparazonArriba(1060, SUELO + 5, 280);
  const sol = ramp(t, wordAt("13-nube", "sol"), wordAt("13-nube", "sol") + 0.8);
  return (
    <AbsoluteFill>
      <Bosque pan={3800} />
      <Obj x={1500} y={tween(lt, 0, 9, 300, 240)} size={300} glow={0.4 + 0.4 * sol}>
        <Sol />
      </Obj>
      <Pino x={620} y={SUELO + 10} h={440} lookUp={sol} />
      <Nube x={1060} y={SUELO + 5} h={280} lookUp={sol} />
      <Beto x={lomo.x} y={lomo.y + 4} h={120} />
    </AbsoluteFill>
  );
};

export const P14: React.FC = () => {
  const { lt } = useTime();
  const a = (2 * Math.PI * lt) / 7 + 2.2;
  return (
    <AbsoluteFill>
      <Bosque pan={3800} tilt={1} />
      <Obj x={960} y={620} size={540} glow={0.5}>
        <Sol />
      </Obj>
      <ColorWord text="AMARILLO" color={c.amarillo} contorno="#E9A100" at={wordAt("14-pino", "amarillo")} y={160} size={180} />
      <Beto x={960 + 470 * Math.cos(a)} y={720 + 170 * Math.sin(a)} h={180} flying flip={Math.sin(a) > 0} />
    </AbsoluteFill>
  );
};

export const P15: React.FC = () => (
  <Pregunta
    pregunta="15-pregunta"
    respuesta="15-respuesta"
    fondo={<Bosque pan={3800} tilt={0.35} zoom={1.3} />}
    brillo={{ x: 1400, y: 300 }}
    objeto={(pulse, bounce) => (
      <Obj x={1400} y={300 - bounce * 30} size={340} glow={0.6} scale={1 + pulse}>
        <Sol />
      </Obj>
    )}
  />
);

export const P16: React.FC = () => {
  const { t } = useTime();
  const amarillo = (k: number) => hop(t, wordAt("16-pino", "amarillo", k), 0.5);
  const mariposa = wordAt("16-nube", "mariposa");
  const m = t - mariposa;
  return (
    <AbsoluteFill>
      <Bosque pan={3800} />
      <Obj x={1700} y={170 - amarillo(3) * 30} size={210} glow={0.3}>
        <Sol />
      </Obj>
      <Obj x={1000} y={SUELO - 230 - amarillo(1) * 30} size={300} ratio={500 / 300} scale={popIn(t, wordAt("16-nube", "girasol"))}>
        <Girasol />
      </Obj>
      <Obj
        x={1000 + 260 * Math.sin(m * 0.8)}
        y={430 + 70 * Math.sin(m * 1.3) - amarillo(2) * 40}
        size={170}
        ratio={130 / 160}
        scale={popIn(t, mariposa)}
      >
        <Mariposa />
      </Obj>
      <Nube x={1560} y={SUELO + 5} h={280} />
      <Pino x={420} y={SUELO + 10} h={440} />
    </AbsoluteFill>
  );
};

// --- 5. Resumen -----------------------------------------------------------

const RESUMEN = [
  { x: 1010, pregunta: "18-manzana", respuesta: "18-roja", palabra: "roja", color: c.rojo, dibujo: <Manzana /> },
  { x: 1340, pregunta: "18-cielo", respuesta: "18-azul", palabra: "azul", color: c.azul, dibujo: <CieloIcono /> },
  { x: 1670, pregunta: "18-sol", respuesta: "18-amarillo", palabra: "amarillo", color: c.amarillo, dibujo: <Sol cara={false} /> },
];

const Resumen: React.FC<{ saltan?: boolean }> = ({ saltan = false }) => {
  const { t } = useTime();
  const lomo = caparazonArriba(690, SUELO + 5, 250);
  const salto = saltan ? hop(t, 190.4, 0.6) + hop(t, 191.1, 0.6) : 0;
  return (
    <AbsoluteFill>
      <Bosque pan={5000} />
      {RESUMEN.map((r, i) => {
        const activo = Math.min(
          ramp(t, line(r.pregunta).start - 0.2, line(r.pregunta).start + 0.3),
          1 - ramp(t, line(r.respuesta).end + 0.6, line(r.respuesta).end + 1.1),
        );
        const enRonda = t >= 172.5 && t < line("18-amarillo").end + 1;
        const dim = enRonda ? 0.55 + 0.45 * activo : 1;
        return (
          <React.Fragment key={r.x}>
            <Obj x={r.x} y={470} size={270} scale={popIn(t, 162.6 + i * 0.6) * (1 + 0.1 * activo)} opacity={dim} glow={activo * 0.8}>
              <Plato />
              <div style={{ position: "absolute", inset: "14%" }}>{r.dibujo}</div>
            </Obj>
            <ColorWord text={r.palabra} color={r.color} at={line(r.respuesta).start} x={r.x} y={700} size={100} />
          </React.Fragment>
        );
      })}
      <Pino x={300} y={SUELO + 10} h={420} bounce={salto} />
      <Nube x={690} y={SUELO + 5} h={250} bounce={salto * 0.5} />
      <Beto x={lomo.x} y={lomo.y + 4} h={110} bounce={salto} />
    </AbsoluteFill>
  );
};

export const P17: React.FC = () => <Resumen />;
export const P18: React.FC = () => <Resumen />;

export const P19: React.FC = () => (
  <AbsoluteFill>
    <Resumen saltan />
    <Notas from={wordAt("19-cantar", "cantar")} x={480} y={520} />
  </AbsoluteFill>
);

// --- 6. Canción -----------------------------------------------------------

const latido = (t: number) => Math.pow(Math.max(0, Math.cos((Math.PI * ((t - 200) % BEAT)) / BEAT)), 6);

const Coro: React.FC<{ betoGira?: boolean; arcoiris?: number }> = ({ betoGira = false, arcoiris = 0 }) => {
  const { t } = useTime();
  const b = Math.abs(Math.sin((Math.PI * (t - 200)) / BEAT));
  const a = (2 * Math.PI * (t - 227)) / 6;
  const junta = ramp(t, 238.6, 240.2);
  return (
    <AbsoluteFill>
      <Bosque pan={5000} />
      {[c.rojo, c.azul, c.amarillo].map((color, i) => (
        <Obj
          key={color}
          x={tween(junta, 0, 1, 760 + i * 200, 960)}
          y={tween(junta, 0, 1, 230, 300)}
          size={150}
          scale={(1 + 0.1 * latido(t + i * BEAT)) * (1 - junta)}
          opacity={1 - junta}
        >
          <Circulo color={color} />
        </Obj>
      ))}
      {arcoiris > 0 ? (
        <Obj x={960} y={330} size={900} ratio={360 / 640}>
          <Arcoiris progress={arcoiris} />
        </Obj>
      ) : null}
      <Pino x={760} y={SUELO + 10} h={440} bounce={b * 0.25} />
      <Nube x={1260} y={SUELO + 5} h={280} bounce={b * 0.15} />
      {betoGira ? (
        <Beto x={1150 + 330 * Math.cos(a)} y={470 + 110 * Math.sin(a)} h={140} flying flip={Math.sin(a) > 0} />
      ) : (
        <Beto x={1560} y={540} h={150} flying />
      )}
    </AbsoluteFill>
  );
};

export const P20: React.FC = () => <Coro />;

export const P21: React.FC = () => {
  const { t } = useTime();
  const ver = (k: number) => LYRICS[7].words[k].start;
  const items = [
    [560, LYRICS[4].start, <Manzana key="m" />],
    [960, LYRICS[5].start, <CieloIcono key="c" />],
    [1360, LYRICS[6].start, <Sol key="s" />],
  ] as const;
  return (
    <AbsoluteFill>
      <Bosque pan={6200} />
      {items.map(([x, at, dibujo], i) => (
        <Obj key={x} x={x} y={500 - hop(t, ver(i), 0.45) * 50} size={320} scale={popIn(t, at - 0.2)} glow={0.5}>
          {dibujo}
        </Obj>
      ))}
    </AbsoluteFill>
  );
};

export const P22: React.FC = () => {
  const { t } = useTime();
  return <Coro betoGira arcoiris={ramp(t, 239.2, 241.8)} />;
};

// --- 7. Despedida ---------------------------------------------------------

export const P23: React.FC = () => {
  const { t } = useTime();
  const velo = ramp(t, 250.4, 252.2);
  return (
    <AbsoluteFill>
      <Bosque pan={5000} />
      <Obj x={960} y={330} size={900} ratio={360 / 640}>
        <Arcoiris progress={1} />
      </Obj>
      <Pino x={760} y={SUELO + 10} h={440} wave={saludo(t, "23-chau", 4.5)} />
      <Nube x={1260} y={SUELO + 5} h={280} />
      <Beto x={1560} y={540} h={150} flying />
      <AbsoluteFill style={{ backgroundColor: c.crema, opacity: velo * 0.8 }} />
      <Titulo at={251} />
    </AbsoluteFill>
  );
};

export const PLANO_COMPONENTES = [
  P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12,
  P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23,
];
