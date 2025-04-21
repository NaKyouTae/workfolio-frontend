import { useState } from 'react';

export interface IDropdown {
    value: string;
    label: string;
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
    
    return (
        <div className="dropdown">
            <button onClick={toggleDropdown} className="dropdown-toggle">
                {selectedOption}
            </button>
            {isOpen && (
                <ul className="dropdown-menu">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className="dropdown-item"
                            onClick={() => handleOptionClick(option.value)} // 클릭 시 값을 setValue로 설정
                        >
                            {option.label} {/* 객체의 title만 렌더링 */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


export default Dropdown;


