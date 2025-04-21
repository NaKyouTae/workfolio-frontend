import React, {useState} from 'react'
import useSelectedTodoListStore from "@/store/useSelectedTodoListStore";
import {Record, Record_RecordType} from "../../../../generated/common"

interface TodoListProps {
    record: Record; // 할 일 목록이 Todos 배열로 변경
}

const RecordList: React.FC<TodoListProps> = ({ record }) => {
    const { selectedIdx, setSelectedIdx } = useSelectedTodoListStore();
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
    
    const handleClick = (todoIndex: string) => {
        setSelectedIdx(todoIndex); // 클릭 시 인덱스 설정
    };
    
    const handleDoubleClick = () => {
        setIsModalOpen(true); // 모달 열기
    };
    
    const closeModal = () => {
        setIsModalOpen(false); // 모달 닫기
    };
    
    const isRecordTypeEqual = (record: Record_RecordType, recordType: Record_RecordType) => {
        return Record_RecordType[record].toString() === recordType.toString();
    };
    
    return (
        <div style={{width: '100%'}}>
            <div
                key={record.id}
                className="list-item"
                onClick={() => handleClick(`${record.startedAt}:${record.endedAt}:${record.id}`)} // 클릭 시 인덱스 설정
                onDoubleClick={handleDoubleClick} // 더블 클릭 시 모달 열기
                style={{
                    backgroundColor: selectedIdx === `${record.startedAt}:${record.endedAt}:${record.id}` ? '#e0f7fa' : record.recordGroup?.color, // 선택된 아이템 배경색
                    color: selectedIdx === `${record.startedAt}:${record.endedAt}:${record.id}` ? '#00796b' : '#000', // 선택된 아이템 텍스트 색상
                    cursor: 'pointer', // 커서 포인터로 설정
                    transition: 'background-color 0.3s ease, color 0.3s ease', // 부드러운 전환 효과
                }}
            >
                {
                    isRecordTypeEqual(record.type, Record_RecordType.TIME) && (
                        <>
                            <span className={"label"}></span>
                            {record.title}
                        </>
                    )
                }
                {
                    isRecordTypeEqual(record.type, Record_RecordType.DAY) && (
                        <>
                            <span className={"label"}></span>
                            {record.title}
                        </>
                    )
                }
                {
                    isRecordTypeEqual(record.type, Record_RecordType.MULTI_DAY) && (
                        <div className={"multi-day-item"}>{record.title}</div>
                    )
                }
            </div>
            
            {/*<RecordDetailModal isOpen={isModalOpen} onClose={closeModal}/>*/}
        </div>
    );
}

export default RecordList;
