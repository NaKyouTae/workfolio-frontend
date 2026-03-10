"use client";

import { useRouter } from 'next/navigation';
import MyUITemplates from '@/components/features/ui-templates/MyUITemplates';

export default function TemplatesPage() {
    const router = useRouter();

    return (
        <>
            <div className="page-title">
                <div>
                    <h2>보유 템플릿</h2>
                </div>
            </div>
            <div className="page-cont" style={{ display: 'flex', flexDirection: 'column' }}>
                <MyUITemplates onOpenUITemplateStore={() => router.push('/templates')} />
            </div>
        </>
    );
}
