import React from 'react';
import '@/styles/records-config.css';
import RecordManagement from './RecordManagement';
import RecordGroupManagement from './RecordGroupManagement';
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
    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>기록 설정</h2>
                </div>
            </div>
            <div className="page-cont">
                <RecordManagement />
                <RecordGroupManagement recordGroupsData={recordGroupsData} />
            </div>
        </div>
    );
};

export default RecordConfig;
