import React, { useEffect } from 'react';
import { ResumeUpdateRequest_ProjectRequest } from '@/generated/resume';
import Input from '@/components/ui/Input';
import DatePicker from '@/components/ui/DatePicker';
import DateUtil from '@/utils/DateUtil';
import styles from '../CareerContentEdit.module.css';
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
      className={styles.cardWrapper}
    >
      <div className={styles.card}>
        <div className={styles.gridContainer2}>
        {/* 프로젝트명 */}
        <div className={styles.formField}>
          <Input 
            type="text"
            label="프로젝트명"
            placeholder="전사 ERP 시스템 구축"
            value={project.title || ''}
            onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
          />
        </div>

        {/* 역할 */}
        <div className={styles.formField}>
          <Input 
            type="text"
            label="역할"
            placeholder="백엔드 개발 리드"
            value={project.role || ''}
            onChange={(e) => handleProjectChange(index, 'role', e.target.value)}
          />
        </div>
      </div>
      <div className={styles.gridContainer2}>
        <div className={styles.formField}>
        <Input 
            type="text"
            label="소속"
            placeholder="네이버"
            value={project.affiliation || ''}
            onChange={(e) => handleProjectChange(index, 'affiliation', e.target.value)}
          />
        </div>
      </div>

      <div className={styles.gridContainer2}>
        {/* 시작일 */}
        <div className={styles.formField}>
          <DatePicker 
            required={false}
            label="시작일"
            value={project.startedAt}
            onChange={(date) => handleProjectChange(index, 'startedAt', date)}
          />
        </div>

        {/* 종료일 */}
        <div className={styles.formField}>
          <DatePicker 
            required={false}
            label="종료일"
            value={project.endedAt}
            onChange={(date) => handleProjectChange(index, 'endedAt', date)}
          />
        </div>
      </div>

      <div className={styles.gridContainer2}>
        {/* 설명 */}
        <div className={styles.formFieldSpan2}>
          <Input 
            type="textarea"
            label="상세 설명"
            placeholder="프로젝트에 대한 상세한 설명, 사용한 기술, 성과 등을 기록하세요."
            value={project.description || ''}
            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
          />
        </div>
      </div>
      </div>
      
      <CardActions
        isVisible={project.isVisible ?? true}
        onToggleVisible={() => toggleVisible(index)}
        onDelete={() => handleDeleteProject(index)}
      />
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
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitleCounter}>
          프로젝트 | {projects.length}개
        </h3>
        <div className={styles.addButtonContainer}>
          <button
            onClick={handleAddProject}
            className={styles.addButton}
          >
            <span>+ 추가</span>
          </button>
        </div>
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
    </div>
  );
};

export default ProjectEdit;

