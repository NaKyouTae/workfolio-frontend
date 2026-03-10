import React, { useState } from 'react';
import CalendarNavigation from './CalendarNavigation';
import { CalendarViewType, CALENDAR_VIEW_OPTIONS } from '@workfolio/shared/models/CalendarTypes';
import { ListRecordResponse } from '@workfolio/shared/generated/record';
import { RECORD_TEMPLATES, RecordTemplateType } from '../templates/recordTemplates';

export type TemplateFilterType = 'all' | RecordTemplateType;

const TEMPLATE_FILTER_OPTIONS: { value: TemplateFilterType; label: string }[] = [
    { value: 'all', label: '전체' },
    ...RECORD_TEMPLATES.map((t) => ({ value: t.type as TemplateFilterType, label: t.label })),
];

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
    templateFilter?: TemplateFilterType;
    onTemplateFilterChange?: (filter: TemplateFilterType) => void;
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
    templateFilter = 'all',
    onTemplateFilterChange,
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
                    <h2>검색 결과 <span>{searchResultCount}개</span></h2>
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
                        {CALENDAR_VIEW_OPTIONS.map((option) => (
                            <li key={option.value}>
                                <button
                                    onClick={() => onTypeChange(option.value)}
                                    className={`${recordType === option.value ? 'active' : ''}`}
                                >
                                    {option.label}
                                </button>
                            </li>
                        ))}
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
                                <i className="ic-delete" />
                            </button>
                        )}
                    </div>
                )}
            </div>
            {/* 템플릿 유형별 필터 */}
            {!searchResults && onTemplateFilterChange && (
                <div className="template-filter">
                    {TEMPLATE_FILTER_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            className={`template-filter-chip ${templateFilter === option.value ? 'active' : ''}`}
                            onClick={() => onTemplateFilterChange(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CalendarHeader;
