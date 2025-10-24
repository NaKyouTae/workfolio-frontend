import React, { useEffect } from 'react';
import { ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest } from '@/generated/resume';
import Input from '@/components/ui/Input';
import DatePicker from '@/components/ui/DatePicker';
import DateUtil from '@/utils/DateUtil';
import styles from '../CareerContentEdit.module.css';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import CardActions from '@/components/ui/CardActions';

interface LanguageTestEditProps {
  languageTests: ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest[];
  onUpdate: (languageTests: ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest[]) => void;
}

interface LanguageTestItemProps {
  languageTest: ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest;
  index: number;
  handleLanguageTestChange: (index: number, field: keyof ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest, value: string | number | boolean) => void;
  toggleVisible: (index: number) => void;
  handleDeleteLanguageTest: (index: number) => void;
}

const LanguageTestItem: React.FC<LanguageTestItemProps> = ({
  languageTest,
  index,
  handleLanguageTestChange,
  toggleVisible,
  handleDeleteLanguageTest,
}) => {
  return (
    <DraggableItem 
      id={languageTest.id || `language-test-${index}`}
      className={styles.cardWrapper}
      dragButtonSize={20}
    >
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
      
      <CardActions
        isVisible={languageTest.isVisible ?? true}
        onToggleVisible={() => toggleVisible(index)}
        onDelete={() => handleDeleteLanguageTest(index)}
      />
    </DraggableItem>
  );
};

/**
 * 어학 시험 서브섹션을 관리하는 컴포넌트
 */
const LanguageTestEdit: React.FC<LanguageTestEditProps> = ({ languageTests, onUpdate }) => {
  const createEmptyLanguageTest = (priority: number = 0): ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest => ({
    name: '',
    score: '',
    acquiredAt: undefined,
    isVisible: true,
    priority,
  });

  // priority를 배열 인덱스와 동기화
  useEffect(() => {
    const needsUpdate = languageTests.some((test, idx) => test.priority !== idx);
    if (needsUpdate && languageTests.length > 0) {
      const updated = languageTests.map((test, idx) => ({
        ...test,
        priority: idx
      }));
      onUpdate(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageTests.length]);

  const handleAddLanguageTest = () => {
    const newLanguageTest = createEmptyLanguageTest(languageTests.length);
    onUpdate([...languageTests, newLanguageTest]);
  };

  const handleDeleteLanguageTest = (index: number) => {
    if (languageTests.length > 0) {
      const filtered = languageTests.filter((_, i) => i !== index);
      // priority를 인덱스로 재설정
      const updated = filtered.map((languageTest, idx) => ({
        ...languageTest,
        priority: idx
      }));
      onUpdate(updated);
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
    
    // priority를 인덱스로 설정
    const updatedLanguageTests = newLanguageTests.map((languageTest, idx) => ({
      ...languageTest,
      priority: idx
    }));
    
    onUpdate(updatedLanguageTests);
  };

  const toggleVisible = (index: number) => {
    handleLanguageTestChange(index, 'isVisible', !languageTests[index].isVisible);
  };

  const handleReorder = (reorderedLanguageTests: ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest[]) => {
    const updatedLanguageTests = reorderedLanguageTests.map((test, idx) => ({
      ...test,
      priority: idx
    }));
    onUpdate(updatedLanguageTests);
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

      <DraggableList
        items={languageTests}
        onReorder={handleReorder}
        getItemId={(test, idx) => test.id || `language-test-${idx}`}
        renderItem={(languageTest, index) => (
          <LanguageTestItem
            key={languageTest.id || `language-test-${index}`}
            languageTest={languageTest}
            index={index}
            handleLanguageTestChange={handleLanguageTestChange}
            toggleVisible={toggleVisible}
            handleDeleteLanguageTest={handleDeleteLanguageTest}
          />
        )}
      />
    </div>
  );
};

export default LanguageTestEdit;

