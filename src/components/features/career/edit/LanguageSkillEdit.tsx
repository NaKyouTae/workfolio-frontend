import React, { useEffect } from 'react';
import { ResumeUpdateRequest_LanguageSkillRequest, ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest } from '@/generated/resume';
import { LanguageSkill_Language, LanguageSkill_LanguageLevel } from '@/generated/common';
import Dropdown from '@/components/ui/Dropdown';
import styles from '../CareerContentEdit.module.css';
import LanguageTestEdit from './LanguageTestEdit';

interface LanguageSkillEditProps {
  languageSkills: ResumeUpdateRequest_LanguageSkillRequest[];
  onUpdate: (languageSkills: ResumeUpdateRequest_LanguageSkillRequest[]) => void;
}

/**
 * 어학 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 어학 항목 포함
 */
const LanguageSkillEdit: React.FC<LanguageSkillEditProps> = ({ languageSkills, onUpdate }) => {
  const createEmptyLanguageSkill = (): ResumeUpdateRequest_LanguageSkillRequest => ({
    language: LanguageSkill_Language.ENGLISH,
    level: LanguageSkill_LanguageLevel.LANGUAGE_LEVEL_UNKNOWN,
    isVisible: true,
    languageTests: [],
  });

  // 빈 배열일 때 자동으로 항목 하나 추가
  useEffect(() => {
    if (languageSkills.length === 0) {
      onUpdate([createEmptyLanguageSkill()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddLanguageSkill = () => {
    onUpdate([...languageSkills, createEmptyLanguageSkill()]);
  };

  const handleDeleteLanguageSkill = (index: number) => {
    onUpdate(languageSkills.filter((_, i) => i !== index));
  };

  const handleLanguageSkillChange = (index: number, field: keyof ResumeUpdateRequest_LanguageSkillRequest, value: string | number) => {
    const newLanguageSkills = [...languageSkills];
    
    // language, level 필드는 number로 변환
    if (field === 'language' || field === 'level') {
      newLanguageSkills[index] = {
        ...newLanguageSkills[index],
        [field]: Number(value)
      };
    } else {
      newLanguageSkills[index] = {
        ...newLanguageSkills[index],
        [field]: value
      };
    }
    
    onUpdate(newLanguageSkills);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitleCounter}>
          어학 | {languageSkills.length}개
        </h3>
        <div className={styles.addButtonContainer}>
          <button
            onClick={handleAddLanguageSkill}
            className={styles.addButton}
          >
            <span>+ 추가</span>
          </button>
        </div>
      </div>

      {languageSkills.map((languageSkill, index) => (
        <div key={languageSkill.id || index} className={styles.card}>
          {languageSkills.length > 1 && (
            <button
              onClick={() => handleDeleteLanguageSkill(index)}
              className={styles.deleteButton}
            >
              ×
            </button>
          )}

          <div className={styles.gridContainer2}>
            {/* 언어 */}
            <div className={styles.formField}>
              <Dropdown
                label="언어"
                selectedOption={languageSkill.language?.toString() || String(LanguageSkill_Language.ENGLISH)}
                options={[
                  { value: String(LanguageSkill_Language.ENGLISH), label: '영어' },
                  { value: String(LanguageSkill_Language.JAPANESE), label: '일본어' },
                  { value: String(LanguageSkill_Language.CHINESE), label: '중국어' },
                  { value: String(LanguageSkill_Language.KOREAN), label: '한국어' },
                  { value: String(LanguageSkill_Language.FRENCH), label: '프랑스어' },
                  { value: String(LanguageSkill_Language.SPANISH), label: '스페인어' },
                  { value: String(LanguageSkill_Language.GERMAN), label: '독일어' },
                  { value: String(LanguageSkill_Language.RUSSIAN), label: '러시아어' },
                  { value: String(LanguageSkill_Language.VIETNAMESE), label: '베트남어' },
                  { value: String(LanguageSkill_Language.ITALIAN), label: '이탈리아어' },
                  { value: String(LanguageSkill_Language.THAI), label: '태국어' },
                  { value: String(LanguageSkill_Language.ARABIC), label: '아랍어' },
                  { value: String(LanguageSkill_Language.PORTUGUESE), label: '포르투갈어' },
                  { value: String(LanguageSkill_Language.INDONESIAN), label: '인도네시아어' },
                  { value: String(LanguageSkill_Language.MONGOLIAN), label: '몽골어' },
                  { value: String(LanguageSkill_Language.TURKISH), label: '터키어' },
                ]}
                setValue={(value) => handleLanguageSkillChange(index, 'language', value)}
              />
            </div>

            {/* 수준 */}
            <div className={styles.formField}>
              <Dropdown
                label="수준"
                selectedOption={languageSkill.level?.toString() || String(LanguageSkill_LanguageLevel.LANGUAGE_LEVEL_UNKNOWN)}
                options={[
                  { value: String(LanguageSkill_LanguageLevel.DAILY_CONVERSATION), label: '일상 회화 가능' },
                  { value: String(LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION), label: '비즈니스 회화 가능' },
                  { value: String(LanguageSkill_LanguageLevel.NATIVE_LEVEL), label: '원어민 수준' },
                ]}
                setValue={(value) => handleLanguageSkillChange(index, 'level', value)}
              />
            </div>
          </div>

          {/* 어학 시험 */}
          <LanguageTestEdit
            languageTests={languageSkill.languageTests || []}
            onUpdate={(languageTests: ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest[]) => {
              const newLanguageSkills = [...languageSkills];
              newLanguageSkills[index] = {
                ...newLanguageSkills[index],
                languageTests
              };
              onUpdate(newLanguageSkills);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default LanguageSkillEdit;

