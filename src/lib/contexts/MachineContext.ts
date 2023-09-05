import { createContext } from 'react';

interface IMachineContext {
    machineUUID: string;
    machineName: string;
    setMachineUUID: (machineId: string) => void;
    setMachineName: (machineName: string) => void;
}

export const MachineContext = createContext<IMachineContext>({
    machineUUID: '',
    machineName: '',
    setMachineUUID: () => { },
    setMachineName: () => { }
});
