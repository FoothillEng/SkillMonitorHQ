import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';

import { SessionProvider } from 'next-auth/react';

import Layout from '@/components/Layout';
import { MachineProvider } from '@/lib/contexts/MachineContext';
import { ApprenticeProvider } from '@/lib/contexts/ApprenticeContext';
import { TourProvider } from '@/lib/contexts/TourContext';
import { oxygen } from '@/lib/fonts';

interface AppPropsWithSession extends AppProps {
    session: Session;
}

const App = ({ Component, pageProps }: AppPropsWithSession) => {
    return (
        <SessionProvider session={pageProps.session}>
            <MachineProvider>
                <ApprenticeProvider>
                    <TourProvider>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </TourProvider>
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
};

export default App;
