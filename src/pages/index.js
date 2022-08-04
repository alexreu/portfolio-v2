import styles from '../../styles/Index.module.css'
import Image from "next/image";
import backgroundImage from '../../public/images/bg-under-construction.jpeg';
import { ThemeContext } from '../modules/theme/ThemeContext';
import HomeSection from '../sections/Home/HomeSection';
import AboutSection from '../sections/About/AboutSection';

const Index = () => {
    return (
        <>
            <HomeSection />
            <AboutSection />
            {/* <section className="bg-test h-[50vh] lg:h-screen">
            </section> */}
            {/* <section className='bg-white dark:bg-secondary-darkest h-[900px]'>
            </section>
            <section className='bg-grey-light dark:bg-primary-darkest h-[900px]'>
            </section> */}
        </>
    )
}

export default Index;
