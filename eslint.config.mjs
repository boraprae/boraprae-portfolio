import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptConfig from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "build/**", "node_modules/**"],
  },
  ...coreWebVitals,
  ...typescriptConfig,
];

export default eslintConfig;
