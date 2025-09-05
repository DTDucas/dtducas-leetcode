import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './website',
  base: '/dtducas-leetcode/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'website/index.html'),
        problems: resolve(__dirname, 'website/problems.html'),
        about: resolve(__dirname, 'website/about.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './website/src'),
      '@/components': resolve(__dirname, './website/src/components'),
      '@/styles': resolve(__dirname, './website/src/styles'),
      '@/utils': resolve(__dirname, './website/src/utils'),
      '@/types': resolve(__dirname, './website/src/types')
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
