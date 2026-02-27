"use client";

import { useRouter } from 'next/navigation';
import MyUITemplates from '@/components/features/ui-templates/MyUITemplates';

export default function TemplatesPage() {
    const router = useRouter();

    return (
        <div className="page-cont">
            <MyUITemplates onOpenUITemplateStore={() => router.push('/templates')} />
        </div>
    );
}
