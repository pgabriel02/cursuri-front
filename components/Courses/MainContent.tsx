import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import toast from 'react-hot-toast'
import { useUserContext } from '../../contexts/userContext'
import { en } from '../../utils/lang'
import { API_URL, Role } from '../../utils/variables'
import CourseWrapper from './CourseWrapper'
import {motion} from 'framer-motion'

interface UserspassedInterface {
    id: number,
    UserCoursePassedEntity: {
        CourseID: number,
        Step: number,
        userID: number,
        createdAt: string,
        updatedAt: string
    }
}

interface EpisodesInterface {
    EpisodeID: number,
    EpisodeName: string,
    EpisodeVideo: string
}

export interface CourseInterface {
    CourseID: number,
    CourseName: string,
    CourseImage: string
    userspassed: UserspassedInterface[],
    episodes: EpisodesInterface[]

}

const MainContent = () => {
    const [courses, setCourses] = useState<CourseInterface[]>([])
    const {loaded, user} = useUserContext()
    useEffect(() => {
        if(loaded) {
            if(user) {
                axios.get(`${API_URL}/course/getAll`, {withCredentials: true}).then((data) => {
                    setCourses(data.data)
                })
            }
        }
    },[loaded])
    
    const router = useRouter()

    const startCourse = (id: number) => {
        if(!loaded)
            return;
        if(!user)
            return router.push('/').then(() => toast.error(en.not_loggedin))
        if(!courses.some(i => i.CourseID === id))
            return toast.error('Invalid course id!')
        if(courses.filter(i => i.CourseID === id).some(i => i.userspassed.length > 0))
            return toast.error('This course is already started!')
        axios.post(`${API_URL}/course/start`, {id}, {withCredentials: true}).then((data) => {
            if(data.status === 201) {
                router.push(`/course/${id}`).then(() => toast.success(`Course ${id} has been started with successfully!`))
            }
        })
    }

    const deleteCourse = (id: number) => {
        if(!loaded)
            return;
        if(!user)
            return router.push('/').then(() => toast.error(en.not_loggedin))
        if(user.admin < Role.Editor)
            return router.push('/').then(() => toast.error(en.insuficient_access))
        
        axios.post(`${API_URL}/course/delete`, {id}, {withCredentials: true}).then((data) => {
            if(data.status === 201) {
                setCourses(old => old.filter(o => o.CourseID !== id))
                toast.success(`Course ${id} has been deleted with successfully!`)
            } else {
                toast.error('Something went wrong')
            }
        })
        
    }

    return (
        <div className='px-8 md:px-24 py-3 w-full flex flex-col gap-5'>
            <h2 className='font-semibold text-black text-lg md:text-xl'>My courses</h2>
            <div className='flex flex-col md:flex-row flex-wrap gap-5 w-full'>
                {courses.map(course =>
                    <CourseWrapper course={course} key={course.CourseID} deleteCourse={deleteCourse} startCourse={startCourse} />
                )}
            </div>
        </div>
    )
}

export default MainContent