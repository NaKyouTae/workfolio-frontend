"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import ServiceGuidesSidebar from "./ServiceGuidesSidebar";
import ServiceGuidesContent from "./ServiceGuidesContent";
import Footer from "../../layouts/Footer";
import { MenuType } from "@workfolio/shared/models/MenuType";

interface ServiceGuidesPageProps {
    initialMenu?: MenuType;
}

const ServiceGuidesPage: React.FC<ServiceGuidesPageProps> = ({ initialMenu }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [selectedMenu, setSelectedMenu] = useState<MenuType>(initialMenu || "notices");

    // URL 경로에 따라 selectedMenu 설정
    useEffect(() => {
        if (pathname === "/service-guides/notices") {
            setSelectedMenu("notices");
        } else if (pathname === "/service-guides/terms-services") {
            setSelectedMenu("terms");
        } else if (pathname === "/service-guides/privacy-policies") {
            setSelectedMenu("privacy");
        } else if (pathname === "/service-guides") {
            setSelectedMenu("notices");
        }
        // else if (pathname === "/service-guides/company") {
        //     setSelectedMenu("company");
        // }
    }, [pathname]);

    const handleMenuClick = (menu: MenuType) => {
        setSelectedMenu(menu);
        // 메뉴 클릭 시 해당 경로로 이동
        if (menu === "notices") {
            router.push("/service-guides/notices");
        } else if (menu === "terms") {
            router.push("/service-guides/terms-services");
        } else if (menu === "privacy") {
            router.push("/service-guides/privacy-policies");
        }
        // else if (menu === "company") {
        //     router.push("/service-guides/company");
        // }
    };

    return (
        <main>
            <ServiceGuidesSidebar selectedMenu={selectedMenu} onMenuClick={handleMenuClick} />
            <section>
                <ServiceGuidesContent selectedMenu={selectedMenu} />
                <Footer />
            </section>
        </main>
    );
};

export default ServiceGuidesPage;
