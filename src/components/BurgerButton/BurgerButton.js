const BurgerButton = ({onClick, style}) => {
    return (
        <button onClick={onClick} type="button" className={`flex items-center relative lg:hidden p-1 ${style}`}>
            <i className="bi bi-list text-[35px]" />
            <span className="sr-only">Ouvrir le menu</span>
        </button>
    )
}

export default BurgerButton;
