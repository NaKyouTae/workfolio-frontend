import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

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
    disabled?: boolean;
}

interface DropdownMenuProps {
    options: IDropdown[];
    selectedOption: string | number | undefined;
    onOptionClick: (value: string | number) => void;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
}

// 드롭다운 메뉴를 별도 컴포넌트로 분리
const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
    options, 
    selectedOption, 
    onOptionClick, 
    buttonRef
}) => {
    const ulRef = useRef<HTMLUListElement>(null);
    const [position, setPosition] = useState<{ top: number; left: number; showAbove: boolean } | null>(null);

    useEffect(() => {
        if (!buttonRef.current) return;

        const calculatePosition = () => {
            const button = buttonRef.current;
            if (!button) return;

            const buttonRect = button.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            
            const gap = 4; // 버튼과 드롭다운 사이 간격
            
            // ul이 아직 렌더링되지 않았을 수 있으므로 예상 높이 사용
            // 각 옵션: 2.4rem (약 24px), padding: 1.2rem (약 12px)
            const itemHeight = 24; // px
            const padding = 12; // px
            const maxHeight = 160; // max-height: 16rem = 약 160px
            const estimatedHeight = Math.min(options.length * itemHeight + padding, maxHeight);
            
            // 하단 공간 계산
            const spaceBelow = viewportHeight - buttonRect.bottom - gap;
            // 상단 공간 계산
            const spaceAbove = buttonRect.top - gap;
            
            // 위치 결정
            let showAbove = false;
            if (spaceBelow < estimatedHeight && spaceAbove >= estimatedHeight) {
                showAbove = true;
            } else if (spaceAbove < estimatedHeight && spaceBelow >= estimatedHeight) {
                showAbove = false;
            } else if (spaceBelow < estimatedHeight && spaceAbove < estimatedHeight) {
                showAbove = spaceAbove > spaceBelow;
            }
            
            // 좌우 위치 계산 (버튼과 같은 너비)
            let left = buttonRect.left;
            const ulWidth = buttonRect.width;
            
            // 오른쪽으로 넘어가면 조정
            if (left + ulWidth > viewportWidth) {
                left = viewportWidth - ulWidth - 10;
            }
            // 왼쪽으로 넘어가면 조정
            if (left < 10) {
                left = 10;
            }
            
            // 상하 위치 계산 (예상 높이 사용)
            const top = showAbove 
                ? buttonRect.top - estimatedHeight - gap
                : buttonRect.bottom + gap;
            
            setPosition({ top, left, showAbove });
        };

        // 다음 프레임에서 실행하여 DOM이 준비된 후 계산
        const rafId = requestAnimationFrame(() => {
            calculatePosition();
        });

        // 리사이즈 및 스크롤 시 재계산
        window.addEventListener('resize', calculatePosition);
        window.addEventListener('scroll', calculatePosition, true);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', calculatePosition);
            window.removeEventListener('scroll', calculatePosition, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]); // buttonRef는 ref이므로 의존성에 포함하지 않음

    // 실제 높이 계산 후 위치 재조정
    useEffect(() => {
        if (!position || !ulRef.current || !buttonRef.current) return;

        const adjustPosition = () => {
            const button = buttonRef.current;
            const ul = ulRef.current;
            if (!button || !ul || !position) return;

            const buttonRect = button.getBoundingClientRect();
            const actualUlHeight = ul.offsetHeight;
            const viewportHeight = window.innerHeight;
            const gap = 4;

            const spaceBelow = viewportHeight - buttonRect.bottom - gap;
            const spaceAbove = buttonRect.top - gap;

            let showAbove = position.showAbove;
            if (spaceBelow < actualUlHeight && spaceAbove >= actualUlHeight) {
                showAbove = true;
            } else if (spaceAbove < actualUlHeight && spaceBelow >= actualUlHeight) {
                showAbove = false;
            } else if (spaceBelow < actualUlHeight && spaceAbove < actualUlHeight) {
                showAbove = spaceAbove > spaceBelow;
            }

            const top = showAbove 
                ? buttonRect.top - actualUlHeight - gap
                : buttonRect.bottom + gap;

            if (Math.abs(top - position.top) > 1 || showAbove !== position.showAbove) {
                setPosition({ ...position, top, showAbove });
            }
        };

        // 실제 높이가 계산된 후 위치 조정
        const timeoutId = setTimeout(adjustPosition, 0);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [position]); // buttonRef는 ref이므로 의존성에 포함하지 않음

    if (!position) {
        return null; // 위치 계산 전에는 렌더링하지 않음
    }

    const button = buttonRef.current;
    const buttonWidth = button ? button.getBoundingClientRect().width : 'auto';
    
    return createPortal(
        <ul 
            ref={ulRef}
            className={`dropdown-menu ${position.showAbove ? 'above' : ''}`}
            style={{
                position: 'fixed',
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: `${buttonWidth}px`,
                zIndex: 10000,
            }}
        >
            {options.map((option, index) => (
                <li
                    key={`${option.value}-${index}`}
                    className={`${
                        option.value === selectedOption ? 'selected' : ''
                    }`}
                    onClick={() => onOptionClick(option.value)}
                >
                    {option.label}
                </li>
            ))}
        </ul>,
        document.body
    );
};

const Dropdown = ({ selectedOption, options, setValue, label, disabled = false }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    
    const toggleDropdown = (e: React.MouseEvent) => {
        if (!disabled) {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(prev => !prev);
        }
    };
    
    const handleOptionClick = (value: string | number) => {
        if (!disabled) {
            setValue(value);
            setIsOpen(false);
        }
    };

    // 외부 클릭 감지
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            
            // 드롭다운 버튼이나 메뉴 내부 클릭은 무시
            if (
                dropdownRef.current?.contains(target) ||
                document.querySelector('.dropdown-menu')?.contains(target)
            ) {
                return;
            }
            
            setIsOpen(false);
        };

        // 다음 이벤트 루프에서 이벤트 리스너 추가
        const timeoutId = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside, true);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('mousedown', handleClickOutside, true);
        };
    }, [isOpen]);

    // 선택된 옵션의 라벨 찾기
    const selectedLabel = options.find(option => option.value === selectedOption)?.label || '선택';
    
    return (
        <>
            <div className="dropdown" ref={dropdownRef}>
                {label && <label className="dropdown-label">{label}</label>}
                <button 
                    ref={buttonRef}
                    type="button"
                    onClick={toggleDropdown}
                    disabled={disabled}
                    style={{ color: selectedLabel == '선택' ? '#808991' : '#121212' }}
                >
                    {selectedLabel}
                </button>
            </div>
            {isOpen && (
                <DropdownMenu
                    options={options}
                    selectedOption={selectedOption}
                    onOptionClick={handleOptionClick}
                    buttonRef={buttonRef}
                />
            )}
        </>
    );
};

export default Dropdown;
