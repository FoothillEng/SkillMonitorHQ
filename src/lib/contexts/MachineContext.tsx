import { useState, createContext } from 'react';

interface IMachineContext {
    machineUUID: string;
    machineName: string;
    setMachineUUID: (machineId: string) => void;
    setMachineName: (machineName: string) => void;
}

export const MachineContext = createContext<IMachineContext>({
    machineUUID: '',
    machineName: '',
    setMachineUUID: () => {},
    setMachineName: () => {}
});

export const MachineProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [machineUUID, setMachineUUID] = useState<string>('');
    const [machineName, setMachineName] = useState<string>('');

    return (
        <MachineContext.Provider
            value={{
                machineUUID,
                machineName,
                setMachineUUID,
                setMachineName
            }}
        >
            {children}
        </MachineContext.Provider>
    );
};
