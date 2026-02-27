import React, { ReactNode, useState } from 'react';
import '../styles/table-view.css';
import LoadingScreen from './LoadingScreen';

export interface TableColumn<T> {
  key: string;
  title: string;
  width?: string;
  render: (item: T, index: number) => ReactNode;
}

interface TableViewProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  onRowClick?: (item: T, index: number) => void;
  expandedRowRender?: (item: T, index: number) => ReactNode;
  getRowKey?: (item: T, index: number) => string;
  emptyMessage?: string;
  isLoading?: boolean;
}

function TableView<T>({
  columns,
  data,
  onRowClick,
  expandedRowRender,
  getRowKey,
  emptyMessage = '데이터가 없습니다.',
  isLoading = false
}: TableViewProps<T>) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<Set<string>>(new Set());

  const handleRowClick = (item: T, index: number) => {
    if (expandedRowRender) {
      const key = getRowKey ? getRowKey(item, index) : String(index);
      setExpandedRowKeys((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }
        return newSet;
      });
    }
    onRowClick?.(item, index);
  };

  const isRowExpanded = (item: T, index: number) => {
    const key = getRowKey ? getRowKey(item, index) : String(index);
    return expandedRowKeys.has(key);
  };

  if (isLoading && data.length === 0) {
    return (
      <div className="table-view-container">
        <LoadingScreen />
      </div>
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <div className="table-view-container">
        <div className="table-view-empty">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="table-view-container">
      {isLoading && (
        <div className="table-view-refresh-overlay">
          <svg className="table-view-refresh-spinner" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="40 60" />
          </svg>
        </div>
      )}
      <table className="table-view">
        <thead>
          <tr>
            {expandedRowRender && (
              <th style={{ width: '40px' }}></th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const expanded = isRowExpanded(item, index);
            return (
              <React.Fragment key={getRowKey ? getRowKey(item, index) : index}>
                <tr
                  onClick={() => handleRowClick(item, index)}
                  className={expandedRowRender || onRowClick ? 'clickable' : ''}
                >
                  {expandedRowRender && (
                    <td className="expand-icon-cell">
                      <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>
                        ▶
                      </span>
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.key} data-title={column.title}>
                      {column.render(item, index)}
                    </td>
                  ))}
                </tr>
                {expanded && expandedRowRender && (
                  <tr className="expanded-row">
                    <td colSpan={columns.length + 1}>
                      <div className="expanded-content">
                        {expandedRowRender(item, index)}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TableView;
