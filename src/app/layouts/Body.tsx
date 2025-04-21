// src/components/MonthlyCalendar.tsx
import React from 'react';
import BodyLeft from "@/app/layouts/BodyLeft"
import BodyRight from "@/app/layouts/BodyRight"

const Body = () => {
    return (
        <div className={"middle-container"}>
            <BodyLeft />
            <BodyRight />
        </div>
    );
};

export default Body;
