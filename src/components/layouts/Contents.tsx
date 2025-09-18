// src/components/MonthlyCalendar.tsx
import React from 'react';
import Sidebar from "@/components/layouts/Sidebar"
import BodyRight from "@/components/layouts/BodyRight"
import Footer from "@/components/layouts/Footer"
import Mypage from "@/app/mypage/page"
import { useViewStore } from '@/store/viewStore';

const Contents = () => {
    const { currentView } = useViewStore();
    
    if (currentView === 'mypage') {
        return <Mypage />;
    }
    
    return (
        <main>
            <Sidebar />
            <section>
                <BodyRight />
                <Footer/>
            </section>
        </main>
    );
};

export default Contents;
