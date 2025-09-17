import React from 'react';
import RecordTypeButton from './RecordTypeButton';
import CalendarNavigation from './CalendarNavigation';
import MonthlyCalendarHeaderTitle from './MonthlyCalendarHeaderTitle';

type RecordType = 'weekly' | 'monthly' | 'list';

interface CalendarHeaderProps {
    date: Date;
    recordType: RecordType;
    onTypeChange: (type: RecordType) => void;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onTodayMonth: () => void;
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    date,
    recordType,
    onTypeChange,
    onPreviousMonth,
    onNextMonth,
    onTodayMonth,
    searchTerm = '',
    onSearchChange,
}) => {
    return (
        <div className="calendar-option">
            <div className="calendar-nav">
                <MonthlyCalendarHeaderTitle date={date} />
                <CalendarNavigation 
                    onPreviousMonth={onPreviousMonth}
                    onNextMonth={onNextMonth}
                    onTodayMonth={onTodayMonth}
                />
            </div>
            <div className="calendar-type">
                {onSearchChange && (
                    <div className="input-search">
                        <input
                            type="text"
                            placeholder="검색어를 입력해 주세요."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                )}
                <RecordTypeButton 
                    selectedType={recordType}
                    onTypeChange={onTypeChange}
                />
            </div>
        </div>
    );
};

export default CalendarHeader; 