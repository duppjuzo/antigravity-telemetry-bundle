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
      // Remove stale hashed bundles before emitting single-file HTML; never touch Python files.
      fs.rmSync(assetsOutDir, { recursive: true, force: true });
    },
    generateBundle(_options, bundle) {
      const cssParts: string[] = [];
      const jsParts: string[] = [];

      for (const [key, item] of Object.entries(bundle)) {
        if (item.type === 'asset' && item.fileName.endsWith('.css')) {
          const src =
            typeof item.source === 'string'
              ? item.source
              : Buffer.from(item.source).toString('utf8');
          cssParts.push(src);
          delete bundle[key];
        } else if (item.type === 'chunk' && item.fileName.endsWith('.js')) {
          jsParts.push(item.code);
          delete bundle[key];
        } else if (item.fileName === 'index.html' || key === 'index.html') {
          delete bundle[key];
        }
      }

      const css = cssParts.join('\n').replace(/<\/(style)/gi, '<\\/$1');
      const js = jsParts.join('\n').replace(/<\/(script)/gi, '<\\/$1');

      const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="dark light" />
    <title>Antigravity Telemetry</title>
    <style>${css}</style>
  </head>
  <body>
    <telemetry-app></telemetry-app>
    <script>${js}</script>
  </body>
</html>
`;

      this.emitFile({
        type: 'asset',
        fileName: 'web_dashboard.html',
        source: html,
      });
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
    cssCodeSplit: false,
    modulePreload: false,
    sourcemap: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        format: 'iife',
        inlineDynamicImports: true,
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8765',
    },
  },
});
