import React, {useEffect, useState} from 'react'
import { NextPage } from "next"
import { useUserContext } from '../../../../contexts/userContext'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import {motion} from 'framer-motion'
import { en } from '../../../../utils/lang'
import { API, API_URL, Role } from '../../../../utils/variables'
import axios from 'axios'
import Head from 'next/head'
import { BsImageFill } from 'react-icons/bs'
import { AiOutlineClose } from 'react-icons/ai'
import { CourseInterface } from '../../../../components/Courses/MainContent'

const EditCourse: NextPage = () => {
    const [courseName, setCourseName] = useState('')
    const [file, setFile] = useState<File | undefined>(undefined)
    const [course, setCourse] = useState<CourseInterface | null>(null)
    const {user, loaded} = useUserContext()
    const [deletedImage, setDeletedImage] = useState<boolean>(false) 
    const router = useRouter()
    const {id} = router.query
    useEffect(() => {
        if(loaded) {
            if(!user)
                router.push('/').then(() => toast.error(en.not_loggedin))
            if(user && user.admin < Role.Editor)
                router.push('/').then(() => toast.error(en.insuficient_access))
        }
    }, [loaded])
    useEffect(() => {
        if(id) {
            axios.get(`${API_URL}/course/getCourse/${id}`, {withCredentials: true}).then((data) => {
                setCourse(data.data)
                setCourseName(data.data.CourseName)
            })
        }
    }, [id])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if(!course) return;
        if(course && !deletedImage && courseName === course.CourseName)
            return router.push('/').then(() => toast.error(`You didn't edit something!`))
        
        const formData = new FormData()
        file && formData.append('image', file)
        formData.append('name', courseName)
        course && formData.append('id', course.CourseID.toString())
        axios.post(`${API_URL}/course/edit`, formData, {withCredentials: true}).then((data) => {
            if(data.status === 201) {
                router.push('/').then(() => toast.success(`Course ${course.CourseID} has been edited with successfully!`))
            } else {
                toast.error('Something went wrong.')
            }
        })
    }

    return (
        <>
            <Head>
                <title>Curs.RO | Edit course</title>
            </Head>
            <div className='px-8 md:px-24 py-3 items-center justify-center w-full flex flex-col'>
                <motion.div 
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration:0.3}}
                    className='w-full p-5 shadow-md rounded-md py-8 my-10 bg-white flex flex-col'>
                        <h2 className='font-semibold text-lg'>Create a new course</h2>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-2 mt-5 mx-auto justify-center w-full items-center md:justify-start md:items-start'>
                            <div className='flex flex-col md:flex-row flex-wrap gap-5 md:gap-2 w-full items-center'>
                                <div className='flex flex-col gap-3 w-full md:w-[49%]'>
                                    <label htmlFor='course-name' className='text-black font-medium text-lg'>Course Name</label>
                                    <input type='text' value={courseName} onChange={(e) => setCourseName(e.target.value)}  required className='shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black hover:border-b-2 hover:border-b-blue-500 focus:border-b-2 duration-200 focus:border-b-blue-500' placeholder='Course Name' id='course-name' />
                                </div>
                                <div className='flex flex-col gap-3 w-full md:w-[49%]'>
                                    {
                                        deletedImage ?
                                            <>
                                                <label htmlFor='course-image' className='text-black font-medium text-lg cursor-pointer gap-2 flex items-center group'>
                                                    <BsImageFill className='duration-200 group-hover:text-blue-500' /> Please insert an image for course
                                                </label>
                                                <input type='file' onChange={(e) => e.target.files && setFile(e.target.files[0])}  required className='shadow-sm shadow-gray-300 p-[9px] rounded-sm outline-none text-black hover:border-b-2 hover:border-b-blue-500 focus:border-b-2 duration-200 focus:border-b-blue-500' id='course-image' />
                                            </>
                                        :
                                            <div className=''>
                                                <p>Course Image</p>
                                                <div className='relative w-[200px]'>
                                                    <img className='relative' src={`${API}/uploads/${course && course.CourseImage}`} alt={`${courseName} cover`} width={200} height={150} />
                                                    <AiOutlineClose className='absolute top-1 right-1 cursor-pointer text-red-500' onClick={() => setDeletedImage(true) } />
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>
                            <button type='submit' className='p-2 bg-blue-500 rounded-sm text-white duration-200 hover:bg-black ml-auto mr-4'>Edit course</button>
                        </form>
                </motion.div>
            </div>
        </>
    )
}

export default EditCourse