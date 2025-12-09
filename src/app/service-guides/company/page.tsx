"use client";

import React from "react";
import Header from "@/components/portal/layouts/Header";
import ServiceGuidesPage from "@/components/portal/features/service-guide/ServiceGuidesPage";

export default function CompanyPage() {
    return (
        <>
            <Header />
            <ServiceGuidesPage initialMenu="company" />
        </>
    );
}
