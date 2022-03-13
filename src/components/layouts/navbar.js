import Link from 'next/link';

const Navbar = () => {
    return (
        <header role="banner">
            <nav role="navigation">
                <Link href="/">
                    <a className="text-white text-[14px] font-bold uppercase"><span className="opacity-50">{'<'}</span> Alex <span className="opacity-50">{'/>'}</span></a>
                </Link>
            </nav>
        </header>
    )
}

export default Navbar;
