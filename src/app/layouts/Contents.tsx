// src/components/MonthlyCalendar.tsx
import React from 'react';
import BodyLeft from "@/app/layouts/BodyLeft"
import BodyRight from "@/app/layouts/BodyRight"
import Footer from "@/app/layouts/Footer"
const Contents = () => {
    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: '100vh',
            overflow: 'hidden'
        }}>
            <div style={{
                width: '20%',
                height: '100%',
                borderRight: '1px solid #e0e0e0'
            }}>
                <BodyLeft />
            </div>
            <div style={{
                width: '80%',
                height: '100%',
                overflow: 'auto'
            }}>
                <BodyRight />
                <Footer/>
            </div>
        </div>
    );
};

export default Contents;
