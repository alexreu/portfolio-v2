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
            main: ["Poppins", "sans-serif"],
            sub: ["Cookie", "sans-serif"],
            montserrat: ["Montserrat", "sans-serif"],
        },
        colors: {
            primary: "#FD4766",
            "primary-light": "#fff5f7",
            secondary: "#337DFF",
            "secondary-rgb": "rgba(253, 71, 102, 1)",
            tertiary: "#010001",
            dark: "#000000",
            heading: "#1f1f25",
            body: "rgba(29, 29, 36, 0.75)",
            gray: "rgba(29, 29, 36, 0.75)",
            midgray: "#e9ecef",
            "midgray-lighter": "#757575",
            light: "#E4E6EA",
            lighter: "#CED0D4",
            lightest: "#F0F2F5",
            border: "#E6E6E6",
            white: "#ffffff",
            darkest: "#161414",
            "dark-border": "rgba(255,255,255,0.2)",
            "dark-body": "rgba(198, 201, 216, 0.75)",
            "background-light": "#F9F9F9",
            "background-dark-light": "#191919",

            primary: "#FD4766",
            "primary-darkest": "#161414",
            "secondary-darkest": "#191919",
            black: "#1F1F25",
            "dark-body": "rgba(198, 201, 216, 0.75)",
            grey: "rgba(29,29,36,.75)",
            "grey-dark": "#191919",
            "grey-light": "#E6E6E6",
            white: "#ffffff",
            border: "#E6E6E6",
            "border-dark": "rgba(255,255,255,0.2)",
        },
        extend: {
            screens: {
                xsd: { max: "399px" },
                xs: "400px",
                smd: { max: "639px" },
                sm: "640px",
                mdd: { max: "767px" },
                md: "768px",
                lgd: { max: "1023px" },
                lg: "1024px",
                xld: { max: "1169px" },
                xl: "1170px",
                "2xld": { max: "1439px" },
                "2xl": "1440px",
                print: { raw: "print" },
            },
        },
    },
    plugins: [
        function ({ addComponents }) {
            addComponents({
                ".container": {
                    maxWidth: "100%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    paddingLeft: "1rem",
                    paddingRight: "1rem",
                    "@screen sm": {
                        maxWidth: "640px",
                    },
                    "@screen md": {
                        maxWidth: "768px",
                    },
                    "@screen lg": {
                        maxWidth: "1024px",
                    },
                    "@screen xl": {
                        maxWidth: "1170px",
                    },
                    "@screen 2xl": {
                        maxWidth: "1170px",
                    },
                },
            });
        },
    ],
};
