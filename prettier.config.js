/** @type {import("prettier").Config} */
// eslint-disable-next-line import/no-anonymous-default-export
module.exports = {
    tabWidth: 4,
    endOfLine: "lf",
    trailingComma: "es5",
    printWidth: 120,
    arrowParens: "avoid",
    plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-classnames", "prettier-plugin-merge"],
    endingPosition: "absolute-with-indent",
};
