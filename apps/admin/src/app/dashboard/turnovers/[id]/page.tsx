import AdminTurnOverDetail from "@/components/AdminTurnOverDetail";

export default async function TurnOverDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminTurnOverDetail id={id} />;
}
