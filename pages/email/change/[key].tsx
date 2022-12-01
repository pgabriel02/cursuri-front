import axios from 'axios'
import { useRouter } from 'next/router'
import {useEffect} from 'react'
import toast from 'react-hot-toast'
import { API_URL } from '../../../utils/variables'

const ChangeEmail = () => {
    const router = useRouter()
    const {key} = router.query
    useEffect(() => {
        if(key)
            axios.post(`${API_URL}/changeemail/change`, {key}, {withCredentials: true}).then((data) => {
                if(data.status !== 201)
                    return router.push('/').then(() => toast.error('Your key is invalid!'))
                router.push('/').then(() => toast.success("Your email has been changed with successfully!"))
            }).catch(() => router.push('/').then(() => toast.error('Your key is invalid!')))
    }, [key])
    return(
        <>
        </>
    )
}

export default ChangeEmail