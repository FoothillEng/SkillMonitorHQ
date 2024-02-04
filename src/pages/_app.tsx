import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';

import { SessionProvider } from 'next-auth/react';

import Layout from '@/components/Layout';
import { MachineProvider } from '@/lib/contexts/MachineContext';
import { ApprenticeProvider } from '@/lib/contexts/ApprenticeContext';
import { oxygen } from '@/lib/fonts';

interface AppPropsWithSession extends AppProps {
    session: Session;
}
// fix
export default function App({
    Component,
    pageProps: { session, ...pageProps }
}) {
    return (
        <SessionProvider session={session}>
            <MachineProvider>
                <ApprenticeProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </ApprenticeProvider>
            </MachineProvider>
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
