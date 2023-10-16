const path = require("path");
const generatePackageJson = require("rollup-plugin-generate-package-json");
const commonjs = require("@rollup/plugin-commonjs");
const typescript2 = require("rollup-plugin-typescript2");
const copy = require("rollup-plugin-copy");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const json = require("@rollup/plugin-json");
const { wasm } = require("@rollup/plugin-wasm");

const localPackageJson = require(path.resolve(__dirname, "package.json"));

const { defineConfig } = require("rollup");

module.exports = defineConfig({
  input: "./index.ts",
  output: [
    {
      format: "cjs",
      dir: "./dist",
      name: "unillm-node",
      entryFileNames: "[name].cjs.js",
      chunkFileNames: "[name]-[hash].cjs.js",
      sourcemap: true,
    },
    {
      format: "esm",
      dir: "./dist",
      name: "unillm-node",
      entryFileNames: "[name].esm.js",
      chunkFileNames: "[name]-[hash].esm.js",
      sourcemap: true,
    },
  ],
  plugins: [
    nodeResolve(),
    typescript2({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
      compilerOptions: { outDir: "./dist", sourceMap: true },
      useTsconfigDeclarationDir: true,
    }),
    commonjs(),
    wasm(),
    json(),
    generatePackageJson({
      baseContents: () => ({
        ...localPackageJson,
        main: "./index.cjs.js",
        module: "./index.esm.js",
        types: "./types/packages/unillm-node/index.d.ts",
      }),
    }),
    copy({
      targets: [
        {
          src: path.resolve(__dirname, "../../", "README.md"),
          dest: "./dist",
        },
        {
          src: path.resolve(__dirname, "../../", "LICENSE"),
          dest: "./dist",
        },
      ],
    }),
  ],
});
