import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
	resolve: {
    alias: {
      assets: "/src/assets",
      components: "/src/components",
      services: "/src/services",
      pages: "/src/pages",
      hooks: "/src/hooks",
      reduxFolder: "/src/reduxFolder",
      styles: "/src/styles",
      types: "/src/types",
      utils: "/src/utils",
    },
  },
})
