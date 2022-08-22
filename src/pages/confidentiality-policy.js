import { Heading } from "../components/Heading";
import Layout from "../components/Layout/Layout";
import { ThemeProvider } from "../modules/theme";
import { SectionWrapper } from "../components/SectionWrapper";
import { SectionHead } from "../components/SectionHead";
import { Button } from "../components/Button";
import { CookiesTable } from "../components/CookiesTable";

const confidentialityPolicy = () => {
    return (
        <SectionWrapper id="confidentialityPolicy" className="min-h-screen">
            <div className="container">
                <SectionHead title="Politique d'utilisation des cookies" />
                <span className="block w-full border border-white"></span>
                <Heading variant="h2" className="heading2 text-heading dark:text-white mt-10 mb-5">
                    Que sont les cookies ?
                </Heading>
                <p className="text-light">
                    Un cookie est un fichier qui est téléchargé sur votre terminal (ordinateur ou dispositif mobile)
                    dans le but de garder en mémoire des données qui pourront par la suite être mises à jour et
                    récupérées par l’entité responsable de leur installation. Les informations obtenues par le biais des
                    cookies peuvent comprendre l’adresse IP, la date et l’heure des visites effectuées sur le Site
                    Internet, les pages affichées, le temps que vous passez à consulter le Site Internet, ou encore les
                    sites visités juste avant et tout de suite après le nôtre.
                </p>
                <Heading variant="h2" className="heading2 text-heading dark:text-white mt-10 mb-5">
                    Type de cookies utilisés sur le site internet
                </Heading>
                <p className="text-light">
                    Sur notre Site Internet, nous utilisons le système de mesure d’audience Google Analytics. Ce système
                    de mesure est un outil d’analyse web de Google LLC. (ci-après « Google »), dont le siège est à 1600
                    Amphitheatre Parkway, Mountain View, Californie 94043 (États-Unis d’Amérique). Google Analytics nous
                    permet de savoir comment interagissent les utilisateurs de notre Site Internet. L’installation des
                    cookies analytiques propres à ce service et les fichiers de registre de notre serveur nous
                    permettent de connaître le nombre total d’utilisateurs qui visitent notre Site Internet et de savoir
                    quelles sont les sections du site les plus populaires. Tout cela nous permet d’obtenir des
                    informations qui peuvent nous aider à améliorer la navigation et à rendre un service de meilleure
                    qualité à nos utilisateurs et clients. Nous vous informons que le transfert international vers
                    Google est effectué en vertu de la conclusion des clauses contractuelles types adoptées par la
                    Commission européenne. Nous reproduisons ci-dessous la liste détaillée des cookies qui sont
                    installés par le service Google Analytics par le biais de notre Site Internet :
                </p>
                <CookiesTable
                    head={["Cookies", "Objet", "Durée"]}
                    content={[
                        {
                            cookie: "Google Analytics (_ga)",
                            object: `Utilisé pour identifier et distinguer un utilisateur. Ces cookies gardent en mémoire
                                    un identifiant client unique (ID client) qui est généré de façon aléatoire. Il est
                                    utilisé pour calculer les interactions des utilisateurs (visites, données concernant
                                    les utilisateurs, sessions et campagnes), afin d’optimiser les services qu’ils
                                    proposent.`,
                            duration: "2 ans",
                        },
                        {
                            cookie: "Google Analytics (_gid)",
                            object: "Utilisé pour identifier un même utilisateur au cours d’une seule et même journée.",
                            duration: "24 Heures",
                        },
                        {
                            cookie: "Google Analytics (_gat)",
                            object: `Utilisé pour faire la distinction entre les différents objets de suivi créés au
                                    cours de la session. Le cookie se met à jour chaque fois qu’il transmet les données
                                    à Google Analytics.`,
                            duration: "1 minute",
                        },
                    ]}
                />
                <Heading variant="h2" className="heading2 text-heading dark:text-white mt-10 mb-5">
                    Refus et révocation du consent
                </Heading>
                <p className="text-light">
                    Vous pouvez refuser l’utilisation des cookies sur ce site Internet et révoquer votre consentement en
                    utilisant l’outil indiqué ci-dessous:
                </p>
                <Button className="btn btn-default mt-5 text-grey-dark dark:text-white border-grey-light hover:text-white">
                    Configurateur des cookies
                </Button>
                <Heading variant="h2" className="heading2 mt-10 mb-5 text-heading dark:text-white">
                    Modification de la politique des cookies
                </Heading>
                <p className="text-light">
                    Il est possible que nous mettions à jour à l’avenir la Politique de Cookies de notre Site Internet.
                    C’est pourquoi nous vous recommandons de la consulter chaque fois que vous accédez à notre Site
                    Internet, afin de vous tenir informé comme il se doit de la façon dont nous utilisons les cookies,
                    et à quelles fins.
                </p>
                <Heading variant="h2" className="heading2 mt-10 mb-5 text-heading dark:text-white">
                    Contact
                </Heading>
                <p className="text-light">
                    Si vous avez des questions, des remarques ou des suggestions concernant la Politique de Cookies,
                    veuillez nous écrire à l’adresse suivante: privacy@garrigues.com.
                </p>
            </div>
        </SectionWrapper>
    );
};

confidentialityPolicy.getLayout = page => (
    <ThemeProvider>
        <Layout title="Politique de confidentialité">{page}</Layout>
    </ThemeProvider>
);

export default confidentialityPolicy;
