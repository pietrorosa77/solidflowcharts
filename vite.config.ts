import path from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import eslintPlugin from "vite-plugin-eslint";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@tiptap/core", "@tiptap/starter-kit"],
  },
  plugins: [solidPlugin(), eslintPlugin({ cache: false })],
  build: {
    minify: true,
    target: "es2015",
    polyfillDynamicImport: false,
    lib: {
      entry: path.resolve(__dirname, "src/lib.tsx"),
      name: "SolidDumbotChart",
      fileName: "SolidDumbotChart",
    },
  },
});
