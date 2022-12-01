import Link from "next/link"
import { CourseInterface } from "./MainContent"
import {MdModeEditOutline} from 'react-icons/md'
import { useUserContext } from "../../contexts/userContext"
import { API_URL, Role } from "../../utils/variables"
import { FaTrash } from "react-icons/fa"
import toast from "react-hot-toast"
import { useRouter } from "next/router"
import { en } from "../../utils/lang"
import axios from "axios"

type Props = {
    course: CourseInterface,
    startCourse?: (id: number) => void
    deleteCourse?: (id: number) => void
}


const CourseWrapper = ({course, startCourse, deleteCourse}: Props) => {
    const {loaded, user} = useUserContext()
    return (
        <Link href={course.episodes.length === 0 ? '' : course.userspassed.length === 0 ? '' : course.episodes.length === course.userspassed[0].UserCoursePassedEntity.Step ? '/view/course/' + course.CourseID : '/view/course/' + course.CourseID}>

            <article className='shadow-md rounded-md w-[95%] md:w-[48%] cursor-pointer relative pb-[30px]'>
                <img alt={`${course.CourseName}`} className='rounded-md w-full h-auto aspect-video' src={`http://localhost:3001/uploads/${course.CourseImage}`} width={200} height={300} />
                <div className='flex flex-wrap justify-between items-center p-5'>
                    <div className='flex gap-2 items-center'>
                        <h3 className='font-semibold text-black text-base lg:text-lg'>{course.CourseName}</h3>
                        { loaded && user && user.admin >= Role.Editor && deleteCourse && startCourse &&
                            <>
                                <Link href={`/admin/edit/course/${course.CourseID}`}>
                                    <a className='flex items-center gap-1 text-sm font-medium group'><MdModeEditOutline className='duration-200 group-hover:text-blue-500 text-lg md:text-base' /> <span className='hidden xl:block'>Edit Course</span></a>
                                </Link>
                                <div onClick={() => deleteCourse(course.CourseID)} className='flex items-center gap-1 text-sm font-medium group'><FaTrash className='duration-200 group-hover:text-blue-500 text-lg md:text-base' /> <span className='hidden xl:block'>Delete Course</span></div>
                            </>
                        }
                    </div>
                    {
                        course.userspassed?.length === 0 && startCourse ?
                            <span onClick={() => startCourse(course.CourseID)} className='cursor-pointer p-2 bg-blue-500 rounded-sm text-white duration-200 hover:bg-black'>Start course</span>
                        : course.episodes?.length !== course.userspassed[0].UserCoursePassedEntity.Step ?
                            <Link href={`/view/course/${course.CourseID}/`}>
                                <a className='p-2 bg-blue-500 rounded-sm text-white duration-200 hover:bg-black'>Keep viewing</a>
                            </Link>
                        :
                            <Link href={`/course/${course.CourseID}/episode/${course.userspassed[0].UserCoursePassedEntity.Step}`}>
                                <a className='p-2 bg-black rounded-sm text-white duration-200 hover:bg-blue-500'>Finished</a>
                            </Link>

                    }
                </div>
                
                <div className="w-[90%] bg-gray-200 rounded-full h-1.5 mb-4 mx-auto absolute left-[50%] translate-x-[-50%] bottom-2">
                    <div className="bg-blue-600 h-1.5 rounded-full dark:bg-blue-500 mt-auto absolute " style={{
                        width: `${course.userspassed?.length !== 0 ? (course.userspassed[0].UserCoursePassedEntity.Step < course.episodes.length ?  (course.userspassed[0].UserCoursePassedEntity.Step * 100) / course.episodes?.length : 100) + '%' : '0%'}`
                    }}></div>
                </div>
                
            </article>
        </Link>
    )
}

export default CourseWrapper