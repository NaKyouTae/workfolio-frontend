import React from 'react';
import { TurnOverUpsertRequest_MemoRequest } from '@/generated/turn_over';
import DraggableList from '@/components/portal/ui/DraggableList';
import DraggableItem from '@/components/portal/ui/DraggableItem';
import EmptyState from '@/components/portal/ui/EmptyState';
import GuideModal from '@/components/portal/ui/GuideModal';
import { useGuide } from '@/hooks/useGuide';
import '@/styles/component-edit.css';
import Image from 'next/image';

interface MemoEditProps {
  memos: TurnOverUpsertRequest_MemoRequest[];
  onMemosChange: (memos: TurnOverUpsertRequest_MemoRequest[]) => void;
}

interface MemoItemProps {
  item: TurnOverUpsertRequest_MemoRequest;
  index: number;
  onUpdate: (index: number, content: string) => void;
  onRemove: (index: number) => void;
}

const MemoItem: React.FC<MemoItemProps> = ({
  item,
  index,
  onUpdate,
  onRemove,
}) => {
  return (
    <DraggableItem id={`memo-${index}`}>
        <div className="card">
            <ul className="edit-cont type2">
                <li>
                    <p>내용</p>
                    <textarea 
                    placeholder="내용을 입력해 주세요."
                    value={item.content || ''}
                    onChange={(e) => onUpdate(index, e.target.value)}                     
                    ></textarea>
                </li>
            </ul>
            <div className="edit-btn">
                <button
                    onClick={() => onRemove(index)}
                    title="삭제"
                    type="button"
                    className="gray"
                >
                    <Image
                        src="/assets/img/ico/ic-minus.svg"
                        alt="삭제"
                        width={1}
                        height={1}
                    />
                </button>
            </div>
        </div>
    </DraggableItem>
  );
};

const MemoEdit: React.FC<MemoEditProps> = ({ memos, onMemosChange }) => {
  const { isOpen: isGuideOpen, openGuide, closeGuide } = useGuide();

  const addMemo = () => {
    const newItem: TurnOverUpsertRequest_MemoRequest = {
      content: '',
      isVisible: true,
      priority: memos.length,
    };
    onMemosChange([...memos, newItem]);
  };

  const removeMemo = (index: number) => {
    const updated = memos.filter((_, i) => i !== index);
    // 재정렬 후 priority 업데이트
    const reordered = updated.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onMemosChange(reordered);
  };

  const updateMemo = (index: number, content: string) => {
    const updated = [...memos];
    updated[index].content = content;
    onMemosChange(updated);
  };

  const handleReorder = (reordered: TurnOverUpsertRequest_MemoRequest[]) => {
    // 드래그앤드롭 후 priority를 index로 업데이트
    const updatedWithPriority = reordered.map((item, idx) => ({
      ...item,
      priority: idx,
    }));
    onMemosChange(updatedWithPriority);
  };

  return (
    <>
        <div className="cont-tit">
            <div>
                <h3>메모</h3>
                {/* <p>{memos.length}개</p> */}
                <button onClick={openGuide}><i className="ic-question"></i></button>
            </div>
            <button onClick={addMemo}><i className="ic-add" />추가</button>
        </div>
        {memos.length === 0 ? (
        <EmptyState text="메모를 추가해 주세요." />
        ) : (
        <DraggableList
            items={memos}
            onReorder={handleReorder}
            getItemId={(_, idx) => `memo-${idx}`}
            renderItem={(item, index) => (
            <MemoItem
                key={`memo-${index}`}
                item={item}
                index={index}
                onUpdate={updateMemo}
                onRemove={removeMemo}
            />
            )}
        />
        )}

        {/* 가이드 모달 */}
        <GuideModal
            isOpen={isGuideOpen}
            onClose={closeGuide}
            title="메모 가이드"
        >
          <div className="turnover-guide-wrap">
            <h3>1. 나의 핵심 역량, 꼼꼼하게 파헤치기</h3>
            <ul>
              <li>내가 제일 장하는 일 정리 : 지금까지 쌓아온 경험 중에서 가장 자신 있는 업무나 가장 큰 성과를 냈던 부분을 구체적인 예시와 함께 정리해 두세요.</li>
              <li>성과는 숫자로 표현 : &apos;A 프로젝트를 통해 B 지표를 N% 개선&apos;과 같이 숫자로 증명할 수 있게 기록하면 면접에서 빛을 발할 거예요.</li>
            </ul>
          </div>
          <div className="turnover-guide-wrap">
            <h3>2. 업계 트렌드 및 시장 흐름 스캐하기</h3>
            <ul>
              <li>요즘 핫한 분야 체크 : 내가 속한 업계와 직무에서 최근 어떤 변화가 있는지, 가장 성장하고 있는 분야는 어디인지 조사해 보세요.</li>
              <li>채용 시장 동향 파악 : 내가 원하는 직무의 채용 공고가 늘고 있는지, 회사들이 어떤 새로운 역량을 요구하고 있는지 살펴보고 내 스펙을 정리해 보세요.</li>
            </ul>
          </div>
          <div className="turnover-guide-wrap">
            <h3>3. 보상 및 근무 조건, 나만의 기준 세우기</h3>
            <ul>
              <li>기준은 명확하게 : 연봉, 근무 형태(재택, 유연근무 등), 복지 수준, 조직 문화 등 나에게 정말로 중요한 조건들을 먼저 생각하고 우선순위를 정해요.</li>
              <li>마지노선 정하기 : 타협할 수 있는 부분과 절대 포기할 수 없는 마지노선을 미리 정해두면 나중에 후회하지 않아요.</li>
            </ul>
          </div>
          <div className="turnover-guide-wrap">
            <h3>4. 희망 기업 리스트, 미리미리 찜하기</h3>
            <ul>
              <li>관심 기업 분류: 회사의 비전, 일하는 문화, 내 직무와의 적합성을 기준으로 관심 가는 기업들을 쭉 정리해 보세요.</li>
              <li>이유 적어두기 : 구체적인 이유를 함께 적어두면 지원할 때 더 설득력 있는 지원서가 될 거예요.</li>
            </ul>
          </div>
        </GuideModal>
    </>
  );
};

export default MemoEdit;
