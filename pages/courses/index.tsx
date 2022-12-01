import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, {useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import MainContent from '../../components/Courses/MainContent'
import { useUserContext } from '../../contexts/userContext'
import { API_URL, Role } from '../../utils/variables'
const Courses = () => {
    const {user, loaded} = useUserContext()
    const router = useRouter()
    useEffect(() => {
        if(loaded) {
            if(!user)
                router.push('/').then(() => toast.error('You must to be logged in to view that page.'))
        }
        
    }, [loaded, user])
    return(
        <>
            <Head>
                <title>Curs.RO | My Courses</title>
            </Head>
            <MainContent />
            
        </>
    )
}

export default Courses