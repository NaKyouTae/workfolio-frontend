import React from 'react';
import { Resume_Gender } from '@/generated/common';
import Input from '@/components/ui/Input';
import DatePicker from '@/components/ui/DatePicker';
import styles from '../CareerContentEdit.module.css';
import { compareEnumValue } from '@/utils/commonUtils';

interface BasicInfoEditProps {
  name: string;
  birthDate: number | undefined;
  gender: Resume_Gender | undefined;
  phone: string;
  email: string;
  job: string;
  description: string;
  onNameChange: (name: string) => void;
  onBirthDateChange: (birthDate: number) => void;
  onGenderChange: (gender: Resume_Gender | undefined) => void;
  onJobChange: (job: string) => void;
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
  job,
  birthDate,
  gender,
  phone,
  email,
  description,
  onJobChange,
  onDescriptionChange,
}) => {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>
        기본 정보
      </h3>
      
      <div className={styles.gridContainer2}>
        {/* 이름 */}
        <div className={styles.formField}>
          <Input 
            type="text"
            label="이름"
            readOnly={true}
            value={name}
          />
        </div>
        <div className={styles.formField}>
          <Input 
            type="text"
            label="직무"
            placeholder="백엔드 개발자"
            value={job}
            onChange={(e) => onJobChange(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.gridContainer2}>
        <div className={styles.formField}>
          <DatePicker
            label="생년월일"
            value={birthDate}
            readOnly={true}
            required={false}
          />
        </div>
        {/* 성별 */}
        <div className={styles.formField}>
          <label className={styles.label}>
            성별
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                readOnly={true}
                checked={compareEnumValue(gender, Resume_Gender.MALE, Resume_Gender)}
                className={styles.radio}
              />
              <span className={styles.radioText}>남</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                readOnly={true}
                checked={compareEnumValue(gender, Resume_Gender.FEMALE, Resume_Gender)}
                className={styles.radio}
              />
              <span className={styles.radioText}>여</span>
            </label>
          </div>
        </div>
      </div>
      <div className={styles.gridContainer2}>
        {/* 전화번호 */}
        <div className={styles.formField}>
          <Input 
            type="tel"
            label="전화번호"
            readOnly={true}
            value={formatPhoneNumber(phone)}
          />
        </div>
        {/* 이메일 */}
        <div className={styles.formField}>
          <Input 
            type="email"
            label="이메일"
            readOnly={true}
            value={email}
          />
        </div>
      </div>

      <div className={styles.gridContainer1}>
        {/* 전화번호 */}
        <div className={styles.formField}>
          <Input 
            type="text"
            label="소개"
            placeholder="간단 자기소개 입력"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoEdit;

