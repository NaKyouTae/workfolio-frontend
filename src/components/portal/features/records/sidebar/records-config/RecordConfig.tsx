import React, { useState } from 'react';
import '@/styles/records-config.css';
import RecordManagement from './RecordManagement';
import { RecordGroup, RecordGroup_RecordGroupType, SystemConfig_SystemConfigType } from '@/generated/common';
import { RecordGroupDetailResponse } from '@/generated/record_group';
import { SystemConfigUpdateRequest } from '@/generated/system_config';
import FloatingNavigation from '@/components/portal/ui/FloatingNavigation';
import HttpMethod from '@/enums/HttpMethod';
import { useSystemConfigStore } from '@/store/systemConfigStore';
import RecordSharedGroupManagement from './RecordSharedGroupManagement';
import RecordPrivateGroupManagement from './RecordPrivateGroupManagement';
import { compareEnumValue } from '@/utils/commonUtils';
import { useUserStore } from '@/store/userStore';
import RecordGroupDetailEditManagement from './detail/RecordGroupDetailEditManagement';
import RecordGroupDetailCreateManagement from './detail/RecordGroupDetailCreateManagement';
import { useNotification } from '@/hooks/useNotification';
import { isLoggedIn } from '@/utils/authUtils';
import LoginModal from '@/components/portal/ui/LoginModal';

interface RecordConfigProps {
    onClose: () => void;
    recordGroupsData: {
        ownedRecordGroups: RecordGroup[];
        sharedRecordGroups: RecordGroup[];
        allRecordGroups: RecordGroup[];
        isLoading: boolean;
        refreshRecordGroups: () => void;
        fetchRecordGroupDetails: (recordGroupId: string) => Promise<RecordGroupDetailResponse | null>;
    };
}

const RecordConfig: React.FC<RecordConfigProps> = ({ recordGroupsData }) => {
    const [selectedGroupForDetail, setSelectedGroupForDetail] = useState<RecordGroup | null | 'create-private' | 'create-shared'>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { getSystemConfig } = useSystemConfigStore();
    const { user } = useUserStore();
    const { showNotification } = useNotification();

    const handleGroupSettingsClick = (group: RecordGroup) => {
        setSelectedGroupForDetail(group);
    };

    const handleCreatePrivateGroup = () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        setSelectedGroupForDetail('create-private');
    };

    const handleCreateSharedGroup = () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        setSelectedGroupForDetail('create-shared');
    };

    const handleBackToList = () => {
        setSelectedGroupForDetail(null);
    };

    const handleSave = async () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        
        try {
            // DEFAULT_RECORD_TYPE 설정 가져오기
            const systemConfig = getSystemConfig(SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE);
            
            if (!systemConfig) {
                showNotification('설정을 불러오는 중입니다. 잠시 후 다시 시도해주세요.', 'error');
                return;
            }

            const requestBody: SystemConfigUpdateRequest = {
                id: systemConfig.id,
                type: SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE,
                value: systemConfig.value
            };

            const response = await fetch('/api/system-configs', {
                method: HttpMethod.PUT,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                showNotification('설정이 저장되었습니다.', 'success');
            } else {
                const errorMessage = `Failed to update system config: ${response.status}`;
                console.error(errorMessage);
                showNotification('설정 저장에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error('Error updating system config:', error);
            showNotification('설정 저장 중 오류가 발생했습니다.', 'error');
        }
    };

    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>기록 설정</h2>
                </div>
            </div>
            {selectedGroupForDetail ? (
                selectedGroupForDetail === 'create-private' || selectedGroupForDetail === 'create-shared' ? (
                    <RecordGroupDetailCreateManagement 
                        recordGroupsData={recordGroupsData}
                        isPrivate={selectedGroupForDetail === 'create-private'}
                        createType={selectedGroupForDetail === 'create-private' ? RecordGroup_RecordGroupType.PRIVATE : RecordGroup_RecordGroupType.SHARED}
                        onBack={handleBackToList}
                    />
                ) : (
                    <RecordGroupDetailEditManagement 
                        recordGroupsData={recordGroupsData}
                        initialRecordGroup={selectedGroupForDetail}
                        isPrivate={compareEnumValue(selectedGroupForDetail.type, RecordGroup_RecordGroupType.PRIVATE, RecordGroup_RecordGroupType)}
                        isAdmin={selectedGroupForDetail.worker?.id === user?.id}
                        onBack={handleBackToList}
                    />
                )
            ) : (
                <div className="page-cont">
                    <article>
                        <RecordManagement />
                        <RecordPrivateGroupManagement
                            onGroupSettingsClick={handleGroupSettingsClick}
                            onCreateGroup={handleCreatePrivateGroup}
                        />
                        <RecordSharedGroupManagement
                            userId={user?.id || ''}
                            onGroupSettingsClick={handleGroupSettingsClick}
                            onCreateGroup={handleCreateSharedGroup}
                        />
                    </article>
                    <FloatingNavigation
                        navigationItems={[
                            { id: 'record-management', label: '기록 설정' },
                            { id: 'record-group-management', label: '기록장 설정' },
                        ]}
                        onSave={handleSave}
                    />
                </div>
            )}
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
    );
};

export default RecordConfig;
