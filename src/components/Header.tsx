import { useContext } from 'react';

import { MachineContext } from '@/lib/contexts/MachineContext';

const Header = () => {
    const { machineName } = useContext(MachineContext);
    return (
        <div className="text-fhs-blue mb-20 mt-16 w-full font-oxygen">
            <h1 className="text-center text-9xl">
                {machineName
                    ? `SkillMonitorHQ - ${machineName}`
                    : 'SkillMonitorHQ'}
            </h1>
        </div>
    );
};

export default Header;
