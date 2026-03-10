import React, {useEffect, useState, useMemo} from 'react'
import HttpMethod from "@workfolio/shared/enums/HttpMethod"
import { DateUtil } from "@workfolio/shared/utils/DateUtil"
import {IDropdown} from "@workfolio/shared/ui/Dropdown"
import {RecordGroup} from "@workfolio/shared/generated/common"
import { RecordCreateRequest } from '@workfolio/shared/generated/record'
import { useRecordGroupStore } from '@workfolio/shared/store/recordGroupStore'
import dayjs from 'dayjs'
import RecordForm, { RecordAttachment } from './RecordForm'
import { RecordTemplateType, getTemplate, buildDescriptionFromFields } from '../templates/recordTemplates'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate?: string | null;
    allRecordGroups: RecordGroup[];
    templateType?: RecordTemplateType;
}

const RecordCreateModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    selectedDate,
    allRecordGroups,
    templateType = 'free',
}) => {
    const template = getTemplate(templateType);

    const [recordGroupId, setRecordGroupId] = useState<string | undefined>(undefined);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startedAt, setStartedAt] = useState(dayjs().toISOString());
    const [endedAt, setEndedAt] = useState(dayjs().add(1, 'hour').toISOString());
    const [isAllDay, setIsAllDay] = useState(false);
    const [attachments, setAttachments] = useState<RecordAttachment[]>([]);
    const [templateFields, setTemplateFields] = useState<Record<string, string>>({});

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
        if (selectedDate && isOpen) {
            const selectedDateTime = dayjs(selectedDate);
            setStartedAt(selectedDateTime.toISOString());
            setEndedAt(selectedDateTime.add(30, 'minute').toISOString());
        }
    }, [selectedDate, isOpen]);

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

    useEffect(() => {
        if (isOpen) {
            setTitle(template.defaultTitle);
            setDescription('');
            setTemplateFields({});

            if (selectedDate) {
                const selectedDateTime = dayjs(selectedDate);
                setStartedAt(selectedDateTime.toISOString());
                setEndedAt(selectedDateTime.add(30, 'minute').toISOString());
            } else {
                if (template.isAllDay) {
                    const today = dayjs().startOf('day');
                    if (templateType === 'weekly_review') {
                        const monday = today.day(1);
                        const friday = today.day(5).endOf('day');
                        setStartedAt(monday.toISOString());
                        setEndedAt(friday.toISOString());
                    } else {
                        setStartedAt(today.toISOString());
                        setEndedAt(today.endOf('day').toISOString());
                    }
                } else {
                    const now = dayjs();
                    const currentHour = now.hour();
                    const startHour = currentHour >= 23 ? 22 : currentHour;
                    const endHour = startHour + 1;

                    const startTime = now.hour(startHour).minute(0).second(0);
                    const endTime = now.hour(endHour).minute(0).second(0);

                    setStartedAt(startTime.toISOString());
                    setEndedAt(endTime.toISOString());
                }
            }

            setRecordGroupId(dropdownOptions[0]?.value as string || undefined);
            setIsAllDay(template.isAllDay);
            setAttachments([]);
        }
    }, [isOpen, selectedDate, dropdownOptions, templateType, template]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalDescription = templateType !== 'free'
            ? buildDescriptionFromFields(template, templateFields)
            : description;

        const createRecordRequest = RecordCreateRequest.create({
            startedAt: DateUtil.parseToTimestamp(startedAt),
            endedAt: DateUtil.parseToTimestamp(endedAt),
            recordGroupId: recordGroupId || undefined,
            title: title || undefined,
            description: finalDescription || undefined,
            attachments: attachments.map(a => ({
                fileName: a.fileName,
                fileData: a.fileData as unknown as Uint8Array,
            })),
        });

        try {
            const response = await fetch('/api/records', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createRecordRequest),
            });
            if (!response.ok) throw new Error('Failed to create record');

            triggerRecordRefresh();
            onClose();
        } catch (error) {
            console.error('Error creating record:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-wrap">
                <div className="modal-tit">
                    <h2>{template.type === 'free' ? '기록 추가' : `${template.label} 추가`}</h2>
                    <button onClick={onClose}><i className="ic-close" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <RecordForm
                        recordGroupId={recordGroupId}
                        setRecordGroupId={setRecordGroupId}
                        recordGroupColor={dropdownOptions.find(
                            option => option.value === recordGroupId
                        )?.color || '#ddd'}
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
                        templateType={templateType}
                        templateFields={templateFields}
                        onTemplateFieldsChange={setTemplateFields}
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

export default RecordCreateModal;
