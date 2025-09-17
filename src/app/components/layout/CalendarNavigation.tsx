import React from 'react';

interface CalendarNavigationProps {
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onTodayMonth: () => void;
}

const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
    onPreviousMonth,
    onNextMonth,
    onTodayMonth
}) => {
    return (
        <ul>
            <li><button onClick={onPreviousMonth}><i className="ic-arrow-left-14" /></button></li>
            <li><button onClick={onNextMonth}><i className="ic-arrow-right-14" /></button></li>
            <li><button onClick={onTodayMonth}>오늘</button></li>
        </ul>
    );
};

export default CalendarNavigation; 