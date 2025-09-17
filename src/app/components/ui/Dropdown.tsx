import { useState } from 'react';
import styles from './Dropdown.module.css';

export interface IDropdown {
    value: string;
    label: string;
    color?: string;
}

interface DropdownProps {
    selectedOption: string;
    options: IDropdown[]; // 옵션 배열
    setValue: (value: string) => void; // 선택된 옵션의 값을 설정하는 함수
}

const Dropdown = ({ selectedOption, options, setValue }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    
    const handleOptionClick = (value: string) => {
        setValue(value); // 선택된 옵션의 title 값을 외부 상태에 설정
        setIsOpen(false); // 드롭다운 닫기
    };

    // 선택된 옵션의 라벨 찾기
    const selectedLabel = options.find(option => option.value === selectedOption)?.label || '선택해주세요';
    
    return (
        <div className={styles.dropdown}>
            <button 
                type="button"
                onClick={toggleDropdown} 
                className={styles.dropdownToggle}
                style={{color: 'black'}}
            >
                {selectedLabel}
                <span className={styles.arrow}>▼</span>
            </button>
            {isOpen && (
                <ul className={styles.dropdownMenu}>
                    {options.map((option) => (
                        <li
                            key={option.value}
                            className={`${styles.dropdownItem} ${
                                option.value === selectedOption ? styles.selected : ''
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


