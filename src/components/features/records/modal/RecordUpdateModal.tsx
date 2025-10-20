import React, {useEffect, useState, useMemo} from 'react'
import HttpMethod from "@/enums/HttpMethod"
import { DateUtil } from "@/utils/DateUtil"
import Dropdown, {IDropdown} from "@/components/ui/Dropdown"
import DateTimeInput from "@/components/ui/DateTimeInput"
import {Record, RecordGroup, Company} from "@/generated/common"
import { useRecordGroupStore } from '@/store/recordGroupStore'
import dayjs from 'dayjs'
import { RecordUpdateRequest } from '@/generated/record'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete?: () => void;
    record: Record | null;
    allRecordGroups: RecordGroup[];
    companiesData: {
        companies: Company[];
        isLoading: boolean;
        refreshCompanies: () => void;
    };
}

const RecordUpdateModal: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    onDelete, 
    record, 
    allRecordGroups,
    companiesData
}) => {
    const [recordGroupId, setRecordGroupId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [startedAt, setStartedAt] = useState(dayjs().toISOString());
    const [endedAt, setEndedAt] = useState(dayjs().add(1, 'hour').toISOString());
    const [isAllDay, setIsAllDay] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [companyId, setCompanyId] = useState<string | null>(null);

    // store에서 triggerRecordRefresh 가져오기
    const { triggerRecordRefresh } = useRecordGroupStore();
    
    // props로 받은 companiesData 사용
    const { companies, refreshCompanies } = companiesData;
    
    // record groups를 dropdown options로 변환
    const dropdownOptions: IDropdown[] = useMemo(() => 
        allRecordGroups.map(group => ({
            value: group.id || '',
            label: group.title || '',
            color: group.color
        })), [allRecordGroups]
    );
    
    // companies를 dropdown options로 변환
    const companyOptions: IDropdown[] = useMemo(() => 
        companies.map(company => ({
            value: company.id || '',
            label: company.name || ''
        })), [companies]
    );

    // isAllDay 변경 시 시간 고정 로직
    useEffect(() => {
        if (isAllDay) {
            // 하루 종일이면 시작 시간을 00:00:00으로, 종료 시간을 23:59:59로 설정
            const startDate = dayjs(startedAt).startOf('day').toISOString();
            const endDate = dayjs(endedAt).endOf('day').toISOString();
            setStartedAt(startDate);
            setEndedAt(endDate);
        }
    }, [isAllDay, startedAt, endedAt]);
    
    useEffect(() => {
        if (isOpen && record) {
            // 기존 레코드 데이터로 폼 초기화
            setTitle(record.title || '');
            setDescription(record.description || '');
            setStartedAt(record.startedAt ? dayjs(parseInt(record.startedAt.toString())).toISOString() : dayjs().toISOString());
            setEndedAt(record.endedAt ? dayjs(parseInt(record.endedAt.toString())).toISOString() : dayjs().add(1, 'hour').toISOString());
            setRecordGroupId(record.recordGroup?.id || '');
            setIsAllDay(false); // 기본값으로 설정
            setSelectedFile(null);
        }
    }, [isOpen, record]);

    useEffect(() => {
        if (isOpen) {
            setCompanyId(record?.company?.id || '');
            refreshCompanies();
        }
    }, [isOpen, record, refreshCompanies]);

    // ESC 키 이벤트 처리
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
            const createRecordRequest: RecordUpdateRequest = {
                id: record.id,
                title: title,
                description: description,
                companyId: companyId || undefined,
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
        <div className="modal">
            <div className="modal-wrap">
                <div className="modal-tit">
                    <h2>기록 수정</h2>
                    <button onClick={onClose}><i className="ic-close" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-cont">
                        <ul className="record-info-input">
                            <li>
                                <p>기록장</p>
                                <div className="record-select">
                                    <div className="color" style={{
                                        backgroundColor: record.recordGroup?.color || '#e0e0e0',
                                    }}></div>
                                    <Dropdown
                                        options={dropdownOptions}
                                        selectedOption={recordGroupId}
                                        setValue={setRecordGroupId}
                                    />
                                </div>
                            </li>
                            <li>
                                <p>기록 할 회사</p>
                                <div className="record-select">
                                    <Dropdown
                                        options={companyOptions}
                                        selectedOption={companyId || ''}
                                        setValue={setCompanyId}
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
                            <li>
                                <p>메모</p>
                                <textarea
                                    id="description"
                                    value={description || ''}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={4}
                                />
                            </li>
                            <li>
                                <p>첨부파일</p>
                                <label className="file">
                                    <input
                                        type="file"
                                        id="file"
                                        onChange={handleFileChange}
                                    />
                                    <input type="text" placeholder="파일을 선택해 주세요." readOnly />
                                    <button>파일 찾기</button>
                                </label>
                                {selectedFile && (
                                    <ul className="file-list">
                                        <li>
                                            <p>{selectedFile.name}</p>
                                            <button><i className="ic-delete"/></button>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </div>
                    <div className="modal-btn">
                        <button type="button" onClick={onDelete}>삭제</button>
                        <button type="submit">저장</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordUpdateModal;
