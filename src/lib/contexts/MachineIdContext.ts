import { createContext } from 'react';


interface IMachineIdContext {
    machineId: string;
    setMachineId: (machineId: string) => void;
}

export const MachineIdContext = createContext<IMachineIdContext>({
    machineId: '',
    setMachineId: () => { }
});
