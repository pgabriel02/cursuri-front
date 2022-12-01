import { Course, Episode } from "../../../interfaces/interface"
import Chapter from "./Chapter"

const CourseSidebar = ({course, active, changeEpisode} : {course: Course, active: Episode, changeEpisode: (id: number) => void}) => {
    return(
        <div className='w-[38%] flex gap-1 flex-col rounded-md border-1 py-2 border-blue-500 shadow-md bg-black'>
            {
                course && course.chapters.map((chapter) => 
                    <Chapter key={chapter.ChapterID} changeEpisode={changeEpisode} active={active} step={course.userspassed[0].UserCoursePassedEntity.Step } episodes={course.episodes} chapter={chapter} />
                )
            }
        </div>
    )
}

export default CourseSidebar