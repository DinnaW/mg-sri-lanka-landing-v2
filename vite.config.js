import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/mg-sri-lanka-landing-v2/",

  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            tag === "model-viewer",
        },
      },
    }),
  ],
});