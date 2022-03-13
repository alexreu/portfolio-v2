import Layout from "../components/layouts/layout";
import '../../styles/globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

export default function MyApp({Component, pageProps}) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}
