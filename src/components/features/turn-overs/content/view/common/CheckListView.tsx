import React from 'react';
import { CheckList } from '@/generated/common';
import EmptyState from '@/components/ui/EmptyState';
import GuideModal from '@/components/ui/GuideModal';
import { useGuide } from '@/hooks/useGuide';
import { checkListGuide } from '@/utils/turnOverGuideData';
import '@/styles/component-view.css';

interface CheckListViewProps {
  checkList: CheckList[];
}

const CheckListView: React.FC<CheckListViewProps> = ({ checkList }) => {
  const { isOpen: isGuideOpen, openGuide, closeGuide } = useGuide();
  return (
    <>
      <div className="view-container">
        <h3 className="view-title">
          체크리스트
          <span 
            onClick={openGuide}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '18px',
              height: '18px',
              background: '#e5e7eb',
              color: '#6b7280',
              borderRadius: '50%',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '8px'
            }}>?</span>
        </h3>
      
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

      {/* 가이드 모달 */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={closeGuide}
        title="체크리스트 가이드"
        sections={checkListGuide}
      />
    </>
  );
};

export default CheckListView;

