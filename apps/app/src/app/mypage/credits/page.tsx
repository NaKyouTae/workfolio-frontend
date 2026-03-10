"use client";

import CreditHistory from '@/components/features/credits/CreditHistory';
import { usePaymentWidgetContext } from '../layout';

export default function CreditsPage() {
    const { openPaymentWidget } = usePaymentWidgetContext();

    return (
        <>
            <div className="page-title">
                <div>
                    <h2>크레딧 내역</h2>
                </div>
            </div>
            <div className="page-cont" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <CreditHistory onOpenPaymentWidget={openPaymentWidget} />
            </div>
        </>
    );
}
