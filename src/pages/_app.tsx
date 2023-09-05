import '@/styles/globals.css';
import { useState } from 'react';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';

import { SessionProvider } from 'next-auth/react';

import Layout from '@/components/Layout';
import { MachineContext } from '@/lib/contexts/MachineContext';
import { oxygen } from '@/lib/fonts';

interface AppPropsWithSession extends AppProps {
    session: Session;
}
// fix
export default function App({
        Component,
        pageProps: { session, ...pageProps }
    }) {
    // eslint-disable-line
    const [machineUUID, setMachineUUID] = useState<string>('');
    const [machineName, setMachineName] = useState<string>('');
    return (
        <SessionProvider session={session}>
            <MachineContext.Provider
                value={{
                    machineUUID,
                    setMachineUUID,
                    machineName,
                    setMachineName
                }}
            >
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </MachineContext.Provider>
            <style jsx global>
                {`
                    :root {
                        --font-oxygen: ${oxygen.style.fontFamily};
                    }
                `}
            </style>
        </SessionProvider>
    );
}
