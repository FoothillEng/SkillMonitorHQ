import { useState, createContext } from 'react';

import type { User } from '@prisma/client';

export type ApprenticeUser = User & {
    userMachineId: number;
};

interface IApprenticeContext {
    apprentices: ApprenticeUser[];
    setApprentices: (
        prevState:
            | ApprenticeUser[]
            | ((prevState: ApprenticeUser[]) => ApprenticeUser[])
    ) => void;
}

export const ApprenticeContext = createContext<IApprenticeContext>({
    apprentices: [],
    setApprentices: () => {}
});

export const ApprenticeProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [apprentices, setApprentices] = useState<ApprenticeUser[]>([]);

    const handleSetApprentices = (
        prevState:
            | ApprenticeUser[]
            | ((prevState: ApprenticeUser[]) => ApprenticeUser[])
    ) => {
        if (typeof prevState === 'function') {
            setApprentices((prevApprentices) => prevState(prevApprentices));
        } else {
            setApprentices(prevState);
        }
    };

    return (
        <ApprenticeContext.Provider
            value={{
                apprentices,
                setApprentices: handleSetApprentices
            }}
        >
            {children}
        </ApprenticeContext.Provider>
    );
};
