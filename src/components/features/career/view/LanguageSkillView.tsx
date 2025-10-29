import React from 'react';
import { LanguageSkill, LanguageSkill_Language, LanguageSkill_LanguageLevel } from '@/generated/common';
import LanguageTestView from './LanguageTestView';
import { normalizeEnumValue } from '@/utils/commonUtils';
import EmptyState from '@/components/ui/EmptyState';

interface LanguageSkillViewProps {
  languageSkills: LanguageSkill[];
  showHidden?: boolean;
}

/**
 * 어학 능력 읽기 전용 컴포넌트
 */
const LanguageSkillView: React.FC<LanguageSkillViewProps> = ({ languageSkills, showHidden = false }) => {
  const getLanguageLabel = (language?: LanguageSkill_Language) => {
    const normalizedLanguage = normalizeEnumValue(language, LanguageSkill_Language);
    switch (normalizedLanguage) {
      case LanguageSkill_Language.ENGLISH:
        return '영어';
      case LanguageSkill_Language.JAPANESE:
        return '일본어';
      case LanguageSkill_Language.CHINESE:
        return '중국어';
      case LanguageSkill_Language.KOREAN:
        return '한국어';
      case LanguageSkill_Language.FRENCH:
        return '프랑스어';
      case LanguageSkill_Language.SPANISH:
        return '스페인어';
      case LanguageSkill_Language.GERMAN:
        return '독일어';
      case LanguageSkill_Language.RUSSIAN:
        return '러시아어';
      case LanguageSkill_Language.VIETNAMESE:
        return '베트남어';
      case LanguageSkill_Language.ITALIAN:
        return '이탈리아어';
      case LanguageSkill_Language.THAI:
        return '태국어';
      case LanguageSkill_Language.ARABIC:
        return '아랍어';
      case LanguageSkill_Language.PORTUGUESE:
        return '포르투갈어';
      case LanguageSkill_Language.INDONESIAN:
        return '인도네시아어';
      case LanguageSkill_Language.MONGOLIAN:
        return '몽골어';
      case LanguageSkill_Language.TURKISH:
        return '터키어';
      case LanguageSkill_Language.UNRECOGNIZED:
        return '미선택';
      default:
        return '';
    }
  };

  const getLevelLabel = (level?: LanguageSkill_LanguageLevel) => {
    const normalizedLevel = normalizeEnumValue(level, LanguageSkill_LanguageLevel);
    switch (normalizedLevel) {
      case LanguageSkill_LanguageLevel.DAILY_CONVERSATION:
        return '일상 회화 가능';
      case LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION:
        return '비즈니스 회화 가능';
      case LanguageSkill_LanguageLevel.NATIVE_LEVEL:
        return '원어민 수준';
      case LanguageSkill_LanguageLevel.UNRECOGNIZED:
        return '미선택';
      default:
        return '';
    }
  };

  return (
    <div>
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: '700', 
        color: '#000',
        marginBottom: '20px'
      }}>
        언어
      </h3>
      
      {(!languageSkills || languageSkills.length === 0) ? (
        <EmptyState text="등록된 어학 정보가 없습니다." />
      ) : (
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {languageSkills.filter(l => showHidden ? true : l.isVisible !== false).map((languageSkill) => (
          <div 
            key={languageSkill.id}
            style={{
              padding: '20px',
              border: '1px solid #e0e0e0',
              marginBottom: '16px'
            }}
          >
            {
              languageSkill.language && (
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#333', 
                  marginBottom: '8px'
                }}>
                  {getLanguageLabel(languageSkill.language)}
                </h4>
              )
            }
            {
              languageSkill.level && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{
                    fontSize: '13px',
                    color: '#999',
                    whiteSpace: 'nowrap',                
                  }}>
                    {getLevelLabel(languageSkill.level)}
                  </span>
                </div>
              )
            }

            {/* 어학 시험 */}
            {languageSkill.languageTests && languageSkill.languageTests.length > 0 && (
              <LanguageTestView languageTests={languageSkill.languageTests} showHidden={showHidden} />
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default LanguageSkillView;

