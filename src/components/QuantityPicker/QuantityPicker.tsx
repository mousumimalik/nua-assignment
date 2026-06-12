import styles from './QuantityPicker.module.scss';

interface QuantityPickerProps {
  value: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

export function QuantityPicker({
  value,
  max,
  disabled = false,
  onChange,
}: QuantityPickerProps) {
  const decrease = () => onChange(Math.max(1, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Quantity</span>
      <div className={`${styles.controls} ${disabled ? styles.disabled : ''}`}>
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={decrease}
          disabled={disabled || value <= 1}
        >
          −
        </button>
        <span className={styles.value} aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={increase}
          disabled={disabled || value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}
