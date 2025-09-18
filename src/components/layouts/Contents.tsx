// src/components/layouts/Contents.tsx
import React from 'react';
import Sidebar from "@/components/layouts/Sidebar"
import BodyRight from "@/components/layouts/BodyRight"
import Footer from "@/components/layouts/Footer"

const Contents = () => {
    return (
        <main>
            <Sidebar />
            <section>
                <BodyRight />
                <Footer/>
            </section>
        </main>
    );
};

export default Contents;
