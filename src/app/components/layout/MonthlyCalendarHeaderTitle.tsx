import React from 'react';

interface MonthlyCalendarHeaderTitleProps {
    date: Date;
}

const MonthlyCalendarHeaderTitle: React.FC<MonthlyCalendarHeaderTitleProps> = ({date}) => {
    return (
        <div className="calendar-title">
            {`${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`}
        </div>
    );
};

export default MonthlyCalendarHeaderTitle; 