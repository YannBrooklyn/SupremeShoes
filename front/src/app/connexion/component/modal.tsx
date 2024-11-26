"use client"

import { logUser } from "@/api/users"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useCookies } from "next-client-cookies"

export default function ModalConnexion(){

    const reg_email = /^([-.a-zA-Z\d]{5,150})+@+([-a-zA-Z\d]{3,150})+\.+([a-zA-Z\d]{2,20})$/
    const reg_pwd_ban = /[{}\[\]<>()%]/
    const [message, setMessage] = useState('')
    const router = useRouter()
    const cookies = useCookies()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleLogUser(event:any) {
        event.preventDefault();

        const data = {
            email: email,
            password: password
        }

        if (reg_email.test(email) === false) {
            return setMessage("Merci de mettre un email correct.")
        }
    
        if (/[\D][\W]/.test(password) === true) {
            if (reg_pwd_ban.test(password) === true) {
                return setMessage("Caractères invalide")
            }
        }
        await logUser(data)
        .then((result)=>{
            console.log(result)
            if (result.status === 200) {

                cookies.set("token", result.data.token)
                setMessage(result.data.message)
                setTimeout(() => {
                    router.push('/')
                }, 1200);
            } else {
                setMessage(result.response.data.message)
            }
        })


    }

    if (cookies.get("token")){
        router.push('/')
    } 

    
    return(
        <section style={{display:"flex", flexDirection:"column", width:"100%", alignItems:"center", justifyContent:"center"}}> 
            <h2 style={{fontSize:"4vh", fontWeight:"bold"}}>CONNEXION</h2>
            <h2>{message}</h2>
            {!cookies.get("token") ? 
            (

                <form action="" onSubmit={handleLogUser} className="w-11/12 flex flex-col justify-center items-center h-96 lg:w-4/6" method="post">

                    <div className="w-11/12 flex flex-col justify-center items-center h-96 lg:w-4/6" style={{backgroundColor:"#EDEDED"}}>
                        <h4>Email</h4>
                        <input value={email} onChange={(b)=> setEmail(b.target.value)} className="w-11/12 lg:w-96" pattern="^([a-zA-Z\d]{5,150})+@+([a-zA-Z\d]{3,150})+\.+([a-zA-Z\d]{2,20})$" required type="email" />
                        <h4>Mot de passe</h4>
                        <input pattern="{12,250}" value={password} onChange={(b)=> setPassword(b.target.value)} className="w-11/12 lg:w-96" required type="password" />

                    </div>
                    <button className="bg-black rounded-full font-xl h-8 w-28 text-white">Connexion</button>
                </form>
            ): null}

        </section>
    )
}