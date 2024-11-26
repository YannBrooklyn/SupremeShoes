import axios from "axios"

export const getAllProducts = async () => {
    return await axios({
        method: 'get',
        url: `http://localhost:8000/products/get/products/all/`
    })
    .then ((result) => {
        console.log(result)
        return result
    })
    .catch((error)=> {
        console.log(error)
        return error
    })
}

export const getOneProduct = async (idProduct: number) => {
    return await axios({
        method: 'get',
        url: `http://localhost:8000/products/get/products/${idProduct}/`
    })
    .then ((result) => {
        console.log(result)
        return result
    })
    .catch((error)=> {
        console.log(error)
        return error
    })
}

export const putProduct = async (data: any, idProduct: number) => {
    return await axios ({
        method: "put",
        url: `http://localhost:8000/products/put/products/${idProduct}/`,
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

export const delProduct = async (idProduct: number) => {
    return await axios ({
        method: "delete",
        url: `http://localhost:8000/products/delete/products/${idProduct}/`
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

export const newProduct = async (data: any) => {
    return await axios({
        method:"post",
        url:"http://localhost:8000/products/post/products/",
        data: data
    })
    .then ((result)=> {
        console.log(result)
        return result
    })
    .catch((error)=>{
        console.log(error)
        return error
    })
}