import axios from "axios"

export const allRoles = async () => {
    return await axios({
        method:"get",
        url: "http://localhost:8000/roles/get/roles/all/"

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