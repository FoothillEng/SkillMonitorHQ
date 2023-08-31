import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import type { Session } from 'next-auth';

import { SessionProvider } from 'next-auth/react';

import Layout from '@/components/Layout';
import { oxygen } from '@/lib/fonts';

interface AppPropsWithSession extends AppProps {
    session: Session;
}
// fix
export default function App({Component,pageProps: { session, ...pageProps }}) { // eslint-disable-line
    return (
        <Layout>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
            <style jsx global>
                {`
                    :root {
                        --font-oxygen: ${oxygen.style.fontFamily};
                    }
                `}
            </style>
        </Layout>
    );
}
