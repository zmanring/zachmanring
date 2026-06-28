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

export default defineConfig({
  plugins: [react(), zoneSaverPlugin()],
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
