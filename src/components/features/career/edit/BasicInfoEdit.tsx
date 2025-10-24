import React from 'react';
import { Resume_Gender } from '@/generated/common';
import Input from '@/components/ui/Input';
import DatePicker from '@/components/ui/DatePicker';
import { DateUtil } from '@/utils/DateUtil';
import { compareEnumValue } from '@/utils/commonUtils';
import styles from '../CareerContentEdit.module.css';

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
  onNameChange,
  onJobChange,
  onBirthDateChange,
  onGenderChange,
  onPhoneChange,
  onEmailChange,
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
            placeholder="홍길동"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
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
                checked={compareEnumValue(gender, Resume_Gender.MALE, Resume_Gender)}
                onChange={() => onGenderChange(Resume_Gender.MALE)}
                className={styles.radio}
              />
              <span className={styles.radioText}>남</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                checked={compareEnumValue(gender, Resume_Gender.FEMALE, Resume_Gender)}
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

      <div className={styles.gridContainer1}>
        {/* 전화번호 */}
        <div className={styles.formField}>
          <Input 
            type="text"
            label="소개"
            placeholder=""
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInfoEdit;

