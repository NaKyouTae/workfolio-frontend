import React, {useEffect, useState} from 'react'
import HttpMethod from "@/enums/HttpMethod"
import {toTimestamp} from "@/utils/TimeUtil"
import Dropdown, {IDropdown} from "@/app/components/ui/Dropdown"
import DateTimeInput from "@/app/components/ui/DateTimeInput"
import {RecordGroup} from "../../../../generated/common"

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RecordCreateModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [dropdownOptions, setDropdownOptions] = useState<IDropdown[]>([]);
    const [recordGroupId, setRecordGroupId] = useState<string>('');
    const [title, setTitle] = useState('');
    const [memo, setMemo] = useState('');
    const [startedAt, setStartedAt] = useState('');
    const [endedAt, setEndedAt] = useState('');
    
    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setMemo('');
            setStartedAt('');
            setEndedAt('');
            setRecordGroupId('');
            
            const fetchRecordGroups = async () => {
                try {
                    const res = await fetch('/api/recordGroups', { method: HttpMethod.GET });
                    const data = await res.json();
                    if (data != null) {
                        
                        const options = data.groups.map((res: RecordGroup) => {
                            return {
                                value: res.id,
                                label: res.title,
                            }
                        })
                        setDropdownOptions(options);
                        setRecordGroupId(options[0]?.title); // 첫 번째 항목을 기본값으로 설정
                    }
                } catch (error) {
                    console.error('Error fetching record groups:', error);
                }
            };
            
            fetchRecordGroups();
        }
    }, [isOpen]); // isOpen이 true로 바뀔 때마다 호출
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const data = await fetch('/api/records', {
                method: HttpMethod.POST,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    title,
                    memo,
                    startedAt: toTimestamp(startedAt),
                    endedAt: toTimestamp(endedAt),
                    recordGroupId,
                }),
            });
            console.log('1 Created Group:', data);
        } catch (error) {
            console.error('Error creating group:', error);
        }
        
        onClose();
    };
    
    if (!isOpen) return null; // 모달이 열려있지 않으면 아무것도 렌더링 하지 않음
    
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
            }}
        >
            <div
                style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    minWidth: '300px', // 최소 너비 설정
                }}
            >
                <h3>할 일 추가</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>기록장</label>
                        <Dropdown selectedOption={recordGroupId} options={dropdownOptions} setValue={setRecordGroupId} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>제목:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ width: '80%', marginTop: '5px', padding: '5px' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>내용:</label>
                        <textarea
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            style={{ width: '80%', marginTop: '5px', padding: '5px' }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>시작 날짜:</label>
                        <DateTimeInput value={startedAt} onChange={setStartedAt} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>종료 날짜:</label>
                        <DateTimeInput value={endedAt} onChange={setEndedAt} />
                    </div>
                    <button type="submit" style={{ marginTop: '10px' }}>저장</button>
                    <button type="button" onClick={onClose} style={{ marginTop: '10px', marginLeft: '10px' }}>닫기</button>
                </form>
            </div>
        </div>
    );
};

export default RecordCreateModal;
