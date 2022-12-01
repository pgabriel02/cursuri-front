import { Course, Episode } from "../../interfaces/interface"
import { API, API_URL, Role, themeBg } from "../../utils/variables"
import {useEffect, useState} from 'react'
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { useUserContext } from "../../contexts/userContext"
import Swal from "sweetalert2"
import axios from "axios"
import { useRouter } from "next/router"
import toast from "react-hot-toast"
import Link from "next/link"

const VideoContainer = ({activeEpisode, course, completeEpisode}: {activeEpisode: Episode, course: Course, completeEpisode: () => void}) => {
    const [marked, setMarked] = useState<boolean>(false)
    const {user} = useUserContext()
    useEffect(() => {
        let video = (document.getElementById('video') as HTMLVideoElement);
        if(activeEpisode) {
            setTimeout(() => {
                video.muted = false
                video.volume = 0.2
                video.load()
            }, 250)
            course.episodes.some((c, i) => {
                if(c.EpisodeID === activeEpisode.EpisodeID) {
                    if(course.userspassed[0].UserCoursePassedEntity.Step > i)
                        setMarked(true)
                    else
                        setMarked(false)
                }
            })
            !marked &&
                video.addEventListener('ended', completeEpisode)
        }
        return () => video.removeEventListener('ended', completeEpisode)
    }, [activeEpisode])
    const router = useRouter()
    const handleDelete = () => {
        Swal.fire({
            title: `Delete ${activeEpisode.EpisodeName}`,
            text: `Are you sure you want to delete ${activeEpisode.EpisodeName}?`,
            showCancelButton: true,
            confirmButtonText: 'Delete it!',
            confirmButtonColor: themeBg
        }).then((result) => {
            if(result.isConfirmed) {
                let episodeID = activeEpisode.EpisodeID, courseID = course.CourseID,
                Index = course.episodes.some((e, i) => {
                    if(e.EpisodeID === activeEpisode.EpisodeID)
                        return i
                })
                axios.post(`${API_URL}/episode/delete`, {episodeID, courseID, Index, EpisodeFile: activeEpisode.EpisodeVideo}, {withCredentials: true}).then((data) => {
                    if(data.status === 201)
                        router.push(`/`).then(() => toast.success(`${activeEpisode.EpisodeName} has been deleted with successfully!`))
                })
            }
        })
    }
    return(
        <div className='w-[58%] h-auto aspect-video flex flex-col gap-3'>
            <video width={320} height={240} className='w-full h-full rounded-md' controls muted autoPlay id='video'>
                <source src={`${API}/uploads/videos/${activeEpisode.EpisodeVideo}`} type="video/mp4" />
            </video>
            <div className='flex items-center justify-between mx-4'>
                <div className='flex gap-2 flex-wrap items-center'>
                    <h2 className='text-black font-medium text-xl'>
                        {activeEpisode.EpisodeName} - {course.CourseName}
                    </h2>
                    {
                        user && user.admin >= Role.Editor &&
                        <>
                            <Link href={`/admin/edit/episode/${activeEpisode.EpisodeID}`}>
                                <AiOutlineEdit className='text-blue-500 cursor-pointer text-xl' title={`Edit ${activeEpisode.EpisodeName}`} />
                            </Link>
                            <AiOutlineDelete onClick={handleDelete} className='text-red-500 cursor-pointer text-xl' title={`Delete ${activeEpisode.EpisodeName}`} />
                        </>
                    }
                </div>
                <div className='flex gap-2'>
                    {
                        !marked ?
                            <label htmlFor='viewed' className='font-medium text-sm'>This episode has not been completed yet</label>
                        :
                            <label htmlFor='viewed' className='font-medium text-sm'>This episode has been completed</label>
                    }
                    {
                        marked ?
                            <input type='checkbox' className='h-5 w-5'  id='viewed' checked={marked} />
                        :
                            <input type='checkbox' className='h-5 w-5' id='viewed' onChange={() => {
                                setMarked(true)
                                completeEpisode()
                            }} />
                    }
                </div>
            </div>
        </div>
    )
}
export default VideoContainer