import React from 'react';
import { CheckList } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import '@/styles/component-view.css';

interface CheckListViewProps {
  checkList: CheckList[];
}

const CheckListView: React.FC<CheckListViewProps> = ({ checkList }) => {
  return (
    <div className="view-container">
      <h3 className="view-title">체크리스트</h3>
      
      {!checkList || checkList.length === 0 ? (
        <EmptyState text="등록된 체크리스트가 없습니다." />
      ) : (
        <div className="view-list-container">
          {checkList.map((item, index) => (
            <div key={item.id || `checklist-${index}`} className="view-item">
              <div className="view-item-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={item.checked}
                    readOnly
                    style={{ width: '20px', height: '20px', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <label style={{ flex: 1, fontSize: '15px', color: '#333', lineHeight: 1.6, cursor: 'pointer' }}>
                    {item.content}
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheckListView;

