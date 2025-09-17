import React from 'react';

type RecordType = 'weekly' | 'monthly' | 'list';

interface RecordTypeButtonProps {
    selectedType: RecordType;
    onTypeChange: (type: RecordType) => void;
}

const RecordTypeButton: React.FC<RecordTypeButtonProps> = ({ selectedType, onTypeChange }) => {
    return (
        <ul className="tab-style1">
            <li>
                <button 
                    onClick={() => onTypeChange('weekly')}
                    className={`${selectedType === 'weekly' ? 'active' : ''}`}
                >
                    주간
                </button>
            </li>
            <li>
                <button 
                    onClick={() => onTypeChange('monthly')}
                    className={`${selectedType === 'monthly' ? 'active' : ''}`}
                >
                    월간
                </button>
            </li>
            <li>
                <button 
                    onClick={() => onTypeChange('list')}
                    className={`${selectedType === 'list' ? 'active' : ''}`}
                >
                    목록
                </button>
            </li>
        </ul>
    );
};

export default RecordTypeButton; 