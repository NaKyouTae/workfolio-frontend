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
    const [isComposing, setIsComposing] = useState(false);

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
            onSave(title.trim(), color);
            setTitle(null);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        // 한글 조합 중에는 Enter 키 이벤트 무시
        if (e.key === 'Enter' && !isComposing) {
            handleSave();
        }
    };

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
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
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
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
                        />
                    </div>
                )}
            </div>
        </li>
    );
};

export default NewRecordGroupItem;
