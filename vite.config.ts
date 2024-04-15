/*
 * @Author: yjl
 * @Date: 2024-04-08 17:00:14
 * @LastEditors: yjl
 * @LastEditTime: 2024-04-15 15:56:57
 * @Description: 描述
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import dts from "vite-plugin-dts";
const resolve = (dir: any) => path.join(__dirname, dir);

export default defineConfig({
  plugins: [
    vue(),
    visualizer(),
    dts({
      outputDir:'./lib',
      entryRoot:'./packages',
    }),
  ],
  resolve: {
    alias: {
      "@": resolve("src"),
      packages: resolve("packages"),
    },
  },
  build: {
    outDir: "lib",
    lib: {
      entry: "packages/index.ts", //指定组件编译入口文件
      name: "BPMN-Vue3",
      fileName: "index",
    }, //库编译模式配置
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
      },
    }, // rollup打包配置

    minify: "terser",
    // 压缩时忽略警告
    terserOptions: {
      compress: {
        drop_debugger: true,
        drop_console: true,
      },
    },
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 9527, // 将3000更改为所需的端口号
  },
});
