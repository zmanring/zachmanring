import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Dev-only plugin: POST /api/save-zones writes src/data/zones.json
function zoneSaverPlugin() {
  return {
    name: 'zone-saver',
    configureServer(server: any) {
      server.middlewares.use('/api/save-zones', (req: any, res: any) => {
        if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }
        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => {
          const dest = path.resolve(__dirname, 'src/data/zones.json');
          fs.writeFileSync(dest, JSON.stringify(JSON.parse(body), null, 2));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: true }));
        });
      });
    },
  };
}

// Dev-only plugin: POST /api/save-npcs patches NPC_DEFS in WorldScene.ts
function npcSaverPlugin() {
  return {
    name: 'npc-saver',
    configureServer(server: any) {
      server.middlewares.use('/api/save-npcs', (req: any, res: any) => {
        if (req.method !== 'POST') { res.writeHead(405); res.end(); return; }
        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const defs: [number, number, string, number, string, string][] = JSON.parse(body);
            const filePath = path.resolve(__dirname, 'src/game/scenes/WorldScene.ts');
            let src = fs.readFileSync(filePath, 'utf8');
            const lines = defs.map(([x, y, outfit, radius, id, zone]) =>
              `  [${x}, ${y},  '${outfit}', ${String(radius).padStart(3)}, '${id}', '${zone}'],`
            );
            const newBlock = `const NPC_DEFS: [number, number, string, number, string, string][] = [\n${lines.join('\n')}\n];`;
            src = src.replace(
              /const NPC_DEFS: \[number, number, string, number, string, string\]\[\] = \[[\s\S]*?\];/,
              newBlock
            );
            fs.writeFileSync(filePath, src, 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ ok: true }));
          } catch (e) {
            res.writeHead(500); res.end(String(e));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), zoneSaverPlugin(), npcSaverPlugin()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
        },
      },
    },
  },
})
