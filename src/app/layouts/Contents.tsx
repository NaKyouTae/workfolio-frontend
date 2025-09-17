// src/components/MonthlyCalendar.tsx
import React from 'react';
import BodyLeft from "@/app/layouts/BodyLeft"
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
            <BodyLeft />
            <section>
                <BodyRight />
                <Footer/>
            </section>
        </main>
    );
};

export default Contents;
