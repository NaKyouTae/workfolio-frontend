"use client";

import { useEffect, useState } from "react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { Worker, Worker_Gender } from "@/generated/common";
import { WorkerUpdateRequest } from "@/generated/worker";
import TableView, { TableColumn } from "@/components/portal/ui/TableView";

import LoadingScreen from "../portal/ui/LoadingScreen";
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
            width: "120px",
            render: (worker) => (
                <div style={{ fontSize: "12px", color: "#6b7280" }}>{worker.id}</div>
            ),
        },
        {
            key: "nickName",
            title: "닉네임",
            width: "150px",
            render: (worker) => <div style={{ fontWeight: 500 }}>{worker.nickName}</div>,
        },
        {
            key: "email",
            title: "이메일",
            width: "200px",
            render: (worker) => <div>{worker.email}</div>,
        },
        {
            key: "phone",
            title: "전화번호",
            width: "150px",
            render: (worker) => <div>{worker.phone}</div>,
        },
        {
            key: "gender",
            title: "성별",
            width: "80px",
            render: (worker) => <div>{getGenderLabel(worker.gender)}</div>,
        },
        {
            key: "birthDate",
            title: "생년월일",
            width: "120px",
            render: (worker) => formatDate(worker.birthDate),
        },
        {
            key: "createdAt",
            title: "가입일",
            width: "120px",
            render: (worker) => formatDate(worker.createdAt),
        },
        {
            key: "actions",
            title: "작업",
            width: "100px",
            render: (worker) => (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <button
                        className="line gray"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleOpenUpdateModal(worker);
                        }}
                        style={{ width: "60px", height: "30px" }}
                    >
                        편집
                    </button>
                </div>
            ),
        },
    ];

    const renderExpandedRow = (worker: Worker) => {
        return (
            <div style={{ padding: "16px" }}>
                <div
                    style={{
                        marginBottom: "12px",
                        paddingBottom: "12px",
                        borderBottom: "1px solid #e5e7eb",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            gap: "16px",
                            fontSize: "13px",
                            color: "#6b7280",
                            flexWrap: "wrap",
                        }}
                    >
                        <span>ID: {worker.id}</span>
                        <span>닉네임: {worker.nickName}</span>
                        <span>이메일: {worker.email}</span>
                        <span>전화번호: {worker.phone}</span>
                        <span>성별: {getGenderLabel(worker.gender)}</span>
                        <span>생년월일: {formatDate(worker.birthDate)}</span>
                        <span>가입일: {formatDate(worker.createdAt)}</span>
                        <span>수정일: {formatDate(worker.updatedAt)}</span>
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
                    {error && <div style={{ color: "red" }}>에러: {error}</div>}

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
