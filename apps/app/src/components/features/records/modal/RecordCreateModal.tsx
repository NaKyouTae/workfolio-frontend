import React, {useEffect, useState, useMemo, useCallback} from 'react'
import HttpMethod from "@workfolio/shared/enums/HttpMethod"
import { DateUtil } from "@workfolio/shared/utils/DateUtil"
import {IDropdown} from "@workfolio/shared/ui/Dropdown"
import {RecordGroup, RecordGroup_RecordGroupCategory} from "@workfolio/shared/generated/common"
import { RecordCreateRequest } from '@workfolio/shared/generated/record'
import { useRecordGroupStore } from '@workfolio/shared/store/recordGroupStore'
import dayjs from 'dayjs'
import RecordForm, { RecordAttachment } from './RecordForm'
import { RecordTemplateType, getTemplate, buildDescriptionFromFields, getTemplatesForCategory } from '../templates/recordTemplates'
import { useRouter } from 'next/navigation'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate?: string | null;
    allRecordGroups: RecordGroup[];
}

const RecordCreateModal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    selectedDate,
    allRecordGroups,
}) => {
    const router = useRouter();
    const [recordGroupId, setRecordGroupId] = useState<string | undefined>(undefined);
    const [templateType, setTemplateType] = useState<RecordTemplateType>('free');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startedAt, setStartedAt] = useState(dayjs().toISOString());
    const [endedAt, setEndedAt] = useState(dayjs().add(1, 'hour').toISOString());
    const [isAllDay, setIsAllDay] = useState(false);
    const [attachments, setAttachments] = useState<RecordAttachment[]>([]);
    const [templateFields, setTemplateFields] = useState<Record<string, string>>({});
    const [showSavedNudge, setShowSavedNudge] = useState(false);

    const { triggerRecordRefresh } = useRecordGroupStore();

    const getCategoryLabel = (category: RecordGroup_RecordGroupCategory) =>
        category === RecordGroup_RecordGroupCategory.PROJECT ? '프로젝트' : '일반';

    const dropdownOptions: IDropdown[] = useMemo(() =>
        allRecordGroups.map(group => ({
            value: group.id || '',
            label: `${group.title || ''} - ${getCategoryLabel(group.category)}`,
            color: group.color
        })), [allRecordGroups]
    );

    // Get selected record group's category
    const selectedGroup = useMemo(() =>
        allRecordGroups.find(g => g.id === recordGroupId),
        [allRecordGroups, recordGroupId]
    );

    const selectedCategory = selectedGroup?.category === RecordGroup_RecordGroupCategory.PROJECT
        ? 'PROJECT' as const
        : 'GENERAL' as const;

    const categoryLabel = selectedCategory === 'PROJECT' ? '프로젝트' : '일반';

    // Get available templates for the selected category
    const availableTemplates = useMemo(() =>
        getTemplatesForCategory(selectedCategory),
        [selectedCategory]
    );

    const templateDropdownOptions: IDropdown[] = useMemo(() =>
        availableTemplates.map(t => ({
            value: t.type,
            label: t.label,
        })), [availableTemplates]
    );

    // When record group changes, reset template to first available
    useEffect(() => {
        if (availableTemplates.length > 0) {
            const currentValid = availableTemplates.find(t => t.type === templateType);
            if (!currentValid) {
                setTemplateType(availableTemplates[0].type);
                setTemplateFields({});
            }
        }
    }, [availableTemplates, templateType]);

    const template = getTemplate(templateType);

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
            setTitle('');
            setDescription('');
            setTemplateFields({});

            if (selectedDate) {
                const selectedDateTime = dayjs(selectedDate);
                setStartedAt(selectedDateTime.toISOString());
                setEndedAt(selectedDateTime.add(30, 'minute').toISOString());
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

            setRecordGroupId(dropdownOptions[0]?.value as string || undefined);
            setIsAllDay(false);
            setAttachments([]);
            setShowSavedNudge(false);
        }
    }, [isOpen, selectedDate, dropdownOptions]);

    // When template changes, adjust isAllDay
    useEffect(() => {
        setIsAllDay(template.isAllDay);
        setTitle(template.defaultTitle);
        setTemplateFields({});
    }, [templateType, template]);

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
            templateType: templateType,
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
            setShowSavedNudge(true);
        } catch (error) {
            console.error('Error creating record:', error);
        }
    };

    const handleGoToResume = useCallback(() => {
        setShowSavedNudge(false);
        onClose();
        router.push('/careers');
    }, [onClose, router]);

    const handleCloseNudge = useCallback(() => {
        setShowSavedNudge(false);
        onClose();
    }, [onClose]);

    if (!isOpen) return null;

    if (showSavedNudge) {
        return (
            <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) handleCloseNudge(); }}>
                <div className="modal-wrap record-saved-nudge">
                    <div className="modal-tit">
                        <h2>기록 저장 완료</h2>
                        <button onClick={handleCloseNudge}><i className="ic-close" /></button>
                    </div>
                    <div className="record-saved-nudge-body">
                        <p className="record-saved-nudge-msg">이 기록이 이력서에 반영될 수 있어요</p>
                        <span className="record-saved-nudge-desc">쌓인 기록을 바탕으로 이력서를 업데이트해 보세요.</span>
                        <div className="modal-btn">
                            <button type="button" onClick={handleCloseNudge}>다음에 할게요</button>
                            <button type="button" className="btn-primary" onClick={handleGoToResume}>이력서에 반영하기</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="modal-wrap">
                <div className="modal-tit">
                    <h2>기록 추가</h2>
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
                        setTemplateType={setTemplateType}
                        templateDropdownOptions={templateDropdownOptions}
                        templateFields={templateFields}
                        onTemplateFieldsChange={setTemplateFields}
                        categoryLabel={categoryLabel}
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
