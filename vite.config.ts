import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [
        PrimeVueResolver(),
        // Custom resolver to handle missing components
        (name) => {
          if (name === 'TabView') {
            return {
              name: 'default',
              from: 'primevue/tabview',
              sideEffects: undefined,
            };
          }
          if (name === 'TabPanel') {
            return {
              name: 'default',
              from: 'primevue/tabpanel',
              sideEffects: undefined,
            };
          }
          if (name === 'Tabs') {
            return {
              name: 'default',
              from: 'primevue/tabs',
              sideEffects: undefined,
            };
          }
          if (name === 'Tab') {
            return {
              name: 'default',
              from: 'primevue/tab',
              sideEffects: undefined,
            };
          }
          if (name === 'TabList') {
            return {
              name: 'default',
              from: 'primevue/tablist',
              sideEffects: undefined,
            };
          }
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
