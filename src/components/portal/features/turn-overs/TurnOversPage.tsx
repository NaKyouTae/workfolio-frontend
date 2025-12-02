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
  const [isLoadingDetail, setIsLoadingDetail] = useState(!!initialTurnOverId); // 초기 로딩 상태
  const { turnOvers, isLoading, refreshTurnOvers, upsertTurnOver, getTurnOverDetail, duplicateTurnOver, deleteTurnOver } = useTurnOver();
  
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
        setIsLoadingDetail(false);
        return;
      }
      
      setIsLoadingDetail(true);
      setViewMode(initialEditMode ? 'edit' : 'view');
      setPreviousMode(initialEditMode ? 'view' : 'home');
      
      // turnOvers에서 해당 id의 데이터를 찾아서 바로 표시
      const turnOverDetail = turnOvers.find(t => t.id === initialTurnOverId);
      if (turnOverDetail) {
        setSelectedTurnOver(turnOverDetail);
        setIsNewTurnOver(false);
        setIsLoadingDetail(false);
      } else if (turnOvers.length > 0) {
        // turnOvers가 로드되었지만 해당 id를 찾지 못한 경우, getTurnOverDetail 호출
        getTurnOverDetail(initialTurnOverId).then((detail) => {
          if (detail) {
            setSelectedTurnOver(detail);
            setIsNewTurnOver(false);
          }
          setIsLoadingDetail(false);
        }).catch(() => {
          setIsLoadingDetail(false);
        });
      } else {
        // turnOvers가 아직 로드되지 않은 경우, 로드 완료 후 다시 시도
        // 이 경우 turnOvers가 업데이트되면 이 useEffect가 다시 실행됨
      }
    } else {
      setIsLoadingDetail(false);
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
      // 목록 새로고침
      await refreshTurnOvers();
      
      // 새로 생성한 경우 (isNewTurnOver가 true) 목록 화면으로 이동
      if (isNewTurnOver) {
        setIsNewTurnOver(false);
        setSelectedTurnOver(null);
        setViewMode('home');
        setPreviousMode('home');
        router.push('/turn-overs');
      } else {
        // 기존 이직 활동 수정한 경우 상세 화면으로 이동
        const updatedTurnOverDetail = await getTurnOverDetail(savedId);
        if (updatedTurnOverDetail) {
          setSelectedTurnOver(updatedTurnOverDetail);
          setViewMode('view');
          setPreviousMode('view');
          router.push(`/turn-overs/${savedId}`);
        }
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
    // onSave에서 이미 라우팅을 처리했으므로, 여기서는 추가 라우팅을 하지 않음
    // 단, mode가 'edit'이 아닌 경우에만 viewMode 업데이트
    if (mode !== 'edit') {
      setViewMode(mode);
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
            isLoading={isLoading}
        />
        <TurnOversContent 
            selectedTurnOver={selectedTurnOver} 
            isNewTurnOver={isNewTurnOver}
            viewMode={viewMode}
            isLoading={isLoading || isLoadingDetail}
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
