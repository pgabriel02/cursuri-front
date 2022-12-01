import { Chapter, Episode } from "../../../interfaces/interface"
import {useState, useEffect} from 'react'
import { API } from "../../../utils/variables"
import EpisodeList from "./Episode"
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md"

const Chapter = ({chapter, episodes, active, step, changeEpisode} : {chapter: Chapter, step: number, episodes: Episode[], active: Episode, changeEpisode: (id: number) => void}) => {
    const [collapse, setCollapse] = useState<boolean>(false)
    useEffect(() => {
        if(chapter.ChapterID === active.ChapterID)
            setCollapse(true)
    }, [active])
    return(
        <article key={chapter.ChapterID} className='px-3 py-1 text-white'>
            <div className='flex justify-between items-center cursor-pointer p-3 bg-blue-500/50' onClick={() => setCollapse(old => !old)}>
                <h3 className='font-'>{chapter.ChapterName}</h3>
                {
                    !collapse ?
                        <MdOutlineExpandMore className='text-2xl' />
                    :
                        <MdOutlineExpandLess className='text-2xl' />
                }
            </div>
            {
                collapse &&
                    <div className='flex flex-col gap-2'>
                        {
                            episodes.map((episode, i) => 
                                episode.ChapterID === chapter.ChapterID &&
                                    <EpisodeList key={episode.EpisodeID} changeEpisode={changeEpisode} episodeIndex={i} step={step} active={active} episode={episode} />
                            )
                        }
                    </div>
            }
        </article>
    )
}

export default Chapter