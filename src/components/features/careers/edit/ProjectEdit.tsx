import React, { useEffect } from 'react';
import { ResumeUpdateRequest_ProjectRequest } from '@/generated/resume';
import Input from '@/components/ui/Input';
import DatePicker from '@/components/ui/DatePicker';
import DateUtil from '@/utils/DateUtil';
import DraggableList from '@/components/ui/DraggableList';
import DraggableItem from '@/components/ui/DraggableItem';
import CardActions from '@/components/ui/CardActions';
import EmptyState from '@/components/ui/EmptyState';

interface ProjectEditProps {
  projects: ResumeUpdateRequest_ProjectRequest[];
  onUpdate: (projects: ResumeUpdateRequest_ProjectRequest[]) => void;
}

interface ProjectItemProps {
  project: ResumeUpdateRequest_ProjectRequest;
  index: number;
  handleProjectChange: (index: number, field: keyof ResumeUpdateRequest_ProjectRequest, value: string | number | boolean | undefined) => void;
  toggleVisible: (index: number) => void;
  handleDeleteProject: (index: number) => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  index,
  handleProjectChange,
  toggleVisible,
  handleDeleteProject,
}) => {
  return (
    <DraggableItem 
        id={project.id || `project-${index}`}
    >
        <div className="card">
            <ul className="edit-cont">
                <li>
                    <p>프로젝트명</p>
                    <Input 
                        type="text"
                        label="프로젝트명"
                        placeholder="프로젝트명을 입력해 주세요."
                        value={project.title || ''}
                        onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                    />
                </li>
                <li>
                    <p>소속</p>
                    <Input 
                        type="text"
                        label="소속"
                        placeholder="소속을 입력해 주세요."
                        value={project.affiliation || ''}
                        onChange={(e) => handleProjectChange(index, 'affiliation', e.target.value)}
                    />
                </li>
                <li>
                    <p>시작년월 - 종료년월</p>
                    <div>
                        <DatePicker 
                            required={false}
                            value={project.startedAt}
                            onChange={(date) => handleProjectChange(index, 'startedAt', date)}
                        />
                        <span>-</span>
                        <DatePicker 
                            required={false}
                            value={project.endedAt}
                            onChange={(date) => handleProjectChange(index, 'endedAt', date)}
                        />
                    </div>
                </li>
                <li>
                    <p>역할</p>
                    <Input 
                        type="text"
                        label="역할"
                        placeholder="예) PM, 기획 등"
                        value={project.role || ''}
                        onChange={(e) => handleProjectChange(index, 'role', e.target.value)}
                    />
                </li>
                <li className="full">
                    <p>내용</p>
                    {/* <Input
                        type="text"
                        label="내용"
                        placeholder="내용을 입력해 주세요."
                        value={project.description || ''}
                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    /> */}
                    <textarea placeholder="내용을 입력해 주세요."></textarea>
                </li>
            </ul>
            <CardActions
            isVisible={project.isVisible ?? true}
            onToggleVisible={() => toggleVisible(index)}
            onDelete={() => handleDeleteProject(index)}
            />
        </div>
    </DraggableItem>
  );
};

/**
 * 프로젝트 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 프로젝트 항목 포함
 */
const ProjectEdit: React.FC<ProjectEditProps> = ({ projects, onUpdate }) => {
  const createEmptyProject = (priority: number = 0): ResumeUpdateRequest_ProjectRequest => ({
    title: '',
    role: '',
    affiliation: '',
    description: '',
    startedAt: undefined,
    endedAt: undefined,
    isVisible: true,
    priority,
  });

  // priority를 배열 인덱스와 동기화
  useEffect(() => {
    const needsUpdate = projects.some((project, idx) => project.priority !== idx);
    if (needsUpdate && projects.length > 0) {
      const updated = projects.map((project, idx) => ({
        ...project,
        priority: idx
      }));
      onUpdate(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length]);

  const handleAddProject = () => {
    const newProject = createEmptyProject(projects.length);
    onUpdate([...projects, newProject]);
  };

  const handleDeleteProject = (index: number) => {
    const filtered = projects.filter((_, i) => i !== index);
    // priority를 인덱스로 재설정
    const updated = filtered.map((project, idx) => ({
      ...project,
      priority: idx
    }));
    onUpdate(updated);
  };

  const handleProjectChange = (index: number, field: keyof ResumeUpdateRequest_ProjectRequest, value: string | number | boolean | undefined) => {
    const newProjects = [...projects];
    
    // startedAt, endedAt는 timestamp(number)로 변환
    if (field === 'startedAt' || field === 'endedAt') {
      newProjects[index] = {
        ...newProjects[index],
        [field]: typeof value === 'string' ? DateUtil.parseToTimestamp(value) : value
      };
    } else {
      newProjects[index] = {
        ...newProjects[index],
        [field]: value
      };
    }
    
    // priority를 인덱스로 설정
    const updatedProjects = newProjects.map((project, idx) => ({
      ...project,
      priority: idx
    }));
    
    onUpdate(updatedProjects);
  };

  const toggleVisible = (index: number) => {
    handleProjectChange(index, 'isVisible', !projects[index].isVisible);
  };

  const handleReorder = (reorderedProjects: ResumeUpdateRequest_ProjectRequest[]) => {
    const updatedProjects = reorderedProjects.map((project, idx) => ({
      ...project,
      priority: idx
    }));
    onUpdate(updatedProjects);
  };

  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>프로젝트</h3>
                {/* <p>{projects.length}개</p> */}
            </div>
            <button onClick={handleAddProject}><i className="ic-add" />추가</button>
        </div>

        {projects.length === 0 ? (
        <EmptyState text="등록된 프로젝트 정보가 없습니다." />
        ) : (
        <DraggableList
            items={projects}
            onReorder={handleReorder}
            getItemId={(proj, idx) => proj.id || `project-${idx}`}
            renderItem={(project, index) => (
            <ProjectItem
                key={project.id || `project-${index}`}
                project={project}
                index={index}
                handleProjectChange={handleProjectChange}
                toggleVisible={toggleVisible}
                handleDeleteProject={handleDeleteProject}
            />
            )}
        />
        )}
    </>
  );
};

export default ProjectEdit;

