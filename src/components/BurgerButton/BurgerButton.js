const BurgerButton = ({onClick, type}) => {
    return (
        <button onClick={onClick} type={type} className="flex items-center relative lg:hidden p-1">
            <i className="bi bi-list text-[35px]" />
            <span className="sr-only">Ouvrir le menu</span>
        </button>
    )
}

export default BurgerButton;
