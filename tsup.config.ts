import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["iife"],
  globalName: "HostieChat",
  outDir: "dist",
  bundle: true,
  minify: true,
  sourcemap: true,

  loader: {
    ".css": "text",
  },

  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },

  esbuildOptions(options) {
    options.platform = "browser";
    options.define = {
      ...options.define,
      "fs": "false",
    };
  },
});

// import { defineConfig } from "tsup";

// export default defineConfig({
//   entry: ["src/index.tsx"],
//   format: ["iife"],            // browser-ready <script>
//   globalName: "HostieChat",    // exposed as window.HostieChat
//   outDir: "dist",
//   bundle: true,
//   minify: true,
//   sourcemap: true,
//   loader: {
//   ".css": "text",
// },

//   define: {
//     "process.env.NODE_ENV": JSON.stringify("production"),
//   },
//  external: [], // ⚡ Make sure lucide-react, iconsax-react, and react are NOT external
// });
