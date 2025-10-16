// src/components/layouts/Contents.tsx
import React, { useRef, useState } from 'react';
import Sidebar from "@/components/layouts/Sidebar"
import BodyRight, { BodyRightRef } from "@/components/layouts/BodyRight"
import RecordsConfig from "@/components/features/sidebar/RecordsConfig"
import Footer from "@/components/layouts/Footer"

const Contents = () => {
    const bodyRightRef = useRef<BodyRightRef>(null);
    const [isConfigMode, setIsConfigMode] = useState(false);

    const handleConfigToggle = () => {
        setIsConfigMode(!isConfigMode);
    };

    const handleConfigClose = () => {
        setIsConfigMode(false);
    };

    return (
        <main>
            <Sidebar onConfigToggle={handleConfigToggle} />
            <section>
                {isConfigMode ? (
                    <RecordsConfig onClose={handleConfigClose} />
                ) : (
                    <BodyRight ref={bodyRightRef} />
                )}
                <Footer/>
            </section>
        </main>
    );
};

export default Contents;
