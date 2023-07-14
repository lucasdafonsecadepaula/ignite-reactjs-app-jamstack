import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { Header } from '../components/Header'
import { SessionProvider } from "next-auth/react"

const roboto = Roboto({
  subsets: ['latin'],
  weight: '400'
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <main className={`bg-gray-900 text-white ${roboto.className}`}>
        <Header />
        <Component {...pageProps} />  
      </main>
    </SessionProvider>
  )
}
