import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

interface DraggableListProps<T> {
  items: T[];
  onReorder: (items: T[]) => void;
  getItemId: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  children?: React.ReactNode;
}

/**
 * 드래그앤드롭 가능한 리스트 컨테이너 컴포넌트
 * 
 * @example
 * <DraggableList
 *   items={educations}
 *   onReorder={setEducations}
 *   getItemId={(edu, idx) => edu.id || `education-${idx}`}
 *   renderItem={(education, index) => (
 *     <DraggableItem
 *       id={education.id || `education-${index}`}
 *       index={index}
 *     >
 *       {교육 내용}
 *     </DraggableItem>
 *   )}
 * />
 */
function DraggableList<T>({
  items,
  onReorder,
  getItemId,
  renderItem,
  children,
}: DraggableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item, idx) => getItemId(item, idx) === active.id);
      const newIndex = items.findIndex((item, idx) => getItemId(item, idx) === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        onReorder(reorderedItems);
      }
    }
  };

  return (
    <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
    >
        <SortableContext
            items={items.map((item, idx) => getItemId(item, idx))}
            strategy={verticalListSortingStrategy}
        >
            {children || items.map((item, index) => {
                const itemElement = renderItem(item, index);
                const itemId = getItemId(item, index);
                return React.isValidElement(itemElement)
                    ? React.cloneElement(itemElement, { key: itemId, ...(itemElement.props as React.HTMLAttributes<HTMLElement>) })
                    : <React.Fragment key={itemId}>{itemElement}</React.Fragment>;
            })}
        </SortableContext>
    </DndContext>
  );
}

export default DraggableList;

