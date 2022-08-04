function Button({ style, children, ...props }) {
  return (
    <button className={style} {...props}>
      {children}
    </button>
  );
}

export default Button;
