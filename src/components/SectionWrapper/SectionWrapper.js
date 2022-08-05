export const SectionWrapper = ({ type, className, children }) => {
    const sectionColor =
        type === "dark" ? "bg-white dark:bg-primary-darkest" : "bg-background-light dark:bg-background-dark-light";
    return <section className={`px-[80px] lg:py-[120px] ${sectionColor} ${className}`}>{children}</section>;
};
