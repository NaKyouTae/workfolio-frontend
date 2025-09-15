import React from 'react';
import { RecordGroupColor } from '@/enums/RecordGroupColor';

interface ColorSelectModalProps {
    isOpen: boolean;
    currentColor: string;
    onColorSelect: (color: string) => void;
    onClose: () => void;
    title?: string;
}

const ColorSelectModal: React.FC<ColorSelectModalProps> = ({
    isOpen,
    currentColor,
    onColorSelect,
    onClose,
    title = "기록장 이름 변경"
}) => {
    if (!isOpen) return null;

    const colors = [
        { value: RecordGroupColor.RED, label: '빨강', hex: '#dc3545' },
        { value: RecordGroupColor.ORANGE, label: '주황', hex: '#fd7e14' },
        { value: RecordGroupColor.YELLOW, label: '노랑', hex: '#ffc107' },
        { value: RecordGroupColor.GREEN, label: '초록', hex: '#198754' },
        { value: RecordGroupColor.TEAL, label: '청록', hex: '#20c997' },
        { value: RecordGroupColor.BLUE, label: '파랑', hex: '#0d6efd' },
        { value: RecordGroupColor.INDIGO, label: '남색', hex: '#6610f2' },
        { value: RecordGroupColor.PURPLE, label: '보라', hex: '#6f42c1' },
        { value: RecordGroupColor.PINK, label: '분홍', hex: '#d63384' },
        { value: RecordGroupColor.GRAY, label: '회색', hex: '#6c757d' }
    ];

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '16px',
            minWidth: '280px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            border: '1px solid #dee2e6',
            position: 'relative'
        }}>
            <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#212529'
            }}>
                {title}
            </h3>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '6px',
                marginBottom: '12px'
            }}>
                {colors.map((color) => (
                    <button
                        key={color.value}
                        onClick={() => onColorSelect(color.value)}
                        style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: color.hex,
                            border: currentColor === color.value ? '2px solid #000' : '2px solid #dee2e6',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative'
                        }}
                    >
                        {currentColor === color.value && (
                            <span style={{
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}>
                                ✓
                            </span>
                        )}
                    </button>
                ))}
            </div>
            
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '6px'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        fontSize: '12px'
                    }}
                >
                    취소
                </button>
            </div>
        </div>
    );
};

export default ColorSelectModal;
