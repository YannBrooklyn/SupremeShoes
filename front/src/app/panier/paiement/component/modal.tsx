"use client"
import jwt from "jsonwebtoken"


import { allCommandes, putCommande } from "@/api/commandes"
import { useCookies } from "next-client-cookies"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ModalPaiement() {

    const [message, setMessage] = useState("")
    const cookie = useCookies()
    const router = useRouter()

    async function handleCommande() {
        
        const idUser = jwt.decode(cookie.get("token")).id

        const isDelivred = false
        const isCommanded = true
        const data = {
            user: idUser,
            isDelivred: isDelivred,
            isCommanded: isCommanded,
            token: cookie.get("token")
        }


        if (typeof (idUser) !== "number") {
            return setMessage("Erreur ID")
        }

        if (typeof (isDelivred) !== "boolean" || typeof (isCommanded) !== "boolean") {
            return setMessage("Erreur data")
        }
        await putCommande(data)
            .then((result) => {
                if (result.status === 200) {

                    setMessage(result.data.message)
                    setTimeout(() => {
                        router.push("/")
                    }, 1200);
                } else {
                    setMessage(result.response.data.message)
                }
            })
    }

    async function verifyOrder() {

        const idUser = jwt.decode(cookie.get("token")).id

        let arrayIdUser: number[] = []
        await allCommandes()
        .then((result)=>{
            result.data.forEach(element => {
                if (element.fields.user_id === idUser) {
                    if (element.fields.isCommanded === false) {
                        arrayIdUser.push(element.fields.user_id)
                    }
                }
            });
            if (arrayIdUser.includes(idUser) === false) {
                
                router.push('/')
            }
        })
    }

    useEffect(()=>{
        if (cookie.get("token")) {

            verifyOrder()
        }
    },[])
    if (cookie.get("token")) {

    
    return (
        <section style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            <div className="gap-8 w-10/12 h-56 flex flex-col lg:w-6/12" style={{ backgroundColor: "#EDEDED", justifyContent: "center", alignItems: "center" }}>
                <h3>{message}</h3>
                <div style={{ width: "100%", textAlign: "center" }}>
                    <h4>Carte Bancaire :</h4>
                    <input className="w-9/12 h-6 lg:w-4/12" type="text" name="" id="" />
                </div>
                <div className="text-center" style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <div>
                        <h4>Code Secret :</h4>
                        <input type="text" className="w-5/12 h-6 lg:w-7/12" name="" id="" />
                    </div>
                    <div>
                        <h4>Date Expiration :</h4>
                        <input type="text" className="w-5/12 h-6 lg:w-7/12" name="" id="" />
                    </div>
                </div>

            </div>
            <button className="bg-black rounded-full w-32 text-md h-8 text-white" onClick={handleCommande}>VALIDER</button>

        </section>
    )
    } else {
        router.push('/')
        return (
            <h4>Vous n'avez pas le droit</h4>
        )
    }
}