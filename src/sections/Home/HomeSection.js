import Button from "../../components/button";
import styles from "../../../styles/sections/HomeSection.module.css";

const HomeSection = () => {
    console.log(styles);
    return (
        <section className={styles.homeBackground}>
            <div className="container relative z-10">
                <h1 className="flex items-center flex-col text-white text-[58px] leading-[75px] font-montserrat font-black">
                    <span className="w-full">Alexandre Adolphe</span>
                    <span className="w-full text-primary">Developpeur JS.</span>
                </h1>
                <p className="mt-2.5 mb-7 text-[54px] text-white font-main leading-none">Situé à l'île de la Réunion</p>
                <span className="inline-flex w-full">Front end developpeur</span>
                <Button type="default" style="text-white hover:text-primary">Voir mon cv</Button>
            </div>
        </section>
    );
};

export default HomeSection;
