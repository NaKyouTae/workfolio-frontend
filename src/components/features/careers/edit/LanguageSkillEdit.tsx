import React, { useEffect } from 'react';
import { ResumeUpdateRequest_LanguageSkillRequest, ResumeUpdateRequest_LanguageSkillRequest_LanguageTestRequest } from '@/generated/resume';
import { LanguageSkill_Language, LanguageSkill_LanguageLevel } from '@/generated/common';
import Dropdown from '@/components/ui/Dropdown';
import LanguageTestEdit from './LanguageTestEdit';
import { normalizeEnumValue } from '@/utils/commonUtils';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import CardActions from '@/components/ui/CardActions';
import EmptyState from '@/components/ui/EmptyState';

interface LanguageSkillEditProps {
  languageSkills: ResumeUpdateRequest_LanguageSkillRequest[];
  onUpdate: (languageSkills: ResumeUpdateRequest_LanguageSkillRequest[]) => void;
}

interface LanguageSkillItemProps {
  languageSkill: ResumeUpdateRequest_LanguageSkillRequest;
  index: number;
  handleLanguageSkillChange: (index: number, field: keyof ResumeUpdateRequest_LanguageSkillRequest, value: string | number | boolean | undefined) => void;
  toggleVisible: (index: number) => void;
  handleDeleteLanguageSkill: (index: number) => void;
  languageSkills: ResumeUpdateRequest_LanguageSkillRequest[];
  onUpdate: (languageSkills: ResumeUpdateRequest_LanguageSkillRequest[]) => void;
}

const LanguageSkillItem: React.FC<LanguageSkillItemProps> = ({
  languageSkill,
  index,
  handleLanguageSkillChange,
  toggleVisible,
  handleDeleteLanguageSkill,
  languageSkills,
  onUpdate,
}) => {
  return (
    <DraggableItem 
        id={languageSkill.id || `language-skill-${index}`}
    >
        <div className="card-wrap">
            <div className="card">
                <ul className="edit-cont">
                    <li>
                        <p>언어</p>
                        <Dropdown
                            selectedOption={normalizeEnumValue(languageSkill.language, LanguageSkill_Language)}
                            options={[
                                { value: LanguageSkill_Language.ENGLISH, label: '영어' },
                                { value: LanguageSkill_Language.JAPANESE, label: '일본어' },
                                { value: LanguageSkill_Language.CHINESE, label: '중국어' },
                                { value: LanguageSkill_Language.KOREAN, label: '한국어' },
                                { value: LanguageSkill_Language.FRENCH, label: '프랑스어' },
                                { value: LanguageSkill_Language.SPANISH, label: '스페인어' },
                                { value: LanguageSkill_Language.GERMAN, label: '독일어' },
                                { value: LanguageSkill_Language.RUSSIAN, label: '러시아어' },
                                { value: LanguageSkill_Language.VIETNAMESE, label: '베트남어' },
                                { value: LanguageSkill_Language.ITALIAN, label: '이탈리아어' },
                                { value: LanguageSkill_Language.THAI, label: '태국어' },
                                { value: LanguageSkill_Language.ARABIC, label: '아랍어' },
                                { value: LanguageSkill_Language.PORTUGUESE, label: '포르투갈어' },
                                { value: LanguageSkill_Language.INDONESIAN, label: '인도네시아어' },
                                { value: LanguageSkill_Language.MONGOLIAN, label: '몽골어' },
                                { value: LanguageSkill_Language.TURKISH, label: '터키어' },
                            ]}
                            setValue={(value) => handleLanguageSkillChange(index, 'language', normalizeEnumValue(value, LanguageSkill_Language))}
                        />
                    </li>
                    <li>
                        <p>수준</p>
                        <Dropdown
                            selectedOption={normalizeEnumValue(languageSkill.level, LanguageSkill_LanguageLevel)}
                            options={[
                                { value: LanguageSkill_LanguageLevel.DAILY_CONVERSATION, label: '일상 회화 가능' },
                                { value: LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION, label: '비즈니스 회화 가능' },
                                { value: LanguageSkill_LanguageLevel.NATIVE_LEVEL, label: '원어민 수준' },
                            ]}
                            setValue={(value) => handleLanguageSkillChange(index, 'level', normalizeEnumValue(value, LanguageSkill_LanguageLevel))}
                        />
                    </li>
                </ul>
                <CardActions
                isVisible={languageSkill.isVisible ?? true}
                onToggleVisible={() => toggleVisible(index)}
                onDelete={() => handleDeleteLanguageSkill(index)}
                />
            </div>
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
    </DraggableItem>
  );
};

/**
 * 어학 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 어학 항목 포함
 */
const LanguageSkillEdit: React.FC<LanguageSkillEditProps> = ({ languageSkills, onUpdate }) => {
  const createEmptyLanguageSkill = (priority: number = 0): ResumeUpdateRequest_LanguageSkillRequest => ({
    language: LanguageSkill_Language.ENGLISH,
    level: LanguageSkill_LanguageLevel.DAILY_CONVERSATION,
    isVisible: true,
    priority,
    languageTests: [],
  });

  // priority를 배열 인덱스와 동기화 (languageSkill와 languageTests 모두)
  useEffect(() => {
    let needsUpdate = false;
    
    // languageSkill priority 체크
    const skillNeedsUpdate = languageSkills.some((skill, idx) => skill.priority !== idx);
    
    // languageTests priority 체크
    const testsNeedUpdate = languageSkills.some(skill => 
      skill.languageTests?.some((test, idx) => test.priority !== idx)
    );
    
    needsUpdate = skillNeedsUpdate || testsNeedUpdate;
    
    if (needsUpdate && languageSkills.length > 0) {
      const updated = languageSkills.map((skill, idx) => ({
        ...skill,
        priority: idx,
        languageTests: (skill.languageTests || []).map((test, testIdx) => ({
          ...test,
          priority: testIdx
        }))
      }));
      onUpdate(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageSkills.length, languageSkills.reduce((sum, s) => sum + (s.languageTests?.length || 0), 0)]);

  const handleAddLanguageSkill = () => {
    const newLanguageSkill = createEmptyLanguageSkill(languageSkills.length);
    onUpdate([...languageSkills, newLanguageSkill]);
  };

  const handleDeleteLanguageSkill = (index: number) => {
    const filtered = languageSkills.filter((_, i) => i !== index);
    // priority를 인덱스로 재설정
    const updated = filtered.map((languageSkill, idx) => ({
      ...languageSkill,
      priority: idx
    }));
    onUpdate(updated);
  };

  const handleLanguageSkillChange = (index: number, field: keyof ResumeUpdateRequest_LanguageSkillRequest, value: string | number | boolean | undefined) => {
    const newLanguageSkills = [...languageSkills];
    newLanguageSkills[index] = {
      ...newLanguageSkills[index],
      [field]: value
    };
    
    // priority를 인덱스로 설정
    const updatedLanguageSkills = newLanguageSkills.map((languageSkill, idx) => ({
      ...languageSkill,
      priority: idx
    }));
    
    onUpdate(updatedLanguageSkills);
  };

  const toggleVisible = (index: number) => {
    handleLanguageSkillChange(index, 'isVisible', !languageSkills[index].isVisible);
  };

  const handleReorder = (reorderedLanguageSkills: ResumeUpdateRequest_LanguageSkillRequest[]) => {
    const updatedLanguageSkills = reorderedLanguageSkills.map((skill, idx) => ({
      ...skill,
      priority: idx
    }));
    onUpdate(updatedLanguageSkills);
  };

  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>어학</h3>
                {/* <p>{languageSkills.length}개</p> */}
            </div>
            <button onClick={handleAddLanguageSkill}><i className="ic-add" />추가</button>
        </div>

        {languageSkills.length === 0 ? (
        <EmptyState text="등록된 어학 정보가 없습니다." />
        ) : (
        <DraggableList
            items={languageSkills}
            onReorder={handleReorder}
            getItemId={(skill, idx) => skill.id || `language-skill-${idx}`}
            renderItem={(languageSkill, index) => (
            <LanguageSkillItem
                key={languageSkill.id || `language-skill-${index}`}
                languageSkill={languageSkill}
                index={index}
                handleLanguageSkillChange={handleLanguageSkillChange}
                toggleVisible={toggleVisible}
                handleDeleteLanguageSkill={handleDeleteLanguageSkill}
                languageSkills={languageSkills}
                onUpdate={onUpdate}
            />
            )}
        />
        )}
    </>
  );
};

export default LanguageSkillEdit;

