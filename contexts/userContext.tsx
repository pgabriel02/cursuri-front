import React, { useEffect } from 'react'
import { API_URL } from '../utils/variables'
import axios from 'axios'

export interface UserInterface {
    id: number,
    name: string,
    admin: number,
    email: string,
    avatar: string,
    gender: string,
}
export const userData: UserInterface = {
    name: '',
    id: 0,
    admin: 0,
    avatar: '',
    gender: '',
    email: ''
}

interface UserContext {
    user: UserInterface | null,
    setUser: (data: UserInterface | null) => void,
    loaded: boolean,
    setLoaded: (state: boolean) => void,
}

const userContext = React.createContext<UserContext>({
    user: userData,
    setUser: () => {},
    loaded: false,
    setLoaded: () => {},
})


const UserWrapper = ({children} : {children: JSX.Element | JSX.Element[]}) => {
    const [user, setUser] = React.useState<UserInterface | null>(null)
    const [loaded, setLoaded] = React.useState<boolean>(false)
    useEffect(() => {
        if(!loaded) {
            axios.get(`${API_URL}/auth/getData`, {withCredentials: true}).then((data) => {
                setLoaded(true)
                setUser(data.data.user)
            }).catch(() => setLoaded(true))
        }
    }, [loaded])

    return (
        <userContext.Provider value={{user, setUser, loaded, setLoaded}}>
            {children}
        </userContext.Provider>
    )
}

export const useUserContext = () => {
    return React.useContext(userContext)
}

export default UserWrapper