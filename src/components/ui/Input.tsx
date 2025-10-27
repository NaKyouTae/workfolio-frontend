import { ChangeEvent } from 'react';

interface InputProps {
    type?: string;        // 입력 타입 (default: text)
    placeholder?: string; // 입력 필드의 placeholder
    value: string;        // 입력값
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void; // 입력값 변경 이벤트
    label?: string; // 입력 필드의 라벨
    readOnly?: boolean; // 입력 필드의 읽기 전용 여부
}

const Input = ({ type = 'text', placeholder, value, onChange, label, readOnly = false }: InputProps) => {
    return (
        <div className="input-wrapper">
            {label && <label className="input-label">{label}</label>}
            <div className="input-field-container">
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange ? onChange : undefined}
                    readOnly={readOnly}
                    className={`input-field ${readOnly ? 'read-only' : ''}`}
                />
            </div>
        </div>
    );
};

export default Input;
