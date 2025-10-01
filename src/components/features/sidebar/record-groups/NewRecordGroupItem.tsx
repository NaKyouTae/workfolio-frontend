import { RecordGroupColor } from '@/enums/RecordGroupColor';
import React, { useRef, useState, useEffect } from 'react';
import RecordGroupColorModal from './RecordGroupColorModal';

interface NewRecordGroupItemProps {
    placeholder: string;
    onSave: (title: string, color: string) => void;
    onCancel: () => void;
}

const NewRecordGroupItem = ({ placeholder, onSave, onCancel }: NewRecordGroupItemProps) => {
    const [title, setTitle] = useState<string | null>(null);
    const [showColorModal, setShowColorModal] = useState(false);
    const [color, setColor] = useState<string>(RecordGroupColor.RED);

    const modalRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLLIElement>(null);

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onCancel();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onCancel]);

    const handleSave = () => {
        if (title?.trim()) {
            console.log('Save', color);
            onSave(title.trim(), color);
            setTitle(null);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            console.log('Enter', color);
            handleSave();
        }
    };

    const handleColorSelect = (color: string) => {
        if (color) {
            setColor(color);
        }
    };

    return (
        <li ref={containerRef}>
            <div className="info">
                <input 
                    checked={true} 
                    type="checkbox" 
                    id={`new-group`} 
                    onChange={() => {}}
                />
                <label 
                    htmlFor={`new-group`}
                    style={{"--group-color": `${color}` } as React.CSSProperties} 
                >
                    <input
                        placeholder={placeholder}
                        type="text"
                        value={title || ''}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyPress}
                        autoFocus
                    />
                </label>
            </div>
            <div className="more">
                <button className="trans active" onClick={() => setShowColorModal(!showColorModal)}><i className="ic-more" /></button>
                {showColorModal && (
                    <div className="record-edit-modal-wrap" ref={modalRef}>
                        <RecordGroupColorModal
                            isOpen={showColorModal}
                            currentColor={color}
                            onColorSelect={handleColorSelect}
                            onClose={() => setShowColorModal(false)}
                            title="기록장 색상 변경"
                        />
                    </div>
                )}
            </div>
        </li>
    );
};

export default NewRecordGroupItem;
