import React, { useRef } from 'react';
import styles from './ColorSelectModal.module.css';
import { useRecordGroupCreateStore } from '@/store/recordGroupCreateStore';
import { RecordGroupColor } from '@/enums/RecordGroupColor';


const COLORS = Object.values(RecordGroupColor); 

const ColorSelectModal: React.FC = ({}) => {
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
                            key={`modal-color-${color}-${index}`}
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
                                <span 
                                    key={`modal-checkmark-${color}-${index}`}
                                    className={styles.checkmark}
                                >
                                    ✓
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ColorSelectModal; 