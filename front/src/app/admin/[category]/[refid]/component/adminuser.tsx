"use client"

import { getAllBrands } from "@/api/brands"
import { allUsers, delUser, putUser, regUser } from "@/api/users"
import { useCookies } from "next-client-cookies"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react" 
import jwt from "jsonwebtoken"
export default function AdminUsers() {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [adress, setAdress] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [message, setMessage] = useState('')
    const router = useRouter()
    const cookies = useCookies()
    const idUser: number = parseInt(useParams().refid)
    const params = useParams()
    const reg_general = /^[-.a-zA-Z\d]{5,30}$/
    const reg_general_bis = /^[-.a-zA-Z\d\s]{5,50}$/
    const reg_email = /^([-.a-zA-Z\d]{5,150})+@+([-a-zA-Z\d]{3,150})+\.+([a-zA-Z\d]{2,20})$/
    const reg_pwd_p1 = /[a-z]/
    const reg_pwd_p2 = /[A-Z]/
    const reg_pwd_p3 = /[\d]/
    const reg_pwd_ban = /[{}\[\]<>()%]/
    const reg_id = /[\D]/


    if (params.category !== "users" && params.category !== "brands" && params.category !== "products") {
        router.push('/')
    }

    if (!cookies.get("token")) {
        router.push('/')
    }

    async function getIds() {

        await allUsers()
        .then((result)=>{
            if (params.category === "users") {
                let arrayId: number[] = []
                result.data.forEach(element => {
                    console.log(element)
                    arrayId.push(element.pk)
                });
                if (!arrayId.includes(parseInt(params.refid))) {
                    router.push('/admin')
                }
            }
        })
    }


    useEffect(()=>{
        getIds()
        
        
    },[])

    

    


    function ModalDelUser(){
        const dialogUser = document.querySelector("#dialogUser")
        dialogUser.style.display = "flex"
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

    
    

    async function handlePutUser(event: any) {

        event.preventDefault();
        console.log("OUAI2")

        const data = {
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            adress: adress,
            city: city,
            country: country,
            token: cookies.get("token")
        }


        if (reg_general.test(username) === false) {
            console.log(username)
            return setMessage("Le nom d'utilisateur ne doit pas avoir d'espace ni de caractère spécial.")
        }

        if (reg_email.test(email) === false) {
            return setMessage("Merci de mettre un email correct.")
        }

        let msg_miss_pwd = "Il vous manque"

        if (reg_pwd_p1.test(password) === false) {
            msg_miss_pwd = msg_miss_pwd + " une lettre minuscule,"
        }
        if (reg_pwd_p2.test(password) === false) {
            msg_miss_pwd = msg_miss_pwd + " une lettre majuscule,"
        }
        if (reg_pwd_p3.test(password) === false) {
            msg_miss_pwd = msg_miss_pwd + " un chiffre,"
        }
        if (/[^0-9A-Za-z]/.test(password) === true) {
            if (reg_pwd_ban.test(password) === true) {
                msg_miss_pwd = msg_miss_pwd + " un caractère spécial sauf ' }, {, ], [, <, >, (, )f '%"
            }
        }
        if (/[^0-9A-Za-z]/.test(password) === false) {
            msg_miss_pwd = msg_miss_pwd + " un caractère spécial sauf ' }, {, ], [, <, >, (, )a ' %"
            console.log(password)
        }

        if (/[^0-9A-Za-z]/.test(confirmPassword) === true) {
            if (reg_pwd_ban.test(confirmPassword) === true) {
                return setMessage("Caractères invalide dans la confirmation du mot de passe")
            }
        }


        if (password !== confirmPassword) {
            return setMessage("Les mots de passe ne sont pas les mêmes")
        }
        if (password.length < 12) {
            msg_miss_pwd = msg_miss_pwd + " 12 caractères minimum,"
        }

        if (msg_miss_pwd !== "Il vous manque") {
            return setMessage(msg_miss_pwd.substring(0, msg_miss_pwd.length - 1) + ".")
        }

        if (reg_general_bis.test(adress) === false) {
            return setMessage("Veuillez ne pas mettre de caractères spéciaux dans le champs \"Adresse\".")
        }

        if (reg_general_bis.test(city) === false) {
            return setMessage("Veuillez ne pas mettre de caractères spéciaux dans le champs \"Adresse\".")
        }

        if (reg_general_bis.test(country) === false) {
            return setMessage("Veuillez ne pas mettre de caractères spéciaux dans le champs \"Adresse\".")
        }

        if (reg_id.test(idUser.toString()) === true) {
            return setMessage("IdUser corrompu")
        }
        


        await putUser(data, idUser)
            .then((result) => {
                if (result.status === 200) {

                    setMessage(result.data.message)
                    setTimeout(() => {
                        router.push('/admin')
                    }, 1200);
                } else {
                    setMessage(result.response.data.message)
                }
            })
    }


    useEffect(()=>{
        checkUsersAdmin()
    },[])

    if (params.category === "users") {
        if (adminState === true) {

        
        return (

            <section style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", justifyContent: "center" }}>
                <h2 className="text-3xl">Modifier utilisateur</h2>
                <h2>{message}</h2>
                {cookies.get("token") ?
                    (
                        <form action="" onSubmit={handlePutUser} className="w-11/12 flex flex-col justify-center items-center h-96 lg:w-4/6" method="post">
                            <div className="w-11/12 flex flex-col justify-center items-center h-96 lg:w-4/6" style={{ backgroundColor: "#EDEDED" }}>
                                <h4>Nom d'utilisateur</h4>
                                <input pattern="^[a-zA-Z\d]{5,30}$" required value={username} onChange={(b) => setUsername(b.target.value)} className="w-11/12 lg:w-96" type="text" />
                                <h4>Email</h4>
                                <input pattern="^([a-zA-Z\d]{5,150})+@+([a-zA-Z\d]{3,150})+\.+([a-zA-Z\d]{2,20})$" required value={email} onChange={(b) => setEmail(b.target.value)} className="w-11/12 lg:w-96" type="email" />
                                <h4>Mot de passe</h4>
                                <input required value={password} onChange={(b) => setPassword(b.target.value)} className="w-11/12 lg:w-96" type="password" />
                                <h4>Confirmation</h4>
                                <input required value={confirmPassword} onChange={(b) => setConfirmPassword(b.target.value)} className="w-11/12 lg:w-96" type="password" />
                                <h4>Adresse</h4>
                                <input pattern="^[a-zA-Z\d\s]{5,50}$" required value={adress} onChange={(b) => setAdress(b.target.value)} className="w-11/12 lg:w-96" type="text" />
                                <h4>Ville</h4>
                                <input pattern="^[a-zA-Z\d\s]{5,50}$" required value={city} onChange={(b) => setCity(b.target.value)} className="w-11/12 lg:w-96" type="text" />
                                <h4>Pays</h4>
                                <input pattern="^[a-zA-Z\d\s]{5,50}$" required value={country} onChange={(b) => setCountry(b.target.value)} className="w-11/12 lg:w-96" type="text" />
                            </div>
                            <button className="bg-black rounded-full font-xl h-8 w-28 text-white" >Modifier</button>
                            <button type="button" className="rounded-full font-xl h-8 w-28 text-black"onClick={ModalDelUser} style={{ backgroundColor: "#EDEDED" }}>Supprimer</button>
                        </form>
                    ) : null}
                    <ModalDeleteUser/>
            </section>
        )
        } else {
            return (
                <h3>Vous n'avez pas la permission.</h3>
            )
        }
    }
}

export function ModalDeleteUser() {
    const idUser: number = parseInt(useParams().refid)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const reg_id = /[\D]/
    

    async function handleDeleteUser(event: any) {
        event.preventDefault()

        if (reg_id.test(idUser.toString()) === true) {
            return setMessage("IdUser corrompu")
        }

        await delUser(idUser)
        .then((result)=>{
            setMessage(result.data.message)
            setTimeout(() => {
                router.push('/admin')
            }, 1200);
        })
    }

    function ModalDelUser(){
        const dialogUser = document.querySelector("#dialogUser")
        dialogUser.style.display = "none"
    }

    return (
        <div id="dialogUser" style={{display:"none" , textAlign:"center", justifyContent:"center", alignItems:"center", backgroundColor:"rgba(0, 0, 0, 0.780)", height:"100%", width:"100%", position:"fixed", top:0}}>

            <div style={{ position:"fixed"}} >
                <form action="" onSubmit={handleDeleteUser} className="w-11/12 flex flex-col justify-center items-center h-96 lg:w-4/6" method="post">
                    <div className="w-11/12 flex flex-col justify-center items-center h-96 lg:w-4/6" style={{ backgroundColor: "#EDEDED" }}>
                        <h3>{message}</h3>
                        <br/>
                        <p>Êtes-vous sûr de vouloir supprimer cette utilisateur ?</p>
                    </div>
                    <button className="bg-black rounded-full font-xl h-8 w-28 text-white">Oui</button>
                    <button type="button" className="rounded-full font-xl h-8 w-28 text-black" onClick={ModalDelUser} style={{ backgroundColor: "#EDEDED" }}>Non</button>
                    
                </form>
            </div>
        </div>
    )
}