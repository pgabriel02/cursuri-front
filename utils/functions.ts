import axios from "axios";
import { useUserContext } from "../contexts/userContext";
import { API_URL } from "./variables";

export const isEmail = (email: string) => {
    const emailtest = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
    return emailtest.test(email)
}

export const isPassword = (password: string) => {
    const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    return passw.test(password)
}


export const existChapter = async (name: string, course: number) => {
    let check = await axios.get(`${API_URL}/chapter/check/${course}/${name}`, {withCredentials: true})
    return typeof check.data ? false : true
}