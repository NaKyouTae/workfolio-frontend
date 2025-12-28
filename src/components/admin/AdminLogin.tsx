"use client";

import { useState } from "react";
import styles from "@/app/admin/admin.module.css";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Staff Login API 호출
            const response = await fetch("/api/staffs/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                setError(errorData.error || "아이디 또는 비밀번호가 올바르지 않습니다.");
                setLoading(false);
                return;
            }

            const data = await response.json();

            // 로그인 성공 - 세션 저장
            sessionStorage.setItem("admin_logged_in", "true");
            sessionStorage.setItem("admin_user", JSON.stringify(data.staff));

            // 쿠키가 설정되도록 약간의 지연 후 전체 페이지 리로드로 대시보드로 이동
            // router.push는 클라이언트 사이드 네비게이션이므로 쿠키가 아직 설정되지 않을 수 있음
            setTimeout(() => {
                window.location.href = "/admin/dashboard";
            }, 100);
        } catch (err) {
            setError("로그인 중 오류가 발생했습니다.");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.loginBox}>
                <div className={styles.logoSection}>
                    <h1>Workfolio Admin</h1>
                    <p>관리자 로그인</p>
                </div>

                <form onSubmit={handleLogin} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="username">아이디</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="관리자 아이디를 입력하세요"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">비밀번호</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            required
                            disabled={loading}
                        />
                    </div>

                    {error && <div className={styles.error}>{error}</div>}

                    <button type="submit" className={styles.loginButton} disabled={loading}>
                        {loading ? "로그인 중..." : "로그인"}
                    </button>
                </form>
            </div>
        </div>
    );
}
