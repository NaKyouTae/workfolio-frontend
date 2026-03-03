import React from 'react';
import { LanguageSkill } from '@workfolio/shared/generated/common';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';
import { getLanguageLabel, getLanguageLevelLabel } from '../shared/formatters';
import styles from './PublicView.module.css';

interface PublicLanguageSkillViewProps {
  languageSkills: LanguageSkill[];
}

const PublicLanguageSkillView: React.FC<PublicLanguageSkillViewProps> = ({ languageSkills }) => {
  const visibleLanguageSkills = languageSkills.filter((s) => s.isVisible === true);

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
                {skill.level && <span className={styles.itemSubtitle}>{getLanguageLevelLabel(skill.level)}</span>}
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
