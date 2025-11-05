import React from 'react';
import { InterviewQuestion } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import '@/styles/component-view.css';

interface InterviewQuestionViewProps {
  interviewQuestions: InterviewQuestion[];
}

const InterviewQuestionView: React.FC<InterviewQuestionViewProps> = ({ interviewQuestions }) => {
  return (
    <div className="view-container">
      <h3 className="view-title">면접 예상 질문</h3>
      
      {!interviewQuestions || interviewQuestions.length === 0 ? (
        <EmptyState text="등록된 면접 예상 질문이 없습니다." />
      ) : (
        <div className="view-list-container">
          {interviewQuestions.map((item, index) => (
            <div key={item.id || `interview-q-${index}`} className="view-item">
              <div className="view-item-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    background: '#28a745',
                    color: 'white',
                    borderRadius: '50%',
                    fontSize: '14px',
                    fontWeight: 600,
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </span>
                  <strong style={{ flex: 1 }}>질문 제목 들어가는 영역</strong>
                </div>
                <p style={{ fontWeight: 600, marginBottom: '8px', color: '#333', lineHeight: 1.6 }}>{item.question}</p>
                <p style={{ color: '#666', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewQuestionView;

