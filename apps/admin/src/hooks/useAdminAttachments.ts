import { useState, useCallback } from 'react';

export interface AdminAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  targetId: string;
  targetType: string;
  category: string;
  type: string;
  fileExtension: string;
  fileSizeBytes: number;
  createdAt: string;
  updatedAt: string;
}

interface AdminAttachmentListResponse {
  attachments: AdminAttachment[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export const useAdminAttachments = () => {
  const [attachments, setAttachments] = useState<AdminAttachment[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAttachments = useCallback(async (page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/attachments?page=${page}&size=${size}`);
      if (!response.ok) {
        throw new Error('Failed to fetch attachments');
      }
      const data: AdminAttachmentListResponse = await response.json();
      setAttachments(data.attachments || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 0);
      setCurrentPage(data.currentPage || 0);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setAttachments([]);
      setTotalElements(0);
      setTotalPages(0);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAttachment = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/attachments/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete attachment');
      }
      const data = await response.json();
      return data.isSuccess || false;
    } catch (error) {
      console.error('Error deleting attachment:', error);
      return false;
    }
  }, []);

  return {
    attachments,
    totalElements,
    totalPages,
    currentPage,
    loading,
    error,
    fetchAttachments,
    deleteAttachment,
  };
};
