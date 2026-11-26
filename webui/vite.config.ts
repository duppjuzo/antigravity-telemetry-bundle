import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverOutDir = path.resolve(__dirname, '../plugin/cache-monitor/server');
const assetsOutDir = path.join(serverOutDir, 'assets');

function telemetryDashboardPlugin(): Plugin {
  return {
    name: 'telemetry-dashboard-output',
    enforce: 'post',
    buildStart() {
      // Remove stale hashed bundles before emitting new ones; never touch Python files.
      fs.rmSync(assetsOutDir, { recursive: true, force: true });
    },
    generateBundle(_options, bundle) {
      for (const [key, chunk] of Object.entries(bundle)) {
        if (chunk.fileName === 'index.html' || key === 'index.html') {
          chunk.fileName = 'web_dashboard.html';
          delete bundle[key];
          bundle['web_dashboard.html'] = chunk;
          break;
        }
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [telemetryDashboardPlugin()],
  build: {
    outDir: serverOutDir,
    emptyOutDir: false,
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
    },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8765',
    },
  },
});
