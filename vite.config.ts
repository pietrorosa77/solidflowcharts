import path from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  optimizeDeps: {
    exclude: ["@tiptap/core", "@tiptap/starter-kit"],
  },
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
    lib: {
      entry: path.resolve(__dirname, "src/flowchartWebComponent.tsx"),
      name: "SolidDumbotChart",
      fileName: "SolidDumbotChart",
    },
  },
});
