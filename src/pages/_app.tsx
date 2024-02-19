import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';
import { Analytics } from '@vercel/analytics/react';

import { SessionProvider } from 'next-auth/react';

import Layout from '@/components/Layout';
import { MachineProvider } from '@/lib/contexts/MachineContext';
import { ApprenticeProvider } from '@/lib/contexts/ApprenticeContext';
import { TourProvider } from '@/lib/contexts/TourContext';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { oxygen } from '@/lib/fonts';

interface AppPropsWithSession extends AppProps {
    session: Session;
}

const App = ({ Component, pageProps }) => {
    return (
        <SessionProvider session={pageProps.session}>
            <MachineProvider>
                <ApprenticeProvider>
                    <TourProvider>
                        <AuthProvider>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </AuthProvider>
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
            <Analytics />
        </SessionProvider>
    );
};

export default App;
