import React, { useState, useEffect } from 'react';
import { useConfirm } from '@/hooks/useConfirm';

export interface FloatingNavigationItem {
  id: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface FloatingNavigationProps {
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

    const handleScroll = () => {
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
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <nav>
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

