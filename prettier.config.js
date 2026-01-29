/** @type {import("prettier").Config} */
module.exports = {
    semi: true,
    singleQuote: false,
    jsxSingleQuote: false,
    tabWidth: 4,
    useTabs: false,
    printWidth: 100,
    trailingComma: "all",
    endOfLine: "lf",
    arrowParens: "always",

    plugins: ["@ianvs/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],

    importOrder: [
        "^(react/(.*)$)|^(react$)",
        "^(next/(.*)$)|^(next$)",
        "<THIRD_PARTY_MODULES>",
        "",
        "^types$",
        "^@/types/(.*)$",
        "^@/config/(.*)$",
        "^@/lib/(.*)$",
        "^@/hooks/(.*)$",
        "^@/components/ui/(.*)$",
        "^@/components/(.*)$",
        "^@/app/(.*)$",
        "",
        "^[./]",
    ],
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    importOrderTypeScriptVersion: "5.0.0",
};
