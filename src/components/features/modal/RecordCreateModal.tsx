import React, {useEffect, useState} from 'react'
import HttpMethod from "@/enums/HttpMethod"
import { DateUtil } from "@/utils/DateUtil"
import Dropdown, {IDropdown} from "@/components/ui/Dropdown"
import DateTimeInput from "@/components/ui/DateTimeInput"
import {RecordGroup} from "@/generated/common"
import { RecordCreateRequest } from '@/generated/record'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import { useCompanies } from '@/hooks/useCompanies'
import dayjs from 'dayjs'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RecordCreateModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [dropdownOptions, setDropdownOptions] = useState<IDropdown[]>([]);
    const [recordGroupId, setRecordGroupId] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [startedAt, setStartedAt] = useState(dayjs().toISOString());
    const [endedAt, setEndedAt] = useState(dayjs().add(1, 'hour').toISOString());
    const [isAllDay, setIsAllDay] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [companyId, setCompanyId] = useState<string | null>(null);

    // store에서 triggerRecordRefresh 가져오기
    const { triggerRecordRefresh } = useRecordGroupStore();
    
    // companies hook 사용
    const { companies, refreshCompanies } = useCompanies();
    
    // companies를 dropdown options로 변환
    const companyOptions: IDropdown[] = companies.map(company => ({
        value: company.id || '',
        label: company.name || ''
    }));

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
        if (isOpen) {
            setTitle(null);
            setDescription(null);
            setStartedAt(dayjs().toISOString());
            setEndedAt(dayjs().add(1, 'hour').toISOString());
            setRecordGroupId(null);
            setIsAllDay(false);
            setSelectedFile(null);
            setCompanyId(null);

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
            refreshCompanies();
        }
    }, [isOpen, refreshCompanies]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const createRecordRequest = RecordCreateRequest.create({
            startedAt: DateUtil.parseToTimestamp(startedAt),
            endedAt: DateUtil.parseToTimestamp(endedAt),
            companyId: companyId || undefined,
            recordGroupId: recordGroupId || undefined,
            title: title || undefined,
            description: description || undefined,
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
            
            // 레코드 생성 성공 시 store를 통해 새로고침 트리거
            triggerRecordRefresh();
            
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
                                        backgroundColor: dropdownOptions.find(
                                            option => option.value === recordGroupId
                                        )?.color || '#ddd'
                                    }}></div>
                                    <Dropdown
                                        options={dropdownOptions}
                                        selectedOption={recordGroupId || ''}
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
                                    value={title || ''}
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
                        <button type="button" onClick={onClose}>취소</button>
                        <button type="submit">저장</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordCreateModal;
