"use client"
import { getAllBrands } from "@/api/brands"
import { getAllProducts } from "@/api/products"
import { allUsers } from "@/api/users"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"
import { useCookies } from "next-client-cookies"

export default function ModalBrands() {
    const cookies = useCookies()
    const [brands, setBrands] = useState([])

    const [adminState, setAdminState] = useState(false)
    const router = useRouter()

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

    async function getBrands() {
        await getAllBrands()
            .then((result) => {
                setBrands(result.data)
            })
    }

    useEffect(() => {
        getBrands()
        checkUsersAdmin()
        if (!cookies.get("token")) {
            router.push("/")
        }
    }, [adminState])

    if (adminState === true) {



        return (
            <section style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", justifyContent: "center" }}>

                <div style={{ backgroundColor: "#EDEDED", width: "90%", height: "55vh", display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "scroll" }}>
                    <h3 className="text-center text-2xl" >Marques</h3>
                    <table style={{ borderColor: "black", borderWidth: "0.2vh" }}>
                        <thead>
                            <tr>
                                <th style={{ borderColor: "black", borderWidth: "0.2vh" }}>Nom de la marque</th>
                                <th style={{ borderColor: "black", borderWidth: "0.2vh" }}>Modifier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map((brand, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{ borderColor: "black", borderWidth: "0.2vh" }}>{brand.fields.name}</td>

                                        <td style={{ borderColor: "black", borderWidth: "0.2vh" }}><a href={"/admin/brands/" + brand.pk}><button style={{ backgroundColor: "black", color: "white" }}>Modifier</button></a></td>

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