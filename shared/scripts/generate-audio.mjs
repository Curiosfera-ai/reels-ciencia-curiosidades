// Genera la música y los efectos de sonido de un video con síntesis programática.
// Compartido por todos los nichos del repo.
// Uso: node shared/scripts/generate-audio.mjs <carpeta-del-proyecto-remotion>
//   →  escribe WAVs en <carpeta>/public/audio/   (sin argumento: la carpeta actual)
// Ej.: desde curiosidades-ciencia/medusa-inmortal/video →  npm run audio
import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const SR = 44100;
const OUT = join(resolve(process.argv[2] ?? process.cwd()), "public", "audio");
mkdirSync(OUT, { recursive: true });

// Ruido determinista para que cada render suene igual
let seed = 1234567;
const noise = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 4294967296) * 2 - 1;
};

const buffer = (seconds) => new Float32Array(Math.round(seconds * SR));

const writeWav = (name, data, peak = 0.9) => {
  let max = 0;
  for (const v of data) max = Math.max(max, Math.abs(v));
  const gain = max > 0 ? peak / max : 1;
  const out = Buffer.alloc(44 + data.length * 2);
  out.write("RIFF", 0);
  out.writeUInt32LE(36 + data.length * 2, 4);
  out.write("WAVE", 8);
  out.write("fmt ", 12);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20); // PCM
  out.writeUInt16LE(1, 22); // mono
  out.writeUInt32LE(SR, 24);
  out.writeUInt32LE(SR * 2, 28);
  out.writeUInt16LE(2, 32);
  out.writeUInt16LE(16, 34);
  out.write("data", 36);
  out.writeUInt32LE(data.length * 2, 40);
  data.forEach((v, i) => {
    const s = Math.max(-1, Math.min(1, v * gain));
    out.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  });
  writeFileSync(join(OUT, `${name}.wav`), out);
  console.log(`  ${name}.wav  (${(data.length / SR).toFixed(2)} s)`);
};

// Filtro pasa banda de estado variable (Chamberlin), frecuencia por muestra
const bandpass = (input, freqAt, q = 2.5) => {
  const out = new Float32Array(input.length);
  let low = 0;
  let band = 0;
  for (let i = 0; i < input.length; i++) {
    const f = 2 * Math.sin((Math.PI * Math.min(freqAt(i / SR), SR / 6)) / SR);
    const high = input[i] - low - band / q;
    band += f * high;
    low += f * band;
    out[i] = band;
  }
  return out;
};

const lowpass = (input, cutoff) => {
  const out = new Float32Array(input.length);
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / SR);
  let y = 0;
  for (let i = 0; i < input.length; i++) {
    y += a * (input[i] - y);
    out[i] = y;
  }
  return out;
};

// --- Efectos -------------------------------------------------------------

const whoosh = (reverse) => {
  const dur = 0.5;
  const raw = buffer(dur).map(() => noise());
  const swept = bandpass(raw, (t) => {
    const p = t / dur;
    return reverse ? 3200 - 2900 * p : 300 + 2900 * p;
  });
  return swept.map((v, i) => {
    const p = i / swept.length;
    const env = reverse ? Math.pow(p, 2.2) * (p < 0.97 ? 1 : (1 - p) / 0.03) : Math.sin(Math.PI * p) ** 2;
    return v * env;
  });
};

const pop = () => {
  const data = buffer(0.18);
  let phase = 0;
  return data.map((_, i) => {
    const t = i / SR;
    const f = 300 + 700 * Math.exp(-t / 0.02);
    phase += (2 * Math.PI * f) / SR;
    return Math.sin(phase) * Math.exp(-t / 0.045) * Math.min(1, t / 0.002);
  });
};

const click = () => {
  const data = buffer(0.06);
  return data.map((_, i) => {
    const t = i / SR;
    const tone = Math.sin(2 * Math.PI * 2400 * t) * Math.exp(-t / 0.008);
    const burst = noise() * Math.exp(-t / 0.002);
    return tone * 0.7 + burst * 0.5;
  });
};

const tick = (data, start, f = 1900, amp = 1) => {
  const n = Math.round(0.03 * SR);
  const s = Math.round(start * SR);
  for (let i = 0; i < n && s + i < data.length; i++) {
    const t = i / SR;
    data[s + i] += Math.sin(2 * Math.PI * f * t) * Math.exp(-t / 0.006) * amp;
  }
};

const ticks = () => {
  // Acompaña al contador 0 → 4,5 mm (~1.1 s), acelerando como un odómetro
  const data = buffer(1.2);
  [0, 0.16, 0.3, 0.42, 0.52, 0.61, 0.69, 0.76, 0.82, 0.87, 0.91, 0.95].forEach((t, i) =>
    tick(data, t, 1700 + i * 40, 0.8),
  );
  return data;
};

const boom = (dur = 1.4) => {
  const data = buffer(dur);
  let phase = 0;
  const thump = data.map((_, i) => {
    const t = i / SR;
    const f = 42 + 90 * Math.exp(-t / 0.08);
    phase += (2 * Math.PI * f) / SR;
    return Math.sin(phase) * Math.exp(-t / 0.35) * Math.min(1, t / 0.003);
  });
  const transient = lowpass(
    data.map((_, i) => noise() * Math.exp(-(i / SR) / 0.03)),
    900,
  );
  return thump.map((v, i) => v + transient[i] * 1.2);
};

const sting = () => {
  // Golpe grave + acorde brillante tipo campana para el clímax del loop
  const dur = 2.6;
  const low = boom(dur);
  const partials = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
  return buffer(dur).map((_, i) => {
    const t = i / SR;
    let bell = 0;
    partials.forEach((f, k) => {
      bell += Math.sin(2 * Math.PI * f * t + k) * Math.exp(-t / (1.1 - k * 0.12)) / (1 + k * 0.4);
    });
    const shimmer = 1 + 0.15 * Math.sin(2 * Math.PI * 6 * t);
    return low[i] * 0.9 + bell * 0.45 * shimmer * Math.min(1, t / 0.004);
  });
};

// --- Música --------------------------------------------------------------

const music = () => {
  // Más larga que el video: el fundido de salida lo hace Remotion según la duración real
  const dur = 50;
  const bpm = 100;
  const beat = 60 / bpm;
  const data = buffer(dur);
  const note = (m) => 440 * Math.pow(2, (m - 69) / 12);
  // Am – F – C – G, dos compases cada uno (4.8 s), en loop
  const chords = [
    [57, 60, 64],
    [53, 57, 60],
    [48, 52, 55],
    [55, 59, 62],
  ];
  const chordLen = beat * 8;

  // Pad: tres voces levemente desafinadas con armónicos suaves
  const pad = data.map((_, i) => {
    const t = i / SR;
    const idx = Math.floor(t / chordLen) % chords.length;
    const local = t % chordLen;
    const env = Math.min(1, local / 1.2) * Math.min(1, (chordLen - local) / 0.6);
    let v = 0;
    for (const m of chords[idx]) {
      for (const det of [-0.12, 0.12]) {
        const f = note(m) * Math.pow(2, det / 12);
        v += Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t) + 0.12 * Math.sin(6 * Math.PI * f * t);
      }
    }
    return v * env;
  });
  const padSoft = lowpass(lowpass(pad, 1400), 1400);

  // Arpegio pluck en corcheas, una octava arriba
  const pluck = buffer(dur);
  for (let n = 0; n * beat * 0.5 < dur; n++) {
    const start = n * beat * 0.5;
    const idx = Math.floor(start / chordLen) % chords.length;
    const chord = chords[idx];
    const m = chord[[0, 1, 2, 1][n % 4]] + 12;
    const f = note(m);
    const s = Math.round(start * SR);
    for (let i = 0; i < 0.4 * SR && s + i < pluck.length; i++) {
      const t = i / SR;
      pluck[s + i] += (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(4 * Math.PI * f * t)) * Math.exp(-t / 0.12);
    }
  }

  // Latido suave en cada negra
  const pulse = buffer(dur);
  for (let n = 0; n * beat < dur; n++) {
    const s = Math.round(n * beat * SR);
    let phase = 0;
    for (let i = 0; i < 0.25 * SR && s + i < pulse.length; i++) {
      const t = i / SR;
      phase += (2 * Math.PI * (50 + 60 * Math.exp(-t / 0.04))) / SR;
      pulse[s + i] += Math.sin(phase) * Math.exp(-t / 0.09);
    }
  }

  return data.map((_, i) => {
    const fadeIn = Math.min(1, i / SR / 0.3);
    return (padSoft[i] * 0.16 + pluck[i] * 0.22 + pulse[i] * 0.5) * fadeIn;
  });
};

// Cierre suave: acorde grave que crece despacio y se apaga, en vez de un golpe
const swell = () => {
  const dur = 3;
  return buffer(dur).map((_, i) => {
    const t = i / SR;
    const env = Math.min(1, t / 0.5) * Math.exp(-Math.max(0, t - 0.5) / 0.8);
    let v = 0;
    for (const [f, a] of [[55, 1], [110, 0.6], [164.8, 0.35], [220, 0.2]]) v += Math.sin(2 * Math.PI * f * t) * a;
    return v * env;
  });
};

// --- Micro-efectos v3 ----------------------------------------------------

// Gota de agua: el tono sube rápido y se apaga (una por célula que cambia)
const bloop = (f0) => {
  let phase = 0;
  return buffer(0.16).map((_, i) => {
    const t = i / SR;
    const f = f0 * (1 + 1.2 * (1 - Math.exp(-t / 0.025)));
    phase += (2 * Math.PI * f) / SR;
    return Math.sin(phase) * Math.exp(-t / 0.035) * Math.min(1, t / 0.003);
  });
};

// Tic-tac rápido de reloj (envejecer)
const clock = () => {
  const data = buffer(1.3);
  for (let k = 0; k * 0.11 < 1.2; k++) tick(data, k * 0.11, k % 2 ? 1500 : 2100, 0.7 - k * 0.03);
  return data;
};

// Grieta: dos chasquidos de ruido brillante muy cortos (lastimarse)
const crack = () => {
  const raw = buffer(0.25).map((_, i) => {
    const t = i / SR;
    return noise() * (Math.exp(-t / 0.012) + 0.6 * Math.exp(-Math.max(0, t - 0.035) / 0.02) * (t > 0.035 ? 1 : 0));
  });
  return bandpass(raw, () => 2600, 1.2);
};

// Latido grave "lub-dub"
const beat = (data, start, amp) => {
  for (const [off, a] of [[0, 1], [0.16, 0.7]]) {
    const s = Math.round((start + off) * SR);
    let phase = 0;
    for (let i = 0; i < 0.18 * SR && s + i < data.length; i++) {
      const t = i / SR;
      phase += (2 * Math.PI * (48 + 40 * Math.exp(-t / 0.03))) / SR;
      data[s + i] += Math.sin(phase) * Math.exp(-t / 0.06) * amp * a;
    }
  }
};

// Latidos que se espacian y se apagan (el principio del fin)
const heartbeatFade = () => {
  const data = buffer(2.8);
  [[0, 1], [0.75, 0.65], [1.65, 0.35], [2.5, 0.15]].forEach(([t, a]) => beat(data, t, a));
  return data;
};

// El corazón vuelve: dos latidos que crecen
const heartbeatReturn = () => {
  const data = buffer(1);
  [[0, 0.55], [0.45, 1]].forEach(([t, a]) => beat(data, t, a));
  return data;
};

// Burbujas que suben (se hunde)
const bubbles = () => {
  const data = buffer(1.6);
  [0, 0.12, 0.3, 0.38, 0.6, 0.8, 0.95, 1.2].forEach((start, k) => {
    const s = Math.round(start * SR);
    let phase = 0;
    for (let i = 0; i < 0.06 * SR && s + i < data.length; i++) {
      const t = i / SR;
      phase += (2 * Math.PI * (380 + k * 40 + 900 * (t / 0.06))) / SR;
      data[s + i] += Math.sin(phase) * Math.sin((Math.PI * t) / 0.06) * (0.4 + (k % 3) * 0.2);
    }
  });
  return data;
};

// Rebobinado de cinta: tono que baja con trémolo rápido
const rewind = () => {
  let phase = 0;
  const dur = 0.9;
  return buffer(dur).map((_, i) => {
    const t = i / SR;
    const f = 1100 - 800 * (t / dur);
    phase += (2 * Math.PI * f) / SR;
    const saw = 2 * ((phase / (2 * Math.PI)) % 1) - 1;
    const trem = 0.6 + 0.4 * Math.sin(2 * Math.PI * 28 * t);
    return (saw * 0.5 + noise() * 0.15) * trem * Math.sin((Math.PI * t) / dur);
  });
};

// Brillo suave (genéticamente idénticas)
const chime = () =>
  buffer(1.4).map((_, i) => {
    const t = i / SR;
    let v = 0;
    [1318.5, 1975.5, 2637].forEach((f, k) => (v += Math.sin(2 * Math.PI * f * t) * Math.exp(-t / (0.5 - k * 0.1)) / (1 + k)));
    return v * Math.min(1, t / 0.01);
  });

// Whoosh grave y largo (la sombra del pez)
const whooshLow = () => {
  const dur = 0.9;
  const swept = bandpass(buffer(dur).map(() => noise()), (t) => 120 + 600 * (t / dur), 1.8);
  return swept.map((v, i) => v * Math.sin((Math.PI * i) / swept.length) ** 2);
};

console.log("Generando audio en public/audio/");
[300, 360, 420, 500].forEach((f, k) => writeWav(`bloop-${k + 1}`, bloop(f), 0.7));
writeWav("clock", clock());
writeWav("crack", crack());
writeWav("heartbeat-fade", heartbeatFade());
writeWav("heartbeat-return", heartbeatReturn());
writeWav("bubbles", bubbles());
writeWav("rewind", rewind());
writeWav("chime", chime());
writeWav("whoosh-low", whooshLow());
writeWav("whoosh", whoosh(false));
writeWav("whoosh-reverse", whoosh(true));
writeWav("pop", pop());
writeWav("click", click());
writeWav("ticks", ticks());
writeWav("boom", boom());
writeWav("sting", sting());
writeWav("swell", swell());
writeWav("music", music(), 0.8);
