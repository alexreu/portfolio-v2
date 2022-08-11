import Layout from "../components/Layout/Layout";
import "../../styles/globals.css";
import "../../styles/utilities.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ThemeProvider } from "../modules/theme";

function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </ThemeProvider>
    );
}

export default MyApp;
