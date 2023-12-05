import { getInitialTheme, ThemeProvider } from "../modules/theme";
import { Layout } from "../components/Layout";

const legalMentions = () => {
    return <section className="h-screen bg-dark"></section>;
};

legalMentions.getLayout = page => (
    <ThemeProvider initialTheme={getInitialTheme()}>
        <Layout title="Mentions légales">{page}</Layout>
    </ThemeProvider>
);
export default legalMentions;
