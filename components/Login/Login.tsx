import React from 'react'
import {motion} from 'framer-motion'
import { API_URL } from '../../utils/variables'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useUserContext } from '../../contexts/userContext'
import { isEmail, isPassword } from '../../utils/functions'
import ReCAPTCHA from "react-google-recaptcha";


const Login = ({setStep}: {setStep: (step: number) => void}) => {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const {setUser, loaded, user} = useUserContext()
    const [loading, setLoading] = React.useState<boolean>(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if(loaded && user) return;
        if(!isEmail(email))
            return toast.error('Your email is incorrect!')
        if(!isPassword(password))
            return toast.error('Password incorect format.')
        setLoading(true)
        axios.post(`${API_URL}/auth/login`, {username: email, password}, {withCredentials: true}).then(data => {
            if(data.status === 201) {
                toast.success('You has been logged in with successfully!')
                setUser(data.data)
                setEmail('')
                setPassword('')
            }
            else toast.error('Invalid credentials!')
            setLoading(false)
        }).catch(() => toast.error('Invalid credentials'))
    }
    return (
        <motion.div
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.3}}
            >
            <h2 className='font-semibold text-lg'>Sign in to your account</h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-5'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='email' className='text-black font-medium text-lg'>E-Mail</label>
                    <input type='email' value={email} onChange={(e) => setEmail(e.target.value)}  required className='hover:border-b-2 hover:border-b-blue-500  shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black focus:border-b-2 duration-200 focus:border-b-blue-500' placeholder='Your E-Mail' id='email' />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='password' className='text-black font-medium text-lg'>Password</label>
                    <input type='password'  value={password} onChange={(e) => setPassword(e.target.value)} required className='hover:border-b-2 hover:border-b-blue-500  shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black focus:border-b-2 duration-200 focus:border-b-blue-500' placeholder='Your password' id='password' />
                </div>
                <button type='submit' disabled={loading} className='p-2 bg-blue-500 rounded-sm text-white duration-200 hover:bg-black'>Login</button>
                <div className='flex gap-5 justify-center items-center'>
                    <span onClick={() => setStep(2)} className='font-thin text-sm text-gray-500 cursor-pointer duration-200 hover:text-blue-500'>
                        Password reset
                    </span>
                    <span onClick={() => setStep(1)} className='font-thin text-sm text-gray-500 cursor-pointer duration-200 hover:text-blue-500'>
                        Register now!
                    </span>
                </div>
            </form>
        </motion.div>
        
        )
}

export default Login