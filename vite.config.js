import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      // Two pages ship: the game (index.html) and the object showcase
      // (preview.html, the player-facing 物件圖鑑 reached from the title screen).
      input: {
        main: resolve(root, 'index.html'),
        preview: resolve(root, 'preview.html'),
      },
    },
  },
  test: {
    include: ['src/**/*.test.js'],
    environment: 'node',
  },
});
