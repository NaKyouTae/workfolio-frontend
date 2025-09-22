import React, {useEffect, useState} from 'react'
import HttpMethod from "@/enums/HttpMethod"
import { DateUtil } from "@/utils/DateUtil"
import Dropdown, {IDropdown} from "@/components/ui/Dropdown"
import DateTimeInput from "@/components/ui/DateTimeInput"
import {RecordGroup, Record} from "@/generated/common"
import styles from './RecordCreateModal.module.css'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import dayjs from 'dayjs'
import { RecordUpdateRequest } from '@/generated/record'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    record: Record | null;
}

const RecordUpdateModal: React.FC<ModalProps> = ({ isOpen, onClose, record }) => {
    const [dropdownOptions, setDropdownOptions] = useState<IDropdown[]>([]);
    const [recordGroupId, setRecordGroupId] = useState<string>('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startedAt, setStartedAt] = useState(dayjs().toISOString());
    const [endedAt, setEndedAt] = useState(dayjs().add(1, 'day').toISOString());
    const [isAllDay, setIsAllDay] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    // store에서 triggerRecordRefresh 가져오기
    const { triggerRecordRefresh } = useRecordGroupStore();
    
    useEffect(() => {
        if (isOpen && record) {
            // 기존 레코드 데이터로 폼 초기화
            setTitle(record.title || '');
            setDescription(record.description || '');
            setStartedAt(record.startedAt ? dayjs(parseInt(record.startedAt.toString())).toISOString() : dayjs().toISOString());
            setEndedAt(record.endedAt ? dayjs(parseInt(record.endedAt.toString())).toISOString() : dayjs().add(1, 'day').toISOString());
            setRecordGroupId(record.recordGroup?.id || '');
            setIsAllDay(false); // 기본값으로 설정
            setSelectedFile(null);
        }
    }, [isOpen, record]);

    useEffect(() => {
        if (isOpen) {
            // RecordGroup 목록을 가져와서 드롭다운 옵션 생성
            const accessToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('accessToken='))
                ?.split('=')[1];
            
            if (accessToken) {
                // 로그인한 경우 - API에서 RecordGroup 목록 가져오기
                fetch('/api/record-groups/owned', { method: HttpMethod.GET })
                    .then(res => res.json())
                    .then(data => {
                        const groups = data.groups || [];
                        const options: IDropdown[] = groups.map((group: RecordGroup) => ({
                            value: group.id,
                            label: group.title
                        }));
                        setDropdownOptions(options);
                    })
                    .catch(error => {
                        console.error('Error fetching record groups:', error);
                        setDropdownOptions([]);
                    });
            } else {
                // 로그인하지 않은 경우 - 샘플 데이터 사용
                const sampleGroups = [
                    { id: '1', title: '업무' },
                    { id: '2', title: '개인' },
                    { id: '3', title: '학습' }
                ];
                const options: IDropdown[] = sampleGroups.map(group => ({
                    value: group.id,
                    label: group.title
                }));
                setDropdownOptions(options);
            }
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!record) return;

        try {
            const createRecordRequest: RecordUpdateRequest = {
                id: record.id,
                title: title,
                description: description,
                startedAt: DateUtil.parseToTimestamp(startedAt),
                endedAt: DateUtil.parseToTimestamp(endedAt),
            };

            const response = await fetch('/api/records', {
                method: HttpMethod.PUT,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createRecordRequest),
            });
            if (!response.ok) throw new Error('Failed to update record');
            
            // 레코드 수정 성공 시 store를 통해 새로고침 트리거
            triggerRecordRefresh();
            
            onClose();
        } catch (error) {
            console.error('Error updating record:', error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setSelectedFile(file);
    };

    if (!isOpen || !record) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>레코드 수정</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.modalForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="recordGroup">기록장</label>
                        <Dropdown
                            options={dropdownOptions}
                            selectedValue={recordGroupId}
                            onChange={(value) => setRecordGroupId(value)}
                            placeholder="기록장을 선택하세요"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="title">제목</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="description">설명</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.textarea}
                            rows={3}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            <input
                                type="checkbox"
                                checked={isAllDay}
                                onChange={(e) => setIsAllDay(e.target.checked)}
                            />
                            종일
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="startedAt">시작일시</label>
                        <DateTimeInput
                            value={startedAt}
                            onChange={setStartedAt}
                            isDisabled={isAllDay}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="endedAt">종료일시</label>
                        <DateTimeInput
                            value={endedAt}
                            onChange={setEndedAt}
                            isDisabled={isAllDay}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="file">첨부파일</label>
                        <input
                            type="file"
                            id="file"
                            onChange={handleFileChange}
                            className={styles.fileInput}
                        />
                        {selectedFile && (
                            <p className={styles.fileName}>{selectedFile.name}</p>
                        )}
                    </div>

                    <div className={styles.modalActions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>
                            취소
                        </button>
                        <button type="submit" className={styles.submitButton}>
                            수정
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordUpdateModal;
