import React from 'react';
import CalendarNavigation from './CalendarNavigation';

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
                <h2>{`${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`}</h2>
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
                <ul className="tab-style1">
                    <li>
                        <button 
                            onClick={() => onTypeChange('weekly')}
                            className={`${recordType === 'weekly' ? 'active' : ''}`}
                        >
                            주간
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => onTypeChange('monthly')}
                            className={`${recordType === 'monthly' ? 'active' : ''}`}
                        >
                            월간
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => onTypeChange('list')}
                            className={`${recordType === 'list' ? 'active' : ''}`}
                        >
                            목록
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CalendarHeader; 