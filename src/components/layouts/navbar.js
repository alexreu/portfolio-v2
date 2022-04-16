import styles from '../../../styles/Navbar.module.css';
import {useEffect, useState} from "react";
import BurgerButton from "../burger-button";

const Navbar = () => {
    const [scroll, setScroll] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const scrollCheck = window.scrollY > 120;
            if (scrollCheck !== scroll) {
                setScroll(scrollCheck)
            }
        }

        const onWindowResize = () => {
            if(window.innerWidth >= 1024) {
                setOpenMenu(false);
            }
        }

        document.addEventListener("scroll", onScroll);
        window.addEventListener("resize", onWindowResize);

        return () => {
            document.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onWindowResize);
        }
    }, [scroll, openMenu])

    const handleToggleMenu = () => {
        setOpenMenu(!openMenu);
    }
    const navContent = [
        {label: 'Accueil', icon: 'house-door-fill', anchor: 'home'},
        {label: 'A propos', icon: 'question-circle-fill', anchor: 'about'},
        {label: 'Diplômes', icon: 'mortarboard-fill', anchor: 'graduations'},
        {label: 'Portfolio', icon: 'award-fill', anchor: 'portfolio'},
        {label: 'Contact', icon: 'send-fill', anchor: 'contact'},
    ]
    const navList = navContent.map((navItem, index) => {
        const {anchor, label, icon} = navItem
        return (
            <li key={index} className="lgd:py-3 lgd:w-full transition-200 hover:text-primary lgd:border-b border-grey-light">
                <a href={`#${anchor}`} className="custom-underline inline-flex items-center h-full gap-x-4">
                    <i className={`bi bi-${icon}`}/>
                    <span>{label}</span>
                </a>
            </li>
        )
    });


    return (
        <header role="banner"
                className={(scroll ? `${styles.headerSticky} fixed top-0 z-[9999] bg-white` : 'absolute top-0 bg-transparent') + ` lgd:flex items-center justify-end w-full lgd:min-h-[64px] lgd:px-8 transition-all duration-300 ease-in-out`}>
            <BurgerButton type="button" onClick={handleToggleMenu} />
            <nav role="navigation" aria-label="navigation-principal"
                 className={(openMenu ? 'lgd:w-screen lgd:translate-x-0' : 'lgd:w-0 lgd:-translate-x-full') + ` ${styles.mobilePopUp}`}>
                <ul className="flex lgd:flex-col lg:justify-center items-stretch lgd:gap-y-3 lg:gap-x-16 lgd:overflow-hidden lg:min-h-[80px] lgd:px-4 text-[22px] transition-200">
                    <li>
                        <button className='flex items-center justify-center lg:hidden ml-auto' onClick={handleToggleMenu}>
                            <i className="bi bi-x text-[35px]" />
                        </button>
                    </li>
                    {navList}
                </ul>
            </nav>
        </header>
    )
}

export default Navbar;
