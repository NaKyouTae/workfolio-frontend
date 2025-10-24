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
    isVisible: true,
  });

  const handleAddLanguageTest = () => {
    onUpdate([...languageTests, createEmptyLanguageTest()]);
  };

  const handleDeleteLanguageTest = (index: number) => {
    if (languageTests.length > 0) {
      onUpdate(languageTests.filter((_, i) => i !== index));
    }
  };

  const handleLanguageTestChange = (index: number, field: keyof ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest, value: string | number | boolean) => {
    const newLanguageTests = [...languageTests];
    
    // acquiredAt는 timestamp(number)로 변환
    if (field === 'acquiredAt') {
      newLanguageTests[index] = {
        ...newLanguageTests[index],
        [field]: typeof value === 'string' ? DateUtil.parseToTimestamp(value) : (typeof value === 'number' ? value : undefined)
      };
    } else {
      newLanguageTests[index] = {
        ...newLanguageTests[index],
        [field]: value
      };
    }
    
    onUpdate(newLanguageTests);
  };

  const toggleVisible = (index: number) => {
    handleLanguageTestChange(index, 'isVisible', !languageTests[index].isVisible);
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
        <div key={languageTest.id || index} className={styles.cardWrapper}>
          <div style={{ 
            flex: 1,
            padding: '12px',
            backgroundColor: '#f8f9fa',
            borderRadius: '6px',
            position: 'relative'
          }}>
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
                value={languageTest.acquiredAt}
                onChange={(date) => handleLanguageTestChange(index, 'acquiredAt', date)}
              />
            </div>
          </div>
          </div>
          
          <div className={styles.cardActions}>
            <button
              onClick={() => toggleVisible(index)}
              className={`${styles.visibleButton} ${languageTest.isVisible ? styles.visible : ''}`}
            >
              {languageTest.isVisible ? '보임' : '안보임'}
            </button>
            <button
              onClick={() => handleDeleteLanguageTest(index)}
              className={styles.cardDeleteButton}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LanguageTestEdit;

