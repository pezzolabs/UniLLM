const path = require("path");
const commonjs = require("@rollup/plugin-commonjs");
const typescript2 = require("rollup-plugin-typescript2");
const copy = require("rollup-plugin-copy");

const { defineConfig } = require("rollup");

module.exports = defineConfig({
  input: "./index.ts",
  output: {
    dir: "./dist",
    sourcemap: true,
  },
  plugins: [
    typescript2({
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
      compilerOptions: { outDir: "./dist", sourceMap: true },
      useTsconfigDeclarationDir: true,
    }),
    commonjs(),
    copy({
      targets: [
        {
          src: path.resolve(__dirname, "package.json"),
          dest: "./dist",
        },
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
