import React, { useRef } from 'react'
import Dropdown, { IDropdown } from "@workfolio/shared/ui/Dropdown"
import DateTimeInput from "@workfolio/shared/ui/DateTimeInput"
import { RecordTemplateType } from '../templates/recordTemplates'
import TemplateFields from '../templates/TemplateFields'

export interface RecordAttachment {
    fileName: string;
    fileData: string;
}

interface RecordFormProps {
    recordGroupId: string | undefined;
    setRecordGroupId: (id: string) => void;
    recordGroupColor: string;
    dropdownOptions: IDropdown[];
    title: string;
    setTitle: (title: string) => void;
    description: string;
    setDescription: (desc: string) => void;
    startedAt: string;
    setStartedAt: (date: string) => void;
    endedAt: string;
    setEndedAt: (date: string) => void;
    isAllDay: boolean;
    setIsAllDay: (val: boolean) => void;
    attachments: RecordAttachment[];
    onAttachmentsChange: (attachments: RecordAttachment[]) => void;
    templateType?: RecordTemplateType;
    templateFields?: Record<string, string>;
    onTemplateFieldsChange?: (fields: Record<string, string>) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xlsx', '.pptx', '.hwp', '.txt', '.png', '.jpg', '.jpeg', '.gif', '.webp'];
const ALLOWED_ACCEPT = ALLOWED_EXTENSIONS.join(',');

const uint8ArrayToBase64 = (bytes: Uint8Array): string => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
};

const RecordForm: React.FC<RecordFormProps> = ({
    recordGroupId,
    setRecordGroupId,
    recordGroupColor,
    dropdownOptions,
    title,
    setTitle,
    description,
    setDescription,
    startedAt,
    setStartedAt,
    endedAt,
    setEndedAt,
    isAllDay,
    setIsAllDay,
    attachments,
    onAttachmentsChange,
    templateType = 'free',
    templateFields = {},
    onTemplateFieldsChange,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isTemplateMode = templateType !== 'free' && onTemplateFieldsChange;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const oversizedFiles = fileArray.filter(f => f.size > MAX_FILE_SIZE);
        if (oversizedFiles.length > 0) {
            alert(`파일 크기는 10MB 이하만 가능합니다. (초과: ${oversizedFiles.map(f => f.name).join(', ')})`);
            e.target.value = '';
            return;
        }
        const invalidFiles = fileArray.filter(f => {
            const ext = '.' + f.name.split('.').pop()?.toLowerCase();
            return !ALLOWED_EXTENSIONS.includes(ext);
        });
        if (invalidFiles.length > 0) {
            alert(`허용되지 않는 파일 형식입니다. (${invalidFiles.map(f => f.name).join(', ')})\n허용: ${ALLOWED_EXTENSIONS.join(', ')}`);
            e.target.value = '';
            return;
        }

        const newAttachments: RecordAttachment[] = [];
        for (const file of Array.from(files)) {
            try {
                const uint8Array = await new Promise<Uint8Array>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const arrayBuffer = reader.result as ArrayBuffer;
                        resolve(new Uint8Array(arrayBuffer));
                    };
                    reader.onerror = () => reject(new Error('파일 읽기 실패'));
                    reader.readAsArrayBuffer(file);
                });
                newAttachments.push({
                    fileName: file.name,
                    fileData: uint8ArrayToBase64(uint8Array),
                });
            } catch (error) {
                console.error('파일 읽기 오류:', error);
            }
        }

        onAttachmentsChange([...attachments, ...newAttachments]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileRemove = (index: number) => {
        onAttachmentsChange(attachments.filter((_, i) => i !== index));
    };

    return (
        <div className="modal-cont">
            <ul className="record-info-input">
                <li>
                    <p>기록장</p>
                    <div className="record-select">
                        <div className="color" style={{
                            backgroundColor: recordGroupColor,
                        }}></div>
                        <Dropdown
                            options={dropdownOptions}
                            selectedOption={recordGroupId || ''}
                            setValue={(value) => setRecordGroupId(value as string)}
                        />
                    </div>
                </li>
                <li>
                    <p>제목</p>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </li>
                <li>
                    <p>시작 일시</p>
                    <DateTimeInput
                        value={startedAt}
                        onChange={setStartedAt}
                        showTime={!isAllDay}
                    />
                </li>
                <li>
                    <p>종료 일시</p>
                    <DateTimeInput
                        value={endedAt}
                        onChange={setEndedAt}
                        showTime={!isAllDay}
                    />
                </li>
                <li>
                    <input
                        type="checkbox"
                        checked={isAllDay}
                        onChange={(e) => setIsAllDay(e.target.checked)}
                        id="allday"
                    />
                    <label htmlFor="allday"><p>종일</p></label>
                </li>
                {isTemplateMode ? (
                    <TemplateFields
                        templateType={templateType}
                        templateFields={templateFields}
                        onTemplateFieldsChange={onTemplateFieldsChange!}
                    />
                ) : (
                    <li>
                        <p>메모</p>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </li>
                )}
                <li>
                    <p>첨부파일</p>
                    <label className="file">
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="file"
                            multiple
                            accept={ALLOWED_ACCEPT}
                            onChange={handleFileChange}
                        />
                        <input
                            type="text"
                            placeholder="파일을 선택해 주세요. (최대 10MB)"
                            readOnly
                            value={attachments.map(a => a.fileName).join(', ')}
                            onClick={() => fileInputRef.current?.click()}
                            style={{ cursor: 'pointer' }}
                        />
                        <button type="button" onClick={() => fileInputRef.current?.click()}>파일 찾기</button>
                    </label>
                    {attachments.length > 0 && (
                        <ul className="file-list">
                            {attachments.map((attachment, index) => (
                                <li key={index}>
                                    <p>{attachment.fileName}</p>
                                    <button type="button" onClick={() => handleFileRemove(index)}><i className="ic-delete"/></button>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default RecordForm;
