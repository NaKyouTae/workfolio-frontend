// src/components/layouts/Contents.tsx
import React, { useRef } from 'react';
import Sidebar from "@/components/layouts/Sidebar"
import BodyRight, { BodyRightRef } from "@/components/layouts/BodyRight"
import Footer from "@/components/layouts/Footer"

const Contents = () => {
    const bodyRightRef = useRef<BodyRightRef>(null);

    return (
        <main>
            <Sidebar />
            <section>
                <BodyRight ref={bodyRightRef} />
                <Footer/>
            </section>
        </main>
    );
};

export default Contents;
