import { DateTime } from "luxon";
import { useState, useRef, useEffect } from "react";
import styles from './DateTimeInput.module.css';

interface DateTimeInputProps {
    value: string;
    onChange: (newDate: string) => void;
    label?: string;
    showTime?: boolean;
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ value, onChange, label, showTime = true }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);
    const [dateInputValue, setDateInputValue] = useState('');
    const [timeInputValue, setTimeInputValue] = useState('');
    const calendarRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);
    
    const dateTime = value ? DateTime.fromISO(value) : DateTime.now();
    
    useEffect(() => {
        setDateInputValue(dateTime.toFormat('yyyy. MM. dd.'));
        setTimeInputValue(dateTime.toFormat('HH:mm'));
    }, [value]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (calendarRef.current && !(calendarRef.current as Node).contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
            if (timeRef.current && !(timeRef.current as Node).contains(event.target as Node)) {
                setIsTimeOpen(false);
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
    
    const generateTimeOptions = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                times.push({
                    hour,
                    minute,
                    label: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
                });
            }
        }
        return times;
    };
    
    const handleDateSelect = (day: DateTime) => {
        const newDateTime = dateTime.set({
            year: day.year,
            month: day.month,
            day: day.day
        });
        const isoString = newDateTime.toISO() || dateTime.toISO() || DateTime.now().toISO();
        onChange(isoString);
        setIsCalendarOpen(false);
    };
    
    const handleTimeSelect = (hour: number, minute: number) => {
        const newDateTime = dateTime.set({
            hour,
            minute
        });
        const isoString = newDateTime.toISO() || dateTime.toISO() || DateTime.now().toISO();
        onChange(isoString);
        setIsTimeOpen(false);
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

    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setDateInputValue(inputValue);

        // 날짜 형식 검증 (yyyy. MM. dd.)
        const datePattern = /^(\d{4})\. (\d{2})\. (\d{2})\.$/;
        const match = inputValue.match(datePattern);

        if (match) {
            const [_, year, month, day] = match;
            const newDate = DateTime.fromObject({
                year: parseInt(year),
                month: parseInt(month),
                day: parseInt(day),
                hour: dateTime.hour,
                minute: dateTime.minute
            });

            if (newDate.isValid) {
                const isoString = newDate.toISO() || dateTime.toISO() || DateTime.now().toISO();
                onChange(isoString);
            }
        }
    };

    const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        
        // 시간 형식에 맞게 자동 포맷팅
        let formattedValue = inputValue.replace(/[^\d]/g, '');
        if (formattedValue.length > 4) {
            formattedValue = formattedValue.slice(0, 4);
        }
        if (formattedValue.length > 2) {
            formattedValue = formattedValue.slice(0, 2) + ':' + formattedValue.slice(2);
        }
        
        setTimeInputValue(formattedValue);

        // 시간 형식 검증 (HH:mm)
        const timePattern = /^(\d{2}):(\d{2})$/;
        const match = formattedValue.match(timePattern);

        if (match) {
            const [_, hours, minutes] = match;
            const hour = parseInt(hours);
            const minute = parseInt(minutes);

            if (hour >= 0 && hour < 24 && minute >= 0 && minute < 60) {
                const newDateTime = dateTime.set({ hour, minute });
                const isoString = newDateTime.toISO() || dateTime.toISO() || DateTime.now().toISO();
                onChange(isoString);
            }
        }
    };
    
    return (
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
            {showTime && (
                <li>
                    <input
                        type="text"
                        value={timeInputValue}
                        onChange={handleTimeInputChange}
                        onClick={() => setIsTimeOpen(true)}
                        placeholder="HH:mm"
                    />
                    {isTimeOpen && (
                        <ul ref={timeRef} className="time-picker">
                            {generateTimeOptions().map((time, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleTimeSelect(time.hour, time.minute)}
                                    className={`${
                                        dateTime.hour === time.hour && 
                                        dateTime.minute === time.minute ? 
                                        'active' : ''
                                    }`}
                                >
                                    {time.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            )}
        </ul>
    );
};

export default DateTimeInput;
