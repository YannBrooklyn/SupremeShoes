"use client"

import { delBrand, getAllBrands, putBrands } from "@/api/brands"
import { delProduct, getAllProducts, putProduct } from "@/api/products"
import { allUsers } from "@/api/users"
import { useCookies } from "next-client-cookies"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"
export default function AdminBrands() {

    const [name, setName] = useState("")
    const [img, setImg] = useState("")
    const [message, setMessage] = useState('')
    const router = useRouter()
    const cookies = useCookies()
    const idBrand: number = parseInt(useParams().refid)
    const params = useParams()
    const reg_general = /^[-.a-zA-Z\d]{5,30}$/
    const reg_general_bis = /^[-.a-zA-Z\d\s]{5,50}$/

    const reg_id = /[\D]/
    const reg_price = /^([\d]{1,4})+\.+([\d]{2,2})$/
    const reg_img = /^(http:\/\/|https:\/\/)+([a-zA-Z\d\/\.]{5,250})+(.jpg|.png|.jpeg)$/


    if (params.category !== "users" && params.category !== "brands" && params.category !== "products") {
        router.push('/')
    }

    if (!cookies.get("token")) {
        router.push('/')
    }

    async function getIds() {

        await getAllBrands()
            .then((result) => {
                if (params.category === "brands") {
                    let arrayId: number[] = []
                    result.data.forEach(element => {
                        arrayId.push(element.pk)
                    });
                    if (!arrayId.includes(parseInt(params.refid))) {
                        router.push('/admin')
                    }
                }
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


    function ModalDelBrand() {
        const dialogBrand = document.querySelector("#dialogBrand")
        dialogBrand.style.display = "flex"
    }

    async function handlePutBrand(event: any) {

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

        if (reg_id.test(idBrand.toString()) === true) {
            return setMessage("IdUser corrompu")
        }

        await putBrands(data, idBrand)
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

    useEffect(() => {
        getIds()
        checkUsersAdmin()
        if (!cookies.get("token")) {
            router.push("/")
        }
    }, [adminState])




    if (params.category === "brands") {
        if (adminState === true) {

            return (
                <section style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <h2 className="text-3xl">Modifier Marque</h2>
                    <h2>{message}</h2>
                    {cookies.get("token") ?
                        (
                            <form action="" onSubmit={handlePutBrand} className="w-11/12 flex flex-col justify-center items-center h-auto lg:w-4/6" method="post">
                                <div className="w-11/12 flex flex-col justify-center items-center h-auto lg:w-4/6" style={{ backgroundColor: "#EDEDED" }}>
                                    <h4>Nom de la marque</h4>
                                    <input pattern="^[a-zA-Z\d\s]{5,80}$" required value={name} onChange={(b) => setName(b.target.value)} className="w-11/12 lg:w-96" type="text" />
                                    <h4>Image de la marque (Lien)</h4>
                                    <input pattern="^(http://|https://)+([a-zA-Z\d\/\.]{5,250})+(.jpg|.png|.jpeg)$" required value={img} onChange={(b) => setImg(b.target.value)} className="w-11/12 lg:w-96" type="text" />

                                </div>
                                <button className="bg-black rounded-full font-xl h-8 w-28 text-white" >Modifier</button>
                                <button type="button" className="rounded-full font-xl h-8 w-28 text-black" onClick={ModalDelBrand} style={{ backgroundColor: "#EDEDED" }}>Supprimer</button>
                            </form>
                        ) : null}
                    <ModalDeleteBrand />
                </section>
            )
        } else {
            
            return (
                <h3>Vous n'avez pas la permission</h3>
            )
        }
    }
}

export function ModalDeleteBrand() {
    const idBrand: number = parseInt(useParams().refid)
    const [message, setMessage] = useState('')
    const router = useRouter()
    const reg_id = /[\D]/


    async function handleDeleteBrand(event: any) {
        event.preventDefault()

        if (reg_id.test(idBrand.toString()) === true) {
            return setMessage("Id corrompu")
        }

        await delBrand(idBrand)
            .then((result) => {
                setMessage(result.data.message)
                setTimeout(() => {
                    router.push('/admin')
                }, 1200);
            })
    }

    function ModalDelBrand() {
        const dialogBrand = document.querySelector("#dialogBrand")
        dialogBrand.style.display = "none"
    }

    return (
        <div id="dialogBrand" style={{ display: "none", textAlign: "center", justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.780)", height: "100%", width: "100%", position: "fixed", top: 0 }}>

            <div style={{ position: "fixed" }} >
                <form action="" onSubmit={handleDeleteBrand} className="w-11/12 flex flex-col justify-center items-center h-96 lg:w-4/6" method="post">
                    <div className="w-11/12 flex flex-col justify-center items-center h-96 lg:w-4/6" style={{ backgroundColor: "#EDEDED" }}>
                        <h3>{message}</h3>
                        <br />
                        <p>Êtes-vous sûr de vouloir supprimer cette marque ?</p>
                    </div>
                    <button className="bg-black rounded-full font-xl h-8 w-28 text-white">Oui</button>
                    <button type="button" className="rounded-full font-xl h-8 w-28 text-black" onClick={ModalDelBrand} style={{ backgroundColor: "#EDEDED" }}>Non</button>

                </form>
            </div>
        </div>
    )
}