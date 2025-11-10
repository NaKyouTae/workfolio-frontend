import React from 'react';
import { SelfIntroduction } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import '@/styles/component-view.css';

interface SelfIntroductionViewProps {
  selfIntroductions: SelfIntroduction[];
}

const SelfIntroductionView: React.FC<SelfIntroductionViewProps> = ({ selfIntroductions }) => {
  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>공통 자기소개서</h3>
            </div>
        </div>
        
        {!selfIntroductions || selfIntroductions.length === 0 ? (
        <EmptyState text="등록된 자기소개서가 없습니다." />
        ) : (
        <div className="view-list type2">
            {selfIntroductions.map((item, index) => (
            <li key={item.id || `self-intro-${index}`}>
                {/* <span>{index + 1}</span> */}
                <h4>{item.question}</h4>
                <p>{item.content}</p>
            </li>
            ))}
        </div>
        )}
    </>
  );
};

export default SelfIntroductionView;

