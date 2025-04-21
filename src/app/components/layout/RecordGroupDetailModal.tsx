import React, { useState } from 'react';
import HttpMethod from "@/enums/HttpMethod"
import {CreateRecordGroupRequest} from "../../../../generated/create-record-group"
import {ColorPicker, useColor} from "react-color-palette"
import "react-color-palette/css";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RecordGroupDetailModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [color, setColor] = useColor("#561ecb");
    const [priority, setPriority] = useState(0);
    
    if (!isOpen) return null; // 모달이 열려있지 않으면 아무것도 렌더링 하지 않음
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const message = CreateRecordGroupRequest.create({
            title: title,
            color: color.hex,
            priority: 1,
        });
        
        try {
            const data = await fetch('/api/recordGroups', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        title: message.title,
                        color: message.color,
                        priority: message.priority.toString(),
                    }
                ) }
            );
            console.log('Created Group:', data);
        } catch (error) {
            console.error('Error creating group:', error);
        }
        
        onClose(); // 모달 닫기
    };
    
    return (
        <div style={{
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
        }}>
            <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                minWidth: '300px', // 최소 너비 설정
            }}>
                <h3>기록장 추가</h3>
                <form onSubmit={handleSubmit}>
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
                        <label>색상:</label>
                        <ColorPicker
                            height={100} // 높이 px단위로 설정 (디폴트: 200)
                            hideAlpha={true} // 투명도 조절바 숨김 (디폴트: 안숨김)
                            hideInput={["rgb", "hsv", "rgb"]} // 컬러 코드 숨김 (디폴트: 안숨김)
                            color={color} // 현재 지정된 컬러
                            onChange={setColor} // 컬러 변경될 때마다 실행할 이벤트
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>순위:</label>
                        <input
                            type="number"
                            value={priority}
                            onChange={(e) => setPriority(Number(e.target.value))}
                            style={{ width: '80%', marginTop: '5px', padding: '5px' }}
                            required
                        />
                    </div>
                    <button type="submit" style={{ marginTop: '10px' }}>저장</button>
                    <button type="button" onClick={onClose} style={{ marginTop: '10px', marginLeft: '10px' }}>닫기</button>
                </form>
            </div>
        </div>
    );
};

export default RecordGroupDetailModal;
