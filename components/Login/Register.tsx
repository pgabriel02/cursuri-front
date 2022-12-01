import React, {useState, useEffect} from 'react'
import {motion} from 'framer-motion'
import {toast} from 'react-hot-toast'
import axios from 'axios'
import { API_URL } from '../../utils/variables'
import { isEmail, isPassword } from '../../utils/functions'
import { useUserContext } from '../../contexts/userContext'

const Register = ({setStep}: {setStep: (step: number) => void}) => {
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [gender, setGender] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const {loaded, user} = useUserContext()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if(loaded && user) return;
        if(!isPassword(password))
            return toast.error('Your password is incorrect!')
        if(!isEmail(email))
            return toast.error('Your email is incorrect!')
        setLoading(true)
        axios.post(`${API_URL}/auth/register`, {name, email, password, gender}, {withCredentials: true}).then((data) => {
            if(data.status === 201) {
                setName('')
                setPassword('')
                setEmail('')
                setGender('Male')
                setStep(0)
            } else return toast.error('Incorrect email or passsword!')
            setLoading(false)
        })
    }
    return (
        <motion.div
            initial={{opacity: 0, scale: 0.8}}
            animate={{opacity: 1, scale: 1}}
            transition={{duration: 0.3}}
        >
            <h2 className='font-semibold text-lg'>Register a new account</h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4 mt-5'>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='email' className='text-black font-medium text-lg'>Username</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} type='text' required className='hover:border-b-2 hover:border-b-blue-500  shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black focus:border-b-2 duration-200 focus:border-b-blue-500' placeholder='Username' id='username' />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='email' className='text-black font-medium text-lg'>E-Mail</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' required className='hover:border-b-2 hover:border-b-blue-500  shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black focus:border-b-2 duration-200 focus:border-b-blue-500' placeholder='Your E-Mail' id='email' />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='password' className='text-black font-medium text-lg'>Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type='password' required className='hover:border-b-2 hover:border-b-blue-500 shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black focus:border-b-2 duration-200 focus:border-b-blue-500' placeholder='Your password' id='password' />
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor='password' className='text-black font-medium text-lg'>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className='hover:border-b-2 hover:border-b-blue-500 shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black focus:border-b-2 duration-200 focus:border-b-blue-500'>
                        <option value='Male'>Male</option>
                        <option value='Female'>Female</option>
                    </select>
                </div>
                <button type='submit' disabled={loading} className='p-2 bg-blue-500 rounded-sm text-white duration-200 hover:bg-black'>Register</button>
                <div className='flex gap-5 justify-center items-center'>
                    <span onClick={() => setStep(0)} className='font-thin text-sm text-gray-500 cursor-pointer duration-200 hover:text-blue-500'>
                        Login now!
                    </span>
                </div>
            </form>
        </motion.div>

    )
}

export default Register