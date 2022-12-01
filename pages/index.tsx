import type { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'
import { useRouter } from 'next/router'
import MainContent from '../components/Courses/MainContent'
import LoginWrapper from '../components/Login/Wrapper'
import { useUserContext } from '../contexts/userContext'


const Home: NextPage = () => {
  const {user, loaded} = useUserContext()
  const router = useRouter()
  React.useEffect(() => {
    if(loaded && user) {
      router.push('/courses')
    }
  }, [loaded, user])
  return (
    <div>
      <Head>
        <title>Curs.RO | Login</title>
      </Head>
      {
        loaded && user ? 
          <> 
            <MainContent />
          </>
        : <div className='w-full flex items-center justify-center'>
            <LoginWrapper />
          </div>
      }
    </div>
  )
}

export default Home
