import React from 'react'
import { NextPage } from "next"
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useUserContext } from '../contexts/userContext'

const ErrorPage: NextPage = () => {
    const {loaded} = useUserContext()
    const router = useRouter()
    React.useEffect(() => {
        loaded && router.push('/').then(() => toast.error('Page not found'))
    }, [loaded])
    return (
        <>
        </>
    )
}
export default ErrorPage