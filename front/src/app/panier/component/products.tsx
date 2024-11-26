"use client"

import { allCommandes } from "@/api/commandes"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"
import { useCookies } from "next-client-cookies"
import { useRouter } from "next/navigation"
export default function ProductsPanier() {
    const cookie = useCookies()
    const [commandes, setCommandes] = useState([])
    const [idUser, setIdUser] = useState(0)
    const router = useRouter()
    
    async function getAllCommande() {
        await allCommandes()
            .then((result) => {
                setCommandes(result.data)
            })
    }

    useEffect(() => {
        if (cookie.get("token")) {

            setIdUser(jwt.decode(cookie.get("token")).id)
        } else {
            router.push("/")
        }
        getAllCommande()
    }, [])

    if (idUser !== 0) {

    
    return (
        <section style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            {commandes.map((commande, index) => {

                
                if (commande.fields.user_id === idUser && commande.fields.isCommanded === false) {

                    return (
                        <article key={index} style={{ width: "90%", borderStyle: "solid", borderWidth: "0.4vh", borderColor: "black", height: "15vh", display: "flex", flexDirection: "row", alignItems: "center" }}>
                            <img style={{ height: "10vh", width: "10vh" }} src={commande.fields.product__img} alt={commande.fields.product__name} />
                            <div>
                                <h4 style={{ fontSize: "2vh" }}>{commande.fields.product__name}</h4>
                                {commande.fields.product__promo === 1 ? (

                                    <h4 style={{ fontSize: "2vh" }}>€ {commande.fields.product__price}</h4>
                                ) : (
                                    <h4 style={{ fontSize: "2vh" }}>€ {commande.fields.product__newprice}</h4>

                                )}
                                
                            </div>
                        </article>
                    )
                }
            })}

        </section>
    )
    } else {
        return (
            <h3>Vous n'avez pas la permission.</h3>
        )
    }
}

    
