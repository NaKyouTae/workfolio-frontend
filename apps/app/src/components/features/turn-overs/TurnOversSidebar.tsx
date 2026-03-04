import React, { useState } from "react";
import { TurnOver, TurnOverDetail } from "@workfolio/shared/generated/common";
import { isLoggedIn } from "@workfolio/shared/utils/authUtils";
import LoginModal from "@workfolio/shared/ui/LoginModal";
import SidebarListSkeleton from "@workfolio/shared/ui/skeleton/SidebarListSkeleton";
import GoogleAdBanner from "@/components/ads/GoogleAdBanner";

const NEXT_PUBLIC_ADSENSE_TURNOVERS_SLOT = process.env.NEXT_PUBLIC_ADSENSE_TURNOVERS_SLOT;

interface TurnOversSidebarProps {
    turnOvers: TurnOver[];
    selectedTurnOver: TurnOverDetail | null;
    onGoHome: () => void;
    refreshTurnOvers: () => void;
    onTurnOverSelect: (id: string) => void;
    onTurnOverCreated: () => void;
    isLoading?: boolean;
}

const TurnOversSidebar: React.FC<TurnOversSidebarProps> = ({
    turnOvers,
    selectedTurnOver,
    onGoHome,
    onTurnOverSelect,
    onTurnOverCreated,
    isLoading = false,
}) => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleTurnOverSelect = (id: string) => {
        onTurnOverSelect(id);
    };

    const handleTurnOverCreated = () => {
        if (!isLoggedIn()) {
            setShowLoginModal(true);
            return;
        }
        onTurnOverCreated();
    };

    return (
        <aside>
            <div className="aside-button">
                <button className="md" onClick={handleTurnOverCreated}>
                    신규 이직 추가
                </button>
            </div>
            {/* 이력서 섹션 */}
            <div className="aside-cont">
                <div
                    className={`aside-home ${selectedTurnOver === null ? "active" : ""}`}
                    onClick={onGoHome}
                >
                    내 이직 관리
                </div>
                <div className="aside-group">
                    <p className="aside-group-title">내 이직 활동</p>
                    <ul className="aside-group-list">
                        {isLoading ? (
                            <SidebarListSkeleton count={3} />
                        ) : (
                            turnOvers.map((turnOver) => {
                                return (
                                    <li
                                        key={turnOver.id}
                                        className={
                                            turnOver.id === selectedTurnOver?.id ? "active" : ""
                                        }
                                        onClick={() => handleTurnOverSelect(turnOver.id)}
                                    >
                                        <p>{turnOver.name}</p>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            </div>
            <div>
                <GoogleAdBanner
                    slot={NEXT_PUBLIC_ADSENSE_TURNOVERS_SLOT || ""}
                    width={250}
                    height={250}
                />
            </div>
            <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </aside>
    );
};

export default TurnOversSidebar;
