import { useContext } from 'react';
import Image from 'next/image';

import { MachineContext } from '@/lib/contexts/MachineContext';

import SMHQLogo from '../../public/SMHQ.png';

const Header = () => {
    const { machineName } = useContext(MachineContext);
    return (
        <div className="mb-[3rem] mt-[4rem] w-full font-oxygen text-primary">
            <div className="flex items-center justify-center text-center text-8xl uppercase">
                {(machineName && <div>{machineName}</div>) || (
                    <div>SkillMonitor HQ</div>
                )}
            </div>
            <div className="fixed right-[5rem] top-[5rem]">
                <Image
                    src={SMHQLogo}
                    width={200}
                    height={200}
                    // className="h-[20rem] w-auto"
                    alt="Picture of the logo"
                />
            </div>
        </div>
    );
};

export default Header;
