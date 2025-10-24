import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDndContext } from '@dnd-kit/core';
import Image from 'next/image';

interface DraggableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  dragButtonSize?: number;
  showDragButton?: boolean;
  style?: React.CSSProperties;
}

/**
 * 드래그 가능한 개별 아이템 컴포넌트
 * 
 * @example
 * <DraggableItem id="education-1">
 *   <div className={styles.card}>
 *     교육 내용
 *   </div>
 * </DraggableItem>
 */
const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  children,
  className = '',
  dragButtonSize = 24,
  showDragButton = true,
  style: customStyle = {},
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // 전역 드래그 상태 감지
  const { active } = useDndContext();
  const isAnyItemDragging = active !== null;
  
  // 드래그 중이거나 다른 아이템이 드래그 중일 때 border 표시
  const showBorder = isAnyItemDragging;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    border: showBorder ? '2px dashed #2196f3' : '2px dashed transparent',
    borderRadius: '8px',
    padding: showBorder ? '8px' : '0',
    backgroundColor: showBorder ? '#f0f7ff' : 'transparent',
    ...customStyle,
  };

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {showDragButton && (
        <button
          {...attributes}
          {...listeners}
          style={{
            cursor: 'grab',
            background: 'transparent',
            border: 'none',
            padding: '0',
            marginRight: '0px',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            maxWidth: '16px',
            width: '16px',
          }}
          aria-label="드래그하여 순서 변경"
        >
          <Image
            src="/assets/img/drag-button.png"
            alt="드래그"
            width={dragButtonSize}
            height={dragButtonSize}
            style={{ display: 'block' }}
          />
        </button>
      )}
      {children}
    </div>
  );
};

export default DraggableItem;

