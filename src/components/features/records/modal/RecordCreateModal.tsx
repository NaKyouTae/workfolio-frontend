import React, {useEffect, useState, useMemo} from 'react'
import HttpMethod from "@/enums/HttpMethod"
import { DateUtil } from "@/utils/DateUtil"
import Dropdown, {IDropdown} from "@/components/ui/Dropdown"
import DateTimeInput from "@/components/ui/DateTimeInput"
import {RecordGroup} from "@/generated/common"
import { RecordCreateRequest } from '@/generated/record'
import { useRecordGroupStore } from '@/store/recordGroupStore'
import dayjs from 'dayjs'

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate?: string | null;
    editableRecordGroups: RecordGroup[];
}

const RecordCreateModal: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    selectedDate, 
    editableRecordGroups,
}) => {
    const [recordGroupId, setRecordGroupId] = useState<string | null>(null);
    const [title, setTitle] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [startedAt, setStartedAt] = useState(dayjs().toISOString());
    const [endedAt, setEndedAt] = useState(dayjs().add(1, 'hour').toISOString());
    const [isAllDay, setIsAllDay] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // store에서 triggerRecordRefresh 가져오기
    const { triggerRecordRefresh } = useRecordGroupStore();
    
    // record groups를 dropdown options로 변환
    const dropdownOptions: IDropdown[] = useMemo(() => 
        editableRecordGroups.map(group => ({
            value: group.id || '',
            label: group.title || '',
            color: group.color
        })), [editableRecordGroups]
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
    
    // selectedDate가 변경될 때 startedAt과 endedAt 업데이트
    useEffect(() => {
        if (selectedDate && isOpen) {
            const selectedDateTime = dayjs(selectedDate);
            setStartedAt(selectedDateTime.toISOString());
            setEndedAt(selectedDateTime.add(30, 'minute').toISOString());
        }
    }, [selectedDate, isOpen]);

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
    
    useEffect(() => {
        if (isOpen) {
            setTitle(null);
            setDescription(null);
            
            // selectedDate가 있으면 해당 날짜와 시간으로 설정, 없으면 현재 시간으로 설정
            if (selectedDate) {
                const selectedDateTime = dayjs(selectedDate);
                setStartedAt(selectedDateTime.toISOString());
                setEndedAt(selectedDateTime.add(30, 'minute').toISOString());
            } else {
                // 현재 시간을 기준으로 1시간 차이로 설정 (같은 날 내에서)
                const now = dayjs();
                
                // 현재 시간이 23시면 22시-23시로, 아니면 현재 시간-1시간 후로 설정
                const currentHour = now.hour();
                const startHour = currentHour >= 23 ? 22 : currentHour;
                const endHour = startHour + 1;
                
                const startTime = now.hour(startHour).minute(0).second(0);
                const endTime = now.hour(endHour).minute(0).second(0);
                
                setStartedAt(startTime.toISOString());
                setEndedAt(endTime.toISOString());
            }
            
            // 첫 번째 editableRecordGroup을 기본값으로 설정
            setRecordGroupId(dropdownOptions[0]?.value || null);
            setIsAllDay(false);
            setSelectedFile(null);
        }
    }, [isOpen, selectedDate, dropdownOptions]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const createRecordRequest = RecordCreateRequest.create({
            startedAt: DateUtil.parseToTimestamp(startedAt),
            endedAt: DateUtil.parseToTimestamp(endedAt),
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
                    <h2>기록 생성</h2>
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
