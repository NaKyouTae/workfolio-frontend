import { RecordGroupColor } from '@/enums/RecordGroupColor';
import React, { useState } from 'react';

interface NewRecordGroupItemProps {
    placeholder: string;
    onSave: (title: string) => void;
    onCancel: () => void;
}

const NewRecordGroupItem = ({ placeholder, onSave, onCancel }: NewRecordGroupItemProps) => {
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
        <li>
            <div className="info">
                <input 
                    checked={true} 
                    type="checkbox" 
                    id={`new-group`} 
                    onChange={() => {}}
                />
                <label 
                    htmlFor={`new-group`}
                    style={{"--group-color": `${RecordGroupColor.RED}` } as React.CSSProperties} 
                >
                    <input
                        placeholder={placeholder}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onBlur={handleSave}
                        autoFocus
                    />
                </label>
            </div>
            <div className="more">
                <button className="trans active" style={{ color: '#fff' }} onClick={handleSave}><i className="ic-check" /></button>
                <button className="trans" style={{ color: '#fff' }} onClick={onCancel}><i className="ic-close" /></button>
            </div>
        </li>
    );
};

export default NewRecordGroupItem;
