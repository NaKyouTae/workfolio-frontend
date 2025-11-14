'use client';

import { useEffect, useState } from 'react';
import { useAdminNotices } from '@/hooks/useAdminNotices';
import { Notice } from '@/generated/common';
import TableView, { TableColumn } from '@/components/portal/ui/TableView';
import NoticeCreateModal from './NoticeCreateModal';
import NoticeUpdateModal from './NoticeUpdateModal';
import { NoticeCreateRequest, NoticeUpdateRequest } from '@/generated/notice';

export default function AdminNotices() {
  const { notices, loading, error, fetchNotices, createNotice, updateNotice, deleteNotice } = useAdminNotices();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleOpenCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const handleOpenUpdateModal = (notice: Notice) => {
    setEditingNotice(notice);
    setShowUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setEditingNotice(null);
    setShowUpdateModal(false);
  };

  const handleCreate = async (request: NoticeCreateRequest) => {
    return await createNotice(request);
  };

  const handleUpdate = async (request: NoticeUpdateRequest) => {
    return await updateNotice(request);
  };

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteNotice(id);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const columns: TableColumn<Notice>[] = [
    {
      key: 'isPinned',
      title: '고정',
      width: '80px',
      render: (notice) => (
        <span style={{
          display: 'inline-block',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 600,
          backgroundColor: notice.isPinned ? '#fef3c7' : '#f3f4f6',
          color: notice.isPinned ? '#92400e' : '#6b7280',
        }}>
          {notice.isPinned ? '고정' : '-'}
        </span>
      ),
    },
    {
      key: 'title',
      title: '제목',
      render: (notice) => (
        <div style={{ fontWeight: 500 }}>
          {notice.title}
        </div>
      ),
    },
    {
      key: 'createdAt',
      title: '작성일',
      width: '120px',
      render: (notice) => formatDate(notice.createdAt),
    },
    {
      key: 'updatedAt',
      title: '수정일',
      width: '120px',
      render: (notice) => formatDate(notice.updatedAt),
    },
    {
      key: 'actions',
      title: '작업',
      width: '150px',
      render: (notice) => (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '8px',
        }}>
          <button
            className="line gray"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenUpdateModal(notice);
            }}
            style={{ width: '60px', height: '30px' }}
          >
            편집
          </button>
          <button
            className="line red"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(notice.id);
            }}
            style={{ width: '60px', height: '30px' }}
          >
            삭제
          </button>
        </div>
      ),
    },
  ];

  const renderExpandedRow = (notice: Notice) => {
    return (
      <div style={{ padding: '16px' }}>
        <div style={{ 
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            gap: '16px',
            fontSize: '13px',
            color: '#6b7280'
          }}>
            <span>작성일: {formatDate(notice.createdAt)}</span>
            <span>수정일: {formatDate(notice.updatedAt)}</span>
            <span>고정: {notice.isPinned ? '예' : '아니오'}</span>
          </div>
        </div>
        <div style={{ 
          fontSize: '14px',
          lineHeight: '1.6',
          color: '#374151',
          whiteSpace: 'pre-line'
        }}>
          {notice.content}
        </div>
      </div>
    );
  };

  return (
    <div className="contents">
      <div className="page-title">
        <div>
          <h2>공지사항 관리</h2>
          <p>공지사항을 생성하고 관리합니다.</p>
        </div>
      </div>

      <div className="page-cont">
        <div className="cont-box">
          <div className="cont-tit">
            <h3>전체 공지사항 ({notices.length}개)</h3>
            <button onClick={handleOpenCreateModal}>
              + 새 공지사항 추가
            </button>
          </div>

          {loading && <div>로딩 중...</div>}
          {error && <div style={{ color: 'red' }}>에러: {error}</div>}

          <TableView
            columns={columns}
            data={notices}
            expandedRowRender={renderExpandedRow}
            getRowKey={(notice) => notice.id}
            emptyMessage="등록된 공지사항이 없습니다."
            isLoading={loading}
          />
        </div>
      </div>

      <NoticeCreateModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSubmit={handleCreate}
      />

      <NoticeUpdateModal
        isOpen={showUpdateModal}
        notice={editingNotice}
        onClose={handleCloseUpdateModal}
        onSubmit={handleUpdate}
      />
    </div>
  );
}

