import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import Layout from '@/components/Layout';
import { oxygen } from '@/utils/fonts';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
      <style jsx global>
      {`
        :root {
          --font-oxygen: ${oxygen.style.fontFamily};
        }
      `}
      </style>
    </Layout>
  )
}
