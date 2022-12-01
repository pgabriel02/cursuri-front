import axios from 'axios'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import toast from 'react-hot-toast'
import { BsEnvelope } from 'react-icons/bs'
import {SiAdguard} from 'react-icons/si'
import { FaEdit } from 'react-icons/fa'
import { UserInterface, useUserContext } from '../../contexts/userContext'
import { en } from '../../utils/lang'
import { API, API_URL, Role, themeBg } from '../../utils/variables'
import { CourseInterface } from '../../components/Courses/MainContent'
import CourseWrapper from '../../components/Courses/CourseWrapper'
import Swal from 'sweetalert2'
import { isEmail } from '../../utils/functions'
const Profile = () => {
    const [profile, setProfile] = useState<UserInterface | null>(null)
    const [courses, setCourses] = useState<CourseInterface[] | null>(null)
    const {loaded, user} = useUserContext()
    const router = useRouter()
    const {id} = router.query
    useEffect(() => {
        if(loaded) {
            if(!user)
                router.push('/').then(() => toast.error(en.not_loggedin))
            axios.get(`${API_URL}/course/getAll`, {withCredentials: true}).then((data) => {
                setCourses(data.data)
            })
            console.log(user)
            if(id) {
                axios.get(`${API_URL}/user/get/data`, {params: {id}}).then((data) => {
                    if(data.status !== 200)
                        return router.push('/').then(() => toast.error('This user doesnt exist!'))
                    setProfile(data.data)
                })
            }
        }
    }, [id, loaded])

    const changeName = () => {
        Swal.fire({
            title: 'Change name',
            input: 'text',
            inputValue: profile?.name,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Change',
            confirmButtonColor: themeBg
        }).then((result) => {
            if(result.isConfirmed) {
                if(!profile)
                    return;
                if(!result.value || result.value.length < 2)
                    return toast.error('Invalid value!')
                axios.post(`${API_URL}/user/change/name`, {id, name: result.value}, {withCredentials: true}).then((data) => {
                    if(data.status === 201) {
                        setProfile((old) => ({...old!, name: result.value}))
                        toast.success('Your name has been successfully changed!')
                    }
                })
            }
        })
    }
    const editRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let value = Number(e.target.value)
        if(!user || !profile || profile.admin === value)
            return;
        if(user.admin !== Role.Admin)
            return toast.error(en.insuficient_access)
        if(user.id === profile.id)
            return toast.error('You cant change role yourself.')
        axios.post(`${API_URL}/user/change/role`, {id, value}, {withCredentials: true}).then((data) => {
            if(data.status === 201) {
                setProfile((old) => ({...old!, admin: value}))
                toast.success(`${profile.name} role has been changed with successfully!`)
            }
        })
    }
    
    const changeEmail = () => {
        if(!user || !profile || user.admin < 2 || profile.id !== user.id)
            return;
        Swal.fire({
            title: 'Change email',
            input: 'text',
            inputValue: profile.email,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Change',
            confirmButtonColor: themeBg
        }).then((result) => {
            if(result.isConfirmed) {
                if(!result.value || !isEmail(result.value))
                    return toast.error('Invalid value.')
                axios.post(`${API_URL}/changeemail/request`, {id: profile.id, email: profile.email, newEmail: result.value}, {withCredentials: true}).then((data) => {
                    if(data.status !== 201)
                        return toast.error('Someting went wrong!')
                    if(user.admin === 2) {
                        setProfile((old) => ({...old!, email: result.value}))
                        toast.success(`${profile.name} email has been changed with successfully`)
                    } else {
                        toast.success('You have been emailed a link to change your email.')
                    }
                })
            }
        })
    }

    const changeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!e || !e.target || !e.target.files || !e.target.files.length || !profile)
            return;
        console.log(e.target.files[0])
        const formData = new FormData()
        formData.append('image', e.target.files[0])
        formData.append('id', profile.id.toString())
        formData.append('lastFile', profile.avatar)
        console.log(formData)
        axios.post(`${API_URL}/user/change/avatar`, formData, {withCredentials: true}).then((data) => {
            console.log(data)
            if(data.status !== 201)
                return toast.error('Something went wrong!')
            setProfile((old) => ({...old!, avatar: data.data}))
            toast.success('Your avatar has been changed with successfully!')
        }).catch(() => toast.error('Something went wrong!'))
        
    }
    return(
        <>
            <Head>
                <title>Curs.RO | {profile?.name} profile</title>
            </Head>
            {
                profile &&
                <section id='user-profile' className='px-8 lg:px-24 py-3'>
                    <div className='flex flex-col gap-3 lg:flex-row lg:gap-5 flex-wrap items-start'>
                        <div className='w-full lg:w-[20%] flex flex-col gap-2'>
                            <div className='relative w-full'>
                                <img src={`${API}/uploads/${profile.avatar}`} alt={`${profile.name} avatar`} width={100} height={100} className='aspect-square w-full' />
                               {
                                    user?.id === profile.id && 
                                    <>
                                        <label htmlFor='avatar-file'><FaEdit className='text-blue-500 cursor-pointer absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]' size={24} /></label>
                                        <input accept="image/png, image/jpeg, image/gif" type='file' onChange={changeAvatar} className='hidden' id='avatar-file' />
                                    </>
                               }
                            </div>
                            <div className='border-2 border-gray-600/20 p-3 flex flex-col gap-2'>
                                <div className='flex w-full justify-between items-center'>
                                    <p className='max-w-[80%] break-words'>{profile.name}</p>
                                    {
                                        Number(user?.id) === Number(id) && <FaEdit className='text-blue-500 cursor-pointer' onClick={changeName} size={16} />
                                    }
                                </div>
                                <p className='flex items-center gap-2'>
                                    <BsEnvelope className='text-gray-700 flex-shrink-0' size={14} />
                                    <span className='max-w-[80%] break-words '>
                                        {profile.email}
                                    </span>
                                    {
                                        profile.id === user?.id ?
                                            <FaEdit className='text-blue-500 cursor-pointer flex-shrink-0' onClick={changeEmail} size={16} />
                                        : user?.admin === Role.Admin ?
                                            <FaEdit className='text-blue-500 cursor-pointer flex-shrink-0' onClick={changeEmail} size={16} />
                                        : ''
                                    }
                                </p>
                                {
                                    user && user.admin < 2 ?
                                        <p className='flex items-center gap-2'>
                                            <SiAdguard className='text-gray-700' size={14} />
                                            {profile.admin === 2 ? 'Admin' : profile.admin === 1 ? 'Editor' : 'Member'}
                                        </p>
                                    :
                                        <div className='flex items-center gap-2'>
                                            <SiAdguard className='text-gray-700' size={14} />
                                            <select value={profile?.admin} onChange={editRole}className='flex-1 px-2 py-1'>
                                                <option value='0'>Member</option>
                                                <option value='1'>Editor</option>
                                                <option value='2'>Admin</option>
                                            </select>
                                        </div>
                                }
                                <p className='flex items-center gap-2'>
                                    <img src='/ro.webp' alt='ro flag' width={20} height={20} />
                                    Romania
                                </p>

                            </div>
                        </div>
                        <span className='w-full lg:w-[200px] p-2 mb-auto bg-gray-800 text-white font-bold text-lg'>
                            My courses
                        </span>
                        <div className='w-full lg:flex-1 py-2 flex flex-wrap gap-2'>
                            {courses && courses.map(course =>
                                <CourseWrapper course={course} key={course.CourseID} />
                            )}
                        </div>
                    </div>
                </section>
            }
        </>
    )
}

export default Profile