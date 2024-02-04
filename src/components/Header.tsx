import { useContext } from 'react';
import Image from 'next/image';

import { MachineContext } from '@/lib/contexts/MachineContext';
import { TourContext } from '@/lib/contexts/TourContext';

import SMHQLogo from '../../public/SMHQ.png';

const Header = () => {
    const { machineName } = useContext(MachineContext);
    const { setTour } = useContext(TourContext);

    const handleTour = () => {
        console.log('Tour:', true);
        setTour(true);
    };

    return (
        <div className="mb-[3rem] mt-[4rem] w-full font-oxygen text-primary">
            <div className="flex items-center justify-center text-center text-8xl uppercase">
                {(machineName && <div>{machineName}</div>) || (
                    <div>SkillMonitor HQ</div>
                )}
            </div>
            <div
                className="fixed right-[5rem] top-[5rem] h-[20rem] w-[20rem] border-4 border-secondary"
                onClick={handleTour}
            >
                <Image
                    src={SMHQLogo}
                    width={200}
                    height={200}
                    // sizes={'100vw'}
                    // className="h-[20rem] w-[20rem]"
                    alt="Picture of the logo"
                    priority
                />
            </div>
        </div>
    );
};

export default Header;
