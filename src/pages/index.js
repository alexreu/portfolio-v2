import styles from '../../styles/Index.module.css'

export default function Index() {
    return (
        <section className="flex items-center justify-center mx-auto ">
            <div className="container flex flex-col items-center mx-auto text-center">
                <h2 className="lgd:mb-4 font-medium text-[36px] sm:text-[46px] md:text-[64px] lg:text-[100px] xl:text-[120px] 2xl:text-[140px] lg:tracking-widest text-white uppercase">Coming
                    Soon !</h2>
                <p className="order-first text-[18px] md:text-[24px] lg:text-[48px] text-white opacity-70 uppercase">site under reconstruction</p>
                <a href="mailto:contact@alexandreadolphe.com" aria-label="contact alexandre adolphe" className={styles.contactLink}>Contact</a>
            </div>
        </section>
    )
}
