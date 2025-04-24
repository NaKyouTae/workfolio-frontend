import React from 'react';

type RecordType = 'weekly' | 'monthly' | 'list';

interface RecordTypeButtonProps {
    selectedType: RecordType;
    onTypeChange: (type: RecordType) => void;
}

const RecordTypeButton: React.FC<RecordTypeButtonProps> = ({ selectedType, onTypeChange }) => {
    return (
        <div style={{
            display: 'flex',
            background: '#f5f5f5',
            borderRadius: '8px',
            padding: '4px',
            gap: '4px'
        }}>
            <button 
                onClick={() => onTypeChange('weekly')}
                style={{
                    padding: '6px 16px',
                    border: 'none',
                    background: selectedType === 'weekly' ? '#fff' : 'transparent',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: selectedType === 'weekly' ? '#000' : '#666',
                    cursor: 'pointer',
                    boxShadow: selectedType === 'weekly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
            >
                주간
            </button>
            <button 
                onClick={() => onTypeChange('monthly')}
                style={{
                    padding: '6px 16px',
                    border: 'none',
                    background: selectedType === 'monthly' ? '#fff' : 'transparent',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: selectedType === 'monthly' ? '#000' : '#666',
                    cursor: 'pointer',
                    boxShadow: selectedType === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
            >
                월간
            </button>
            <button 
                onClick={() => onTypeChange('list')}
                style={{
                    padding: '6px 16px',
                    border: 'none',
                    background: selectedType === 'list' ? '#fff' : 'transparent',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: selectedType === 'list' ? '#000' : '#666',
                    cursor: 'pointer',
                    boxShadow: selectedType === 'list' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                }}
            >
                목록
            </button>
        </div>
    );
};

export default RecordTypeButton; 