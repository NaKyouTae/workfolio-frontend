import React from 'react';

interface MonthlyCalendarHeaderTitleProps {
    date: Date;
}

const MonthlyCalendarHeaderTitle: React.FC<MonthlyCalendarHeaderTitleProps> = ({date}) => {
    return (
        <h2>{`${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`}</h2>
    );
};

export default MonthlyCalendarHeaderTitle; 