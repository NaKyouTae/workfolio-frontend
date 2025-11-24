import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TurnOversSidebar from './TurnOversSidebar';
import TurnOversContent from './TurnOversContent';
import { TurnOverDetail } from '@/generated/common';
import { useTurnOver } from '@/hooks/useTurnOver';
import { TurnOverUpsertRequest } from '@/generated/turn_over';

type ViewMode = 'home' | 'view' | 'edit';

interface TurnOversPageProps {
  initialTurnOverId?: string;
  initialEditMode?: boolean;
}

const TurnOversPage: React.FC<TurnOversPageProps> = ({ initialTurnOverId, initialEditMode = false }) => {
  const router = useRouter();
  const [selectedTurnOver, setSelectedTurnOver] = useState<TurnOverDetail | null>(null);
  const [isNewTurnOver, setIsNewTurnOver] = useState(false);
  // initialTurnOverId가 있으면 초기 viewMode를 바로 설정하여 홈 화면이 먼저 보이는 것을 방지
  const [viewMode, setViewMode] = useState<ViewMode>(initialTurnOverId ? (initialEditMode ? 'edit' : 'view') : 'home');
  const [previousMode, setPreviousMode] = useState<ViewMode>('home'); // edit로 들어가기 전 모드 저장
  const { turnOvers, refreshTurnOvers, upsertTurnOver, getTurnOverDetail, duplicateTurnOver, deleteTurnOver } = useTurnOver();
  
  // 초기 로드 여부를 추적하는 ref
  const turnOversFetched = useRef(false);
  
  // 이직 활동 목록은 한 번만 패칭 (페이지 리마운트 시 중복 패칭 방지)
  useEffect(() => {
    if (!turnOversFetched.current) {
      turnOversFetched.current = true;
      refreshTurnOvers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // URL 파라미터로 초기 상태 설정
  useEffect(() => {
    if (initialTurnOverId) {
      // 이미 같은 이직 활동이 선택되어 있고 편집 모드도 같으면 업데이트하지 않음
      if (selectedTurnOver?.id === initialTurnOverId && viewMode === (initialEditMode ? 'edit' : 'view')) {
        return;
      }
      // 화면은 즉시 변경하고, turnOvers에서 데이터를 찾아서 바로 표시
      setViewMode(initialEditMode ? 'edit' : 'view');
      setPreviousMode(initialEditMode ? 'view' : 'home');
      // turnOvers에서 해당 id의 데이터를 찾아서 바로 표시 (API 조회 없이)
      const turnOverDetail = turnOvers.find(t => t.id === initialTurnOverId);
      if (turnOverDetail) {
        setSelectedTurnOver(turnOverDetail);
        setIsNewTurnOver(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTurnOverId, initialEditMode, turnOvers]);
  
  const onGoHome = () => {
    // viewMode를 먼저 변경하여 깜빡임 방지
    setViewMode('home');
    // 상태 초기화는 viewMode 변경 후에 수행
    setSelectedTurnOver(null);
    setIsNewTurnOver(false);
    router.push('/turn-overs');
  };
  
  const onTurnOverSelect = async (id: string) => {
    // 화면을 먼저 view 모드로 변경 (홈 화면이 보이지 않도록)
    setViewMode('view');
    router.push(`/turn-overs/${id}`);
    // turnOvers에서 해당 id의 데이터를 찾아서 바로 표시 (API 조회 없이)
    const turnOverDetail = turnOvers.find(t => t.id === id);
    if (turnOverDetail) {
      setSelectedTurnOver(turnOverDetail);
      setIsNewTurnOver(false);
    }
  };

  // edit 모드로 진입하면서 turnOver 선택
  const onTurnOverSelectAndEdit = async (id: string, fromMode: ViewMode) => {
    // 화면은 즉시 변경
    setPreviousMode(fromMode);
    setViewMode('edit');
    router.push(`/turn-overs/${id}/edit`);
    // turnOvers에서 해당 id의 데이터를 찾아서 바로 표시 (API 조회 없이)
    const turnOverDetail = turnOvers.find(t => t.id === id);
    if (turnOverDetail) {
      setSelectedTurnOver(turnOverDetail);
      setIsNewTurnOver(false);
    }
  };

  const onSave = async (data: TurnOverUpsertRequest) => {
    const savedId = await upsertTurnOver(data);
    if (savedId) {
      // 목록 새로고침과 상세 데이터 조회를 병렬로 처리
      const [_, updatedTurnOverDetail] = await Promise.all([
        refreshTurnOvers(),
        getTurnOverDetail(savedId)
      ]);
      
      setIsNewTurnOver(false);
      
      // 저장된 데이터를 다시 조회하여 갱신
      if (updatedTurnOverDetail) {
        setSelectedTurnOver(updatedTurnOverDetail);
        // 저장 후 view 모드로 변경
        setViewMode('view');
        setPreviousMode('view');
        router.push(`/turn-overs/${savedId}`);
      }
    }
  };

  const onDuplicate = (id: string) => {
      duplicateTurnOver(id).then((success) => {
      if (success) {
        refreshTurnOvers();
        setSelectedTurnOver(null);
        onGoHome();
      }
    });
  };

  const onDelete = (id: string) => {
    deleteTurnOver(id).then((success) => {
      if (success) {
        refreshTurnOvers();
        setSelectedTurnOver(null);
        onGoHome();
      }
    });
  };

  const onTurnOverCreated = () => {
    // 새로운 빈 TurnOverDetail 생성
    const newTurnOver: TurnOverDetail = {
      id: '',
      name: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      turnOverGoal: undefined,
      turnOverChallenge: undefined,
      turnOverRetrospective: undefined,
    };
    
    setSelectedTurnOver(newTurnOver);
    setIsNewTurnOver(true);
    setViewMode('edit');
    // 새로 생성하는 경우 URL은 변경하지 않음 (아직 id가 없음)
  };

  // edit 모드로 진입 (이전 모드 저장)
  const onEnterEdit = (fromMode: ViewMode) => {
    if (selectedTurnOver?.id) {
      setPreviousMode(fromMode);
      setViewMode('edit');
      router.push(`/turn-overs/${selectedTurnOver.id}/edit`);
    }
  };

  // 취소 시 이전 모드로 복귀
  const onCancelEdit = () => {
    if (previousMode === 'home') {
      setSelectedTurnOver(null);
      setIsNewTurnOver(false);
      router.push('/turn-overs');
    } else if (selectedTurnOver?.id) {
      setViewMode('view');
      router.push(`/turn-overs/${selectedTurnOver.id}`);
    }
  };

  // 저장 후 모드 변경
  const onSaveComplete = (mode: ViewMode) => {
    // mode가 'view'이고 previousMode가 'home'이면 home으로, 아니면 view로
    if (mode === 'view' && previousMode === 'home') {
      setViewMode('home');
      setSelectedTurnOver(null);
      setIsNewTurnOver(false);
      router.push('/turn-overs');
    } else if (mode === 'view' && selectedTurnOver?.id) {
      setViewMode(mode);
      router.push(`/turn-overs/${selectedTurnOver.id}`);
    } else {
      setViewMode(mode);
    }
    // 저장 후에는 previousMode 초기화
    if (mode !== 'edit') {
      setPreviousMode(mode);
    }
  };

  return (
    <main>
        <TurnOversSidebar 
            turnOvers={turnOvers}
            selectedTurnOver={selectedTurnOver}
            onGoHome={onGoHome} 
            refreshTurnOvers={refreshTurnOvers} 
            onTurnOverSelect={onTurnOverSelect} 
            onTurnOverCreated={onTurnOverCreated} 
        />
        <TurnOversContent 
            selectedTurnOver={selectedTurnOver} 
            isNewTurnOver={isNewTurnOver}
            viewMode={viewMode}
            onTurnOverSelect={onTurnOverSelect} 
            onTurnOverSelectAndEdit={onTurnOverSelectAndEdit}
            onSave={onSave} 
            onDuplicate={onDuplicate} 
            onDelete={onDelete}
            onEnterEdit={onEnterEdit}
            onCancelEdit={onCancelEdit}
            onSaveComplete={onSaveComplete}
            onTurnOverUpdate={async () => {
              // 체크리스트 업데이트 후 전체 데이터 갱신
              if (selectedTurnOver?.id) {
                const updatedTurnOverDetail = await getTurnOverDetail(selectedTurnOver.id);
                if (updatedTurnOverDetail) {
                  setSelectedTurnOver(updatedTurnOverDetail);
                  // turnOvers 목록도 갱신
                  await refreshTurnOvers();
                }
              }
            }}
        />
    </main>
  );
};

export default TurnOversPage;
