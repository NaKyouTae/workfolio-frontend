import React from 'react';

const MonthlyCalendarWeekdays: React.FC = () => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <thead>
            <tr>
                {weekdays.map((day) => (
                    <th 
                        key={day} 
                        className={`${day === '일' ? 'holiday' : ''}`}
                    >
                        {day}
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export default MonthlyCalendarWeekdays; 