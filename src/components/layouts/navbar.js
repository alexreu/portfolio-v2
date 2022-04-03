import styles from '../../../styles/Navbar.module.css';
import {useEffect, useState} from "react";

const Navbar = () => {
    const [scroll, setScroll] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const scrollCheck = window.scrollY > 120;
            if(scrollCheck !== scroll) {
                setScroll(scrollCheck)
            }
        }
        document.addEventListener("scroll", onScroll);
        return () => document.removeEventListener("scroll", onScroll)
    }, [scroll])

    const handleToggleMenu = () => {
        setOpenMenu(!openMenu);
    }
    const navContent = [
        {label: 'Accueil', icon: 'house-door-fill', anchor:'home'},
        {label: 'A propos', icon: 'question-circle-fill', anchor:'about'},
        {label: 'Diplômes', icon: 'mortarboard-fill', anchor:'graduations'},
        {label: 'Portfolio', icon: 'award-fill', anchor:'portfolio'},
        {label: 'Contact', icon: 'send-fill', anchor:'contact'},
    ]
    const navList = navContent.map((navItem, index) => {
        const {anchor, label, icon} = navItem
        return (
            <li key={index} className="lgd:w-full transition-200 hover:text-primary">
                <a href={`#${anchor}`} className="custom-underline inline-flex items-center h-full gap-x-4">
                    <span>{label}</span>
                    <i className={`bi bi-${icon}`}/>
                </a>
            </li>
            )
    });



    return (
        <header role="banner" className={(scroll ? `${styles.headerSticky} fixed top-0 z-[9999] bg-white` : 'absolute top-0 bg-transparent') + ` w-full transition-all duration-300 ease-in-out` } >
            <button className='lg:hidden' onClick={handleToggleMenu}>Open Menu</button>
            <nav role="navigation" aria-label="navigation-principal" className={(openMenu ? 'lgd:w-screen lgd:translate-x-0': 'lgd:w-0 lgd:-translate-x-full') + ` ${styles.mobilePopUp}`}>
                <ul className={"lg:flex justify-center items-stretch gap-x-16 lg:min-h-[80px] text-[22px] transition-200"}>
                    <li>
                        <button className='lg:hidden' onClick={handleToggleMenu}>Close Menu</button>
                    </li>
                    {navList}
                </ul>
            </nav>
        </header>
    )
}

export default Navbar;
