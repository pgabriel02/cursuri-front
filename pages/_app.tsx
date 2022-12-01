import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/Header/Header'
import UserWrapper from '../contexts/userContext'
import { Toaster } from 'react-hot-toast'
import Footer from '../components/Footer/Footer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserWrapper>
      <div className='relative min-h-screen flex flex-col'>
        <Header />
        <div className='pb-[444px] pt-[100px] lg:pb-[350px] flex-1'>
          <Component {...pageProps} />
        </div>
        <Toaster />
        <Footer />
      </div>
    </UserWrapper>
  )
}

export default MyApp
