import { defineConfig } from "steiger";
import fsd from "@feature-sliced/steiger-plugin";

export default defineConfig([
  ...fsd.configs.recommended,

  {
    files: ["./src/widgets/**"],
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },

  {
    files: ["./src/app/providers/**"],
    rules: {
      "fsd/segments-by-purpose": "off",
    },
  },

  {
  files: ["./src/features/auth/**"],
  rules: {
    "fsd/insignificant-slice": "off",
  },
},
]);