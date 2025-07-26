import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const modulePreloadRemover = {
  name: 'module-preload-remover',
  configResolved(config) {
    if (config.command !== 'build') return

    const plugin = config.plugins.findIndex(
      p => p.name === 'vite:build-import-analysis',
    )

    config.plugins.splice(plugin, 1)
  },
  renderChunk(code) {
    return 'const __VITE_IS_MODERN__=true;' + code
  },
}

export default defineConfig({
  plugins: [
    modulePreloadRemover,
    tailwindcss(),
  ],
  build: {
    modulePreload: false,
  },
})
