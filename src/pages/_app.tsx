import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import { SessionProvider } from 'next-auth/react';

import Layout from '@/components/Layout';
import { oxygen } from '@/lib/fonts';

export default function App({ Component, pageProps }) {
    return (
        <Layout>
            <SessionProvider>
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
