import React, { useState } from 'react';
import Image from 'next/image';

interface RecordGroupMiddleProps {
    title: string;
}

const RecordGroupMiddle: React.FC<RecordGroupMiddleProps> = ({
    title
}) => {
    const [isChecked, setIsChecked] = useState(false);
    
    const onToggle = () => {
        alert(`${title} 기능 붙여야됨`);
        setIsChecked(!isChecked);
    }

    return (
        <div className="record-group-header-container">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1,
                cursor: 'pointer'
            }} onClick={onToggle}>
                <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '2px solid #FFCB42',
                    backgroundColor: '#FFCB42',
                    marginRight: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {isChecked && (
                        <Image
                            src="/ic-check.png"
                            alt="Toggle groups"
                            width={8}
                            height={6}
                        />
                    )}
                </div>
                <div style={{ fontSize: '14px' }}>{title}</div>
            </div>
            <Image
                src="/ic-set.png"
                alt='설정'
                width={16}
                height={16}
                style={{ cursor: 'pointer' }}
            />
        </div>
    );
};

export default RecordGroupMiddle; 