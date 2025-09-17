// src/components/MonthlyCalendar.tsx
import React from 'react';
import Sidebar from "@/app/layouts/Sidebar"
import BodyRight from "@/app/layouts/BodyRight"
import Footer from "@/app/layouts/Footer"
import Mypage from "@/app/components/Mypage"
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
