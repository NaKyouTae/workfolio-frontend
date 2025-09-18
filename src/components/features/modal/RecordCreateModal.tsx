import React, {useEffect, useState} from 'react'
import HttpMethod from "@/enums/HttpMethod"
import { DateUtil } from "@/utils/DateUtil"
import Dropdown, {IDropdown} from "@/components/ui/Dropdown"
import DateTimeInput from "@/components/ui/DateTimeInput"
import {RecordGroup} from "@/generated/common"
import styles from './RecordCreateModal.module.css'
import { CreateRecordRequest } from '@/generated/record'
import dayjs from 'dayjs'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RecordCreateModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const defaultFormat: string = 'YYYY-MM-DD HH:mm:ss';
    const [dropdownOptions, setDropdownOptions] = useState<IDropdown[]>([]);
    const [recordGroupId, setRecordGroupId] = useState<string>('');
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [startedAt, setStartedAt] = useState(dayjs().format(defaultFormat));
    const [endedAt, setEndedAt] = useState(dayjs().add(1, 'day').format(defaultFormat));
    const [isAllDay, setIsAllDay] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setMemo('');
            setStartedAt(dayjs().format(defaultFormat));
            setEndedAt(dayjs().add(1, 'day').format(defaultFormat));
            setRecordGroupId('');
            setIsAllDay(false);
            setSelectedFile(null);
            
            const fetchRecordGroups = async () => {
                try {
                    const res = await fetch('/api/record-groups/editable', { method: HttpMethod.GET });
                    const data = await res.json();

                    if (data != null) {
                        // 중복된 ID를 제거하고 고유한 옵션만 생성
                        const uniqueGroups = data.groups.reduce((acc: RecordGroup[], current: RecordGroup) => {
                            const existingGroup = acc.find(group => group.id === current.id);
                            if (!existingGroup) {
                                acc.push(current);
                            }
                            return acc;
                        }, []);
                        
                        const options = uniqueGroups.map((res: RecordGroup) => ({
                            value: res.id,
                            label: res.title,
                            color: res.color
                        }));
                        setDropdownOptions(options);
                        setRecordGroupId(options[0]?.value);
                    }
                } catch (error) {
                    console.error('Error fetching record groups:', error);
                }
            };
            
            fetchRecordGroups();
        }
    }, [isOpen]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const createRecordRequest = CreateRecordRequest.create({
            startedAt: DateUtil.parseToTimestamp(startedAt),
            endedAt: DateUtil.parseToTimestamp(endedAt),
            recordGroupId: recordGroupId,
            title: title,
            memo: memo,
        });
            
        try {
            const response = await fetch('/api/records', {
                method: HttpMethod.POST,
                body: JSON.stringify(createRecordRequest),
            });
            if (!response.ok) throw new Error('Failed to create record');
            onClose();
        } catch (error) {
            console.error('Error creating record:', error);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };
    
    if (!isOpen) return null;
    
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>새 기록 추가</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>기록장</label>
                        <div className={styles.labelWithColor}>
                            <span 
                                className={styles.colorPipeline}
                                style={{
                                    backgroundColor: dropdownOptions.find(
                                        option => option.value === recordGroupId
                                    )?.color || '#ddd'
                                }}
                            />
                            <Dropdown 
                                selectedOption={recordGroupId} 
                                options={dropdownOptions} 
                                setValue={setRecordGroupId}
                            />
                        </div>
                        
                    </div>
                    <div className={styles.formGroup}>
                        <label>제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="텍스트 입력"
                            required
                        />
                    </div>
                    <div className={styles.dateTimeGroup}>
                        <label>일시</label>
                        <DateTimeInput 
                            value={startedAt} 
                            onChange={setStartedAt}
                            showTime={!isAllDay}
                            label="시작 시간"
                        />
                        <DateTimeInput 
                            value={endedAt} 
                            onChange={setEndedAt}
                            showTime={!isAllDay}
                            label="종료 시간"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.allDayCheckbox}>
                            <input
                                type="checkbox"
                                checked={isAllDay}
                                onChange={(e) => setIsAllDay(e.target.checked)}
                            />
                            하루 종일
                        </label>
                    </div>
                    <div className={styles.formGroup}>
                        <label>메모</label>
                        <textarea
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="텍스트를 입력해 주세요."
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>파일정보 <span className={styles.fileSize}>(최대 25MB)</span></label>
                        <div className={styles.fileUpload}>
                            <input
                                type="text"
                                readOnly
                                value={selectedFile?.name || ''}
                                placeholder="파일을 선택해 주세요."
                            />
                            <label className={styles.fileButton}>
                                파일 찾기
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.manageButton}>
                            기록장 관리
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            저장
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordCreateModal;
