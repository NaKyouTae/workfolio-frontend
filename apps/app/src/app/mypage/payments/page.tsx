"use client";

import PaymentHistory from '@/components/features/payments/PaymentHistory';

export default function PaymentsPage() {
    return (
        <div className="page-cont" style={{ display: 'flex', flexDirection: 'column' }}>
            <PaymentHistory />
        </div>
    );
}
