import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import WindiCSS from 'vite-plugin-windicss'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Inspect from 'vite-plugin-inspect'
// import { visualizer } from 'rollup-plugin-visualizer'

const markdownWrapperClasses = 'prose prose-sm m-auto text-left'

export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),

    // https://github.com/hannoeru/vite-plugin-pages
    Pages({
      extensions: ['vue', 'md'],
    }),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts(),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'vue-i18n',
        '@vueuse/head',
        '@vueuse/core',
      ],
      dts: 'src/auto-imports.d.ts',
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      // custom resolvers
      resolvers: [
        // auto import icons
        // https://github.com/antfu/unplugin-icons
        IconsResolver({
          prefix: "icon",
          enabledCollections: ['carbon', 'mdi'],
        }),
        (name: string) => {
          if (name.startsWith('Van')) {
            const partialName = name.slice(3)
            return {
              importName: partialName,
              path: 'vant/lib',
            }
          }
        },
        (name: string) => {
          if (name.startsWith('El')) {
            return {
              importName: name,
              path: 'element-plus/lib',
            }
          }
        },
      ],

      dts: 'src/components.d.ts',
    }),

    // https://github.com/antfu/unplugin-icons
    Icons(),

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      safelist: markdownWrapperClasses,
    }),

    // https://github.com/intlify/bundle-tools/tree/main/packages/vite-plugin-vue-i18n
    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, 'locales/**')],
    }),

    // https://github.com/antfu/vite-plugin-inspect
    Inspect({
      // change this to enable inspect for debugging
      enabled: false,
    }),
  ],

  server: {
    host: '0.0.0.0',
    fs: {
      strict: true,
    },
    proxy: {
      '/api': {
        // target: "http://192.168.10.16:7001",
        // target: 'http://192.168.10.3:7002',
        target: 'https://api-tron-v1.dpay.systems',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },

  build: {
    rollupOptions: {
      plugins: [
        // visualizer({ open: true }),
      ],
    },
  },
  // https://github.com/antfu/vite-ssg
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
  },
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      '@vueuse/head',
      'vue-demi',
    ],
  },
})
