// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import playwright from "eslint-plugin-playwright";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    plugins: {
      js,
      "@typescript-eslint": tseslint.plugin,
      playwright,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      "plugin:playwright/recommended"
    ],
    rules: {
      // global rules
      "no-unused-vars": "warn",
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
      "eqeqeq": ["error", "always"],
      "no-console": "off",

      // TypeScript
      "@typescript-eslint/no-explicit-any": "off",

      // Playwright-specific
      "playwright/no-skipped-test": "error",
      "playwright/no-focused-test": "error"
    },
  },
]);
