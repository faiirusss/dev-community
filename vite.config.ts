import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  resolve: {
    // This replaces the "vite-tsconfig-paths" plugin
    tsconfigPaths: true, 
  },
  plugins: [  
    tailwindcss(),
    tanstackStart(), // By default, this looks for src/entry-client.tsx and src/entry-server.tsx
  ],
})