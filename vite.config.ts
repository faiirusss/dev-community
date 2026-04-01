import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      buffer: 'buffer/',
    },
  },
  define: {
    global: 'globalThis',
    Buffer: ['buffer', 'Buffer'],
  },
  plugins: [
    tailwindcss(),
    tanstackStart(),
  ],
})