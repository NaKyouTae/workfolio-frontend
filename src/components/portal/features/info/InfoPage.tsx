"use client";

import React from "react";
import Header from "@/components/portal/layouts/Header";
import Footer from "@/components/portal/layouts/Footer";
import InfoContent from "./InfoContent";
import styles from "./InfoPage.module.css";

const InfoPage: React.FC = () => {
    return (
        <div className={styles.infoPageContainer}>
            <Header />
            <div className={styles.infoContentWrapper}>
                <InfoContent />
            </div>
            <Footer />
        </div>
    );
};

export default InfoPage;
