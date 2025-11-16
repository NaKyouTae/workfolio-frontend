import React, { useState } from 'react';
import '@/styles/records-config.css';
import RecordManagement from './RecordManagement';
import RecordGroupManagement from './RecordGroupManagement';
import RecordGroupDetailManagement from './detail/RecordGroupDetailManagement';
import { RecordGroup } from '@/generated/common';
import { RecordGroupDetailResponse } from '@/generated/record_group';

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

    const handleGroupSettingsClick = (group: RecordGroup) => {
        setSelectedGroupForDetail(group);
    };

    const handleBackToList = () => {
        setSelectedGroupForDetail(null);
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
                    <>
                        <RecordManagement />
                        <RecordGroupManagement 
                            recordGroupsData={recordGroupsData}
                            onGroupSettingsClick={handleGroupSettingsClick}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default RecordConfig;
