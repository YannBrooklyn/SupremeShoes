"use client"

import { newBrand } from "@/api/brands"
import { allUsers } from "@/api/users"
import { useCookies } from "next-client-cookies"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"

export default function AdminNewBrands() {

    const [name, setName] = useState("")
    const [img, setImg] = useState("")
    const [message, setMessage] = useState('')
    const router = useRouter()
    const cookies = useCookies()
    const params = useParams()
    const reg_general = /^[-.a-zA-Z\d]{5,30}$/
    const reg_general_bis = /^[-.a-zA-Z\d\s]{5,50}$/
   
    const reg_id = /[\D]/
    const reg_price = /^([\d]{1,4})+\.+([\d]{2,2})$/
    const reg_img = /^(http:\/\/|https:\/\/)+([a-zA-Z\d\/\.]{5,250})+(.jpg|.png|.jpeg)$/

    
    if (params.category !== "brands" && params.category !== "products") {
        router.push('/')
    }

    if (!cookies.get("token")) {
        router.push('/')
    } 
    
    async function handlePostBrand(event: any) {

        event.preventDefault();
        const data = {
            name: name,
            img: img,
            token: cookies.get("token")
        }

        if (reg_general_bis.test(name) === false) {
            return setMessage("Merci de mettre un nom correct.")
        }


        if (reg_img.test(img) === false) {
            return setMessage("Merci de mettre un lien d'image correct.")
        }

        await newBrand(data)
        .then((result)=> {
            setMessage(result.data.message)
        })

        
    }


    const [adminState, setAdminState] = useState(false)
    

    async function checkUsersAdmin() {
        const idUser = jwt.decode(cookies.get("token")).id

        await allUsers()
            .then((result) => {
                let arrayId: number[] = []
                result.data.forEach(element => {
                    if (element.fields.role) {
                        arrayId.push(element.pk)
                    }

                });
                if (arrayId.includes(idUser) === false) {
                    setAdminState(false)
                } else {
                    setAdminState(true)
                }
            })
    }

    useEffect(()=>{
        checkUsersAdmin()
        if (!cookies.get("token")) {
            router.push("/")
        }
    },[adminState])

    if (params.category === "brands") {
        if (adminState === true) {

            return (
                <section style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <h2 className="text-3xl">Nouvelle Marque</h2>
                    <h2>{message}</h2>
                    {cookies.get("token") ?
                        (
                            <form action="" onSubmit={handlePostBrand} className="w-11/12 flex flex-col justify-center items-center h-auto lg:w-4/6" method="post">
                                <div className="w-11/12 flex flex-col justify-center items-center h-auto lg:w-4/6" style={{ backgroundColor: "#EDEDED" }}>
                                    <h4>Nom de la marque</h4>
                                    <input pattern="^[a-zA-Z\d\s]{5,80}$"  required value={name} onChange={(b) => setName(b.target.value)} className="w-11/12 lg:w-96" type="text" />
                                    <h4>Image de la marque (Lien)</h4>
                                    <input pattern="^(http://|https://)+([a-zA-Z\d\/\.]{5,250})+(.jpg|.png|.jpeg)$" required value={img} onChange={(b) => setImg(b.target.value)} className="w-11/12 lg:w-96" type="text" /> 
                                       
                                </div>
                                <button className="bg-black rounded-full font-xl h-8 w-28 text-white" >Créer</button>
                            </form>
                        ) : null} 
                </section>
            )

        } else {
            
            return (
                <h3>Vous n'avez pas la permission.</h3>
            )
        }

        
    }
}