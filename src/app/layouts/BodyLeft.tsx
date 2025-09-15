import React
 from 'react'
import RecordGroupSection from '../components/layout/RecordGroupSection';
import RecordGroupButton from '../components/layout/RecordGroupButton';
import RecordGroupMiddle from '../components/layout/RecordGroupMiddle';

const BodyLeft = () => {
    return (
        <div style={{ 
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            margin: 0,
            boxSizing: 'border-box'
        }}>
            <RecordGroupButton />
            <RecordGroupMiddle title="내 기록 전체보기" />
            <span className="record-group-separator"></span>
            <RecordGroupSection 
                title="내 기록장"
                defaultExpanded={true}
            />
            <span className="record-group-separator"></span>
            <RecordGroupSection 
                title="공유 기록장"
                defaultExpanded={true}
            />
        </div>
    );
};

export default BodyLeft;
