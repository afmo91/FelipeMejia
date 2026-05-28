import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextVitals,
  ...nextTypeScript,
  {
    ignores: [
      ".next/**",
      "next-env.d.ts",
      "node_modules/**",
      "public/cv/**",
      "public/resume/**",
    ],
  },
];

export default eslintConfig;
