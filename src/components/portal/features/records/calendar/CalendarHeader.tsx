import React, { useState } from 'react';
import CalendarNavigation from './CalendarNavigation';
import { CalendarViewType } from '@/models/CalendarTypes';
import { ListRecordResponse } from '@/generated/record';

interface CalendarHeaderProps {
    date: Date;
    recordType: CalendarViewType;
    onTypeChange: (type: CalendarViewType) => void;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onTodayMonth: () => void;
    onSearchChange?: (term: string) => void;
    onCloseSearch?: () => void;
    searchResults?: ListRecordResponse | null;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    date,
    recordType,
    onTypeChange,
    onPreviousMonth,
    onNextMonth,
    onTodayMonth,
    onSearchChange,
    onCloseSearch,
    searchResults,
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearchChange) {
            onSearchChange(inputValue);
        }
    };

    const handleCloseSearch = () => {
        setInputValue('');
        onCloseSearch?.();
    };

    const searchResultCount = searchResults?.records?.length || 0;

    return (
        <div className="page-title">
            {searchResults ? (
                <div className="calendar-nav">
                    <h2>검색 결과 {searchResultCount}건</h2>
                </div>
            ) : (
                <div className="calendar-nav">
                    <h2>{`${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}`}</h2>
                    <CalendarNavigation 
                        onPreviousMonth={onPreviousMonth}
                        onNextMonth={onNextMonth}
                        onTodayMonth={onTodayMonth}
                    />
                </div>
            )}
            <div className="calendar-type">
                {!searchResults && (
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
                )}
                {onSearchChange && (
                    <div className="input-search">
                        <input
                            type="text"
                            placeholder="검색어를 입력해 주세요."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        {searchResults && (
                            <button onClick={handleCloseSearch}>
                                <i className="ic-close" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarHeader; 