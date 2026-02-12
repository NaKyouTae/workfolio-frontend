import React from 'react';
import '@workfolio/shared/styles/component-view.css';

interface SatisfactionViewProps {
  score: number;
  reviewSummary?: string;
}

const SatisfactionView: React.FC<SatisfactionViewProps> = ({ score, reviewSummary }) => {
  const renderStars = (score: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <li key={index}>
        {index < score ? (
          <i className="ic-star-ov" />
        ) : (
          <i className="ic-star" />
        )}
      </li>
    ));
  };

  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>만족도 평가</h3>
            </div>
        </div>
        <ul className="view-box">
            <li>
                <p>점수</p>
                <div className="score"><p>{score}점</p><ul>{renderStars(score)}</ul></div>
            </li>
            {reviewSummary && (
                <li>
                    <p>한 줄 회고</p>
                    <span>{reviewSummary}</span>
                </li>
            )}
        </ul>
    </>
  );
};

export default SatisfactionView;

