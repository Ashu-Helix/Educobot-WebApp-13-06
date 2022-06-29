import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function MyApp({ Component, pageProps }: AppProps) {
    return <>
        <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="../jquery.min.js"></script>
            <script src="../jquery-ui.js"></script>
            <script src="../jquery.ui.touch-punch.js"></script>
            <script src="../materialize.min.js"></script>
        </Head>
        <Component {...pageProps} />
    </>
}

export default MyApp
