import React from 'react';
import styles from './GuideModal.module.css';

export interface GuideSection {
  title: string;
  content: Array<{
    emoji?: string;
    title?: string;
    text?: string;
    list?: string[];
  }>;
}

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  sections: GuideSection[];
}

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose, title, sections }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
        <div className={styles.content}>
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className={styles.section}>
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className={styles.subsection}>
                  {item.title && (
                    <div className={styles.subsectionTitle}>
                      {item.emoji && <span className={styles.emoji}>{item.emoji}</span>}
                      <span>{item.title}</span>
                    </div>
                  )}
                  {item.text && <p className={styles.text}>{item.text}</p>}
                  {item.list && (
                    <ul className={styles.list}>
                      {item.list.map((listItem, listIndex) => (
                        <li key={listIndex} className={styles.listItem}>
                          {listItem}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuideModal;

