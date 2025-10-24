import React from 'react';
import { LanguageSkill, LanguageSkill_Language, LanguageSkill_LanguageLevel } from '@/generated/common';
import LanguageTestView from './LanguageTestView';

interface LanguageSkillViewProps {
  languageSkills: LanguageSkill[];
}

/**
 * 어학 능력 읽기 전용 컴포넌트
 */
const LanguageSkillView: React.FC<LanguageSkillViewProps> = ({ languageSkills }) => {
  const getLanguageLabel = (language?: LanguageSkill_Language) => {
    const labels: Record<LanguageSkill_Language, string> = {
      [LanguageSkill_Language.ENGLISH]: '영어',
      [LanguageSkill_Language.JAPANESE]: '일본어',
      [LanguageSkill_Language.CHINESE]: '중국어',
      [LanguageSkill_Language.KOREAN]: '한국어',
      [LanguageSkill_Language.FRENCH]: '프랑스어',
      [LanguageSkill_Language.SPANISH]: '스페인어',
      [LanguageSkill_Language.GERMAN]: '독일어',
      [LanguageSkill_Language.RUSSIAN]: '러시아어',
      [LanguageSkill_Language.VIETNAMESE]: '베트남어',
      [LanguageSkill_Language.ITALIAN]: '이탈리아어',
      [LanguageSkill_Language.THAI]: '태국어',
      [LanguageSkill_Language.ARABIC]: '아랍어',
      [LanguageSkill_Language.PORTUGUESE]: '포르투갈어',
      [LanguageSkill_Language.INDONESIAN]: '인도네시아어',
      [LanguageSkill_Language.MONGOLIAN]: '몽골어',
      [LanguageSkill_Language.TURKISH]: '터키어',
      [LanguageSkill_Language.UNRECOGNIZED]: '미선택',
    };
    return labels[language || LanguageSkill_Language.UNRECOGNIZED];
  };

  const getLevelLabel = (level?: LanguageSkill_LanguageLevel) => {
    const labels: Record<LanguageSkill_LanguageLevel, string> = {
      [LanguageSkill_LanguageLevel.DAILY_CONVERSATION]: '일상 회화 가능',
      [LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION]: '비즈니스 회화 가능',
      [LanguageSkill_LanguageLevel.NATIVE_LEVEL]: '원어민 수준',
      [LanguageSkill_LanguageLevel.UNRECOGNIZED]: '미선택',
    };
    return labels[level || LanguageSkill_LanguageLevel.UNRECOGNIZED];
  };

  const getLevelColor = (level?: LanguageSkill_LanguageLevel) => {
    const colors: Record<LanguageSkill_LanguageLevel, string> = {
      [LanguageSkill_LanguageLevel.DAILY_CONVERSATION]: '#ff9800',
      [LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION]: '#2196f3',
      [LanguageSkill_LanguageLevel.NATIVE_LEVEL]: '#4caf50',
      [LanguageSkill_LanguageLevel.UNRECOGNIZED]: '#999',
    };
    return colors[level || LanguageSkill_LanguageLevel.UNRECOGNIZED];
  };

  if (!languageSkills || languageSkills.length === 0) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#999'
      }}>
        등록된 어학 능력이 없습니다.
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ 
        marginBottom: '16px', 
        fontSize: '20px', 
        fontWeight: '600', 
        color: '#333' 
      }}>
        어학
      </h3>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px' 
      }}>
        {languageSkills.filter(l => l.isVisible !== false).map((languageSkill) => (
          <div
            key={languageSkill.id}
            style={{
              padding: '20px',
              backgroundColor: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#333',
                margin: 0
              }}>
                {getLanguageLabel(languageSkill.language)}
              </h4>
              <span style={{
                padding: '4px 12px',
                backgroundColor: getLevelColor(languageSkill.level),
                color: '#fff',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {getLevelLabel(languageSkill.level)}
              </span>
            </div>

            {/* 어학 시험 */}
            {languageSkill.languageTests && languageSkill.languageTests.length > 0 && (
              <LanguageTestView languageTests={languageSkill.languageTests} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSkillView;

