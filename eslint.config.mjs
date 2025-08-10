// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
//   ...storybook.configs["flat/recommended"]
// ];

export default [
  // Next.js + TypeScript 권장 규칙 (기존 .eslintrc 기반을 flat으로 호환)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Storybook flat 권장 규칙
  ...storybook.configs["flat/recommended"],

  // 공통 설정(무시 경로/커스텀 룰)
  {
    ignores: ["**/node_modules/**", ".next/**", "dist/**", "coverage/**"],
    rules: {
      // 팀 선호에 맞게 필요한 최소한의 룰만
      "no-unused-vars": "warn",
    },
  },

  // 마지막에 prettier 추가(충돌 규칙 off)
  prettier,
];

// export default eslintConfig;
