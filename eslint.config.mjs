import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Reglas de estilo degradadas a "warn" mientras se paga la deuda del
    // codebase pre-existente. No bloquean CI pero quedan visibles para
    // ir reduciéndolas. Reglas de correctness siguen en "error".
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "react-hooks/set-state-in-effect": "warn",
      // Reglas del React Compiler (solo aplican si se habilita el compiler,
      // que este proyecto no usa). Desactivadas para evitar ruido.
      "react-hooks/purity": "off",
      "react-hooks/static-components": "off",
      // Los textos en español con ¿¡ y comillas disparan falsos positivos.
      "react/no-unescaped-entities": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "vitest.config.mts",
  ]),
]);

export default eslintConfig;
