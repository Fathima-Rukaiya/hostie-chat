import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
 format: ["iife"], // ADD IIFE
  globalName: "HostieChat",  // Only ESM for CDN
  dts: true,
  sourcemap: true,
  minify: true,
  clean: true,
  outDir: "dist",
  bundle:true,
   loader: {
    ".css": "css", //  Makes Tailwind CSS work inside the bundle
  },
});

 

  