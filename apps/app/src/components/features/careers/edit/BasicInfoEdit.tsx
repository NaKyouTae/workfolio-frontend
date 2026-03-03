import React, { useRef } from 'react';
import { Resume_Gender } from '@workfolio/shared/generated/common';
import Input from '@workfolio/shared/ui/Input';
import DatePicker from '@workfolio/shared/ui/DatePicker';
import { normalizeEnumValue } from '@workfolio/shared/utils/commonUtils';
import Dropdown from '@workfolio/shared/ui/Dropdown';
import { DateTime } from 'luxon';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface BasicInfoEditProps {
  name: string;
  birthDate: number | undefined;
  gender: Resume_Gender | undefined;
  phone: string;
  email: string;
  position: string;
  description: string;
  profileImagePreview: string | null;
  onNameChange: (name: string) => void;
  onBirthDateChange: (birthDate: number | undefined) => void;
  onGenderChange: (gender: Resume_Gender | undefined) => void;
  onPositionChange: (position: string) => void;
  onPhoneChange: (phone: string) => void;
  onEmailChange: (email: string) => void;
  onDescriptionChange: (description: string) => void;
  onProfileImageChange: (file: File | null) => void;
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
  profileImagePreview,
  onNameChange,
  onPositionChange,
  onDescriptionChange,
  onGenderChange,
  onBirthDateChange,
  onPhoneChange,
  onEmailChange,
  onProfileImageChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert('파일 크기는 10MB 이하만 가능합니다.');
        e.target.value = '';
        return;
      }
      onProfileImageChange(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    onProfileImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>기본 정보</h3>
            </div>
        </div>
        <ul className="edit-list type1">
            <li className="full">
                <p>인물 사진</p>
                <div style={{ position: 'relative', display: 'inline-block', flex: 'none' }}>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            width: '100px',
                            height: '130px',
                            border: profileImagePreview ? '1px solid #e5e7eb' : '1px dashed #ccc',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#f9f9f9',
                            flexShrink: 0,
                        }}
                    >
                        {profileImagePreview ? (
                            <img
                                src={profileImagePreview}
                                alt="인물 사진"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span style={{ fontSize: '12px', color: '#999', textAlign: 'center', lineHeight: '1.4' }}>
                                사진 선택<br />(최대 10MB)
                            </span>
                        )}
                    </div>
                    {profileImagePreview && (
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                            style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                border: '1.5px solid #fff',
                                backgroundColor: '#999',
                                color: '#fff',
                                fontSize: '12px',
                                lineHeight: '1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0,
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                        >
                            ✕
                        </button>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                    />
                </div>
            </li>
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

