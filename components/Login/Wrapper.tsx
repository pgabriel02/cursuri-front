import React, {useState} from 'react'
import Login from './Login'
import Register from './Register'
import ResetPassword from './Reset'
const LoginWrapper = () => {
    const [step, setStep] = useState<number>(0)
    return (
        <div className='p-5 shadow-md rounded-md w-[90%] md:w-[50%] my-10'>
            {
                step === 0 ? <Login setStep={setStep} /> : step === 1 ? <Register setStep={setStep} /> : <ResetPassword setStep={setStep} />
            }
        </div>
    )
}

export default LoginWrapper