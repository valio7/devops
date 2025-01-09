import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-irregular-whitespace": "error",
      "no-trailing-spaces": "error"
    }
  },
];