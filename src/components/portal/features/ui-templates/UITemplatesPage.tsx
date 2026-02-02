"use client";

import React from 'react';
import Header from '@/components/portal/layouts/Header';
import Footer from '@/components/portal/layouts/Footer';
import UITemplateList from './UITemplateList';
import CreditBalance from '@/components/portal/features/credits/CreditBalance';

const UITemplatesPage: React.FC = () => {
    return (
        <>
            <Header />
            <main>
                <section className="full-width">
                    <div className="contents" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
                        <div className="page-title" style={{ textAlign: 'center', marginBottom: '40px' }}>
                            <div style={{ marginBottom: '16px' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px' }}>템플릿 스토어</h2>
                                <p style={{ color: '#666', fontSize: '16px' }}>공개 이력서 URL과 PDF 다운로드에 사용할 수 있는 템플릿을 구매하세요.</p>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <CreditBalance />
                            </div>
                        </div>
                        <div className="page-cont">
                            <UITemplateList />
                        </div>
                    </div>
                    <Footer />
                </section>
            </main>
        </>
    );
};

export default UITemplatesPage;
