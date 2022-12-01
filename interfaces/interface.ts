export interface Chapter {
    ChapterID: number;
    ChapterName: string;
    CourseID: number;
}

export interface Episode {
    EpisodeID: number;
    ChapterID: number;
    EpisodeName: string;
    EpisodeVideo: string;
}

export interface UserPassed {
    UserCoursePassedEntity: {
        Step: number;
    }
}

export interface Course {
    CourseID: number;
    CourseImage: string;
    CourseName: string;
    chapters: Chapter[],
    episodes: Episode[],
    userspassed: UserPassed[]
}