import React, { useEffect } from 'react';
import { ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest } from '@/generated/resume';
import Input from '@/components/portal/ui/Input';
import DatePicker from '@/components/portal/ui/DatePicker';
import DateUtil from '@/utils/DateUtil';
import DraggableList from '@/components/portal/ui/DraggableList';
import DraggableItem from '@/components/portal/ui/DraggableItem';
import CardActions from '@/components/portal/ui/CardActions';
import EmptyState from '@/components/portal/ui/EmptyState';

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
    >
        <div className="card">
            <ul className="edit-cont">
                <li className="full">
                    <p>시험</p>
                    <Input 
                        type="text"
                        label="시험명"
                        placeholder="시험명을 입력해 주세요."
                        value={languageTest.name || ''}
                        onChange={(e) => handleLanguageTestChange(index, 'name', e.target.value)}
                    />
                </li>
                <li>
                    <p>점수 및 등급</p>
                    <Input 
                        type="text"
                        label="점수 및 등급"
                        placeholder="점수 및 등급을 입력해 주세요."
                        value={languageTest.score || ''}
                        onChange={(e) => handleLanguageTestChange(index, 'score', e.target.value)}
                    />
                </li>
                <li>
                    <p>취득년월</p>
                    <DatePicker 
                        required={false}
                        value={languageTest.acquiredAt}
                        onChange={(date) => handleLanguageTestChange(index, 'acquiredAt', date)}
                    />
                </li>
            </ul>
            <CardActions
                isVisible={languageTest.isVisible ?? true}
                onToggleVisible={() => toggleVisible(index)}
                onDelete={() => handleDeleteLanguageTest(index)}
            />
        </div>
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
    <div className="card-sub">
        <div className="cont-sub-tit">
            <div>
                <h4>어학 시험</h4>
                {/* <p>{languageTests.length}개</p> */}
            </div>
            <button onClick={handleAddLanguageTest}><i className="ic-add" />추가</button>
        </div>
        {languageTests.length === 0 ? (
          <EmptyState text="등록된 어학 시험 정보가 없습니다." />
        ) : (
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
        )}
    </div>
  );
};

export default LanguageTestEdit;

