import axios from "axios" 

type User = {
    username: string;
    email: string;
    password: string;
    adress: string;
    city: string;
    country: string;
}

export const allUsers = async() => {
    return await axios({
        method:"get",
        url:"http://localhost:8000/users/get/users/all/"
    })
    .then((result)=>{
        console.log(result)
        return result
    })
    .catch((error)=>{
        console.log(error)
        return error
    })
}

export const regUser = async (data: User) => {
    return await axios({
        method: "post",
        url: "http://localhost:8000/users/post/users/",
        data: data
    })
    .then((result)=>{
        console.log(result)
        return result
    })
    .catch((error)=>{
        console.log(error)
        return error
    })
}

export const logUser = async (data:any)=>{
    return await axios({
        method: "post",
        url: "http://localhost:8000/users/login/users/",
        data: data
    })
    .then((result)=>{
        return result
    })
    .catch((error)=>{
        return error
    })
}

export const putUser = async (data: User, id: number) => {
    return await axios({
        method: "put",
        url: `http://localhost:8000/users/put/users/${id}/`,
        data: data
    })
    .then((result)=>{
        console.log(result)
        return result
    })
    .catch((error)=>{
        console.log(error)
        return error
    })
}

export const delUser = async (id: number) => {
    return await axios({
        method: "delete",
        url: `http://localhost:8000/users/delete/users/${id}/`
    })
    .then((result)=>{
        console.log(result)
        return result
    })
    .catch((error)=>{
        console.log(error)
        return error
    })
}
