import { ChangeEvent } from 'react';

interface InputProps {
    type?: string;        // 입력 타입 (default: text)
    placeholder?: string; // 입력 필드의 placeholder
    value: string;        // 입력값
    onChange: (e: ChangeEvent<HTMLInputElement>) => void; // 입력값 변경 이벤트
}

const Input = ({ type = 'text', placeholder, value, onChange }: InputProps) => {
    return (
        <div className="input-wrapper">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="input-field"
            />
        </div>
    );
};

export default Input;
