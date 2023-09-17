import { createContext, useState } from 'react';

interface IApprenticeContext {
    apprenticeIds: string[]; // don't need this... currently actually only need the userMachineIds, but whatever lol
    apprenticeUserMachines: { apprenticeId: string; userMachineId: number }[];
    setApprenticeIds: (
        prevState: string[] | ((prevState: string[]) => string[])
    ) => void;
    setApprenticeUserMachines: (
        prevState:
            | { apprenticeId: string; userMachineId: number }[]
            | ((
                  prevState: { apprenticeId: string; userMachineId: number }[]
              ) => { apprenticeId: string; userMachineId: number }[])
    ) => void;
}

export const ApprenticeContext = createContext<IApprenticeContext>({
    apprenticeIds: [],
    apprenticeUserMachines: [],
    setApprenticeIds: () => {},
    setApprenticeUserMachines: () => {}
});

export const ApprenticeProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [apprenticeIds, setApprenticeIds] = useState<string[]>([]);
    const [apprenticeUserMachines, setApprenticeUserMachines] = useState<
        { apprenticeId: string; userMachineId: number }[]
    >([]);

    const handleSetApprenticeIds = (
        prevState: string[] | ((prevState: string[]) => string[])
    ) => {
        if (typeof prevState === 'function') {
            setApprenticeIds((prevApprenticeIds) =>
                prevState(prevApprenticeIds)
            );
        } else {
            setApprenticeIds(prevState);
        }
    };

    const handleSetApprenticeUserMachines = (
        prevState:
            | { apprenticeId: string; userMachineId: number }[]
            | ((
                  prevState: { apprenticeId: string; userMachineId: number }[]
              ) => { apprenticeId: string; userMachineId: number }[])
    ) => {
        if (typeof prevState === 'function') {
            setApprenticeUserMachines((prevApprenticeUserMachines) =>
                prevState(prevApprenticeUserMachines)
            );
        } else {
            setApprenticeUserMachines(prevState);
        }
    };

    return (
        <ApprenticeContext.Provider
            value={{
                apprenticeIds,
                apprenticeUserMachines,
                setApprenticeIds: handleSetApprenticeIds,
                setApprenticeUserMachines: handleSetApprenticeUserMachines
            }}
        >
            {children}
        </ApprenticeContext.Provider>
    );
};
