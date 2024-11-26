"use client"
import { allUsers } from "@/api/users"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"
import { useCookies } from "next-client-cookies"

export default function ModalUser(){

    const [users, setUsers] = useState([])
    const cookies = useCookies()
    async function getAllUsers() {
        await allUsers()
        .then((result)=>{
            setUsers(result.data)
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
        getAllUsers()
        checkUsersAdmin()
    },[])

    if (adminState === true) {
        return(
            <section style={{display:"flex", flexDirection:"column", width:"100%", alignItems:"center", justifyContent:"center"}}>
                
                <div style={{backgroundColor:"#EDEDED", width:"90%", height:"55vh", display:"flex", flexDirection:"column", justifyContent:"center", overflowY:"scroll"}}>
                    <h3 className="text-center text-2xl" >Utilisateur</h3> 
                    <table style={{borderColor:"black", borderWidth:"0.2vh"}}>
                        <thead>
                            <tr>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Nom d'utilisateur</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Email</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Adresse</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Ville</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Pays</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Role</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Modifier</th>
                            </tr>
                        </thead>
                        <tbody>
                        {users.map((user, index)=>{
                            return (
                            <tr key={index}>
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}>{user.fields.username}</td>
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}>{user.fields.email}</td>
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}>{user.fields.adress}</td>
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}>{user.fields.city}</td>
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}>{user.fields.country}</td>
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}>{user.fields.role}</td>
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}><a href={"/admin/users/" + user.pk}><button style={{backgroundColor:"black", color:"white"}}>Modifier</button></a></td>
                                 
                            </tr>
                            )
                        })}
                        </tbody>
                    </table>                        
                </div>
                
            </section>
        )

    } else {
        return (
            <h3>Vous n'avez pas la permission.</h3>
        )
    }
    
}