import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const modulePreloadRemover = {
  name: 'remove-vite-preload',
  apply: 'build',
  configResolved(config) {
    const plugin = config.plugins.find(
      (p) => p.name === 'native:import-analysis-build',
    );
    if (plugin) {
      plugin.applyToEnvironment = undefined;
    }
  },
}

export default defineConfig({
  plugins: [
    modulePreloadRemover,
    tailwindcss(),
  ],
  build: {
    modulePreload: false,
    rolldownOptions: {
      output:  {
        codeSplitting: {
          groups: [
            {
              name: 'webuum',
              test: /node_modules[\\/]webuum(?:[\\/]|$)/,
              priority: 30,
            }
          ]
        }
      }
    }
  },
})
