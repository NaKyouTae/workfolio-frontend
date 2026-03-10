import React, { useEffect, useRef, useState } from 'react'
import { Record } from '@workfolio/shared/generated/common'
import dayjs from 'dayjs'
import { DateUtil } from '@workfolio/shared/utils/DateUtil';
import { isLoggedIn } from '@workfolio/shared/utils/authUtils';
import LoginModal from '@workfolio/shared/ui/LoginModal';
import { detectTemplateType, getTemplate, parseDescriptionToFields } from '../templates/recordTemplates';

interface RecordDetailProps {
    isOpen: boolean;
    onClose: () => void;
    record: Record | null;
    onEdit?: () => void;
    onDelete?: () => void;
    position?: {
        top: number;
        left?: number;
        right?: number;
        width: number;
    };
}

const RecordDetail: React.FC<RecordDetailProps> = ({ 
    isOpen, 
    onClose, 
    record, 
    onEdit, 
    onDelete,
    position
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const format = 'YYYY. MM. DD. A hh:mm';
    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // ESC 키 감지
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !record) return null;

    // 시작일과 종료일이 같은지 확인
    const isSameDay = () => {
        if (!record.startedAt || !record.endedAt) return false;
        const startDate = dayjs(record.startedAt);
        const endDate = dayjs(record.endedAt);
        return startDate.isSame(endDate, 'day');
    };

    // 시간 범위 포맷팅
    const getTimeRange = () => {
        if (!record.startedAt || !record.endedAt) return '';
        
        if (isSameDay()) {
            return `${DateUtil.formatTimestamp(record.startedAt, format)} ~ ${DateUtil.formatTimestamp(record.endedAt, format)}`;
        } else {
            return `${DateUtil.formatTimestamp(record.startedAt, format)} ~ ${DateUtil.formatTimestamp(record.endedAt, format)}`;
        }
    };

    // 템플릿 감지
    const templateType = detectTemplateType(record.description || '');
    const template = getTemplate(templateType);
    const isTemplateMode = templateType !== 'free';
    const templateFieldValues = isTemplateMode
        ? parseDescriptionToFields(template, record.description || '')
        : {};

    // 설명 텍스트를 줄바꿈으로 분리하여 렌더링
    const renderText = (text: string) => {
        return text.split('\n').map((line, index, arr) => (
            <span key={index}>
                {line}
                {index < arr.length - 1 && <br />}
            </span>
        ));
    };

    return (
        <div 
            className="record-modal-wrap"
            ref={containerRef}
            style={position ? {
                top: position.top,
                ...(position.left !== undefined && { left: position.left }),
                ...(position.right !== undefined && { right: position.right }),
                zIndex: 1000
            } : {}}
        >
            <div className="record-modal-tit">
                <div>
                    <div style={{ backgroundColor: record.recordGroup?.color || '#e0e0e0' }}></div>
                    <h2>{record.title}</h2>
                </div>
                <button onClick={onClose}><i className="ic-close" /></button>
            </div>
            <div className="record-modal-cont">
                <ul className="record-info">
                    <li><span>일시</span><p>{getTimeRange()}</p></li>
                    {record.description && (
                        isTemplateMode ? (
                            template.fields
                                .filter(field => templateFieldValues[field.key]?.trim())
                                .map(field => (
                                    <li key={field.key}>
                                        <span>{field.label}</span>
                                        <p>{renderText(templateFieldValues[field.key])}</p>
                                    </li>
                                ))
                        ) : (
                            <li>
                                <span>메모</span>
                                <p>{renderText(record.description)}</p>
                            </li>
                        )
                    )}
                    {/* {record.recordGroup && (
                        <li>
                            <span>기록장</span>
                            <p className={styles.value}>
                                <div 
                                    style={{ backgroundColor: record.recordGroup.color || '#e0e0e0' }}
                                ></div>
                                {record.recordGroup.title}
                            </p>
                        </li>
                    )} */}
                </ul>
            </div>
            <div className="record-modal-btn">
                <button className="xsm line gray" onClick={() => {
                    if (!isLoggedIn()) {
                        setShowLoginModal(true);
                        return;
                    }
                    onEdit?.();
                }}>수정</button>
                <button className="xsm semi-gray" onClick={() => {
                    if (!isLoggedIn()) {
                        setShowLoginModal(true);
                        return;
                    }
                    onDelete?.();
                }}>삭제</button>
            </div>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
};

export default RecordDetail;