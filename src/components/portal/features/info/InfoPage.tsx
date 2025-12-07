"use client";

import React from "react";
import Header from "@/components/portal/layouts/Header";
import InfoContent from "./InfoContent";
import styles from "./InfoPage.module.css";

const InfoPage: React.FC = () => {
    return (
        <>
            <Header />
            <InfoContent />
        </>
    );
};

export default InfoPage;
