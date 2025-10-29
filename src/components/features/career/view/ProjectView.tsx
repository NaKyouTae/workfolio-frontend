import React from 'react';
import { Project } from '@/generated/common';
import { DateUtil } from '@/utils/DateUtil';
import EmptyState from '@/components/ui/EmptyState';

interface ProjectViewProps {
  projects: Project[];
  showHidden?: boolean;
}

/**
 * 프로젝트 정보 읽기 전용 컴포넌트
 */
const ProjectView: React.FC<ProjectViewProps> = ({ projects, showHidden = false }) => {
  // 필터링된 프로젝트 목록 (한 번만 필터링)
  const filteredProjects = projects.filter(p => showHidden ? true : p.isVisible !== false);

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
      
      {(!projects || filteredProjects.length === 0) ? (
        <EmptyState text="등록된 프로젝트 정보가 없습니다." />
      ) : (
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {filteredProjects.map((project) => (
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
                { project.title && (
                    <h4 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#333', 
                      margin: 0
                    }}>
                      {project.title}
                    </h4>
                  )
                }
                {
                  project.affiliation && (
                    <span style={{
                      fontSize: '13px',
                      color: project.affiliation ? '#999' : '#ddd',
                      whiteSpace: 'nowrap'
                    }}>
                      {project.affiliation}
                    </span>
                  )
                }
              </div>
              {
                project.startedAt && (
                  <span style={{
                    fontSize: '13px',
                    color: '#999',
                    whiteSpace: 'nowrap',
                    marginLeft: '16px'
                  }}>
                    {DateUtil.formatTimestamp(project.startedAt || 0, 'YYYY. MM.')}
                  </span>
                )
              }
              {
                project.endedAt && (
                  <span style={{
                    fontSize: '13px',
                    color: '#999',
                    whiteSpace: 'nowrap',
                    marginLeft: '16px'
                  }}>
                    - {DateUtil.formatTimestamp(project.endedAt || 0, 'YYYY. MM.')}
                  </span>
                )
              }
            </div>
            {
              project.role && (
                <div style={{ 
                  fontSize: '14px',
                  color: project.role ? '#666' : '#ddd',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '4px'
                }}>
                  {project.role}
                </div>
              )
            }
            {
              project.description && (
                <div style={{ 
                  fontSize: '14px',
                  color: project.description ? '#666' : '#ddd',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {project.description}
                </div>
              )
            }
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

export default ProjectView;

