import React from 'react';
import { InterviewQuestion } from '@workfolio/shared/generated/common';
import EmptyState from '@workfolio/shared/ui/EmptyState';
import '@workfolio/shared/styles/component-view.css';

interface InterviewQuestionViewProps {
  interviewQuestions: InterviewQuestion[];
}

const InterviewQuestionView: React.FC<InterviewQuestionViewProps> = ({ interviewQuestions }) => {
  return (
    <div>
        <div className="cont-tit">
            <div>
                <h3>면접 예상 질문</h3>
            </div>
        </div>
        
        {!interviewQuestions || interviewQuestions.length === 0 ? (
        <EmptyState text="등록된 면접 예상 질문이 없습니다." />
        ) : (
        <ul className="view-list type2">
            {interviewQuestions.map((item, index) => (
            <li key={item.id || `interview-q-${index}`}>
                {/* <span>{index + 1}</span> */}
                <h4>{item.question}</h4>
                <p>{item.answer}</p>
            </li>
            ))}
        </ul>
        )}
    </div>
  );
};

export default InterviewQuestionView;

