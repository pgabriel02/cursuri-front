import React, {useState, useEffect} from "react";
import { NextPage } from "next";
import Head from "next/head";
import {motion} from 'framer-motion'
import { useUserContext } from "../../../../contexts/userContext";
import { useRouter } from "next/router";
import { en } from "../../../../utils/lang";
import toast from "react-hot-toast";
import { API, API_URL, Role, themeBg } from "../../../../utils/variables";
import axios from "axios";
import { MdMovie } from "react-icons/md";
import { CourseInterface } from "../../../../components/Courses/MainContent";
import { AiOutlineClose, AiOutlineEdit, AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import Swal from "sweetalert2";
import { existChapter } from "../../../../utils/functions";

interface Chapters {
    ChapterID: number;
    ChapterName: string;
    CourseID: number;
}

const  EditEpisode: NextPage = () => {
    const [courseID, setCourseID] = useState(0)
    const [chapterID, setChapterID] = useState(0)
    const [episodeID, setEpisodeID] = useState(0)
    const [episodeName, setEpisodeName] = useState('')
    const [file, setFile] = useState<File | undefined>(undefined)
    const [chapters, setChapters] = useState<Chapters[]>([])
    const [courses, setCourses] = useState<CourseInterface[]>([])
    const {loaded, user} = useUserContext()
    const router = useRouter()
    const {id} = router.query
    useEffect(() => {
        if(loaded) {
            if(!user)
                router.push('/').then(() => toast.error(en.not_loggedin))
            if(user && user.admin < Role.Editor)
                router.push('/').then(() => toast.error(en.insuficient_access))
            axios.get(`${API_URL}/course/getAll`, {withCredentials: true}).then((data) => {
                setCourses(data.data)
            })
            axios.get(`${API_URL}/chapter/getAll`, {withCredentials: true}).then((data) => {
                setChapters(data.data)
            })
            id && 
            axios.get(`${API_URL}/episode/get/${id}`, {withCredentials: true}).then((data) => {
                let ep = data.data
                setEpisodeName(ep.EpisodeName)
                setCourseID(ep.CourseID)
                setChapterID(ep.ChapterID)
                setFile(ep.EpisodeVideo)
                setEpisodeID(ep.EpisodeID)
            });
            
        }
    }, [loaded, id])
    useEffect(() => {
        if(file)
            setTimeout(() => {
                (document.getElementById('video-thumbnail') as HTMLVideoElement).currentTime = .4
            }, 500)
    }, [file])
    let pattern = /^[A-Z][a-z]*(?: [A-Z][a-z]*)*/
    const createChapter = async () => {
        const {value: chapterName} = await Swal.fire({
            title: 'Create a new chapter',
            input: 'text',
            inputLabel: 'Chapter name',
            inputValue: '',
        })

        if(chapterName.length === 0)
            return;
        if(await existChapter(chapterName, courseID))
            return toast.error('Already exists a chapter with this name!')
        if(!pattern.test(chapterName))
            return toast.error('Chapter name must start with upper letter.')
        axios.post(`${API_URL}/chapter/create`, {chapterName, courseID}, {withCredentials: true}).then((data) => {
            if(data.status === 201) {
                toast.success(`${chapterName} has been created with successfully.`)
                setChapters((chapter) => {
                    setTimeout(() => {
                        setChapterID(data.data.ChapterID)
                    }, 250)
                    return [...chapter, {ChapterID: data.data.ChapterID, ChapterName: chapterName, CourseID: courseID }]
                })
            }
        })
    }

    const deleteChapter = async () => {
        if(!chapters.some(c => c.ChapterID === chapterID && c.CourseID === courseID))
            return toast.error("Donesn't exist a chapter with this name.")
        chapters.some(c => {
            if(c.ChapterID === chapterID)
                Swal.fire({
                    title: `Delete ${c.ChapterName}`,
                    text: 'Are you sure you want to do this?',
                    showCancelButton: true,
                    cancelButtonText: 'No',
                    confirmButtonText: 'Yes',
                    confirmButtonColor: themeBg
                }).then((result) => {
                    if(result.isConfirmed) {
                        axios.post(`${API_URL}/chapter/delete`, {chapterID, courseID}, {withCredentials: true}).then((data) => {
                            if(data.status === 201) {
                                setChapters(c => c.filter(chapter => chapter.ChapterID !== chapterID))
                                setChapterID(0)
                                return toast.success(`${c.ChapterName} has been deleted with successfully!`)
                            }
                        })
                    }
                })
        })
        
    }
    const editChapter = async () => {
        if(!chapters.some(c => c.ChapterID === chapterID && c.CourseID === courseID))
            return toast.error("Donesn't exist a chapter with this name.")
        chapters.some(async (c) => {
            if(c.ChapterID === chapterID) {
                const {value: newValue} = await Swal.fire({
                    title: `Edit ${c.ChapterName}`,
                    input: 'text',
                    inputLabel: 'New chapter name', 
                    inputValue: c.ChapterName,
                    showCancelButton: true,
                    cancelButtonText: 'Cancel',
                    confirmButtonText: 'Edit',
                    confirmButtonColor: themeBg
                })

                if(newValue === c.ChapterName)
                    return;
                if(!newValue)
                    return;
                if(!pattern.test(newValue))
                    return toast.error('Chapter name must start with upper letter.')
                axios.post(`${API_URL}/chapter/edit`, {chapterID, courseID, newValue}, {withCredentials: true}).then((data) => {
                    if(data.status === 201) {
                        setChapters((prevState) => {
                            const old = [...prevState]
                            old.filter(o => {
                                if(o.ChapterID === chapterID)
                                    o.ChapterName = newValue
                            })
                            return old
                        })
                        toast.success(`${c.ChapterName} has been edited with successfully in ${newValue}.`)
                    }
                })

            }
                
        })
        
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const formData = new FormData()
        file && formData.append("video", file)
        formData.append('id', episodeID.toString())
        formData.append('courseID', courseID.toString())
        formData.append('chapterID', chapterID.toString())
        formData.append('name', episodeName)
        console.log('ia sa vad')
        axios.post(`${API_URL}/episode/edit`, formData, {withCredentials: true}).then((data) => {
            if(data.status === 201) {
                setEpisodeName('')
                setFile(undefined)
                router.push('/').then(() => toast.success('Episode has been edited with successfully!'))
            }
        }).catch(() => toast.error('Something went wrong!'))
    }
    return (
        <>
            <Head>
                <title>Curs.RO | Edit episode</title>
            </Head>
            <div className='px-8 md:px-24 py-3 items-center justify-center w-full flex flex-col'>
                <motion.div 
                    initial={{opacity: 0, scale: 0.8}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration:0.3}}
                    className='w-full p-5 shadow-md rounded-md py-8 my-10 bg-white flex flex-col'>
                        <h2 className='font-semibold text-lg'>Edit episode</h2>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-2 mt-5 mx-auto justify-center w-full items-center md:justify-start md:items-start'>
                            <div className='flex flex-col md:flex-row flex-wrap gap-5 md:gap-2 w-full'>
                                <div className='flex flex-col gap-3 w-full md:w-[49%]'>
                                    <label htmlFor='episode-name' className='text-black font-medium text-lg'>Episode Name</label>
                                    <input type='text' value={episodeName} onChange={(e) => setEpisodeName(e.target.value)}  required className='shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black hover:border-b-2 hover:border-b-blue-500 focus:border-b-2 duration-200 focus:border-b-blue-500' placeholder='Episode Name' id='episode-name' />
                                </div>
                                <div className='flex flex-col gap-3 w-full md:w-[49%]'>
                                    {
                                        !file ?
                                            <>
                                                <label htmlFor='episode-video' className='text-black font-medium text-lg cursor-pointer gap-2 flex items-center group'>
                                                <MdMovie className='duration-200 group-hover:text-blue-500' /> Please insert a video for episode
                                                </label>
                                                <input type='file' accept="video/*" onChange={(e) => e.target.files && setFile(e.target.files[0])}  required className='shadow-sm shadow-gray-300 p-[9px] rounded-sm outline-none text-black hover:border-b-2 hover:border-b-blue-500 focus:border-b-2 duration-200 focus:border-b-blue-500' id='episode-video' />
                                            </>
                                        :
                                            <>
                                                <div className='relative w-[200px] overflow-hidden'>
                                                    <video id='video-thumbnail' className='w-[200px] aspect-video rounded-md'
                                                        src={`${API}/uploads/videos/${file}`}
                                                    />
                                                    <div className='absolute top-0 left-0 w-full h-[102%] flex items-center justify-center bg-black/80'>
                                                        <AiOutlineClose onClick={() => setFile(undefined)} className='text-red-500 text-2xl cursor-pointer' />
                                                    </div>
                                                </div>
                                            </>
                                    }
                                </div>
                                <div className='flex flex-col gap-3 w-full md:w-[49%]'>
                                    <label htmlFor='course' className='text-black font-medium text-lg'>Course Name</label>
                                    <select value={courseID} onChange={(e) => setCourseID(Number(e.target.value))}  required className='shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black hover:border-b-2 hover:border-b-blue-500 focus:border-b-2 duration-200 focus:border-b-blue-500' id='course'>
                                        <option value='0'>-</option>
                                        {
                                            courses && courses.map((course) => 
                                                <option value={course.CourseID} key={course.CourseID}>
                                                    {course.CourseName}
                                                </option>
                                            )
                                        }
                                    </select>
                                </div>
                                {
                                    courseID !== 0 &&
                                    <div className='flex flex-col gap-3 w-full md:w-[49%]'>
                                        <div className='flex gap-1 items-center'>
                                            <label htmlFor='chapter-name' className='text-black font-medium text-lg'>Chapter Name</label>
                                            <AiOutlinePlusCircle onClick={createChapter} className='text-green-500 text-xl cursor-pointer' />
                                            {
                                                chapterID !== 0 &&
                                                    <>
                                                        <AiOutlineEdit onClick={editChapter} className='text-blue-500 text-xl cursor-pointer' />
                                                        <AiOutlineMinusCircle onClick={deleteChapter} className='text-red-500 text-xl cursor-pointer' />
                                                    </>
                                            }
                                        </div>
                                        <select value={chapterID} onChange={(e) => setChapterID(Number(e.target.value))}  required className='shadow-sm shadow-gray-300 p-3 rounded-sm outline-none text-black hover:border-b-2 hover:border-b-blue-500 focus:border-b-2 duration-200 focus:border-b-blue-500' id='chapter-name'>
                                            <option value='0'>-</option>
                                            {
                                                chapters && chapters.filter(i => i.CourseID === courseID).map((chapter) => 
                                                    <option value={chapter.ChapterID} key={chapter.ChapterID}>
                                                        {chapter.ChapterName}
                                                    </option>
                                                )
                                            }
                                        </select>
                                    </div>
                                }
                                
                            </div>
                            <button type='submit' className='p-2 bg-blue-500 rounded-sm text-white duration-200 hover:bg-black ml-auto mr-4'>Edit episode</button>
                        </form>
                </motion.div>
            </div>
        </>
    )
}

export default EditEpisode