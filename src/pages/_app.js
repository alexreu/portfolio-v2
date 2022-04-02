import Layout from "../components/layouts/layout";
import '../../styles/globals.css';
import '../../styles/utilities.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

const MyApp = ({Component, pageProps}) => {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    )
}

export default MyApp;
