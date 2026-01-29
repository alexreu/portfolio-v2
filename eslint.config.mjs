import { createRequire } from "module";

const require = createRequire(import.meta.url);
const nextConfig = require("eslint-config-next/core-web-vitals");
const prettierConfig = require("eslint-config-prettier");

const config = [
    {
        ignores: [".next/", "node_modules/", "studio/", "public/studio/"],
    },
    ...nextConfig,
    prettierConfig,
];

export default config;
