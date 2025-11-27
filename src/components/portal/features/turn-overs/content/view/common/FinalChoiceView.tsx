import React from 'react';
import '@/styles/component-view.css';
import { DateUtil } from '@/utils/DateUtil';

interface FinalChoiceViewProps {
  endedAt?: number | undefined;
  name: string;
  position: string;
  reason?: string;
}

const FinalChoiceView: React.FC<FinalChoiceViewProps> = ({ endedAt, name, position, reason }) => {
  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>최종 선택</h3>
            </div>
        </div>
        <ul className="view-list type1">
            <li>
                <div className="info">
                    <div>
                        <div>
                            <h4>{name}</h4>
                            <p>{position}</p>
                        </div>
                    </div>
                </div>
                <div className="desc">
                    {endedAt && (
                        <p>종료일: {DateUtil.formatTimestamp(endedAt)}</p>
                    )}
                    {reason && (
                        <p>{reason}</p>
                    )}
                </div>
            </li>
        </ul>
    </>
  );
};

export default FinalChoiceView;

