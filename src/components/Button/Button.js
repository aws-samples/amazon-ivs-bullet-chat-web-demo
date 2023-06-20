import styles from './Button.module.css';

export default function Button({
  onClick,
  additionalClassNames,
  children,
  ...inputProps
}) {
  return (
    <button
      className={`${styles.allButtons} ${additionalClassNames}`}
      onClick={onClick}
      type='button'
      {...inputProps}
    >
      {children}
    </button>
  );
}
