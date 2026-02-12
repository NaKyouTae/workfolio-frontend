import React from 'react';
import { ApplicationStage, ApplicationStage_ApplicationStageStatus } from '@workfolio/shared/generated/common';
import DateUtil from '@workfolio/shared/utils/DateUtil';
import { compareEnumValue, normalizeEnumValue } from '@workfolio/shared/utils/commonUtils';
import { useModal } from '@workfolio/shared/hooks/useModal';
import ContentModal from '@workfolio/shared/ui/ContentModal';

interface ApplicationStageViewProps {
  stage: ApplicationStage;
}

const ApplicationStageView: React.FC<ApplicationStageViewProps> = ({ stage }) => {
  const { isOpen: isMemoOpen, content: selectedMemo, title: memoTitle, openModal, closeModal } = useModal();

  const getStatusLabel = (status: ApplicationStage_ApplicationStageStatus) => {
    const normalizedStatus = normalizeEnumValue(status, ApplicationStage_ApplicationStageStatus);
    switch (normalizedStatus) {
      case ApplicationStage_ApplicationStageStatus.PASSED:
        return '합격';
      case ApplicationStage_ApplicationStageStatus.FAILED:
        return '불합격';
      case ApplicationStage_ApplicationStageStatus.PENDING:
        return '대기';
      case ApplicationStage_ApplicationStageStatus.SCHEDULED:
        return '예정';
      case ApplicationStage_ApplicationStageStatus.CANCELLED:
        return '취소';
      default:
        return '없음';
    }
  };

  const getStatusBadgeStyle = (status: ApplicationStage_ApplicationStageStatus) => {
    switch (status) {
      case ApplicationStage_ApplicationStageStatus.PASSED:
        return { background: '#007AFF' };
      case ApplicationStage_ApplicationStageStatus.FAILED:
        return { background: '#FF3B30' };
      case ApplicationStage_ApplicationStageStatus.PENDING:
        return { background: '#34C759' };
      default:
        return { background: '#515C66' };
    }
  };

  const getStatusBadgeColor = (status: ApplicationStage_ApplicationStageStatus) => {
    const isScheduled = compareEnumValue(status, ApplicationStage_ApplicationStageStatus.SCHEDULED, ApplicationStage_ApplicationStageStatus);
    return isScheduled ? 'scheduled' : '';
  };

  return (
    <>
      <li className={`${getStatusBadgeColor(stage.status)}`}>
        <div>
          <p>{stage.name}</p>
          <span className="label" style={getStatusBadgeStyle(stage.status)}>{getStatusLabel(stage.status)}</span>
        </div>
        {(stage.startedAt || stage.memo) && (
          <ul>
            <li>{stage.startedAt && DateUtil.formatTimestamp(stage.startedAt, 'YY.MM.DD.')}</li>
            <li>
              {stage.memo && (
                <a onClick={() => openModal(stage.memo, '메모 상세보기')}>메모</a>
              )}
            </li>
          </ul>
        )}
      </li>

      {/* 메모 상세보기 모달 */}
      <ContentModal
        isOpen={isMemoOpen}
        onClose={closeModal}
        content={selectedMemo}
        title={memoTitle}
      />
    </>
  );
};

export default ApplicationStageView;

