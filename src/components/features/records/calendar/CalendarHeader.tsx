import React, { useState } from 'react';
import CalendarNavigation from './CalendarNavigation';
import { CalendarViewType } from '@/models/CalendarTypes';

interface CalendarHeaderProps {
    date: Date;
    recordType: CalendarViewType;
    onTypeChange: (type: CalendarViewType) => void;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onTodayMonth: () => void;
    onSearchChange?: (term: string) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    date,
    recordType,
    onTypeChange,
    onPreviousMonth,
    onNextMonth,
    onTodayMonth,
    onSearchChange,
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearchChange) {
            onSearchChange(inputValue);
        }
    };

    return (
        <div className="page-title">
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
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
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