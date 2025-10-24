import { DateTime } from "luxon";
import { useState, useRef, useEffect } from "react";
import styles from './DatePicker.module.css';
import DateUtil from '@/utils/DateUtil';

interface DatePickerProps {
    value: number | string | undefined;
    onChange: (newDate: string) => void;
    label?: string;
    required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label, required = false }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [dateInputValue, setDateInputValue] = useState('');
    const calendarRef = useRef<HTMLDivElement>(null);
    
    // value가 number(timestamp)면 ISO 문자열로 변환
    const getFormattedValue = (): string | undefined => {
        if (!value) return undefined;
        if (typeof value === 'number') {
            return DateUtil.formatTimestamp(value);
        }
        return value;
    };
    
    const formattedValue = getFormattedValue();
    const dateTime = formattedValue ? DateTime.fromISO(formattedValue) : DateTime.now();
    
    useEffect(() => {
        if (!formattedValue) {
            setDateInputValue('---- -- --');
        } else {
            setDateInputValue(dateTime.toFormat('yyyy. MM. dd.'));
        }
    }, [formattedValue, dateTime]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !(calendarRef.current as Node).contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const generateCalendarDays = () => {
        const start = dateTime.startOf('month').startOf('week');
        const end = dateTime.endOf('month').endOf('week');
        const days = [];
        let current = start;
        
        while (current <= end) {
            days.push(current);
            current = current.plus({ days: 1 });
        }
        
        return days;
    };
    
    const handleDateSelect = (day: DateTime) => {
        const newDate = day.toISO();
        if (newDate) {
            onChange(newDate);
        }
        setIsCalendarOpen(false);
    };
    
    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setDateInputValue(inputValue);
        
        // 빈 값이거나 "---- -- --"이고 required가 false인 경우 빈 문자열로 설정
        if ((!inputValue.trim() || inputValue === '---- -- --') && !required) {
            onChange('');
            return;
        }
        
        // 날짜 형식 검증 및 변환
        const parsedDate = DateTime.fromFormat(inputValue, 'yyyy. MM. dd.');
        if (parsedDate.isValid) {
            const newDate = parsedDate.toISO();
            if (newDate) {
                onChange(newDate);
            }
        }
    };

    const handlePrevMonth = () => {
        const newDate = dateTime.minus({ months: 1 });
        const isoString = newDate.toISO() || dateTime.toISO() || DateTime.now().toISO();
        onChange(isoString);
    };
    
    const handleNextMonth = () => {
        const newDate = dateTime.plus({ months: 1 });
        const isoString = newDate.toISO() || dateTime.toISO() || DateTime.now().toISO();
        onChange(isoString);
    };
    
    return (
        <div className={styles.datePickerContainer}>
            {label && (
                <label className={styles.datePickerLabel}>
                    {label}
                    {required && <span className={styles.required}> *</span>}
                </label>
            )}
            <ul className="date-time">
                <li>
                    <input
                        type="text"
                        value={dateInputValue}
                        onChange={handleDateInputChange}
                        onClick={() => setIsCalendarOpen(true)}
                        placeholder="yyyy. MM. dd."
                    />
                    {isCalendarOpen && (
                        <div ref={calendarRef} className="date-picker">
                            <div className="controller">
                                <button onClick={handlePrevMonth}><i className="ic-arrow-left-14" /></button>
                                <p>{dateTime.toFormat('yyyy년 MM월')}</p>
                                <button onClick={handleNextMonth}><i className="ic-arrow-right-14" /></button>
                            </div>
                            <div className="calendar">
                                <ul className="week">
                                    {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                                        <li key={day}>{day}</li>
                                    ))}
                                </ul>
                                <ul className="days">
                                    {generateCalendarDays().map((day, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleDateSelect(day)}
                                            className={`${
                                                day.month === dateTime.month ? '' : 'other'
                                            } ${
                                                day.hasSame(dateTime, 'day') ? 'today' : ''
                                            }`}
                                        >
                                            <p>{day.day}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default DatePicker;
