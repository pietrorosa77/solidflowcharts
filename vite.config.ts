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
  },
});
