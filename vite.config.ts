import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import inject from '@rollup/plugin-inject'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      buffer: 'buffer',
    },
  },
  define: {
    global: 'globalThis',
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    inject({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
})