module.exports = {
    mode: "jit",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        fontFamily: {
            main: ['Roboto', 'sans-serif'],
        },
        extend: {},
    },
    plugins: [],
}
