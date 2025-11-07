import React from 'react';
import styles from './CareerContentEdit.module.css';
import { useConfirm } from '@/hooks/useConfirm';

interface EditFloatingNavigationProps {
  onSave: () => void;
  onCancel?: () => void;
}

const EditFloatingNavigation: React.FC<EditFloatingNavigationProps> = ({
  onSave,
  onCancel
}) => {
  const { confirm } = useConfirm();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancel = async () => {
    const result = await confirm({
      icon: '/assets/img/ico/ic-warning.svg',
      title: '이력서 작성을 취소하시겠어요?',
      description: '지금까지 입력한 내용이 저장되지 않아요.\n지금 나가면 처음부터 다시 작성해야 할 수 있어요.',
      confirmText: '취소하기',
      cancelText: '돌아가기',
    });

    if (result) {
      onCancel?.();
    }
  };

  return (
    <nav>
        <ul className="nav-wrap">
            <li onClick={() => scrollToSection('basic-info')} className="active">기본 정보</li>
            <li onClick={() => scrollToSection('education')}>학력</li>
            <li onClick={() => scrollToSection('career')}>경력</li>
            <li onClick={() => scrollToSection('project')}>프로젝트</li>
            <li onClick={() => scrollToSection('activity')}>활동</li>
            <li onClick={() => scrollToSection('language')}>언어</li>
            <li onClick={() => scrollToSection('attachment')}>첨부</li>
        </ul>
        <div className="nav-btn">
            <button className="dark-gray" onClick={onSave}>저장하기</button>
            <button className="line gray" onClick={handleCancel}>취소</button>
        </div>
    </nav>
  );
};

export default EditFloatingNavigation;

