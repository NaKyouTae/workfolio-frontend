import React, { useEffect } from 'react';
import { ResumeUpdateRequest_ProjectRequest } from '@/generated/resume';
import Input from '@/components/ui/Input';
import DatePicker from '@/components/ui/DatePicker';
import DateUtil from '@/utils/DateUtil';
import styles from '../CareerContentEdit.module.css';

interface ProjectEditProps {
  projects: ResumeUpdateRequest_ProjectRequest[];
  onUpdate: (projects: ResumeUpdateRequest_ProjectRequest[]) => void;
}

/**
 * 프로젝트 섹션 전체를 관리하는 컴포넌트
 * sectionHeader, 추가 버튼, 개별 프로젝트 항목 포함
 */
const ProjectEdit: React.FC<ProjectEditProps> = ({ projects, onUpdate }) => {
  const createEmptyProject = (): ResumeUpdateRequest_ProjectRequest => ({
    title: '',
    role: '',
    description: '',
    startedAt: undefined,
    endedAt: undefined,
    isVisible: true,
  });

  // 빈 배열일 때 자동으로 항목 하나 추가
  useEffect(() => {
    if (projects.length === 0) {
      onUpdate([createEmptyProject()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddProject = () => {
    onUpdate([...projects, createEmptyProject()]);
  };

  const handleDeleteProject = (index: number) => {
    onUpdate(projects.filter((_, i) => i !== index));
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
    
    onUpdate(newProjects);
  };

  const toggleVisible = (index: number) => {
    handleProjectChange(index, 'isVisible', !projects[index].isVisible);
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

      {projects.map((project, index) => (
        <div key={project.id || index} className={styles.cardWrapper}>
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
          
          <div className={styles.cardActions}>
            <button
              onClick={() => toggleVisible(index)}
              className={`${styles.visibleButton} ${project.isVisible ? styles.visible : ''}`}
            >
              {project.isVisible ? '보임' : '안보임'}
            </button>
            <button
              onClick={() => handleDeleteProject(index)}
              className={styles.cardDeleteButton}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectEdit;

