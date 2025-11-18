import React, { useState, useEffect } from 'react';
import { useConfirm } from '@/hooks/useConfirm';

export interface FloatingNavigationItem {
  id: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface FloatingNavigationProps {
  width?: string;
  /**
   * 네비게이션 아이템 목록
   * onClick이 없으면 자동으로 스크롤 기능을 사용합니다.
   */
  navigationItems?: FloatingNavigationItem[];
  
  /**
   * 저장 버튼 클릭 핸들러
   */
  onSave?: (e: React.FormEvent) => void;
  
  /**
   * 취소 버튼 클릭 핸들러
   */
  onCancel?: () => void;
  
  /**
   * 취소 시 확인 다이얼로그 표시 여부
   */
  showCancelConfirm?: boolean;
  
  /**
   * 취소 확인 다이얼로그 설정
   */
  cancelConfirmConfig?: {
    icon?: string;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
  };
  
  /**
   * 추가 액션 버튼들 (저장/취소 외의 버튼)
   */
  actionButtons?: Array<{
    label: string;
    onClick: () => void;
    className?: string;
  }>;
  
  /**
   * 저장 버튼 텍스트 (기본값: '저장하기')
   */
  saveButtonText?: string;
  
  /**
   * 취소 버튼 텍스트 (기본값: '취소')
   */
  cancelButtonText?: string;
}

/**
 * 플로팅 네비게이션 컴포넌트
 * 네비게이션 메뉴와 액션 버튼(저장/취소 등)을 포함하는 공통 UI 컴포넌트입니다.
 */
const FloatingNavigation: React.FC<FloatingNavigationProps> = ({
  navigationItems,
  width,
  onSave,
  onCancel,
  showCancelConfirm = false,
  cancelConfirmConfig,
  actionButtons,
  saveButtonText = '저장하기',
  cancelButtonText = '취소',
}) => {
  const { confirm } = useConfirm();
  const [activeSection, setActiveSection] = useState<string>('');

  // navigationItems가 있고 onClick이 없으면 자동 스크롤 기능 사용
  const handleNavigationClick = (item: FloatingNavigationItem) => {
    if (item.onClick) {
      item.onClick();
      if (item.id) {
        setActiveSection(item.id);
      }
    } else if (item.id) {
      // 자동 스크롤 기능
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(item.id);
      }
    }
  };

  // 스크롤 시 활성 섹션 자동 업데이트
  useEffect(() => {
    if (!navigationItems || navigationItems.length === 0) return;

    // page-cont 스크롤 컨테이너 찾기
    const firstItem = navigationItems[0];
    if (!firstItem?.id) return;
    
    const firstElement = document.getElementById(firstItem.id);
    if (!firstElement) return;
    
    const scrollContainer = firstElement.closest('.page-cont') as HTMLElement;

    const handleScroll = () => {
      if (scrollContainer) {
        // page-cont 컨테이너 내에서의 상대 위치 계산
        const containerRect = scrollContainer.getBoundingClientRect();
        const scrollTop = scrollContainer.scrollTop;
        const offset = 100; // 상단에서 100px 떨어진 위치를 기준으로 활성 섹션 판단
        
        // 각 섹션의 위치를 계산하여 현재 보이는 섹션 찾기
        const sections = navigationItems
          .map(item => {
            const element = document.getElementById(item.id);
            if (element) {
              const elementRect = element.getBoundingClientRect();
              // 컨테이너 내에서의 상대 위치 계산
              const relativeTop = elementRect.top - containerRect.top + scrollTop;
              return { 
                id: item.id, 
                top: relativeTop,
                bottom: relativeTop + elementRect.height
              };
            }
            return null;
          })
          .filter((item): item is { id: string; top: number; bottom: number } => item !== null);

        // 현재 스크롤 위치 + offset을 기준으로 가장 가까운 섹션 찾기
        const currentScrollPosition = scrollTop + offset;
        
        // 현재 스크롤 위치보다 위에 있고 가장 가까운 섹션 찾기
        const visibleSections = sections
          .filter(section => section.top <= currentScrollPosition)
          .sort((a, b) => b.top - a.top); // 위에서 아래로 정렬

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].id);
        } else if (sections.length > 0) {
          // 스크롤이 맨 위에 있으면 첫 번째 섹션 활성화
          setActiveSection(sections[0].id);
        }
      } else {
        // window 스크롤인 경우
        const sections = navigationItems
          .map(item => {
            const element = document.getElementById(item.id);
            if (element) {
              const rect = element.getBoundingClientRect();
              return { id: item.id, top: rect.top };
            }
            return null;
          })
          .filter((item): item is { id: string; top: number } => item !== null)
          .sort((a, b) => Math.abs(a.top) - Math.abs(b.top));

        if (sections.length > 0 && sections[0].top < 200) {
          setActiveSection(sections[0].id);
        }
      }
    };

    // 초기 활성 섹션 설정
    handleScroll();

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    } else {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [navigationItems]);

  const handleCancel = async () => {
    if (showCancelConfirm) {
      const result = await confirm({
        icon: cancelConfirmConfig?.icon || '/assets/img/ico/ic-warning.svg',
        title: cancelConfirmConfig?.title || '작성을 취소하시겠어요?',
        description: cancelConfirmConfig?.description || '지금까지 입력한 내용이 저장되지 않아요.',
        confirmText: cancelConfirmConfig?.confirmText || '취소하기',
        cancelText: cancelConfirmConfig?.cancelText || '돌아가기',
      });

      if (result) {
        onCancel?.();
      }
    } else {
      onCancel?.();
    }
  };

  const showButtons = onSave || onCancel || (actionButtons && actionButtons.length > 0);

  return (
    <nav style={{width: width || '100%'}}>
      {navigationItems && navigationItems.length > 0 && (
        <ul className="nav-wrap">
          {navigationItems.map((item) => {
            const isActive = item.isActive !== undefined 
              ? item.isActive 
              : activeSection === item.id;
            
            return (
              <li
                key={item.id}
                onClick={() => handleNavigationClick(item)}
                className={isActive ? 'active' : ''}
              >
                {item.label}
              </li>
            );
          })}
        </ul>
      )}
      {showButtons && (
        <div className="nav-btn">
          {onSave && (
            <button className="dark-gray" onClick={onSave}>
              {saveButtonText}
            </button>
          )}
          {actionButtons?.map((button, index) => (
            <button
              key={index}
              className={button.className || 'line gray'}
              onClick={button.onClick}
            >
              {button.label}
            </button>
          ))}
          {onCancel && (
            <button className="line gray" onClick={handleCancel}>
              {cancelButtonText}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default FloatingNavigation;

