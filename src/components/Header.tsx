import { useContext } from 'react';

import { MachineContext } from '@/lib/contexts/MachineContext';

const Header = () => {
    const { machineName } = useContext(MachineContext);
    return (
        <div className="text-fhs-blue mb-20 mt-16 w-full font-oxygen">
            <div className="text-center text-9xl uppercase">
                <div>SkillMonitorHQ</div>
                {machineName && <div className="">{machineName}</div>}
            </div>
        </div>
    );
};

export default Header;
