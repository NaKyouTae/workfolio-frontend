'use client';

import React from 'react';
import { prepareBasicFormData } from './prepareBasicFormData';
import PublicCareerView from '../../view/PublicCareerView';
import PublicEducationView from '../../view/PublicEducationView';
import PublicProjectView from '../../view/PublicProjectView';
import PublicActivityView from '../../view/PublicActivityView';
import PublicLanguageSkillView from '../../view/PublicLanguageSkillView';
import type { TemplateRendererProps } from '../templateRegistry';
import styles from './BasicTemplate.module.css';

const BasicTemplate: React.FC<TemplateRendererProps> = ({
  resumeDetail,
  previewMode,
}) => {
  const data = prepareBasicFormData(resumeDetail);

  const renderContactList = () => (
    <ul className={styles.contactList}>
      {data.profile.contacts.map((contact) => (
        <li key={contact.type} className={styles.contactItem}>
          <span className={styles.contactIcon}>
            {contact.type === 'birthDate' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" fill="currentColor"/>
              </svg>
            )}
            {contact.type === 'gender' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
              </svg>
            )}
            {contact.type === 'phone' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/>
              </svg>
            )}
            {contact.type === 'email' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/>
              </svg>
            )}
          </span>
          {contact.value}
        </li>
      ))}
    </ul>
  );

  const isPdfPreview = previewMode === 'pdf';

  const renderSection = (type: string) => {
    switch (type) {
      case 'education':
        return (
          <div key="edu" className={styles.section}>
            <PublicEducationView educations={resumeDetail.educations?.filter((e) => e.isVisible === true) || []} />
          </div>
        );
      case 'career':
        return (
          <div key="career" className={styles.section}>
            <PublicCareerView careers={resumeDetail.careers?.filter((c) => c.isVisible === true) || []} />
          </div>
        );
      case 'project':
        return (
          <div key="project" className={styles.section}>
            <PublicProjectView projects={resumeDetail.projects?.filter((p) => p.isVisible === true) || []} />
          </div>
        );
      case 'activity':
        return (
          <div key="activity" className={styles.section}>
            <PublicActivityView activities={resumeDetail.activities?.filter((a) => a.isVisible === true) || []} />
          </div>
        );
      case 'languageSkill':
        return (
          <div key="lang" className={styles.section}>
            <PublicLanguageSkillView languageSkills={resumeDetail.languageSkills?.filter((l) => l.isVisible === true) || []} />
          </div>
        );
      default:
        return null;
    }
  };

  const content = (
    <div className={`${styles.container}${isPdfPreview ? ` ${styles.containerPdf}` : ''}`}>
      <div className={`${styles.resumeWrapper}${isPdfPreview ? ` ${styles.resumeWrapperPdf}` : ''}`}>
        <div className={`${styles.main}${isPdfPreview ? ` ${styles.mainPdfPages}` : ''}`}>
          <div className={styles.profileSection}>
            <div className={styles.profileHeader}>
              <div className={styles.profileInfo}>
                {data.profile.profileImageUrl && (
                  <div className={styles.profileImageWrapper}>
                    <img
                      src={data.profile.profileImageUrl}
                      alt="인물 사진"
                      className={styles.profileImage}
                    />
                  </div>
                )}
                {data.profile.name && (
                  <h1 className={styles.name}>{data.profile.name}</h1>
                )}
                {data.profile.position && (
                  <p className={styles.position}>{data.profile.position}</p>
                )}
              </div>
              {renderContactList()}
            </div>
            {data.profile.description && (
              <p className={styles.description}>{data.profile.description}</p>
            )}
          </div>

          {data.sections
            .filter((sec) => sec.visible)
            .map((sec) => renderSection(sec.type))}
        </div>

        <div className={styles.footer}>
          <a href="https://workfolio.kr" target="_blank" rel="noopener noreferrer" className={styles.footerLogo}>
            <img
              src="/assets/img/logo/img-logo01.svg"
              alt="Workfolio"
              width={100}
              height={19}
            />
          </a>
        </div>
      </div>
    </div>
  );

  if (isPdfPreview) {
    return (
      <div className={styles.pdfPreviewFrame}>
        <div className={styles.pdfPreviewPaper}>
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default BasicTemplate;
