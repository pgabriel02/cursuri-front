import React, {useState, useEffect} from "react";
import { NextPage } from "next";
import Head from "next/head";
import {motion} from 'framer-motion'
import { useUserContext } from "../../../contexts/userContext";
import { useRouter } from "next/router";
import { en } from "../../../utils/lang";
import toast from "react-hot-toast";
import {BsImageFill} from 'react-icons/bs'
import { API_URL, Role } from "../../../utils/variables";
import axios from "axios";

const  CreateCourse: NextPage = () => {
    const [courseName, setCourseName] = useState('')
    const [file, setFile] = useState<File | undefined>(undefined)
    const {loaded, user} = useUserContext()
    const router = useRouter()

    useEffect(() => {
        if(loaded) {
            if(!user)
                router.push('/').then(() => toast.error(en.not_loggedin))
            if(user && user.admin < Role.Editor)
                router.push('/').then(() => toast.error(en.insuficient_access))
        }
    }, [loaded])
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        file && formData.append("image", file)
        formData.append('name', courseName)
        axios.post(`${API_URL}/course/create`, formData, {withCredentials: true}).then((data) => {
            if(data.status === 201) {
                setCourseName('')
                setFile(undefined)
                router.push('/').then(() => toast.success(`Course ${courseName} has been created with successfully!`))
            }
        })
    }
    return (
        <>
            <Head>
                <title>Curs.RO | Create course</title>
            </Head>
            <div className='px-8 md:px-24 py-3 items-center justify-center w-full flex flex-col'>
                <motion.div 
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration:0.3}}
                    className='w-full p-5 shadow-md rounded-md py-8 my-10 bg-white flex flex-col'>
                        <h2 className='font-semibold text-lg'>Create a new course</h2>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-2 mt-5 mx-auto justify-center w-full items-center md:justify-start md:items-start'>
                            <div className='flex flex-col md:flex-row flex-wrap gap-5 md:gap-2 w-full'>
                                <div className='flex flex-col gap-3 w-full md:w-[49%]'>
                                    <label htmlFor='course-name' className='text-black font-medium text-lg'>Course Name</label>
                                    <input type='text' value={courseName} onChange={(e) => setCourseName(e.target.value)}  required className='shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black hover:border-b-2 hover:border-b-blue-500 focus:border-b-2 duration-200 focus:border-b-blue-500' placeholder='Course Name' id='course-name' />
                                </div>
                                <div className='flex flex-col gap-3 w-full md:w-[49%]'>
                                    <label htmlFor='course-image' className='text-black font-medium text-lg cursor-pointer gap-2 flex items-center group'>
                                        <BsImageFill className='duration-200 group-hover:text-blue-500' /> Please insert an image for course
                                    </label>
                                    <input type='file' onChange={(e) => e.target.files && setFile(e.target.files[0])}  required className='shadow-sm shadow-gray-300 p-[9px] rounded-sm outline-none text-black hover:border-b-2 hover:border-b-blue-500 focus:border-b-2 duration-200 focus:border-b-blue-500' id='course-image' />
                                </div>
                            </div>
                            <button type='submit' className='p-2 bg-blue-500 rounded-sm text-white duration-200 hover:bg-black ml-auto mr-4'>Create course</button>
                        </form>
                </motion.div>
            </div>
        </>
    )
}

export default CreateCourse