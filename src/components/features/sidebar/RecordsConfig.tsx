import React, { useEffect, useState } from 'react';
import '@/styles/records-config.css';
import { JoinRecordGroupRequest } from '@/generated/record_group';
import HttpMethod from '@/enums/HttpMethod';
import { useRecordGroups } from '@/hooks/useRecordGroups';
import Dropdown, { IDropdown } from '@/components/ui/Dropdown';

interface RecordsConfigProps {
    onClose: () => void;
}

const RecordsConfig: React.FC<RecordsConfigProps> = ({ onClose }) => {
    const [dropdownOptions, setDropdownOptions] = useState<IDropdown[]>([]);
    const [recordGroupDefaultScreen, setRecordGroupDefaultScreen] = useState('monthly');
    const [selectedRecordGroup, setSelectedRecordGroup] = useState('[기본] 업무');
    const [recordGroupName, setRecordGroupName] = useState('업무');
    const [shareNickname, setShareNickname] = useState('');
    const [defaultPermission, setDefaultPermission] = useState('full');

    const sharedMembers = [
        { name: '나뚜루 녹차', permission: '보기 권한' },
        { name: '나뚜루 초코', permission: '전체 권한' }
    ];

    const { allRecordGroups, refreshRecordGroups } = useRecordGroups();
    
    useEffect(() => {
        setDropdownOptions(allRecordGroups.map(group => ({
            value: group.id,
            label: group.title,
            color: group.color
        })));
    }, [allRecordGroups]);

    // 그룹 참여 함수
    const handleJoinRecordGroup = async (recordGroupId: string, targetWorkerId: string) => {
        try {
            const message = JoinRecordGroupRequest.create({
                recordGroupId: recordGroupId,
                workerId: targetWorkerId,
            });
            
            const response = await fetch('/api/record-groups/join', {
                method: HttpMethod.POST,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recordGroupId: message.recordGroupId,
                    workerId: message.workerId,
                })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.isSuccess) {
                    // 성공 시 레코드 그룹 다시 조회
                    refreshRecordGroups();
                } else {
                    console.error('Failed to join group');
                }
            } else {
                console.error('Failed to join group');
            }
        } catch (error) {
            console.error('Error joining group:', error);
        }
    };

    return (
        <div className="records-config">
            <div className="config-header">
                <h2>기록 설정</h2>
                <button className="close-btn" onClick={onClose}>
                    <i className="ic-close-24" />
                </button>
            </div>
            
            <div className="config-content">
                {/* 기록 관리 */}
                <div className="config-section">
                    <h3>기록 관리</h3>
                    <div className="config-row">
                        <label>기록장 기본 화면</label>
                        <div className="radio-group">
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="recordGroupDefaultScreen"
                                    value="weekly"
                                    checked={recordGroupDefaultScreen === 'weekly'}
                                    onChange={(e) => setRecordGroupDefaultScreen(e.target.value)}
                                />
                                <span>주별 보기</span>
                            </label>
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="recordGroupDefaultScreen"
                                    value="monthly"
                                    checked={recordGroupDefaultScreen === 'monthly'}
                                    onChange={(e) => setRecordGroupDefaultScreen(e.target.value)}
                                />
                                <span>월별 보기</span>
                            </label>
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="recordGroupDefaultScreen"
                                    value="list"
                                    checked={recordGroupDefaultScreen === 'list'}
                                    onChange={(e) => setRecordGroupDefaultScreen(e.target.value)}
                                />
                                <span>목록 보기</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* 기록장 관리 */}
                <div className="config-section">
                    <h3>기록장 관리</h3>
                    <div className="config-row">
                        <label>기록장 선택</label>
                        <div className="dropdown-container">
                            <div className="color" style={{
                                backgroundColor: dropdownOptions.find(
                                    option => option.value === selectedRecordGroup
                                )?.color || '#ddd'
                            }}></div>
                            <Dropdown
                                options={dropdownOptions}
                                selectedOption={selectedRecordGroup || ''}
                                setValue={setSelectedRecordGroup}
                            />
                        </div>
                    </div>
                    <div className="config-row">
                        <label>기록장 이름 및 색상</label>
                        <div className="input-with-color">
                            <input 
                                type="text" 
                                value={recordGroupName}
                                onChange={(e) => setRecordGroupName(e.target.value)}
                                className="text-input"
                            />
                            <button className="clear-btn">×</button>
                            <div className="color-picker red"></div>
                        </div>
                    </div>
                    <div className="config-row">
                        <label>기록장 공유</label>
                        <div className="share-container">
                            <div className="share-input-row">
                                <input 
                                    type="text" 
                                    placeholder="공유할 분의 닉네임을 입력해 주세요."
                                    value={shareNickname}
                                    onChange={(e) => setShareNickname(e.target.value)}
                                    className="text-input"
                                    style={{ width: '800px' }}
                                />
                                <button className="share-btn" onClick={() => handleJoinRecordGroup(selectedRecordGroup, targetWorkerId)}>공유하기</button>
                            </div>
                            <div className="shared-members">
                                {sharedMembers.map((member, index) => (
                                    <div key={index} className="shared-member">
                                        <span className="member-name">{member.name}</span>
                                        <div className="permission-tag">
                                            <span>{member.permission}</span>
                                            <i className="ic-arrow-down-14"></i>
                                        </div>
                                        <button className="remove-btn">×</button>
                                    </div>
                                ))}
                            </div>
                            <p className="info-text">공유 멤버가 있으면 기록장을 삭제할 수 없어요.</p>
                        </div>
                    </div>
                    <div className="config-row">
                        <label>기록장 공유 기본 권한</label>
                        <div className="radio-group">
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="defaultPermission"
                                    value="full"
                                    checked={defaultPermission === 'full'}
                                    onChange={(e) => setDefaultPermission(e.target.value)}
                                />
                                <span>전체 권한</span>
                            </label>
                            <label className="radio-option">
                                <input 
                                    type="radio" 
                                    name="defaultPermission"
                                    value="view"
                                    checked={defaultPermission === 'view'}
                                    onChange={(e) => setDefaultPermission(e.target.value)}
                                />
                                <span>보기 권한</span>
                            </label>
                        </div>
                    </div>
                    <div className="config-row">
                        <label>기록장 삭제</label>
                        <div className="delete-section">
                            <p className="info-text">기본 기록장은 삭제할 수 없어요.</p>
                            <button className="delete-btn" disabled>삭제하기</button>
                            <p className="info-text">기록장에 있는 모든 기록이 삭제돼요.</p>
                        </div>
                    </div>
                    <div className="config-row">
                        <label>기록장 탈퇴</label>
                        <div className="leave-section">
                            <button className="leave-btn">탈퇴하기</button>
                            <p className="info-text">탈퇴하면 더 이상 공유 기록장에 있는 기록을 볼 수 없어요.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordsConfig;
