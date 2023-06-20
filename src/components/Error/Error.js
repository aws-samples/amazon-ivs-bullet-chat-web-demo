import styles from './Error.module.css';

export default function Error(props) {
  return (
    <div className={styles.errorMessage}>
      <img
        src='/images/warning-icon.svg'
        alt='Warning icon'
        className={styles.warningIcon}
      />
      <p>{props.message}</p>
    </div>
  );
}
