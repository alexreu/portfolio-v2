import styles from '../../../styles/Navbar.module.css';

const Navbar = () => {
    const navContent = ['Accueil','A propos', 'Diplômes', 'Portfolio', 'Contact']
    const navList = navContent.map((navItem, index) => (
        <li key={index} className="transition-all ease-in-out duration-200 hover:text-primary">
            <a href={'#'+navItem.toLowerCase()}>{navItem}</a>
        </li>
    ));
    return (
        <header role="banner">
            <nav role="navigation" aria-label="navigation-principal">
                <ul className="flex justify-center space-x-8 text-[22px]">
                    {navList}
                </ul>
            </nav>
        </header>
    )
}

export default Navbar;
