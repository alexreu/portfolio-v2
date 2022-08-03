import styles from "../../../styles/components/Button.module.css";
const Button = ({type, style, children}) => {
  return (
    <button className={`${styles.btn} ${styles[`btn-${type}`]} ${style}`}>
      {children}
    </button>
  )
}

export default Button;