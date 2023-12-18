import { useContext } from 'react';
import Image from 'next/image';

import { MachineContext } from '@/lib/contexts/MachineContext';

const Header = () => {
    const { machineName } = useContext(MachineContext);
    return (
        <div className="mb-[5rem] mt-[4rem] w-full font-oxygen text-fhs-blue">
            <div className="flex items-center justify-center text-center text-9xl uppercase">
                <div>SkillMonitorHQ {machineName && <>{machineName}</>}</div>
            </div>
            <div className="fixed right-[5rem] top-[5rem]">
                <Image
                    src="/falcon.png"
                    width={100}
                    height={100}
                    alt="Picture of the author"
                />
            </div>
        </div>
    );
};

export default Header;
