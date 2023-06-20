import styles from './TextInput.module.css';
import { useEffect, useState } from 'react';

export default function TextInput({
  children,
  onChange,
  defaultValue,
  error,
  additionalClassNames,
  clearInput,
  ...inputProps
}) {
  const [value, setValue] = useState(defaultValue || '');

  const handleChange = (e) => {
    onChange(e.target.value);
    setValue(e.target.value);
  };

  const clearValue = () => setValue('');

  useEffect(() => {
    if (clearInput) clearInput.current = clearValue;
  }, []);

  return (
    <div className={styles.inputContainer}>
      <input
        onChange={handleChange}
        className={
          error
            ? `${styles.errorInput} ${styles.input} ${additionalClassNames}`
            : `${styles.input} ${additionalClassNames}`
        }
        value={value}
        {...inputProps}
      />
    </div>
  );
}
