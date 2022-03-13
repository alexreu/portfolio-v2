import styles from '../../../styles/Navbar.module.css';

const Navbar = () => {
    return (
        <header role="banner">
            <div className="flex justify-center relative">
                <div className={styles.menuItem}>
                    <i className="bi-clock text-[24px]"/>
                </div>
            </div>
        </header>
    )
}

export default Navbar;
