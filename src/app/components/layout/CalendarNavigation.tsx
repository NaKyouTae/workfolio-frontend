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
        <div className="calendar-nav-group">
            <button className="calendar-nav-button calendar-nav-button-left" onClick={onPreviousMonth}>‹</button>
            <button className="calendar-nav-button calendar-nav-button-middle" onClick={onNextMonth}>›</button>
            <button className="calendar-nav-button calendar-nav-button-right" onClick={onTodayMonth}>오늘</button>
        </div>
    );
};

export default CalendarNavigation; 