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
    <>
        <div className="cont-tit">
            <div>
                <h3>프로젝트</h3>
            </div>
        </div>
        
        {(!projects || filteredProjects.length === 0) ? (
            <EmptyState text="등록된 프로젝트 정보가 없습니다." />
        ) : (
        
        <ul className="view-list type1">
            {filteredProjects.map((project) => (
                <li 
                    key={project.id}
                >
                    <div className="info">
                        <div>
                            <div>
                                {
                                project.title && (
                                    <h4>{project.title}</h4>
                                )
                                }
                                {
                                project.role && (
                                    <p>{project.role}</p>
                                )
                                }
                            </div>
                            <ul>
                                <li className="font-bl">
                                    {
                                    project.startedAt && (
                                        <>{DateUtil.formatTimestamp(project.startedAt || 0, 'YYYY. MM.')}</>
                                    )
                                    }
                                    {
                                    project.endedAt && (
                                        <>- {DateUtil.formatTimestamp(project.endedAt || 0, 'YYYY. MM.')}</>
                                    )
                                    }
                                </li>
                            </ul>
                        </div>
                        <ul>
                            {
                            project.affiliation && (
                                <li>{project.affiliation}</li>
                            )
                            }
                        </ul>
                    </div>
                    <div className="desc">
                        {
                        project.description && (
                            <p>{project.description}</p>
                        )
                        }
                    </div>
                </li>
            ))}
        </ul>
        )}
    </>
  );
};

export default ProjectView;

