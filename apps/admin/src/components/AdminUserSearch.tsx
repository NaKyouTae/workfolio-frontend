"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Worker, Worker_WorkerStatus } from "@workfolio/shared/generated/common";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import styles from "./AdminUserSearch.module.css";
import { formatPhone } from "@/utils/format";

interface AdminUserSearchProps {
    selectedWorker: Worker | null;
    onSelectWorker: (worker: Worker) => void;
    onClearWorker: () => void;
    compact?: boolean;
}

function getStatusLabel(status: Worker_WorkerStatus | string): string {
    const s = typeof status === "string" ? status : Worker_WorkerStatus[status];
    switch (s) {
        case "ACTIVE": return "활성";
        case "INACTIVE": return "비활성";
        case "DELETED": return "삭제";
        default: return "알 수 없음";
    }
}

function isActive(status: Worker_WorkerStatus | string): boolean {
    const s = typeof status === "string" ? status : Worker_WorkerStatus[status];
    return s === "ACTIVE";
}

export default function AdminUserSearch({ selectedWorker, onSelectWorker, onClearWorker, compact }: AdminUserSearchProps) {
    const { workers, loading, fetchWorkers } = useAdminUsers();
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchWorkers();
    }, [fetchWorkers]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredWorkers = useMemo(() => {
        if (!searchQuery.trim()) return workers;
        const query = searchQuery.toLowerCase();
        return workers.filter(
            (worker) =>
                worker.nickName?.toLowerCase().includes(query) ||
                worker.phone?.toLowerCase().includes(query) ||
                worker.email?.toLowerCase().includes(query)
        );
    }, [workers, searchQuery]);

    const handleSelect = (worker: Worker) => {
        onSelectWorker(worker);
        setIsOpen(false);
        setSearchQuery("");
    };

    if (selectedWorker) {
        if (compact) {
            return (
                <div className={styles.selectedUserCompact}>
                    <span className={styles.selectedUserName}>{selectedWorker.nickName}</span>
                    <span className={`${styles.selectedUserStatus} ${isActive(selectedWorker.status) ? styles.statusActive : styles.statusInactive}`}>
                        {getStatusLabel(selectedWorker.status)}
                    </span>
                    <span className={styles.selectedUserDivider} />
                    <span className={styles.selectedUserDetail}>{formatPhone(selectedWorker.phone)}</span>
                    <span className={styles.selectedUserDetail}>{selectedWorker.email || "-"}</span>
                    <button
                        className={styles.changeButtonCompact}
                        onClick={onClearWorker}
                    >
                        변경
                    </button>
                </div>
            );
        }
        return (
            <div className={styles.selectedUser}>
                <div className={styles.selectedUserInfo}>
                    <span className={styles.selectedUserName}>{selectedWorker.nickName}</span>
                    <span className={`${styles.selectedUserStatus} ${isActive(selectedWorker.status) ? styles.statusActive : styles.statusInactive}`}>
                        {getStatusLabel(selectedWorker.status)}
                    </span>
                    <span className={styles.selectedUserDivider} />
                    <span className={styles.selectedUserDetail}>{formatPhone(selectedWorker.phone)}</span>
                    <span className={styles.selectedUserDetail}>{selectedWorker.email || "-"}</span>
                </div>
                <button className={styles.changeButton} onClick={onClearWorker}>
                    변경
                </button>
            </div>
        );
    }

    return (
        <div className={styles.centerWrapper}>
            <div className={styles.searchBox} ref={containerRef}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="닉네임, 연락처, 이메일로 사용자 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    className={styles.searchInput}
                    autoComplete="one-time-code"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                />
                {isOpen && (
                    <div className={styles.dropdown}>
                        {loading ? (
                            <div className={styles.dropdownMessage}>로딩 중...</div>
                        ) : filteredWorkers.length === 0 ? (
                            <div className={styles.dropdownMessage}>검색 결과가 없습니다.</div>
                        ) : (
                            filteredWorkers.map((worker) => (
                                <div
                                    key={worker.id}
                                    className={styles.dropdownItem}
                                    onClick={() => handleSelect(worker)}
                                >
                                    <span className={styles.itemNickName}>{worker.nickName}</span>
                                    <span className={`${styles.itemStatus} ${isActive(worker.status) ? styles.statusActive : styles.statusInactive}`}>
                                        {getStatusLabel(worker.status)}
                                    </span>
                                    <span className={styles.itemPhone}>{formatPhone(worker.phone)}</span>
                                    <span className={styles.itemEmail}>{worker.email || "-"}</span>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
