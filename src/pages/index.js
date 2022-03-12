import styles from '../../styles/Index.module.css'

export default function Index() {
  return (
     <section className="h-screen w-screen overflow-hidden bg-[url('/images/bg-under-construction.jpeg')] bg-no-repeat bg-cover">
         <div className="flex items-center justify-center h-full mx-auto bg-black bg-opacity-70">
             <div className="container mx-auto text-center">
                 <h2 className="mb-4 font-medium text-[36px] md:text-[64px] lg:text-[100px] xl:text-[150px] text-white uppercase">Coming Soon !</h2>
                 <p className="font-light text-white text-[18px] md:text-[20px] xl:text-[28px]">I am currently working on my new website</p>
                 <p className="font-light text-white text-[18px] md:text-[20px] xl:text-[28px]">I will be here soon, if you want to contact me click on "Contact" ! See you soon !</p>
                 <a href="mailto:contact@alexandreadolphe.com" aria-label="contact Alexandre ADOLPHE" className={styles.contactLink}>Contact</a>
             </div>
         </div>
     </section>
  )
}
