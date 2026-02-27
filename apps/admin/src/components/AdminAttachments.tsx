"use client";

import { useEffect, useState } from "react";
import TableView, { TableColumn } from "@workfolio/shared/ui/TableView";
import Pagination from "@workfolio/shared/ui/Pagination";

import { AdminAttachment, useAdminAttachments } from "@/hooks/useAdminAttachments";

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "avif", "heic", "heif"]);

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getFileExtension(attachment: AdminAttachment): string {
  const ext = attachment.fileExtension?.trim().toLowerCase();
  if (ext) return ext;
  const fromName = attachment.fileName?.split(".").pop()?.trim().toLowerCase();
  return fromName || "";
}

function isImageAttachment(attachment: AdminAttachment): boolean {
  return IMAGE_EXTENSIONS.has(getFileExtension(attachment));
}

function getTargetTypeLabel(targetType: string): string {
  const normalized = (targetType || "").trim().toUpperCase();
  if (normalized.includes("RECORD")) return "기록";
  if (normalized.includes("RESUME")) return "이력";
  if (normalized.includes("CAREER")) return "이직";
  if (normalized.includes("TURN_OVER_GOAL")) return "이직 목표";
  if (normalized.includes("TURN_OVER_CHALLENGE")) return "이직 과제";
  if (normalized.includes("TURN_OVER_RETROSPECTIVE")) return "이직 회고";
  if (normalized.includes("TURN_OVER")) return "이직";
  if (normalized.includes("WORKER")) return "사용자";
  return "기타";
}

function renderPreview(attachment: AdminAttachment) {
  const extension = getFileExtension(attachment);
  const extensionLabel = extension ? extension.toUpperCase() : "FILE";
  const isImage = isImageAttachment(attachment);

  if (isImage && attachment.fileUrl) {
    return (
      <img
        src={attachment.fileUrl}
        alt={attachment.fileName || "thumbnail"}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "10px",
          objectFit: "cover",
          border: "1px solid var(--gray003)",
          background: "#fff",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: "48px",
        height: "48px",
        borderRadius: "10px",
        border: "1px solid var(--gray003)",
        background: "linear-gradient(145deg, #f8fafc, #eef2f7)",
        color: "#334155",
        fontWeight: 700,
        fontSize: "11px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        letterSpacing: "0.02em",
      }}
    >
      {extensionLabel}
    </div>
  );
}

export default function AdminAttachments() {
  const { attachments, totalElements, totalPages, currentPage, loading, error, fetchAttachments, deleteAttachment } = useAdminAttachments();
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  useEffect(() => {
    fetchAttachments(0, pageSize);
  }, [fetchAttachments, pageSize]);

  const handlePageChange = (page: number) => {
    fetchAttachments(page - 1, pageSize);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    const success = await deleteAttachment(id);
    if (success) {
      await fetchAttachments(currentPage, pageSize);
    }
  };

  const columns: TableColumn<AdminAttachment>[] = [
    {
      key: "preview",
      title: "미리보기",
      width: "80px",
      render: (a) => (
        <a href={a.fileUrl} target="_blank" rel="noreferrer">
          {renderPreview(a)}
        </a>
      ),
    },
    {
      key: "fileName",
      title: "파일명",
      width: "240px",
      render: (a) => (
        <a href={a.fileUrl} target="_blank" rel="noreferrer" style={{ color: "#0f172a", fontWeight: 500 }}>
          {a.fileName || "-"}
        </a>
      ),
    },
    {
      key: "fileExtension",
      title: "확장자",
      width: "110px",
      render: (a) => {
        const ext = getFileExtension(a);
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "52px",
              height: "26px",
              borderRadius: "999px",
              border: "1px solid var(--gray003)",
              background: "#f8fafc",
              color: "#475569",
              fontSize: "11px",
              fontWeight: 700,
              padding: "0 8px",
            }}
          >
            {ext ? ext.toUpperCase() : "-"}
          </span>
        );
      },
    },
    {
      key: "fileSizeBytes",
      title: "용량",
      width: "110px",
      render: (a) => <span>{formatBytes(a.fileSizeBytes)}</span>,
    },
    {
      key: "targetType",
      title: "대상 유형",
      width: "180px",
      render: (a) => <span>{getTargetTypeLabel(a.targetType)}</span>,
    },
    {
      key: "targetId",
      title: "대상 ID",
      width: "140px",
      render: (a) => <span style={{ fontFamily: "monospace", fontSize: "12px" }}>{a.targetId}</span>,
    },
    {
      key: "createdAt",
      title: "등록일",
      width: "160px",
      render: (a) => <span>{formatDate(a.createdAt)}</span>,
    },
    {
      key: "actions",
      title: "",
      width: "80px",
      render: (a) => (
        <button
          className="line red"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(a.id);
          }}
          style={{ width: "56px", height: "32px", fontSize: "12px" }}
        >
          삭제
        </button>
      ),
    },
  ];

  return (
    <div className="contents">
      <div className="page-title">
        <div>
          <h2>첨부파일 관리</h2>
          <p>전체 첨부파일 목록을 조회하고 삭제할 수 있습니다.</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <div className="page-size-select-wrap">
            <select
              className="page-size-select"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}개
                </option>
              ))}
            </select>
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              className="page-size-select-chevron"
            >
              <path d="M1 1L5 5L9 1" stroke="var(--gray005)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <button
            onClick={() => fetchAttachments(currentPage, pageSize)}
            disabled={loading}
            title="새로고침"
            style={{ width: "36px", height: "36px", padding: 0, border: "1px solid var(--gray003)", borderRadius: "8px", backgroundColor: "transparent", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: loading ? "spin 1s linear infinite" : "none" }}>
              <path d="M13.65 2.35A7.96 7.96 0 0 0 8 0C3.58 0 0 3.58 0 8s3.58 8 8 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 8 14 6 6 0 1 1 8 2c1.66 0 3.14.69 4.22 1.78L9 7h7V0l-2.35 2.35z" fill="var(--gray005)" />
            </svg>
          </button>
        </div>
      </div>

      <div className="page-cont">
        <div className="cont-box">
          <div className="cont-tit">
            <h3>전체 첨부파일 ({totalElements.toLocaleString()}건)</h3>
          </div>

          {error && <div style={{ color: "#f87171" }}>에러: {error}</div>}

          {!loading && (
            <>
              <TableView
                columns={columns}
                data={attachments}
                getRowKey={(a) => a.id}
                emptyMessage="첨부파일이 없습니다."
                isLoading={loading}
              />
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage + 1}
                  totalPages={totalPages}
                  itemsPerPage={pageSize}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
