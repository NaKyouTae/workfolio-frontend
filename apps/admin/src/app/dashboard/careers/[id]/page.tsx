import AdminCareerDetail from "@/components/AdminCareerDetail";

export default async function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <AdminCareerDetail id={id} />;
}
