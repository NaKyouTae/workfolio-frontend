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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {onSearchChange && (
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="검색어를 입력해 주세요."
                                    value={searchTerm}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    style={{
                                        padding: '8px 12px 8px 36px',
                                        border: '1px solid #dee2e6',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        width: '250px',
                                        outline: 'none'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#6c757d',
                                    fontSize: '16px'
                                }}>
                                    🔍
                                </div>
                            </div>
                        )}
                        <RecordTypeButton 
                            selectedType={recordType}
                            onTypeChange={onTypeChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarHeader; 