import React from 'react';
import { LanguageSkill, LanguageSkill_Language, LanguageSkill_LanguageLevel } from '@workfolio/shared/generated/common';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';
import { normalizeEnumValue } from '@workfolio/shared/utils/commonUtils';
import styles from './PublicView.module.css';

interface PublicLanguageSkillViewProps {
  languageSkills: LanguageSkill[];
}

const PublicLanguageSkillView: React.FC<PublicLanguageSkillViewProps> = ({ languageSkills }) => {
  const visibleLanguageSkills = languageSkills.filter((s) => s.isVisible === true);

  const getLanguageLabel = (language?: LanguageSkill_Language) => {
    const normalizedLanguage = normalizeEnumValue(language, LanguageSkill_Language);
    switch (normalizedLanguage) {
      case LanguageSkill_Language.KOREAN:
        return '한국어';
      case LanguageSkill_Language.ENGLISH:
        return '영어';
      case LanguageSkill_Language.JAPANESE:
        return '일본어';
      case LanguageSkill_Language.CHINESE:
        return '중국어';
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
      default:
        return '';
    }
  };

  const getLevelLabel = (level?: LanguageSkill_LanguageLevel) => {
    const normalizedLevel = normalizeEnumValue(level, LanguageSkill_LanguageLevel);
    switch (normalizedLevel) {
      case LanguageSkill_LanguageLevel.DAILY_CONVERSATION:
        return '일상회화';
      case LanguageSkill_LanguageLevel.BUSINESS_CONVERSATION:
        return '비즈니스 회화';
      case LanguageSkill_LanguageLevel.NATIVE_LEVEL:
        return '원어민 수준';
      default:
        return '';
    }
  };

  return (
    <div className={styles.viewContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>어학</h2>
      </div>

      <ul className={styles.itemList}>
        {visibleLanguageSkills.map((skill) => {
          const visibleTests = (skill.languageTests || []).filter((t) => t.isVisible === true);
          return (
          <li key={skill.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <div className={styles.itemTitleGroup}>
                {skill.language && <h3 className={styles.itemTitle}>{getLanguageLabel(skill.language)}</h3>}
                {skill.level && <span className={styles.itemSubtitle}>{getLevelLabel(skill.level)}</span>}
              </div>
            </div>

            {visibleTests.length > 0 && (
              <ul className={styles.subList}>
                {visibleTests.map((test) => (
                  <li key={test.id} className={styles.subItem}>
                    <span className={styles.subItemName}>{test.name}</span>
                    <span className={styles.subItemValue}>{test.score}</span>
                    {test.acquiredAt && (
                      <span className={styles.subItemDate}>
                        {DateUtil.formatTimestamp(test.acquiredAt, 'YYYY. MM.')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PublicLanguageSkillView;
