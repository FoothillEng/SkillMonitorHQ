import { useEffect, useContext, useRef } from 'react';

import { MachineContext } from '@/lib/contexts/MachineContext';
import AutoLogoutTimer from '@/components/AutoLogoutTimer';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SideNav from '@/components/SideNav';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const wasCalled = useRef(false);
    const { setMachineUUID, setMachineName } = useContext(MachineContext);

    useEffect(() => {
        if (wasCalled.current) return;
        wasCalled.current = true;
        const initialLoad = async () => {
            const machineUUID = localStorage.getItem('machineUUID');

            if (!machineUUID) return;
            setMachineUUID(machineUUID);

            await fetch(`/api/machine/get?UUID=${machineUUID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    try {
                        setMachineName(data.machine.name);
                    } catch (error) {
                        if (error instanceof TypeError) {
                            setMachineName(
                                'Machine not Found, please contact admin'
                            );
                        } else {
                            console.error(error);
                        }
                    }
                })
                .catch((error) => console.error(error));
        };
        initialLoad();
    }, [setMachineName, setMachineUUID]);
    return (
        <div className="flex min-h-screen flex-col justify-between bg-black">
            <AutoLogoutTimer />
            <Header />
            <main className="flex flex-row">
                {children}
                <SideNav />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
