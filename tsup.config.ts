// import { defineConfig } from "tsup";

// export default defineConfig({
//   entry: ["src/index.tsx"],
//  format: ["esm", "cjs", "iife"], // ADD IIFE
//   globalName: "HostieChat",  // Only ESM for CDN
//   dts: true,
//   sourcemap: true,
//   minify: true,
//   clean: true,
//   outDir: "dist",
//   bundle:true,
//    loader: {
//     ".css": "css", //  Makes Tailwind CSS work inside the bundle
//   },
// });import { defineConfig } from "tsup";

//  import { defineConfig } from "tsup";
// export default defineConfig({
//   entry: ["src/index.tsx"], // only the main file
//   format: ["iife"],         // single browser-ready JS file
//   globalName: "HostieChat", // window.HostieChat
//   outDir: "dist",
//   bundle: true,             // bundle all components + React
//   minify: true,
//   splitting: false,         // single file
//   loader: { ".css": "css" }, // converts CSS imports to string
// });



  import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["iife"],           // Browser-ready
  globalName: "HostieChat",   // window.HostieChat
  outDir: "dist",
  bundle: true,               // bundle React + components
  minify: true,
  splitting: false,           // single file
  target: "es2020",           // modern JS
  define: {
    "process.env.NODE_ENV": '"production"', // replace process.env
  },
  loader: { ".css": "css" },
});
