import React from 'react';
import { ResumeUpdateRequest_CareerRequest_Achievement } from '@/generated/resume';
import { DateTime } from 'luxon';

interface AchievementViewProps {
  achievements: ResumeUpdateRequest_CareerRequest_Achievement[];
}

/**
 * 성과/프로젝트 정보 읽기 전용 컴포넌트
 */
const AchievementView: React.FC<AchievementViewProps> = ({ achievements }) => {
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '-';
    return DateTime.fromMillis(timestamp).toFormat('yyyy.MM');
  };

  if (!achievements || achievements.length === 0) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#999'
      }}>
        등록된 프로젝트/성과가 없습니다.
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
        프로젝트 & 성과
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {achievements.filter(a => a.isVisible !== false).map((achievement) => (
          <div
            key={achievement.id}
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
              alignItems: 'flex-start',
              marginBottom: '12px'
            }}>
              <h4 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                color: '#333',
                margin: 0
              }}>
                {achievement.title}
              </h4>
              <span style={{
                fontSize: '13px',
                color: '#666',
                whiteSpace: 'nowrap',
                marginLeft: '16px'
              }}>
                {formatDate(achievement.startedAt)} ~ {formatDate(achievement.endedAt)}
              </span>
            </div>

            {achievement.role && (
              <div style={{ 
                marginBottom: '8px',
                fontSize: '14px',
                color: '#666'
              }}>
                <strong>역할:</strong> {achievement.role}
              </div>
            )}

            {achievement.description && (
              <div style={{ 
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {achievement.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementView;

