# 드래그앤드롭 컴포넌트 사용 가이드

## 개요

`DraggableList`와 `DraggableItem` 컴포넌트를 사용하면 간단하게 드래그앤드롭 기능을 구현할 수 있습니다.

## 컴포넌트

### DraggableList

드래그 가능한 리스트의 컨테이너 컴포넌트입니다.

**Props:**
- `items`: 드래그할 아이템 배열
- `onReorder`: 순서 변경 시 호출되는 함수
- `getItemId`: 각 아이템의 고유 ID를 반환하는 함수
- `renderItem`: 각 아이템을 렌더링하는 함수

### DraggableItem

개별 드래그 가능한 아이템 컴포넌트입니다.

**Props:**
- `id`: 아이템의 고유 ID (필수)
- `children`: 아이템 내용
- `className`: 추가 CSS 클래스
- `dragButtonSize`: 드래그 버튼 크기 (기본값: 24)
- `showDragButton`: 드래그 버튼 표시 여부 (기본값: true)
- `style`: 추가 스타일

## 사용 예시

### 1. 기본 사용법

```tsx
import DraggableList from './DraggableList';
import DraggableItem from './DraggableItem';

const MyComponent = () => {
  const [items, setItems] = useState([...]);

  const handleReorder = (reorderedItems) => {
    const updatedItems = reorderedItems.map((item, idx) => ({
      ...item,
      priority: idx
    }));
    setItems(updatedItems);
  };

  return (
    <DraggableList
      items={items}
      onReorder={handleReorder}
      getItemId={(item, idx) => item.id || `item-${idx}`}
      renderItem={(item, index) => (
        <DraggableItem 
          id={item.id || `item-${index}`}
          className={styles.cardWrapper}
        >
          <div className={styles.card}>
            {/* 아이템 내용 */}
          </div>
        </DraggableItem>
      )}
    />
  );
};
```

### 2. EducationEdit 예시

```tsx
import DraggableList from './DraggableList';
import DraggableItem from './DraggableItem';

const EducationEdit = ({ educations, onUpdate }) => {
  const handleReorder = (reorderedEducations) => {
    const updatedEducations = reorderedEducations.map((education, idx) => ({
      ...education,
      priority: idx
    }));
    onUpdate(updatedEducations);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>학력 | {educations.length}개</h3>
        <button onClick={handleAddEducation}>+ 추가</button>
      </div>

      <DraggableList
        items={educations}
        onReorder={handleReorder}
        getItemId={(edu, idx) => edu.id || `education-${idx}`}
        renderItem={(education, index) => (
          <DraggableItem 
            id={education.id || `education-${index}`}
            className={styles.cardWrapper}
          >
            <div className={styles.card}>
              {/* 학력 폼 필드들 */}
            </div>
            <div className={styles.cardActions}>
              <button onClick={() => toggleVisible(index)}>
                {education.isVisible ? '보임' : '안보임'}
              </button>
              <button onClick={() => handleDelete(index)}>×</button>
            </div>
          </DraggableItem>
        )}
      />
    </div>
  );
};
```

### 3. 중첩 드래그앤드롭 (Career + Salary 예시)

```tsx
// Career 리스트
<DraggableList
  items={careers}
  onReorder={handleCareerReorder}
  getItemId={(car, idx) => car.career?.id || `career-${idx}`}
  renderItem={(career, careerIndex) => (
    <DraggableItem 
      id={career.career?.id || `career-${careerIndex}`}
      className={styles.cardWrapper}
    >
      <div className={styles.card}>
        {/* Career 폼 필드들 */}
        
        {/* Salary 중첩 리스트 */}
        <DraggableList
          items={career.salaries || []}
          onReorder={(reorderedSalaries) => handleSalaryReorder(careerIndex, reorderedSalaries)}
          getItemId={(sal, idx) => sal.id || `salary-${careerIndex}-${idx}`}
          renderItem={(salary, salaryIndex) => (
            <DraggableItem 
              id={salary.id || `salary-${careerIndex}-${salaryIndex}`}
              className={styles.cardWrapper}
              dragButtonSize={20}
            >
              <div style={{ backgroundColor: '#f8f9fa' }}>
                {/* Salary 폼 필드들 */}
              </div>
            </DraggableItem>
          )}
        />
      </div>
    </DraggableItem>
  )}
/>
```

## 특징

✅ **드래그 버튼**: 좌측에 드래그 버튼이 자동으로 추가됩니다.  
✅ **드롭 인디케이터**: 드래그 중 드롭 가능한 위치에 파란색 테두리와 배경이 표시됩니다.  
✅ **시각적 피드백**: 드래그 중인 아이템은 50% 투명도로 표시됩니다.  
✅ **타입 안전**: TypeScript 제네릭으로 타입 안전성을 제공합니다.  
✅ **재사용 가능**: 모든 리스트 타입에 사용할 수 있습니다.  

## 마이그레이션 가이드

기존 드래그앤드롭 코드를 새 컴포넌트로 변경하려면:

1. import 변경:
```tsx
// Before
import { DndContext, SortableContext, useSortable, ... } from '@dnd-kit/...';

// After
import DraggableList from './DraggableList';
import DraggableItem from './DraggableItem';
```

2. SortableItem 컴포넌트를 일반 컴포넌트로 변경하고 DraggableItem으로 래핑

3. DndContext/SortableContext를 DraggableList로 교체

4. handleDragEnd를 handleReorder로 단순화

