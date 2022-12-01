import React from 'react'
import {motion} from 'framer-motion'
import { isEmail } from '../../utils/functions'
import toast from 'react-hot-toast'
import axios from 'axios'
import { API_URL } from '../../utils/variables'
import { useUserContext } from '../../contexts/userContext'

const ResetPassword = ({setStep}: {setStep: (step: number) => void}) => {
    const [email, setEmail] = React.useState('')
    const {loaded, user} = useUserContext()
    const [loading, setLoading] = React.useState<boolean>(false)
    const handleSubmit = (e: React.FormEvent) => {
        if(loaded && user) return;
        e.preventDefault()
        if(!isEmail(email))
            return toast.error('Your email is incorrect')
        setLoading(true)
        axios.post(`${API_URL}/recovery/create`, {email}, {withCredentials: true}).then(data => {
            setLoading(false)
            if(data.data.status === 400)
                return toast.error(data.data.response.error)
            toast.success('Your request has been send with successfully! Please verify your email inbox or spam!')
            setEmail('')
            setStep(0)
        })
    }
    return (
        <motion.div
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.3}}
            >
            <h2 className='font-semibold text-lg'>Reset your account password</h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-5'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='email' className='text-black font-medium text-lg'>E-Mail</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' required className='hover:border-b-2 hover:border-b-blue-500  shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black focus:border-b-2 duration-200 focus:border-b-blue-500' placeholder='Your E-Mail' id='email' />
                </div>
                <button type='submit' disabled={loading} className='p-2 bg-blue-500 rounded-sm text-white duration-200 hover:bg-black'>Reset your password</button>
                <div className='flex gap-5 justify-center items-center'>
                    <span onClick={() => setStep(0)} className='font-thin text-sm text-gray-500 cursor-pointer duration-200 hover:text-blue-500'>
                        Login now!
                    </span>
                    <span onClick={() => setStep(1)} className='font-thin text-sm text-gray-500 cursor-pointer duration-200 hover:text-blue-500'>
                        Register now!
                    </span>
                </div>
            </form>
        </motion.div>
        
        )
}

export default ResetPassword