import React, {useEffect, useState, useMemo} from 'react'
import HttpMethod from "@workfolio/shared/enums/HttpMethod"
import { DateUtil } from "@workfolio/shared/utils/DateUtil"
import {IDropdown} from "@workfolio/shared/ui/Dropdown"
import {Record, RecordGroup} from "@workfolio/shared/generated/common"
import { useRecordGroupStore } from '@workfolio/shared/store/recordGroupStore'
import dayjs from 'dayjs'
import { RecordUpdateRequest } from '@workfolio/shared/generated/record'
import RecordForm, { RecordAttachment } from './RecordForm'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    record: Record | null;
    allRecordGroups: RecordGroup[];
}

const RecordUpdateModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    record,
    allRecordGroups,
}) => {
    const [recordGroupId, setRecordGroupId] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startedAt, setStartedAt] = useState(dayjs().toISOString());
    const [endedAt, setEndedAt] = useState(dayjs().add(1, 'hour').toISOString());
    const [isAllDay, setIsAllDay] = useState(false);
    const [attachments, setAttachments] = useState<RecordAttachment[]>([]);

    const { triggerRecordRefresh } = useRecordGroupStore();

    const dropdownOptions: IDropdown[] = useMemo(() =>
        allRecordGroups.map(group => ({
            value: group.id || '',
            label: group.title || '',
            color: group.color
        })), [allRecordGroups]
    );

    useEffect(() => {
        if (isAllDay) {
            const startDate = dayjs(startedAt).startOf('day').toISOString();
            const endDate = dayjs(endedAt).endOf('day').toISOString();
            setStartedAt(startDate);
            setEndedAt(endDate);
        }
    }, [isAllDay, startedAt, endedAt]);

    useEffect(() => {
        if (isOpen && record) {
            setTitle(record.title || '');
            setDescription(record.description || '');
            setStartedAt(record.startedAt ? dayjs(parseInt(record.startedAt.toString())).toISOString() : dayjs().toISOString());
            setEndedAt(record.endedAt ? dayjs(parseInt(record.endedAt.toString())).toISOString() : dayjs().add(1, 'hour').toISOString());
            setRecordGroupId(record.recordGroup?.id || '');
            setIsAllDay(false);
            setAttachments([]);
        }
    }, [isOpen, record]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!record) return;

        try {
            const updateRecordRequest: RecordUpdateRequest = {
                id: record.id,
                title: title,
                description: description,
                attachments: attachments.map(a => ({
                    fileName: a.fileName,
                    fileData: a.fileData as unknown as Uint8Array,
                })),
                startedAt: DateUtil.parseToTimestamp(startedAt),
                endedAt: DateUtil.parseToTimestamp(endedAt),
                recordGroupId: recordGroupId || '',
            };

            const response = await fetch(`/api/records`, {
                method: HttpMethod.PUT,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateRecordRequest),
            });
            if (!response.ok) throw new Error('Failed to update record');

            triggerRecordRefresh();
            onClose();
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    if (!isOpen || !record) return null;

    return (
        <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-wrap">
                <div className="modal-tit">
                    <h2>기록 수정</h2>
                    <button onClick={onClose}><i className="ic-close" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <RecordForm
                        recordGroupId={recordGroupId}
                        setRecordGroupId={setRecordGroupId}
                        recordGroupColor={allRecordGroups.find(g => g.id === recordGroupId)?.color || record.recordGroup?.color || '#e0e0e0'}
                        dropdownOptions={dropdownOptions}
                        title={title}
                        setTitle={setTitle}
                        description={description}
                        setDescription={setDescription}
                        startedAt={startedAt}
                        setStartedAt={setStartedAt}
                        endedAt={endedAt}
                        setEndedAt={setEndedAt}
                        isAllDay={isAllDay}
                        setIsAllDay={setIsAllDay}
                        attachments={attachments}
                        onAttachmentsChange={setAttachments}
                    />
                    <div className="modal-btn">
                        <button type="button" onClick={onClose}>취소</button>
                        <button type="submit">저장</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordUpdateModal;
