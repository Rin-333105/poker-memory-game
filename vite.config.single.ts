import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { viteSingleFile } from 'vite-plugin-singlefile'

// 单文件构建：把所有 JS/CSS 内联进一个 index.html，可双击直接运行 / 压缩发送
export default defineConfig({
  base: './',
  plugins: [
    react({
      babel: {
        plugins: ['react-dev-locator'],
      },
    }),
    tsconfigPaths(),
    viteSingleFile(),
  ],
  build: {
    sourcemap: false,
    outDir: 'dist-single',
    emptyOutDir: true,
  },
})
