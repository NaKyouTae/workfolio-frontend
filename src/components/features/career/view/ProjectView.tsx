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
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 style={{ 
        fontSize: '16px', 
        fontWeight: '700', 
        color: '#000',
        marginBottom: '20px'
      }}>
        프로젝트
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {projects.filter(p => p.isVisible !== false).map((project) => (
          <div 
            key={project.id}
            style={{
              padding: '20px',
              border: '1px solid #e0e0e0',
              marginBottom: '16px'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'baseline',
              marginBottom: '6px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px'
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
                  color: '#999',
                  whiteSpace: 'nowrap'
                }}>
                  {project.affiliation}
                </span>
              </div>
              <span style={{
                fontSize: '13px',
                color: '#999',
                whiteSpace: 'nowrap',
                marginLeft: '16px'
              }}>
                {DateUtil.formatTimestamp(project.startedAt || 0, 'YYYY. MM.')} - {DateUtil.formatTimestamp(project.endedAt || 0, 'YYYY. MM.')} 
              </span>
            </div>

            {project.role && (
              <div style={{ 
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {project.role}
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

