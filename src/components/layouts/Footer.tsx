'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/hooks/useModal';
import ContentModal from '@/components/ui/ContentModal';

const Footer = () => {
  const { isOpen, content, title, openModal, closeModal } = useModal();

  const handleCustomerInquiry = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const inquiryContent = `📧 고객 문의 안내

고객님의 소중한 의견을 기다립니다.

📌 문의 방법:
• 이메일: support@workfolio.pro
• 운영 시간: 평일 09:00 - 18:00 (주말 및 공휴일 제외)
• 평균 응답 시간: 1-2 영업일 이내

📋 문의 시 포함해 주세요:
• 이름 또는 닉네임
• 가입 시 사용한 이메일
• 문의 내용 (상세히 작성해 주시면 빠른 답변이 가능합니다)

💡 자주 묻는 질문은 FAQ 페이지에서 확인하실 수 있습니다.

감사합니다.`;

    openModal(inquiryContent, '고객 문의');
  };

  return (
    <>
      <footer>
        <ul>
          <li>
            <Link href="/notices">공지사항</Link>
          </li>
          <li>
            <a href="#" onClick={handleCustomerInquiry}>
              고객문의
            </a>
          </li>
          <li><a href="#">이용약관</a></li>
          <li><a href="#">개인정보처리방침</a></li>
          <li>
            <Link href="/plans">플랜구성</Link>
          </li>
        </ul>

        <p>Ⓒ 2025 Spectrum. All rights reserved.</p>
      </footer>

      <ContentModal
        isOpen={isOpen}
        onClose={closeModal}
        content={content}
        title={title}
      />
    </>
  );
};

export default Footer;
