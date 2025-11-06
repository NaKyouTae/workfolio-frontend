import { useState, useRef, useEffect } from 'react';

export interface IDropdown {
    value: string | number;
    label: string;
    color?: string;
}

interface DropdownProps {
    selectedOption: string | number | undefined;
    options: IDropdown[]; // 옵션 배열
    setValue: (value: string | number) => void; // 선택된 옵션의 값을 설정하는 함수
    label?: string;
}

const Dropdown = ({ selectedOption, options, setValue, label }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    
    const handleOptionClick = (value: string | number) => {
        setValue(value); // 선택된 옵션의 title 값을 외부 상태에 설정
        setIsOpen(false); // 드롭다운 닫기
    };

    // 외부 클릭 감지
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // 선택된 옵션의 라벨 찾기
    const selectedLabel = options.find(option => option.value === selectedOption)?.label || '선택';
    
    return (
        <div className="dropdown" ref={dropdownRef}>
            {label && <label className="dropdown-label">{label}</label>}
            <button 
                type="button"
                onClick={toggleDropdown}
            >
                {selectedLabel}
            </button>
            {isOpen && (
                <ul>
                    {options.map((option, index) => (
                        <li
                            key={`${option.value}-${index}`}
                            className={`${
                                option.value === selectedOption ? 'selected' : ''
                            }`}
                            onClick={() => handleOptionClick(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;


