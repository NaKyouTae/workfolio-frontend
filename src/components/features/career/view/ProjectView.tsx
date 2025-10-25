import React from 'react';
import { Project } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';
import EmptyState from '@/components/ui/EmptyState';

interface ProjectViewProps {
  projects: Project[];
}

/**
 * 프로젝트 정보 읽기 전용 컴포넌트
 */
const ProjectView: React.FC<ProjectViewProps> = ({ projects }) => {
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
      
      {(!projects || projects.length === 0) ? (
        <EmptyState text="등록된 프로젝트 정보가 없습니다." />
      ) : (
      
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
                  {project.title || '프로젝트명'}
                </h4>
                <span style={{
                  fontSize: '13px',
                  color: project.affiliation ? '#999' : '#ddd',
                  whiteSpace: 'nowrap'
                }}>
                  {project.affiliation || '소속'}
                </span>
              </div>
              <span style={{
                fontSize: '13px',
                color: '#999',
                whiteSpace: 'nowrap',
                marginLeft: '16px'
              }}>
                {DateUtil.formatTimestamp(project.startedAt || 0, 'YYYY. MM.') || '기간'} - {DateUtil.formatTimestamp(project.endedAt || 0, 'YYYY. MM.') || '기간'} 
              </span>
            </div>

            <div style={{ 
              fontSize: '14px',
              color: project.role ? '#666' : '#ddd',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              marginBottom: '4px'
            }}>
              {project.role || '역할'}
            </div>

            <div style={{ 
              fontSize: '14px',
              color: project.description ? '#666' : '#ddd',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap'
            }}>
              {project.description || '상세 설명'}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default ProjectView;

