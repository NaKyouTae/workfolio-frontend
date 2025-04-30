import React, { useRef, useEffect } from 'react';
import styles from './ColorSelectModal.module.css';
import { useRecordGroupCreateStore } from '@/store/recordGroupCreateStore';
import { RecordGroupColor } from '@/enums/RecordGroupColor';

interface ColorSelectModalProps {}

const COLORS = Object.values(RecordGroupColor); 

const ColorSelectModal: React.FC<ColorSelectModalProps> = ({}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const { selectedColor, setSelectedColor } = useRecordGroupCreateStore();

    return (
        <div className={styles.modalOverlay} ref={modalRef}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>색상 선택</h2>
                </div>
                <div className={styles.colorGrid}>
                    {COLORS.map((color, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`${styles.colorButton} ${
                                selectedColor === color ? styles.selected : ''
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                                setSelectedColor(color);
                            }}
                        >
                            {selectedColor === color && (
                                <span className={styles.checkmark}>✓</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ColorSelectModal; 