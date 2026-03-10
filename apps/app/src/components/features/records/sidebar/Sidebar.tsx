import React, { useState, useEffect } from "react";
import { RecordGroup } from "@workfolio/shared/generated/common";
import { RecordGroupDetailResponse } from "@workfolio/shared/generated/record_group";
import RecordGroupsOwned from "./record-groups/record-groups-owned/RecordGroupsOwned";
import SidebarButton from "./SidebarButton";
import SidebarConfig from "./SidebarConfig";
import { useRecordGroupStore } from "@workfolio/shared/store/recordGroupStore";
import { useShallow } from "zustand/react/shallow";
import GoogleAdBanner from "@/components/ads/GoogleAdBanner";
import { isLoggedIn } from "@workfolio/shared/utils/authUtils";

const NEXT_PUBLIC_ADSENSE_RECORDS_SLOT = process.env.NEXT_PUBLIC_ADSENSE_RECORDS_SLOT;

interface SidebarProps {
    onConfigToggle: () => void;
    recordGroupsData: {
        ownedRecordGroups: RecordGroup[];
        allRecordGroups: RecordGroup[];
        isLoading: boolean;
        refreshRecordGroups: () => void;
        fetchRecordGroupDetails: (
            recordGroupId: string
        ) => Promise<RecordGroupDetailResponse | null>;
    };
    showDashboard: boolean;
    onGoHome: () => void;
    onGoRecords: () => void;
}

const Sidebar: React.FC<SidebarProps> = React.memo(({ onConfigToggle, recordGroupsData, showDashboard, onGoHome, onGoRecords }) => {
    const defaultExpanded = true;
    const [showAd, setShowAd] = useState(false);

    useEffect(() => {
        setShowAd(isLoggedIn());
    }, []);

    // Zustand store에서 직접 구독하여 자동 갱신
    const { ownedRecordGroups } = useRecordGroupStore(
        useShallow((state) => ({
            ownedRecordGroups: state.ownedRecordGroups,
        }))
    );

    // refreshRecordGroups는 props에서 가져옴
    const { refreshRecordGroups, allRecordGroups } = recordGroupsData;

    return (
        <aside>
            <SidebarButton allRecordGroups={allRecordGroups} />
            <div className="aside-cont">
                <div
                    className={`aside-home ${showDashboard ? "active" : ""}`}
                    onClick={showDashboard ? onGoRecords : onGoHome}
                >
                    {showDashboard ? "기록 보러가기" : "내 기록 관리"}
                </div>
                <SidebarConfig onConfigToggle={onConfigToggle} />
                <RecordGroupsOwned
                    defaultExpanded={defaultExpanded}
                    recordGroups={ownedRecordGroups}
                    onRefresh={refreshRecordGroups}
                />
            </div>
            {showAd && (
                <div>
                    <GoogleAdBanner
                        slot={NEXT_PUBLIC_ADSENSE_RECORDS_SLOT || ""}
                        width={250}
                        height={250}
                    />
                </div>
            )}
        </aside>
    );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;
