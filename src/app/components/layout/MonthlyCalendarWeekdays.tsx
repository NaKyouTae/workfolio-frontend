import React from 'react';

const MonthlyCalendarWeekdays: React.FC = () => {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    return (
        <div className="calendar-days-header" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: '1px solid #e0e0e0'
        }}>
            {weekdays.map((day, index) => (
                <div 
                    key={day} 
                    style={{
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: day === '일' ? 'red' : day === '토' ? 'blue' : 'black',
                        padding: '10px',
                        borderRight: index === 6 ? 'none' : '1px solid #e0e0e0'
                    }}
                >
                    {day}
                </div>
            ))}
        </div>
    );
};

export default MonthlyCalendarWeekdays; 