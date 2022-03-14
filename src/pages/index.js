import styles from '../../styles/Index.module.css'

const Index = () => {
    return (
        <section className="container flex flex-col items-center justify-center mx-auto text-center landscape:lgd:mt-4">
            <h1 className="lgd:mb-4 font-medium text-[36px] sm:text-[46px] md:text-[64px] lg:text-[100px] xl:text-[120px] 2xl:text-[140px] lg:tracking-widest text-white uppercase">Coming
                Soon !</h1>
            <p className="order-first text-[18px] md:text-[24px] lg:text-[48px] text-white opacity-70 uppercase">site
                under reconstruction</p>
            <a href="mailto:contact@alexandreadolphe.com" aria-label="contact alexandre adolphe"
               className={styles.contactLink}>Contact</a>
        </section>
    )
}

export default Index;
