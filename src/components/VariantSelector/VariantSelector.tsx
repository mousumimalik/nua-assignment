import type { ColorOption, Size, SizeOption } from '../../types';
import styles from './VariantSelector.module.scss';

interface VariantSelectorProps {
  colors: ColorOption[];
  sizes: SizeOption[];
  selectedColorId: string;
  selectedSize: Size;
  onColorChange: (colorId: string) => void;
  onSizeChange: (size: Size) => void;
}

function getSizeLabel(status: SizeOption['status'], stock: number): string {
  if (status === 'sold-out') return 'Sold out';
  if (status === 'low') return `Low stock (${stock})`;
  return 'Available';
}

export function VariantSelector({
  colors,
  sizes,
  selectedColorId,
  selectedSize,
  onColorChange,
  onSizeChange,
}: VariantSelectorProps) {
  return (
    <div className={styles.wrapper}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Colour</legend>
        <div className={styles.swatches}>
          {colors.map((color) => {
            const isSelected = color.id === selectedColorId;
            const isLight = color.id === 'white' || color.id === 'beige';

            return (
              <button
                key={color.id}
                type="button"
                className={`${styles.swatch} ${isSelected ? styles.selected : ''} ${isLight ? styles.light : ''}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => onColorChange(color.id)}
                aria-label={`Colour ${color.name}`}
                aria-pressed={isSelected}
                title={color.name}
              />
            );
          })}
        </div>
        <p className={styles.selectedLabel}>
          {colors.find((color) => color.id === selectedColorId)?.name}
        </p>
      </fieldset>

      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Size</legend>
        <div className={styles.sizes}>
          {sizes.map((sizeOption) => {
            const isSelected = sizeOption.size === selectedSize;
            const statusClass = styles[sizeOption.status.replace('-', '')];

            return (
              <button
                key={sizeOption.size}
                type="button"
                className={`${styles.sizeButton} ${isSelected ? styles.selected : ''} ${statusClass}`}
                onClick={() => onSizeChange(sizeOption.size)}
                disabled={sizeOption.status === 'sold-out'}
                aria-pressed={isSelected}
                aria-label={`Size ${sizeOption.size}, ${getSizeLabel(sizeOption.status, sizeOption.stock)}`}
              >
                <span className={styles.sizeLabel}>{sizeOption.size}</span>
                {sizeOption.status !== 'available' && (
                  <span className={styles.sizeStatus}>
                    {sizeOption.status === 'sold-out' ? 'Sold out' : `${sizeOption.stock} left`}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
