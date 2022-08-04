import Heading from "../../components/heading/Heading";
import styles from "../../../styles/sections/HomeSection.module.css";

const HomeSection = () => {
    return (
        <section className={styles.homeBackground}>
            <div className="container relative z-10">
                <span className="inline-flex w-full mb-5 font-sub text-grey-light text-base uppercase opacity-70 tracking-[4px]">
                    Developpeur Front end
                </span>
                <Heading
                    variant="h1"
                    className="flex items-center flex-col text-white text-[58px] leading-[75px] font-montserrat font-black"
                >
                    <span className="w-full">Alexandre Adolphe</span>
                    <span className="w-full text-primary">Developpeur JS.</span>
                </Heading>
                <p className="mt-5 mb-7 text-[54px] text-white font-main leading-none">Situé à l'île de la Réunion.</p>
                <a href="#" className="btn btn-default text-white border-grey-light">
                    Voir mon cv
                </a>
            </div>
        </section>
    );
};

export default HomeSection;
