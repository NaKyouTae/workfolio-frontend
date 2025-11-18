import React from 'react';
import { Resume_Gender } from '@/generated/common';
import Input from '@/components/portal/ui/Input';
import DatePicker from '@/components/portal/ui/DatePicker';
import { normalizeEnumValue } from '@/utils/commonUtils';
import Dropdown from '@/components/portal/ui/Dropdown';
import { DateTime } from 'luxon';

interface BasicInfoEditProps {
  name: string;
  birthDate: number | undefined;
  gender: Resume_Gender | undefined;
  phone: string;
  email: string;
  position: string;
  description: string;
  onNameChange: (name: string) => void;
  onBirthDateChange: (birthDate: number | undefined) => void;
  onGenderChange: (gender: Resume_Gender | undefined) => void;
  onPositionChange: (position: string) => void;
  onPhoneChange: (phone: string) => void;
  onEmailChange: (email: string) => void;
  onDescriptionChange: (description: string) => void;
}

/**
 * 전화번호 포맷팅 함수
 */
const formatPhoneNumber = (phone?: string): string => {
  if (!phone) return '';
  
  // 숫자만 추출
  const numbers = phone.replace(/[^0-9]/g, '');
  
  // 길이에 따라 포맷팅
  if (numbers.length === 11) {
    // 010-1234-5678
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  } else if (numbers.length === 10) {
    // 02-1234-5678 또는 031-123-4567
    if (numbers.startsWith('02')) {
      return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6)}`;
    }
  } else if (numbers.length === 9) {
    // 02-123-4567
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 5)}-${numbers.slice(5)}`;
  }
  
  // 그 외의 경우 원본 반환
  return phone;
};

/**
 * 기본 정보 섹션을 관리하는 컴포넌트
 * 이름, 생년월일, 성별, 전화번호, 이메일
 */
const BasicInfoEdit: React.FC<BasicInfoEditProps> = ({
  name,
  position,
  birthDate,
  gender,
  phone,
  email,
  description,
  onNameChange,
  onPositionChange,
  onDescriptionChange,
  onGenderChange,
  onBirthDateChange,
  onPhoneChange,
  onEmailChange,
}) => {
  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>기본 정보</h3>
            </div>
        </div>
        <ul className="edit-list type1">
            <li>
                <p>이름</p>
                <Input 
                    type="text"
                    label="이름"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                />
            </li>
            <li>
                <p>직무</p>
                <Input 
                    type="text"
                    label="직무"
                    placeholder="직무를 입력해 주세요."
                    value={position}
                    onChange={(e) => onPositionChange(e.target.value)}
                />
            </li>
            <li>
                <p>생년월일</p>
                <DatePicker
                    value={birthDate}
                    onChange={(date) => onBirthDateChange(DateTime.fromISO(date).toMillis() === 0 ? undefined : DateTime.fromISO(date).toMillis())}
                    required={false}
                />
            </li>
            <li>
                <p>성별</p>
                <Dropdown
                    selectedOption={normalizeEnumValue(gender, Resume_Gender)}
                    options={[
                        { value: Resume_Gender.MALE, label: '남성' },
                        { value: Resume_Gender.FEMALE, label: '여성' },
                    ]}
                    setValue={(value) => onGenderChange(normalizeEnumValue(value, Resume_Gender))}
                />
            </li>
            <li>
                <p>전화번호</p>
                <Input 
                    type="tel"
                    label="전화번호"
                    onChange={(e) => onPhoneChange(formatPhoneNumber(e.target.value))}
                    value={formatPhoneNumber(phone)}
                />
            </li>
            <li>
                <p>이메일</p>
                <Input 
                    type="email"
                    label="이메일"
                    onChange={(e) => onEmailChange(e.target.value)}
                    value={email}
                />
            </li>
            <li className="full">
                <p>소개</p>
                <Input 
                    type="text"
                    label="소개"
                    placeholder="소개를 작성해 주세요."
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                />
            </li>
        </ul>
    </>
  );
};

export default BasicInfoEdit;

