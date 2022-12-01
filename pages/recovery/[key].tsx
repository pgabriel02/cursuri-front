import axios from 'axios'
import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import toast from 'react-hot-toast'
import {motion} from 'framer-motion'
import { API_URL } from '../../utils/variables'
import { isPassword } from '../../utils/functions'
import Head from 'next/head'
const Recovery = () => {
    const [firstPassword, setFirstPassword] = useState('')
    const [secondPassword, setSecondPassword] = useState('')
    const router = useRouter()
    const {key} = router.query
    useEffect(() => {
        if(key)
            axios.get(`${API_URL}/recovery/getKey/${key}`).then((data) => {
                if(data.data.status === 400)
                    router.push('/').then(() => toast.error('Invalid key'))
            })
    }, [key])
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if(!isPassword(firstPassword) || !isPassword(secondPassword))
            return toast.error('Invalid password syntax!')
        if(firstPassword !== secondPassword)
            return toast.error('Passwords dont match')
        axios.post(`${API_URL}/recovery/resetPassword`, {key, password: firstPassword}).then(data => {
            if(data.data.status === 201) {
                router.push('/').then(() => toast.success('Your password has been changed with successfully!'))
                setFirstPassword('')
                setSecondPassword('')
            } else toast.error('Something went wrong!')
        })
    }
    return (
        <>
            <Head>
                <title>Curs.RO | Recover Password</title>
            </Head>
            <motion.div
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.3}}
                className='mx-auto mt-[20vh] p-5 shadow-md rounded-md w-[90%] md:w-[50%]'
            >
                <h2 className='font-semibold text-lg'>Sign in to your account</h2>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-5'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='email' className='text-black font-medium text-lg'>New Password</label>
                        <input type='password' value={firstPassword} onChange={(e) => setFirstPassword(e.target.value)}  required className='shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black focus:border-b-2 duration-200 focus:border-b-blue-500' placeholder='New password' id='email' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor='password' className='text-black font-medium text-lg'>Confirm New Password</label>
                        <input type='password'  value={secondPassword} onChange={(e) => setSecondPassword(e.target.value)} required className='shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black focus:border-b-2 duration-200 focus:border-b-blue-500' placeholder='Confirm new passowrd' id='password' />
                    </div>
                    <button type='submit' className='p-2 bg-blue-500 rounded-sm text-white duration-200 hover:bg-black'>Reset password</button>
                </form>
            </motion.div>
        </>
    )
}

export default Recovery