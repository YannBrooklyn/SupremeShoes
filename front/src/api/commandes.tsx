import axios from "axios"

export const allCommandes = async () =>{
    return await axios({
        method:"get",
        url:"http://localhost:8000/commandes/get/commandes/all/"
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

export const newCommande = async (data: any) =>{
    return await axios({
        method:"post",
        url:"http://localhost:8000/commandes/post/commandes/",
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

export const putCommande = async (data: any) =>{
    return await axios({
        method:"put",
        url:`http://localhost:8000/commandes/put/commandes/`,
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

