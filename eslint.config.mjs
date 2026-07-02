import { defineConfig } from "eslint/config";
import nextConfig from "eslint-config-next";

export default defineConfig([
  ...nextConfig,
  {
    ignores: [".next/**", ".open-next/**", "node_modules/**"],
  },
  {
    rules: {
      // クライアント専用状態（sessionStorage・pointer判定等）の初期化で使う
      // 意図的なパターンのため警告に留める
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);
