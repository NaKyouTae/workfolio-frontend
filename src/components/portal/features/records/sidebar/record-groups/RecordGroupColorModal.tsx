import React from 'react';
import { recordGroupColors } from '@/models/ColorModel';

interface RecordGroupColorModalProps {
    isOpen: boolean;
    currentColor: string;
    onColorSelect: (color: string) => void;
}

const RecordGroupColorModal: React.FC<RecordGroupColorModalProps> = ({
    isOpen,
    currentColor,
    onColorSelect,
}) => {
    if (!isOpen) return null;

    console.log('currentColor', currentColor);

    return (
        <div className="record-edit-color">
            {recordGroupColors.map((color) => (
                <button
                    key={color.hex}
                    onClick={() => onColorSelect(color.hex)}
                    style={{
                        backgroundColor: color.hex,
                    }}
                    className={currentColor === color.hex ? 'active' : ''}
                >
                    {currentColor === color.hex && (
                        <i className="ic-check" />
                    )}
                </button>
            ))}
        </div>
    );
};

export default RecordGroupColorModal;
