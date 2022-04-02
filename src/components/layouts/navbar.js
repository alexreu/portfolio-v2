import styles from '../../../styles/Navbar.module.css';
import {useEffect, useState} from "react";

const Navbar = () => {
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
            <li key={index} className="font-bold transition-200 hover:text-primary">
                <a href={`#${anchor}`} className="custom-underline inline-flex items-center h-full gap-x-4">
                    <span>{label}</span>
                    <i className={`bi bi-${icon}`}/>
                </a>
            </li>
            )
    });

    const [scroll, setScroll] = useState(false);

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

    return (
        <header role="banner" className={(scroll ? `${styles.headerSticky} transform fixed top-0 bg-grey-dark text-white transition-all duration-500 ease-in-out` : 'absolute top-0 text-black bg-transparent transition-200') + ' w-full' } >
            <nav role="navigation" aria-label="navigation-principal">
                <ul className="flex justify-center items-stretch gap-x-16 min-h-[80px] text-[22px]">
                    {navList}
                </ul>
            </nav>
        </header>
    )
}

export default Navbar;
