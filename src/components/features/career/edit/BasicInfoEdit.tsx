import React from 'react';
import { Resume_Gender } from '@/generated/common';
import Input from '@/components/ui/Input';
import DatePicker from '@/components/ui/DatePicker';
import { DateUtil } from '@/utils/DateUtil';
import styles from '../CareerContentEdit.module.css';

interface BasicInfoEditProps {
  name: string;
  birthDate: number;
  gender: Resume_Gender;
  phone: string;
  email: string;
  onNameChange: (name: string) => void;
  onBirthDateChange: (birthDate: number) => void;
  onGenderChange: (gender: Resume_Gender) => void;
  onPhoneChange: (phone: string) => void;
  onEmailChange: (email: string) => void;
}

/**
 * 기본 정보 섹션을 관리하는 컴포넌트
 * 이름, 생년월일, 성별, 전화번호, 이메일
 */
const BasicInfoEdit: React.FC<BasicInfoEditProps> = ({
  name,
  birthDate,
  gender,
  phone,
  email,
  onNameChange,
  onBirthDateChange,
  onGenderChange,
  onPhoneChange,
  onEmailChange,
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
            placeholder="홍길동"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
        
      </div>

      <div className={styles.gridContainer2}>
        <div className={styles.formField}>
          <DatePicker
            label="생년월일"
            value={birthDate ? DateUtil.formatTimestamp(birthDate) : undefined}
            onChange={(date) => onBirthDateChange(DateUtil.parseToTimestamp(date))}
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
                checked={gender === Resume_Gender.MALE}
                onChange={() => onGenderChange(Resume_Gender.MALE)}
                className={styles.radio}
              />
              <span className={styles.radioText}>남</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                checked={gender === Resume_Gender.FEMALE}
                onChange={() => onGenderChange(Resume_Gender.FEMALE)}
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
            type="text"
            label="전화번호"
            placeholder="010-1234-5678"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
          />
        </div>
        {/* 이메일 */}
        <div className={styles.formField}>
          <Input 
            type="text"
            label="이메일"
            placeholder="hong@gmail.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoEdit;

