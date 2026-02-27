"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Worker } from "@workfolio/shared/generated/common";

interface SelectedWorkerContextType {
    selectedWorker: Worker | null;
    selectWorker: (worker: Worker) => void;
    clearWorker: () => void;
}

const SelectedWorkerContext = createContext<SelectedWorkerContextType | null>(null);

export function SelectedWorkerProvider({ children }: { children: ReactNode }) {
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

    const selectWorker = useCallback((worker: Worker) => {
        setSelectedWorker(worker);
    }, []);

    const clearWorker = useCallback(() => {
        setSelectedWorker(null);
    }, []);

    return (
        <SelectedWorkerContext.Provider value={{ selectedWorker, selectWorker, clearWorker }}>
            {children}
        </SelectedWorkerContext.Provider>
    );
}

export function useSelectedWorker() {
    const context = useContext(SelectedWorkerContext);
    if (!context) {
        throw new Error("useSelectedWorker must be used within SelectedWorkerProvider");
    }
    return context;
}
