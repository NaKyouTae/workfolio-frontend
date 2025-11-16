import React, { useEffect, useState, useCallback } from 'react';
import '@/styles/records-config.css';
import { RecordGroupJoinRequest, RecordGroupDetailResponse } from '@/generated/record_group';
import { WorkerListResponse } from '@/generated/worker';
import HttpMethod from '@/enums/HttpMethod';
import Dropdown from '@/components/portal/ui/Dropdown';
import { RecordGroup, Worker } from '@/generated/common';
import { createSampleWorkers } from '@/utils/sampleRecordData';

interface RecordGroupManagementProps {
    recordGroupsData: {
        ownedRecordGroups: RecordGroup[];
        sharedRecordGroups: RecordGroup[];
        allRecordGroups: RecordGroup[];
        isLoading: boolean;
        refreshRecordGroups: () => void;
        fetchRecordGroupDetails: (recordGroupId: string) => Promise<RecordGroupDetailResponse | null>;
    };
}

const RecordGroupManagement: React.FC<RecordGroupManagementProps> = ({ recordGroupsData }) => {
    const [selectedRecordGroup, setSelectedRecordGroup] = useState<RecordGroup | null>(null);
    const [shareNickname, setShareNickname] = useState('');
    const [searchedWorkers, setSearchedWorkers] = useState<Worker[]>([]);
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
    const [recordGroupDetails, setRecordGroupDetails] = useState<RecordGroupDetailResponse | null>(null);
    const [isComposing, setIsComposing] = useState(false);

    // props로 받은 recordGroupsData 사용
    const { allRecordGroups, refreshRecordGroups, fetchRecordGroupDetails } = recordGroupsData;
    
    // dropdownOptions를 useMemo로 메모이제이션
    const dropdownOptions = React.useMemo(() => 
        allRecordGroups.map(group => ({
            value: group.id,
            label: group.title,
            color: group.color
        })),
        [allRecordGroups]
    );

    // 첫 렌더링 시 첫 번째 레코드 그룹 선택
    useEffect(() => {
        if (allRecordGroups.length > 0 && !selectedRecordGroup) {
            setSelectedRecordGroup(allRecordGroups[0]);
        }
    }, [allRecordGroups, selectedRecordGroup]);

    // 선택된 레코드 그룹이 변경될 때 상세 정보 조회
    useEffect(() => {
        if (selectedRecordGroup) {
            fetchRecordGroupDetails(selectedRecordGroup.id).then(details => {
                setRecordGroupDetails(details);
            });
        }
    }, [selectedRecordGroup, fetchRecordGroupDetails]);

    // 드롭다운 변경 핸들러 메모이제이션
    const handleRecordGroupChange = useCallback((value: string | number) => {
        const group = allRecordGroups.find(g => g.id === String(value));
        if (group) {
            setSelectedRecordGroup(group);
        }
    }, [allRecordGroups]);

    // 워커 드롭다운 옵션 생성
    const workerDropdownOptions = React.useMemo(() => 
        searchedWorkers.map(worker => ({
            value: worker.id,
            label: worker.nickName || '',
            color: '#888'
        })),
        [searchedWorkers]
    );

    // 닉네임으로 워커 검색 함수
    const searchWorkerByNickname = useCallback(async (nickname: string) => {
        if (!nickname.trim()) {
            console.warn('닉네임을 입력해주세요.');
            return [];
        }
        
        // 로그인 상태 확인 (쿠키에서 accessToken 확인)
        const hasToken = document.cookie.includes('accessToken=');
        
        // 로그인 안되어있을 때 샘플 데이터 사용
        if (!hasToken) {
            console.log('로그인 안되어있음, 샘플 데이터 사용');
            const sampleWorkers = createSampleWorkers();
            // 닉네임으로 필터링 (부분 일치)
            const filteredWorkers = sampleWorkers.filter(worker => 
                worker.nickName.toLowerCase().includes(nickname.toLowerCase())
            );
            
            if (filteredWorkers.length > 0) {
                setSearchedWorkers(filteredWorkers);
                setSelectedWorker(filteredWorkers[0]); // 첫 번째 워커를 기본 선택
                console.log('샘플 워커 검색 성공:', filteredWorkers);
                return filteredWorkers;
            } else {
                console.warn('해당 닉네임의 워커를 찾을 수 없습니다.');
                setSearchedWorkers([]);
                setSelectedWorker(null);
                return [];
            }
        }
        
        try {
            const response = await fetch(`/api/workers/${nickname}`, {
                method: HttpMethod.GET
            });

            if (response.ok) {
                const data: WorkerListResponse = await response.json();
                if (data.workers && data.workers.length > 0) {
                    setSearchedWorkers(data.workers);
                    setSelectedWorker(data.workers[0]); // 첫 번째 워커를 기본 선택
                    console.log('워커 검색 성공:', data.workers);
                    return data.workers;
                } else {
                    console.warn('해당 닉네임의 워커를 찾을 수 없습니다.');
                    setSearchedWorkers([]);
                    setSelectedWorker(null);
                    return [];
                }
            } else if (response.status === 401 || response.status === 403) {
                // 인증 실패 시 샘플 데이터 사용
                console.log('인증 실패, 샘플 데이터 사용');
                const sampleWorkers = createSampleWorkers();
                const filteredWorkers = sampleWorkers.filter(worker => 
                    worker.nickName.toLowerCase().includes(nickname.toLowerCase())
                );
                
                if (filteredWorkers.length > 0) {
                    setSearchedWorkers(filteredWorkers);
                    setSelectedWorker(filteredWorkers[0]);
                    console.log('샘플 워커 검색 성공:', filteredWorkers);
                    return filteredWorkers;
                } else {
                    setSearchedWorkers([]);
                    setSelectedWorker(null);
                    return [];
                }
            } else {
                console.error('워커 검색 실패:', response.status);
                setSearchedWorkers([]);
                setSelectedWorker(null);
                return [];
            }
        } catch (error) {
            console.error('워커 검색 중 에러 발생:', error);
            // 에러 발생 시에도 샘플 데이터 사용
            console.log('에러 발생, 샘플 데이터 사용');
            const sampleWorkers = createSampleWorkers();
            const filteredWorkers = sampleWorkers.filter(worker => 
                worker.nickName.toLowerCase().includes(nickname.toLowerCase())
            );
            
            if (filteredWorkers.length > 0) {
                setSearchedWorkers(filteredWorkers);
                setSelectedWorker(filteredWorkers[0]);
                console.log('샘플 워커 검색 성공:', filteredWorkers);
                return filteredWorkers;
            } else {
                setSearchedWorkers([]);
                setSelectedWorker(null);
                return [];
            }
        }
    }, []);

    // 엔터 키 이벤트 핸들러
    const handleNicknameKeyDown = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
        // 한글 조합 중에는 Enter 키 이벤트 무시
        if (e.key === 'Enter' && !isComposing) {
            e.preventDefault();
            await searchWorkerByNickname(shareNickname);
        }
    }, [shareNickname, searchWorkerByNickname, isComposing]);

    // 한글 조합 시작 핸들러
    const handleCompositionStart = useCallback(() => {
        setIsComposing(true);
    }, []);

    // 한글 조합 종료 핸들러
    const handleCompositionEnd = useCallback(() => {
        setIsComposing(false);
    }, []);

    // 그룹 참여 함수
    const handleJoinRecordGroup = useCallback(async (recordGroupId: string, workerId: string) => {
        try {
            const message = RecordGroupJoinRequest.create({
                recordGroupId: recordGroupId,
                workerId: workerId,
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
                if (result != null) {
                    console.log('그룹 공유 성공');
                    return true;
                } else {
                    console.error('Failed to join group');
                    return false;
                }
            } else {
                console.error('Failed to join group');
                return false;
            }
        } catch (error) {
            console.error('Error joining group:', error);
            return false;
        }
    }, []);

    // 워커 공유 함수
    const handleShareWorker = useCallback(async () => {
        if (!selectedWorker || !selectedRecordGroup) {
            return;
        }

        const success = await handleJoinRecordGroup(selectedRecordGroup.id, selectedWorker.id);
        
        if (success) {
            // 성공 시 레코드 그룹 목록 갱신
            await refreshRecordGroups();
            
            // 레코드 그룹 상세 정보 리프레시
            const updatedDetails = await fetchRecordGroupDetails(selectedRecordGroup.id);
            setRecordGroupDetails(updatedDetails);
            
            setSelectedWorker(null);
        } else {
            alert('공유 추가에 실패했습니다. 다시 시도해주세요.');
        }
    }, [selectedWorker, selectedRecordGroup, handleJoinRecordGroup, refreshRecordGroups, fetchRecordGroupDetails]);

    // 워커 제거 함수
    const handleRemoveWorker = useCallback(async (workerId: string) => {
        try {
            const response = await fetch(`/api/worker-record-groups?recordGroupId=${selectedRecordGroup?.id}&targetWorkerId=${workerId}`, {
                method: HttpMethod.DELETE
            });

            if (response.ok) {
                const result = await response.json();
                console.log('result', result);
                console.log('Worker removed successfully');
                await refreshRecordGroups();
                const updatedDetails = await fetchRecordGroupDetails(selectedRecordGroup?.id || '');
                setRecordGroupDetails(updatedDetails);
                setShareNickname('');
                setSearchedWorkers([]);
                setSelectedWorker(null);
                
                return true;
            }
        } catch (error) {
            console.error('Error removing worker:', error);
        }
    }, [selectedRecordGroup, refreshRecordGroups, fetchRecordGroupDetails]);

    return (
        <div className="cont-box">
            <div className="cont-tit">
                <div>
                    <h3>기록장 관리</h3>
                </div>
            </div>
            <ul className="setting-list">
                <li>
                    <p>기록장 선택</p>
                    <Dropdown
                        options={dropdownOptions}
                        selectedOption={selectedRecordGroup?.id || ''}
                        setValue={handleRecordGroupChange}
                    />
                </li>
                <li>
                    <p>기록장 이름 및 색상</p>
                    <div>
                        {/* <p>{getRecordGroupTypeLabel(selectedRecordGroup?.type || RecordGroup_RecordGroupType.UNKNOWN)}</p> */}
                        <input 
                            type="text" 
                            value={selectedRecordGroup?.title || ''}
                            onChange={(e) => {
                                if (selectedRecordGroup) {
                                    setSelectedRecordGroup({
                                        ...selectedRecordGroup,
                                        title: e.target.value
                                    });
                                }
                            }}
                        />
                        <div className="color-picker" style={{ backgroundColor: selectedRecordGroup?.color || '#fff' }}></div>
                    </div>
                </li>
                <li>
                    <p>기록장 공유 설정</p>
                    <ul className="input-list">
                        <li><input type="radio" name="share" id="private" /><label htmlFor="private"><p>개인 기록장</p></label></li>
                        <li><input type="radio" name="share" id="shared" /><label htmlFor="shared"><p>공유 기록장</p></label></li>
                    </ul>
                </li>
                <li>
                    <p>기록장 공유 멤버</p>
                    <div>
                        <input 
                            type="text" 
                            placeholder="공유할 분의 닉네임을 입력해 주세요."
                            value={shareNickname}
                            onChange={(e) => setShareNickname(e.target.value)}
                            onKeyDown={handleNicknameKeyDown}
                            onCompositionStart={handleCompositionStart}
                            onCompositionEnd={handleCompositionEnd}
                        />
                        <button >공유하기</button>
                    </div>
                </li>
            </ul>
            <div className="config-row">
                <label>기록장 공유</label>
                <div className="share-container">
                    <div className="share-input-row">
                        
                    </div>
                    <div style={{ marginTop: '12px' }}>
                        <label style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
                            검색된 워커 선택 ({searchedWorkers.length}명)
                        </label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <Dropdown
                                    options={workerDropdownOptions}
                                    selectedOption={selectedWorker?.id || ''}
                                    setValue={(value: string | number) => {
                                        const worker = searchedWorkers.find(w => w.id === String(value));
                                        setSelectedWorker(worker || null);
                                    }}
                                />
                            </div>
                            <button 
                                className="share-btn" 
                                onClick={handleShareWorker}
                                disabled={!selectedWorker}
                            >
                                공유하기
                            </button>
                        </div>
                    </div>
                    <div className="shared-members">
                        {recordGroupDetails?.workers && recordGroupDetails.workers.length > 0 ? (
                            recordGroupDetails.workers.map((worker: Worker, index: number) => (
                                <div key={worker.id || index} className="shared-member">
                                    <span className="member-name">{worker.nickName || ''}</span>
                                    <div className="permission-tag">
                                        <span>전체 권한</span>
                                        <i className="ic-arrow-down-14"></i>
                                    </div>
                                    <button className="remove-btn" onClick={() => handleRemoveWorker(worker.id)}>×</button>
                                </div>
                            ))
                        ) : (
                            <p className="info-text">공유된 멤버가 없습니다.</p>
                        )}
                    </div>
                    <p className="info-text">공유 멤버가 있으면 기록장을 삭제할 수 없어요.</p>
                </div>
            </div>
            {/* <div className="config-row">
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
            </div> */}
        </div>
    );
};

export default RecordGroupManagement;
