"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import InfoContent from "./InfoContent";

const InfoPage: React.FC = () => {
    return (
        <>
            <header className="info-header">
                <h1>
                    <Link href="/info">
                        <Image
                            src="/assets/img/logo/img-logo01.svg"
                            alt="workfolio"
                            width={174}
                            height={50}
                        />
                    </Link>
                </h1>
            </header>
            <InfoContent />
        </>
    );
};

export default InfoPage;
