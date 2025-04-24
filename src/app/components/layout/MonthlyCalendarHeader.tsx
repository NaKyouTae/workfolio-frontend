import React from 'react';
import RecordTypeButton from './RecordTypeButton';
import CalendarNavigation from './CalendarNavigation';
import MonthlyCalendarHeaderTitle from './MonthlyCalendarHeaderTitle';

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
                    <div className="calendar-title-group">
                        <MonthlyCalendarHeaderTitle date={date} />
                        <CalendarNavigation 
                            onPreviousMonth={onPreviousMonth}
                            onNextMonth={onNextMonth}
                            onTodayMonth={onTodayMonth}
                        />
                    </div>
                    <RecordTypeButton 
                        selectedType={recordType}
                        onTypeChange={onTypeChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default MonthlyCalendarHeader; 