"use client";

import React from "react";
import { MenuType } from "@/models/MenuType";
import { KakaoAdfitBanner } from "../../ui/KakaoAdfitBanner";

const NEXT_PUBLIC_KAKAO_ADFIT_SERVICE_GUIDES_KEY = process.env.NEXT_PUBLIC_KAKAO_ADFIT_SERVICE_GUIDES_KEY;

interface ServiceGuidesSidebarProps {
    selectedMenu: MenuType;
    onMenuClick: (menu: MenuType) => void;
}

const ServiceGuidesSidebar: React.FC<ServiceGuidesSidebarProps> = ({
    selectedMenu,
    onMenuClick,
}) => {
    return (
        <aside>
            <div className="aside-cont">
                <ul className="aside-menu">
                    <li
                        className={`${selectedMenu === "notices" ? "active" : ""}`}
                        onClick={() => onMenuClick("notices")}
                    >
                        공지사항
                    </li>
                    <li
                        className={`${selectedMenu === "terms" ? "active" : ""}`}
                        onClick={() => onMenuClick("terms")}
                    >
                        이용약관
                    </li>
                    <li
                        className={`${selectedMenu === "privacy" ? "active" : ""}`}
                        onClick={() => onMenuClick("privacy")}
                    >
                        개인정보 처리방침
                    </li>
                    {/* <li
                        className={`${selectedMenu === "company" ? "active" : ""}`}
                        onClick={() => onMenuClick("company")}
                    >
                        회사소개
                    </li> */}
                </ul>
            </div>
            <div>
                <KakaoAdfitBanner
                    unit={NEXT_PUBLIC_KAKAO_ADFIT_SERVICE_GUIDES_KEY || ""}
                    width={250}
                    height={250}
                    disabled={false}
                />
            </div>
        </aside>
    );
};

export default ServiceGuidesSidebar;
