import React from 'react';
import { LanguageTest } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';

interface LanguageTestViewProps {
  languageTests: LanguageTest[];
}

/**
 * 어학 시험 읽기 전용 컴포넌트
 */
const LanguageTestView: React.FC<LanguageTestViewProps> = ({ languageTests }) => {
  if (!languageTests || languageTests.length === 0) {
    return null;
  }

  return (
    <div style={{ 
      marginTop: '12px',
      padding: '12px',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px'
    }}>
      <div style={{ 
        fontSize: '13px', 
        fontWeight: '600', 
        color: '#666',
        marginBottom: '8px'
      }}>
        어학 시험
      </div>
      {languageTests.map((languageTest) => (
        <div key={languageTest.id} style={{ 
          marginBottom: '8px',
          paddingBottom: '8px',
          borderBottom: languageTests.indexOf(languageTest) < languageTests.length - 1 ? '1px solid #e0e0e0' : 'none'
        }}>
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#333'
            }}>
              {languageTest.name}
            </span>
          </div>
          
          {languageTest.score && languageTest.score !== '0' && (
            <div style={{ 
              fontSize: '12px', 
              color: '#666',
              marginBottom: '2px'
            }}>
              점수/등급: {languageTest.score}
            </div>
          )}
          
          {languageTest.acquiredAt && (
            <div style={{ 
              fontSize: '12px', 
              color: '#666'
            }}>
              취득년월: {DateUtil.formatTimestamp(languageTest.acquiredAt, 'yyyy.MM')}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default LanguageTestView;

