import React from 'react';

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
    <div className="modal" onClick={handleOverlayClick}>
        <div className="modal-wrap">
            <div className="modal-tit">
                <h2>{title}</h2>
                <button onClick={onClose}><i className="ic-close" /></button>
            </div>
            <div className="modal-cont">
            {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="turnover-guide-wrap">
                    <h3>{section.title}</h3>
                    {section.content.map((item, itemIndex) => (
                        <div key={itemIndex}>
                        {item.title && (
                            <h4>{item.emoji && <>{item.emoji}</>} {item.title}</h4>
                        )}
                        {item.text && <p>{item.text}</p>}
                        {item.list && (
                            <ul>
                            {item.list.map((listItem, listIndex) => (
                                <li key={listIndex}>{listItem}</li>
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

