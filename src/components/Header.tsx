import { useContext } from 'react';

import { MachineContext } from '@/lib/contexts/MachineContext';

const Header = () => {
    const { machineName } = useContext(MachineContext);
    return (
        <div className="mt-16 mb-20 w-full font-oxygen text-red">
            <h1 className="text-9xl text-center">
                {machineName
                    ? `SkillMonitorHQ - ${machineName}`
                    : 'SkillMonitorHQ'}
            </h1>
        </div>
    );
};

export default Header;
