"use client"

import { allCommandes } from "@/api/commandes"
import { useCookies } from "next-client-cookies"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"
import { useRouter } from "next/navigation"

export default function TotalPrice() {

    const cookie = useCookies()
    const [totalPrice, setTotalPrice] = useState(0)
    const [idUser, setIdUser] = useState(0)
    const router = useRouter()



    async function getAllCommande() {

        let price = 0
        await allCommandes()
            .then((result) => {
                result.data.forEach(element => {
                    if (element.fields.user_id === idUser && element.fields.isCommanded === false) {
                        if (element.fields.product__promo === 1) {
                            price = price + element.fields.product__price
                        } else {
                            price = price + element.fields.product__newprice
                        }
                    }
                    setTotalPrice(price)
                });

            })
    }

    function cdButton() {
        router.push('/panier/paiement')
    }

    useEffect(() => {
        if (cookie.get("token")) {


            setIdUser(jwt.decode(cookie.get("token")).id)
        } else {
            router.push("/")
        }
        getAllCommande()
    }, [idUser])


    if (idUser !== 0) {


        if (totalPrice !== 0) {

            return (
                <>
                    <h4>Prix Total: € {totalPrice}</h4>
                    <button className="bg-black w-44 rounded-full h-8 text-lg text-white" onClick={cdButton}>PAIEMENT</button>
                </>

            )
        } else {
            return (

                <h4>Aucun article</h4>
            )
        }
    } else {
        return (
            <h4>Prix Total : € 0</h4>
        )
    }
}