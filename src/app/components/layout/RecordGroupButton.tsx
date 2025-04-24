import React from 'react';

interface RecordGroupButtonProps {
    onClick: () => void;
}

const RecordGroupButton: React.FC<RecordGroupButtonProps> = ({
    onClick
}) => {
    return (
        <div className="record-group-button-container">
            <button onClick={onClick}>새 기록 추가</button>
        </div>
    );
};

export default RecordGroupButton; 