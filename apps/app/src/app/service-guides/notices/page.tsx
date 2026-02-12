"use client";

import React from "react";
import Header from "@/components/layouts/Header";
import ServiceGuidesPage from "@/components/features/service-guide/ServiceGuidesPage";

export default function NoticesPage() {
    return (
        <>
            <Header />
            <ServiceGuidesPage initialMenu="notices" />
        </>
    );
}
