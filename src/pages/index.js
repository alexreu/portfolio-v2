import styles from '../../styles/Index.module.css'
import Image from "next/image";
import backgroundImage from '../../public/images/bg-under-construction.jpeg';

const Index = () => {
    return (
        <section className="bg-test h-[1800px]">
            {/*<Image src={backgroundImage} layout='fill' objectFit='cover' objectPosition='center' style='-z-[9999] bg-fixed'/>*/}
            <h1 className="lgd:mb-4 font-medium text-[36px] sm:text-[46px] md:text-[64px] lg:text-[100px] xl:text-[120px] 2xl:text-[140px] lg:tracking-widest uppercase">Coming
                Soon !</h1>
            <p className="order-first text-[18px] md:text-[24px] lg:text-[48px] opacity-70 uppercase">site
                under reconstruction</p>
            <a href="mailto:contact@alexandreadolphe.com" aria-label="contact alexandre adolphe"
               className={styles.contactLink}>Contact</a>
        </section>
    )
}

export default Index;
