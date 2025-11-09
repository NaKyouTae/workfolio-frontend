import React from 'react';
import TableView, { TableColumn } from '@/components/ui/TableView';
import { useNotices, Notice } from '@/hooks/useNotices';

interface NoticesIntegrationProps {
  onNoticeClick?: (notice: Notice) => void;
}

const NoticesIntegration: React.FC<NoticesIntegrationProps> = ({ onNoticeClick }) => {
  const { notices, isLoading, isSampleData } = useNotices();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const columns: TableColumn<Notice>[] = [
    {
      key: 'status',
      title: '구분',
      width: '80px',
      render: (notice) => (
        <span style={{
          display: 'inline-block',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 600,
          backgroundColor: notice.isImportant ? '#fee2e2' : '#f3f4f6',
          color: notice.isImportant ? '#dc2626' : '#6b7280',
        }}>
          {notice.isImportant ? '중요' : '일반'}
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
      key: 'author',
      title: '작성자',
      width: '100px',
      render: (notice) => notice.author,
    },
    {
      key: 'createdAt',
      title: '작성일',
      width: '120px',
      render: (notice) => formatDate(notice.createdAt),
    },
  ];

  const renderExpandedRow = (notice: Notice) => {
    return (
      <div>
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
            <span>작성자: {notice.author}</span>
            <span>작성일: {formatDate(notice.createdAt)}</span>
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
    <div style={{ padding: '24px' }}>
      <div style={{ 
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 700,
          color: '#1f2937',
          margin: 0
        }}>
          공지사항
        </h2>
        <div style={{ color: '#6b7280', fontSize: '14px' }}>
          총 {notices.length}개
        </div>
      </div>

      {isSampleData && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 16px',
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>ℹ️</span>
          <span style={{ fontSize: '14px', color: '#92400e' }}>
            로그인하시면 실시간 공지사항을 확인하실 수 있습니다.
          </span>
        </div>
      )}

      <TableView
        columns={columns}
        data={notices}
        onRowClick={onNoticeClick}
        expandedRowRender={renderExpandedRow}
        getRowKey={(notice) => notice.id}
        emptyMessage="등록된 공지사항이 없습니다."
        isLoading={isLoading}
      />
    </div>
  );
};

export default NoticesIntegration;

