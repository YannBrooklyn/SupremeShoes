import axios from "axios"

export const getAllBrands = async () => {
    return await axios({
        method: 'get',
        url: `http://localhost:8000/brands/get/brands/all/`
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

export const putBrands = async (data: any, idBrand: number) => {
    return await axios({
        method: 'put',
        url: `http://localhost:8000/brands/put/brands/${idBrand}/`,
        data: data
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

export const newBrand = async (data: any) => {
    return await axios({
        method:"post",
        url:"http://localhost:8000/brands/post/brands/",
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

export const delBrand = async (idBrand: number) => {
    return await axios({
        method: 'delete',
        url: `http://localhost:8000/brands/delete/brands/${idBrand}/`
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