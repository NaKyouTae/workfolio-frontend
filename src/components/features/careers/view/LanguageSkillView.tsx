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

  // 필터링된 어학 목록 (한 번만 필터링)
  const filteredLanguageSkills = languageSkills.filter(l => showHidden ? true : l.isVisible !== false);

  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>언어</h3>
            </div>
        </div>
        
        {(!languageSkills || filteredLanguageSkills.length === 0) ? (
            <EmptyState text="등록된 어학 정보가 없습니다." />
        ) : (
        
        <ul className="view-list type1">
        {filteredLanguageSkills.map((languageSkill) => (
            <li 
                key={languageSkill.id}
            >
                <div className="info">
                    <div>
                        <div>
                            {
                            languageSkill.language && (
                                <h4>{getLanguageLabel(languageSkill.language)}</h4>
                            )
                            }
                        </div>
                    </div>
                </div>
                <div className="desc">
                    {
                    languageSkill.level && (
                    <p>{getLevelLabel(languageSkill.level)}</p>
                    )
                    }
                    {/* 어학 시험 */}
                    {languageSkill.languageTests && languageSkill.languageTests.length > 0 && (
                        <LanguageTestView languageTests={languageSkill.languageTests} showHidden={showHidden} />
                    )}
                </div>
            </li>
        ))}
        </ul>
        )}
    </>
  );
};

export default LanguageSkillView;

