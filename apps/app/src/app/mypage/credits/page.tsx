"use client";

import CreditHistory from '@/components/features/credits/CreditHistory';
import { usePaymentWidgetContext } from '../layout';

export default function CreditsPage() {
    const { openPaymentWidget } = usePaymentWidgetContext();

    return (
        <div className="page-cont" style={{ overflow: 'hidden' }}>
            <CreditHistory onOpenPaymentWidget={openPaymentWidget} />
        </div>
    );
}
