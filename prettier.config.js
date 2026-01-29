/** @type {import("prettier").Config} */
 
module.exports = {
    tabWidth: 4,
    endOfLine: "lf",
    trailingComma: "es5",
    printWidth: 120,
    arrowParens: "avoid",
    plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-classnames", "prettier-plugin-merge"],
    endingPosition: "absolute",
};
