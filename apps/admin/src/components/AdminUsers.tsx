"use client";

import { useEffect, useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Worker, Worker_Gender } from "@workfolio/shared/generated/common";
import { WorkerUpdateRequest } from "@workfolio/shared/generated/worker";
import TableView, { TableColumn } from "@workfolio/shared/ui/TableView";

import LoadingScreen from "@workfolio/shared/ui/LoadingScreen";
import UserUpdateModal from "./UserUpdateModal";

export default function AdminUsers() {
    const { workers, loading, error, fetchWorkers, updateWorker } = useAdminUsers();
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null);

    useEffect(() => {
        fetchWorkers();
    }, [fetchWorkers]);

    const handleOpenUpdateModal = (worker: Worker) => {
        setEditingWorker(worker);
        setShowUpdateModal(true);
    };

    const handleCloseUpdateModal = () => {
        setEditingWorker(null);
        setShowUpdateModal(false);
    };

    const handleUpdate = async (request: WorkerUpdateRequest) => {
        return await updateWorker(request);
    };

    const formatDate = (timestamp: number | string | undefined) => {
        if (!timestamp) return "-";
        const numTimestamp = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp;
        if (isNaN(numTimestamp) || numTimestamp === 0) {
            return "-";
        }
        const date = new Date(numTimestamp);
        if (isNaN(date.getTime())) {
            return "-";
        }
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
            date.getDate()
        ).padStart(2, "0")}`;
    };

    const getGenderLabel = (gender?: Worker_Gender) => {
        switch (gender) {
            case Worker_Gender.MALE:
                return "남성";
            case Worker_Gender.FEMALE:
                return "여성";
            default:
                return "-";
        }
    };

    const columns: TableColumn<Worker>[] = [
        {
            key: "id",
            title: "ID",
            width: "130px",
            render: (worker) => (
                <span style={{ fontSize: "11px", color: "#555", fontFamily: "monospace" }}>
                    {worker.id.substring(0, 14)}
                </span>
            ),
        },
        {
            key: "nickName",
            title: "닉네임",
            width: "120px",
            render: (worker) => (
                <span style={{ fontWeight: 500, color: "#ddd" }}>{worker.nickName}</span>
            ),
        },
        {
            key: "email",
            title: "이메일",
            width: "200px",
            render: (worker) => (
                <span style={{ color: "#999" }}>{worker.email}</span>
            ),
        },
        {
            key: "phone",
            title: "전화번호",
            width: "130px",
            render: (worker) => (
                <span style={{ color: "#999", fontSize: "12px" }}>{worker.phone}</span>
            ),
        },
        {
            key: "gender",
            title: "성별",
            width: "60px",
            render: (worker) => (
                <span style={{ color: "#777" }}>{getGenderLabel(worker.gender)}</span>
            ),
        },
        {
            key: "birthDate",
            title: "생년월일",
            width: "100px",
            render: (worker) => (
                <span style={{ color: "#777", fontSize: "12px" }}>{formatDate(worker.birthDate)}</span>
            ),
        },
        {
            key: "createdAt",
            title: "가입일",
            width: "100px",
            render: (worker) => (
                <span style={{ color: "#777", fontSize: "12px" }}>{formatDate(worker.createdAt)}</span>
            ),
        },
        {
            key: "actions",
            title: "",
            width: "70px",
            render: (worker) => (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                        className="table-action-btn edit"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenUpdateModal(worker);
                        }}
                    >
                        편집
                    </button>
                </div>
            ),
        },
    ];

    const renderExpandedRow = (worker: Worker) => {
        return (
            <div>
                <div className="expanded-detail-grid">
                    <div className="detail-item">
                        <span className="detail-label">ID</span>
                        <span className="detail-value mono">{worker.id}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">닉네임</span>
                        <span className="detail-value highlight">{worker.nickName}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">이메일</span>
                        <span className="detail-value">{worker.email}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">전화번호</span>
                        <span className="detail-value">{worker.phone}</span>
                    </div>
                </div>
                <div className="expanded-detail-grid expanded-section">
                    <div className="detail-item">
                        <span className="detail-label">성별</span>
                        <span className="detail-value">{getGenderLabel(worker.gender)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">생년월일</span>
                        <span className="detail-value">{formatDate(worker.birthDate)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">가입일</span>
                        <span className="detail-value">{formatDate(worker.createdAt)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">수정일</span>
                        <span className="detail-value">{formatDate(worker.updatedAt)}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="contents">
            <div className="page-title">
                <div>
                    <h2>사용자 관리</h2>
                    <p>사용자를 생성하고 관리합니다.</p>
                </div>
            </div>

            <div className="page-cont">
                <div className="cont-box">
                    <div className="cont-tit">
                        <h3>전체 사용자 ({workers.length}명)</h3>
                    </div>

                    {loading && <LoadingScreen />}
                    {error && <div style={{ color: "#f87171" }}>에러: {error}</div>}

                    <TableView
                        columns={columns}
                        data={workers}
                        expandedRowRender={renderExpandedRow}
                        getRowKey={(worker) => worker.id}
                        emptyMessage="등록된 사용자가 없습니다."
                        isLoading={loading}
                    />
                </div>
            </div>

            <UserUpdateModal
                isOpen={showUpdateModal}
                worker={editingWorker}
                onClose={handleCloseUpdateModal}
                onSubmit={handleUpdate}
            />
        </div>
    );
}
