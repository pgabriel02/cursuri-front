import axios from "axios"
import Head from "next/head"
import { useRouter } from "next/router"
import React, {useEffect, useState} from 'react'
import toast from "react-hot-toast"
import CourseSidebar from "../../../components/View/Sidebar/Sidebar"
import VideoContainer from "../../../components/View/VideoContainer"
import { useUserContext } from "../../../contexts/userContext"
import { Course, Episode } from "../../../interfaces/interface"
import { API, API_URL } from "../../../utils/variables"


const ViewCourseEpisode = () => {
    const router = useRouter()
    const {id} = router.query
    const {user, loaded} = useUserContext()
    const [course, setCourse] = useState<Course>()
    const [activeEpisode, setActiveEpisode] = useState<Episode>()
    const completeEpisode = () => {
        setCourse((c) => {
            c?.episodes.some((e, i) => {
                if(e.EpisodeID === activeEpisode?.EpisodeID) {
                    if(c.userspassed[0].UserCoursePassedEntity.Step > i)
                        return;
                    const data = {
                        course: c.CourseID,
                        step: i+1
                    }
                    c.userspassed[0].UserCoursePassedEntity.Step += 1
                    axios.post(`${API_URL}/userpassed/completeEpisode`, {data}, {withCredentials: true}).then((data) => {
                        toast.success(`${activeEpisode?.EpisodeName} has been completed with successfully! Congratulations!`)
                    })
                }
            })
            return c
        })
    }
    const changeEpisode = (id: number) => {
        if(!course?.userspassed[0].UserCoursePassedEntity.Step)
            return;
        if(course?.userspassed[0].UserCoursePassedEntity.Step < id)
            return;
        setActiveEpisode(course?.episodes[id])
    }
    useEffect(() => {
        if(loaded) {
            if(!user)
                router.push('/').then(() => toast.error('You must to be logged in to view that page.'))
            if(id) {
                axios.get(`${API_URL}/course/getView/${id}`, {withCredentials: true}).then((data) => {
                    if(data.data.status === 400)
                        return router.push('/').then(() => toast.error(data.data.response.message))
                    setCourse(data.data)
                    let step = data.data.userspassed[0].UserCoursePassedEntity.Step
                    setActiveEpisode(data.data.episodes[step] ? data.data.episodes[step] : data.data.episodes[data.data.episodes.length-1] )
                })
            }
        }
    }, [loaded, id])
    
    return(
        <>
            <Head>
                <title>CURS.RO | View episode {activeEpisode?.EpisodeName}, course {id}</title>
            </Head>
            {
                course && activeEpisode &&
                    <div className='px-8 md:px-24 py-3 w-full flex gap-5'>
                        <VideoContainer course={course} activeEpisode={activeEpisode} completeEpisode={completeEpisode} />
                        <CourseSidebar changeEpisode={changeEpisode} active={activeEpisode} course={course} />
                    </div> 
            }
        </>
    )
}


export default ViewCourseEpisode
