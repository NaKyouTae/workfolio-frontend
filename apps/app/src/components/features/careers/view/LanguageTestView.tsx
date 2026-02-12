import React from 'react';
import { LanguageTest } from '@workfolio/shared/generated/common';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';

interface LanguageTestViewProps {
  languageTests: LanguageTest[];
  showHidden?: boolean;
}

/**
 * 어학 시험 읽기 전용 컴포넌트
 */
const LanguageTestView: React.FC<LanguageTestViewProps> = ({ languageTests, showHidden = false }) => {
  if (!languageTests || languageTests.length === 0) {
    return null;
  }

  return (
    <ul>
        {languageTests
        .filter(t => showHidden ? true : t.isVisible !== false)
        .sort((a, b) => (b.acquiredAt || 0) - (a.acquiredAt || 0))
        .map((languageTest) => (
            <li 
                key={languageTest.id}
            >
                {
                languageTest.acquiredAt && (
                    <p>{DateUtil.formatTimestamp(languageTest.acquiredAt || 0, 'YYYY. MM. DD.')}</p>
                )
                }
                <div>
                    {
                    languageTest.name && (
                        <p>{languageTest.name}</p>
                    )
                    }
                    {
                    languageTest.score && (
                        <span>{languageTest.score}</span>
                    )
                    }
                </div>
            </li>
        ))}
    </ul>
  );
};

export default LanguageTestView;

