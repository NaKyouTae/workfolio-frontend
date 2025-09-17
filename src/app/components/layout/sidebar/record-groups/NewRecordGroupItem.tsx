import React, { useState } from 'react';

interface NewRecordGroupItemProps {
    onSave: (title: string) => void;
    onCancel: () => void;
}

const NewRecordGroupItem = ({ onSave, onCancel }: NewRecordGroupItemProps) => {
    const [title, setTitle] = useState('');

    const handleSave = () => {
        if (title.trim()) {
            onSave(title.trim());
            setTitle('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="record-group-item">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flex: 1
            }}>
                <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: '2px solid #ccc',
                    backgroundColor: '#f8f9fa',
                    marginRight: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                </div>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={handleKeyPress}
                    onBlur={handleSave}
                    autoFocus
                    placeholder="새 기록장 이름"
                    style={{
                        flex: 1,
                        fontSize: '14px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        outline: 'none'
                    }}
                />
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={handleSave} style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: '#007bff'
                }}>
                    ✓
                </button>
                <button onClick={onCancel} style={{
                    background: 'none',
                    border: 'none',
                    padding: '4px',
                    cursor: 'pointer',
                    color: '#dc3545'
                }}>
                    ✕
                </button>
            </div>
        </div>
    );
};

export default NewRecordGroupItem;
