module.exports = {
    mode: "jit",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
        "./src/sections/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        container: {
            center: true,
        },
        fontFamily: {
            main: ['Poppins', 'sans-serif'],
            montserrat: ['Montserrat', 'sans-serif'],
            sub: ['Cookie', 'sans-serif'],
        },
        colors: {
            primary: '#FD4766',
            'primary-darkest': '#161414',
            'secondary-darkest': '#191919',
            black: '#1F1F25',
            'grey-dark': '#191919',
            'grey-light': '#E6E6E6',
            white: '#ffffff',
        },
        extend: {
            screens: {
                xsd: {max: "399px"},
                xs: "400px",
                smd: {max: "639px"},
                sm: "640px",
                mdd: {max: "767px"},
                md: "768px",
                lgd: {max: "1023px"},
                lg: "1024px",
                xld: {max: "1169px"},
                xl: "1170px",
                '2xld': {max: '1439px'},
                '2xl': '1440px',
                print: {raw: "print"},
            },
        },
    },
    plugins: [],
}
