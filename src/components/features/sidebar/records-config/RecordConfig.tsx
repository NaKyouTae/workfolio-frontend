import React from 'react';
import '@/styles/records-config.css';
import RecordManagement from './RecordManagement';
import RecordGroupManagement from './RecordGroupManagement';

interface RecordConfigProps {
    onClose: () => void;
}

const RecordConfig: React.FC<RecordConfigProps> = ({ onClose }) => {
    return (
        <div className="records-config">
            <div className="config-header">
                <h2>기록 설정</h2>
                <button className="close-btn" onClick={onClose}>
                    <i className="ic-close-24" />
                </button>
            </div>
            
            <div className="config-content">
                <RecordManagement />
                <RecordGroupManagement />
            </div>
        </div>
    );
};

export default RecordConfig;
