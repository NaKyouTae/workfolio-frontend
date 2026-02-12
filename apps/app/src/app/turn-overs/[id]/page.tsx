"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/layouts/Header";
import TurnOversPage from "@/components/features/turn-overs/TurnOversPage";

const TurnOverView = () => {
  const params = useParams();
  const id = params.id as string;

  return (
    <>
      <Header />
      <TurnOversPage initialTurnOverId={id} />
    </>
  );
};

export default TurnOverView;
