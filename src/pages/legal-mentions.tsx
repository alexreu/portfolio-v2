import { ThemeProvider } from "../modules/theme";
import Layout from "../components/Layout/Layout";
import confidentialityPolicy from "./confidentiality-policy";

const legalMentions = () => {
    return <section className="h-screen bg-dark"></section>;
};

legalMentions.getLayout = page => (
    <ThemeProvider>
        <Layout title="Mentions légales">{page}</Layout>
    </ThemeProvider>
);
export default legalMentions;
