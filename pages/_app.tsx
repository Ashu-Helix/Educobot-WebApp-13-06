import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
    return <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="../jquery.min.js" defer></script>
            <script src="../jquery-ui.js" defer></script>
            <script src="../jquery.ui.touch-punch.js" defer></script>
            <script src="../materialize.min.js" defer></script>
        </Head>
        <Component {...pageProps} />
    </>
}

export default MyApp
