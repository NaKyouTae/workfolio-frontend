import React from 'react';
import { LanguageTest } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';

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
    <div style={{ 
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      padding: '16px'
    }}>
      {languageTests
        .filter(t => showHidden ? true : t.isVisible !== false)
        .sort((a, b) => (b.acquiredAt || 0) - (a.acquiredAt || 0))
        .map((languageTest, index) => (
          <div 
            key={languageTest.id}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              marginBottom: index < languageTests.length - 1 ? '12px' : '0',
              gap: '20px'
            }}
          >
            {/* 좌측: 날짜와 메모 */}
            <div>
              {
                languageTest.acquiredAt && (
                  <div style={{ 
                    fontSize: '14px',
                    color: '#333',
                    marginBottom: '4px',
                    width: '150px',
                  }}>
                    {DateUtil.formatTimestamp(languageTest.acquiredAt || 0, 'YYYY. MM. DD.')}
                  </div>
                )
              }
            </div>

            {/* 우측: 시험명과 점수 */}
            <div style={{ 
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}>
              {
                languageTest.name && (
                  <div style={{ 
                    fontSize: '13px',
                    color: languageTest.name ? '#666' : '#ddd',
                    marginBottom: '4px'
                  }}>
                    {languageTest.name}
                  </div>
                )
              }
              {
                languageTest.score && (
                  <div style={{ 
                    fontSize: '13px',
                    color: languageTest.score ? '#999' : '#ddd',
                    marginBottom: '4px'
                  }}>
                    {languageTest.score}
                  </div>
                )
              }
            </div>
          </div>
        ))}
    </div>
  );
};

export default LanguageTestView;

