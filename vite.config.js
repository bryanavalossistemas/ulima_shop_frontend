import { defineConfig } from "vite";
// import { nodePolyfills } from 'vite-plugin-node-polyfills'
import react from "@vitejs/plugin-react-swc";
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react(), nodePolyfills()],
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
