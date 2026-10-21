# Repo de videos cortos con IA (varios nichos)

Videos con motion graphics hechos en Remotion, organizados por nicho.
Cada nicho tiene su propia carpeta con su propio CLAUDE.md (reglas de
hook, ritmo y estilo de ese nicho). Antes de trabajar en un nicho, leé
y seguí su CLAUDE.md.

## ESTRUCTURA
- curiosidades-ciencia/   → reels de curiosidades científicas
- futbol-rivalidades/     → (reglas por definir)
- yt-kids-historias/      → "Las Tardes de Pino", episodios calmos para chicos de 3-6 años
- shared/scripts/         → herramientas compartidas por todos los nichos
- Cada video: <nicho>/<nombre-del-video>/ con su proyecto Remotion en
  video/ y una carpeta Renders/ adentro.

## INSTALACIÓN (en una PC nueva)
1. Instalar Claude (claude.com/download), Node.js LTS (nodejs.org) y Git.
2. Clonar el repo y abrir la carpeta raíz en Claude (pestaña Code).
   Los skills de Remotion están en .claude/skills y se cargan solos.
3. En cada proyecto de video (<nicho>/<video>/video/):
   - npm install
   - npm run audio          (regenera música y efectos, ver abajo)
   - crear a mano el archivo .env con las claves que use ese video
     (ej: ELEVENLABS_API_KEY=...). Nunca pegar claves en el chat.

## AUDIO
- La música y los efectos de sonido se generan con código, con
  shared/scripts/generate-audio.mjs (síntesis programática, nada externo).
- Uso: node shared/scripts/generate-audio.mjs <carpeta-del-proyecto-remotion>
  → escribe los WAV en <carpeta>/public/audio/. Cada proyecto lo expone
  como "npm run audio".
- Los WAV generados no se suben a git: se regeneran idénticos.

## CONTROL DE VERSIONES (automático)
- Cada vez que termines un cambio importante (una escena nueva, un 
  ajuste aprobado, un render final), hacé automáticamente:
  git add .
  git commit -m "<mensaje corto describiendo qué cambió>"
  git push
- No me preguntes si querés que lo suba, hacelo solo después de cada 
  ajuste terminado y avisame con una línea qué subiste.
- Nunca subas la carpeta Renders/ ni node_modules (ni archivos .env).
