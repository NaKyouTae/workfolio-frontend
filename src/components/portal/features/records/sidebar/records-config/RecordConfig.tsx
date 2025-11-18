import React, { useState } from 'react';
import '@/styles/records-config.css';
import RecordManagement from './RecordManagement';
import RecordGroupManagement from './RecordGroupManagement';
import RecordGroupDetailManagement from './detail/RecordGroupDetailManagement';
import { RecordGroup, SystemConfig_SystemConfigType } from '@/generated/common';
import { RecordGroupDetailResponse } from '@/generated/record_group';
import { SystemConfigUpdateRequest } from '@/generated/system_config';
import FloatingNavigation from '@/components/portal/ui/FloatingNavigation';
import HttpMethod from '@/enums/HttpMethod';
import { useSystemConfigStore } from '@/store/systemConfigStore';

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
    const [selectedGroupForDetail, setSelectedGroupForDetail] = useState<RecordGroup | null>(null);
    const { getSystemConfig } = useSystemConfigStore();

    const handleGroupSettingsClick = (group: RecordGroup) => {
        setSelectedGroupForDetail(group);
    };

    const handleBackToList = () => {
        setSelectedGroupForDetail(null);
    };

    const handleSave = async () => {
        try {
            // DEFAULT_RECORD_TYPE 설정 가져오기
            const systemConfig = getSystemConfig(SystemConfig_SystemConfigType.DEFAULT_RECORD_TYPE);
            
            if (!systemConfig) {
                console.error('System config not loaded yet');
                alert('설정을 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
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
                console.log('System config updated successfully');
                alert('설정이 저장되었습니다.');
            } else {
                const errorMessage = `Failed to update system config: ${response.status}`;
                console.error(errorMessage);
                alert('설정 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error updating system config:', error);
            alert('설정 저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>기록 설정</h2>
                </div>
            </div>
            <div className="page-cont">
                {selectedGroupForDetail ? (
                    <RecordGroupDetailManagement 
                        recordGroupsData={recordGroupsData}
                        initialRecordGroup={selectedGroupForDetail}
                        onBack={handleBackToList}
                    />
                ) : (
                    <div className="page-cont">
                        <article>
                            <RecordManagement />
                            <RecordGroupManagement 
                                recordGroupsData={recordGroupsData}
                                onGroupSettingsClick={handleGroupSettingsClick}
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
            </div>
        </div>
    );
};

export default RecordConfig;
