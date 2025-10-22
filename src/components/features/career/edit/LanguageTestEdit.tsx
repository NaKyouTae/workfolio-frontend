import React from 'react';
import { ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest } from '@/generated/resume';
import Input from '@/components/ui/Input';
import DatePicker from '@/components/ui/DatePicker';
import DateUtil from '@/utils/DateUtil';
import styles from '../CareerContentEdit.module.css';

interface LanguageTestEditProps {
  languageTests: ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest[];
  onUpdate: (languageTests: ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest[]) => void;
}

/**
 * 어학 시험 서브섹션을 관리하는 컴포넌트
 */
const LanguageTestEdit: React.FC<LanguageTestEditProps> = ({ languageTests, onUpdate }) => {
  const createEmptyLanguageTest = (): ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest => ({
    name: '',
    score: '',
    acquiredAt: undefined,
  });

  const handleAddLanguageTest = () => {
    onUpdate([...languageTests, createEmptyLanguageTest()]);
  };

  const handleDeleteLanguageTest = (index: number) => {
    if (languageTests.length > 0) {
      onUpdate(languageTests.filter((_, i) => i !== index));
    }
  };

  const handleLanguageTestChange = (index: number, field: keyof ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest, value: string | number) => {
    const newLanguageTests = [...languageTests];
    
    // examinedAt는 timestamp(number)로 변환
    if (field === 'acquiredAt') {
      newLanguageTests[index] = {
        ...newLanguageTests[index],
        [field]: typeof value === 'string' ? DateUtil.parseToTimestamp(value) : value
      };
    } else {
      newLanguageTests[index] = {
        ...newLanguageTests[index],
        [field]: value
      };
    }
    
    onUpdate(newLanguageTests);
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <div className={styles.sectionHeader}>
        <h4 className={styles.sectionTitleCounter} style={{ fontSize: '14px' }}>
          어학 시험 | {languageTests.length}개
        </h4>
        <div className={styles.addButtonContainer}>
          <button
            onClick={handleAddLanguageTest}
            className={styles.addButton}
            style={{ fontSize: '12px' }}
          >
            <span>+ 추가</span>
          </button>
        </div>
      </div>

      {languageTests.map((languageTest, index) => (
        <div key={languageTest.id || index} style={{ 
          marginBottom: '12px', 
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          position: 'relative'
        }}>
          {languageTests.length > 0 && (
            <button
              onClick={() => handleDeleteLanguageTest(index)}
              className={styles.deleteButton}
              style={{ top: '8px', right: '8px' }}
            >
              ×
            </button>
          )}

          <div className={styles.gridContainer2}>
            {/* 시험명 */}
            <div className={styles.formField}>
              <Input 
                type="text"
                label="시험명"
                placeholder="TOEIC, TOEFL, JLPT 등"
                value={languageTest.name || ''}
                onChange={(e) => handleLanguageTestChange(index, 'name', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.gridContainer2}>
            {/* 점수/등급 */}
            <div className={styles.formField}>
              <Input 
                type="text"
                label="점수/등급"
                placeholder="00-00-000000"
                value={languageTest.score || ''}
                onChange={(e) => handleLanguageTestChange(index, 'score', e.target.value)}
              />
            </div>

            {/* 취득일 */}
            <div className={styles.formField}>
              <DatePicker 
                required={false}
                label="취득년월"
                value={languageTest.acquiredAt ? DateUtil.formatTimestamp(languageTest.acquiredAt) : undefined}
                onChange={(date) => handleLanguageTestChange(index, 'acquiredAt', date)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LanguageTestEdit;

