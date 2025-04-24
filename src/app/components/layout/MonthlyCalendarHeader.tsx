import React from 'react';
import RecordTypeButton from './RecordTypeButton';

type RecordType = 'weekly' | 'monthly' | 'list';

interface MonthlyCalendarHeaderProps {
    date: Date;
    recordType: RecordType;
    onTypeChange: (type: RecordType) => void;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onTodayMonth: () => void;
}

const MonthlyCalendarHeader: React.FC<MonthlyCalendarHeaderProps> = ({
    date,
    recordType,
    onTypeChange,
    onPreviousMonth,
    onNextMonth,
    onTodayMonth
}) => {
    return (
        <div className="calendar-header-container">
            <div className="calendar-header">
                <div className="calendar-header-content">
                    <div className="calendar-title">
                        {`${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`}
                    </div>
                    <div className="calendar-navigation">
                        <div className="calendar-nav-group">
                            <button className="calendar-nav-button" onClick={onPreviousMonth}>‹</button>
                            <button className="calendar-nav-button" onClick={onNextMonth}>›</button>
                            <button className="calendar-nav-button" onClick={onTodayMonth}>오늘</button>
                        </div>
                        
                    </div>
                </div>
                <RecordTypeButton selectedType={recordType} onTypeChange={onTypeChange} />
            </div>
        </div>
    );
};

export default MonthlyCalendarHeader; 