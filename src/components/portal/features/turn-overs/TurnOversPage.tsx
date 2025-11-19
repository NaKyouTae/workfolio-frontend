import React, { useState, useEffect } from 'react';
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
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [previousMode, setPreviousMode] = useState<ViewMode>('home'); // edit로 들어가기 전 모드 저장
  const { turnOvers, refreshTurnOvers, upsertTurnOver, getTurnOverDetail, duplicateTurnOver, deleteTurnOver } = useTurnOver();
  
  // URL 파라미터로 초기 상태 설정
  useEffect(() => {
    if (initialTurnOverId) {
      getTurnOverDetail(initialTurnOverId).then((turnOverDetail) => {
        if (turnOverDetail) {
          setSelectedTurnOver(turnOverDetail);
          setIsNewTurnOver(false);
          setViewMode(initialEditMode ? 'edit' : 'view');
          setPreviousMode(initialEditMode ? 'view' : 'home');
        }
      });
    }
  }, [initialTurnOverId, initialEditMode, getTurnOverDetail]);
  
  const onGoHome = () => {
    setSelectedTurnOver(null);
    setIsNewTurnOver(false);
    setViewMode('home');
    router.push('/turn-overs');
  };
  
  const onTurnOverSelect = async (id: string) => {
    const turnOverDetail = await getTurnOverDetail(id);
    if (turnOverDetail) {
      setSelectedTurnOver(turnOverDetail);
      setIsNewTurnOver(false);
      setViewMode('view');
      router.push(`/turn-overs/${id}`);
    }
  };

  // edit 모드로 진입하면서 turnOver 선택
  const onTurnOverSelectAndEdit = async (id: string, fromMode: ViewMode) => {
    const turnOverDetail = await getTurnOverDetail(id);
    if (turnOverDetail) {
      setSelectedTurnOver(turnOverDetail);
      setIsNewTurnOver(false);
      setPreviousMode(fromMode);
      setViewMode('edit');
      router.push(`/turn-overs/${id}/edit`);
    }
  };

  const onSave = async (data: TurnOverUpsertRequest) => {
    const savedId = await upsertTurnOver(data);
    if (savedId) {
      await refreshTurnOvers();
      setIsNewTurnOver(false);
      
      // 저장된 데이터를 다시 조회하여 갱신
      const updatedTurnOverDetail = await getTurnOverDetail(savedId);
      if (updatedTurnOverDetail) {
        setSelectedTurnOver(updatedTurnOverDetail);
        // 저장 후 view 모드로 이동
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
        />
    </main>
  );
};

export default TurnOversPage;
