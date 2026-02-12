import React from 'react';
import { Project } from '@workfolio/shared/generated/common';
import { DateUtil } from '@workfolio/shared/utils/DateUtil';
import styles from './PublicView.module.css';

interface PublicProjectViewProps {
  projects: Project[];
}

const PublicProjectView: React.FC<PublicProjectViewProps> = ({ projects }) => {
  const visibleProjects = projects.filter((p) => p.isVisible === true);

  return (
    <div className={styles.viewContainer}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>프로젝트</h2>
      </div>

      <ul className={styles.itemList}>
        {visibleProjects.map((project) => (
          <li key={project.id} className={styles.item}>
            <div className={styles.itemHeader}>
              <div className={styles.itemTitleGroup}>
                {project.title && <h3 className={styles.itemTitle}>{project.title}</h3>}
                {project.affiliation && <span className={styles.itemSubtitle}>{project.affiliation}</span>}
              </div>
              <div className={styles.itemMeta}>
                {(project.startedAt || project.endedAt) && (
                  <span className={styles.itemPeriod}>
                    {project.startedAt && DateUtil.formatTimestamp(project.startedAt, 'YYYY. MM.')}
                    {project.endedAt && ` - ${DateUtil.formatTimestamp(project.endedAt, 'YYYY. MM.')}`}
                  </span>
                )}
              </div>
            </div>

            {project.role && (
              <div className={styles.itemDetails}>
                <span className={styles.itemDetail}>{project.role}</span>
              </div>
            )}

            {project.description && (
              <p className={styles.itemDescription}>{project.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PublicProjectView;
