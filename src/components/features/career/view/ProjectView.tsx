import React from 'react';
import { Project } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';

interface ProjectViewProps {
  projects: Project[];
}

/**
 * 프로젝트 정보 읽기 전용 컴포넌트
 */
const ProjectView: React.FC<ProjectViewProps> = ({ projects }) => {
  const formatDate = (timestamp?: number) => {
    if (!timestamp) return '-';
    return DateUtil.formatTimestamp(timestamp, 'yyyy.MM');
  };

  if (!projects || projects.length === 0) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#999'
      }}>
        등록된 프로젝트가 없습니다.
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
        프로젝트
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {projects.filter(p => p.isVisible !== false).map((project) => (
          <div
            key={project.id}
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
                {project.title}
              </h4>
              <span style={{
                fontSize: '13px',
                color: '#666',
                whiteSpace: 'nowrap',
                marginLeft: '16px'
              }}>
                {formatDate(project.startedAt)} ~ {formatDate(project.endedAt)}
              </span>
            </div>

            {project.role && (
              <div style={{ 
                marginBottom: '8px',
                fontSize: '14px',
                color: '#666'
              }}>
                <strong>역할:</strong> {project.role}
              </div>
            )}

            {project.description && (
              <div style={{ 
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {project.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectView;

