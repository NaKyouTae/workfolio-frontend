import { DateTime } from "luxon";

interface DateTimeInputProps {
    value: string; // ISO 형식 (예: "2025-03-26T12:30:00.000Z")
    onChange: (newDate: string) => void; // ISO 형식으로 변경된 값 반환
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({ value, onChange }) => {
    // ISO 형식을 'datetime-local'에 맞게 변환
    const toLocalDateTime = (isoString: string) => {
        return DateTime.fromISO(isoString).toFormat("yyyy-MM-dd'T'HH:mm");
    };
    
    // 'datetime-local' 입력값을 ISO 형식으로 변환
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const localValue = event.target.value;
        const isoValue = DateTime.fromFormat(localValue, "yyyy-MM-dd'T'HH:mm").toISO();
        if (isoValue) {
            onChange(isoValue);
        }
    };
    
    return (
        <input
            type="datetime-local"
            value={toLocalDateTime(value)}
            onChange={handleChange}
            className="border p-2 rounded"
        />
    );
};

export default DateTimeInput;
