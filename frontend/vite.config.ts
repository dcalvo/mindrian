import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [TanStackRouterVite({ quoteStyle: "double" }), react()],
  // Change the default serving directory for prod vs dev
  base: command === "build" ? "/spa/" : "/",
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
      "/socket": {
        target: "ws://localhost:4000",
        ws: true,
      },
      "/users": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "../backend/priv/static/spa",
    emptyOutDir: true,
  },
}));
