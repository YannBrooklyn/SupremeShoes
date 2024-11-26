"use client"

import { getAllBrands } from "@/api/brands"
import { delProduct, getAllProducts, newProduct, putProduct } from "@/api/products"
import { allUsers, delUser, putUser, regUser } from "@/api/users"
import { useCookies } from "next-client-cookies"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"

export default function AdminNewProducts() {

    const [name, setName] = useState("")
    const [price, setPrice] = useState("")
    const [img, setImg] = useState("")
    const [desc, setDesc] = useState("")
    const [newprice, setNewPrice] = useState("")
    const [promo, setPromo] = useState("")
    const [brand_id, setBrandId] = useState("")
    const [gender, setGender] = useState("")
    const [message, setMessage] = useState('')
    const router = useRouter()
    const cookies = useCookies()
    const params = useParams()
    const reg_general = /^[-.a-zA-Z\d]{5,30}$/
    const reg_general_bis = /^[-.a-zA-Z\d\s]{5,50}$/
     
    const reg_id = /[\D]/
    const reg_price = /^([\d]{1,4})+\.+([\d]{2,2})$/
    const reg_img = /^(http:\/\/|https:\/\/)+([a-zA-Z\d\/\.]{5,250})+(.jpg|.png|.jpeg)$/

    const [allBrands, setAllBrands] = useState([])

    if (params.category !== "brands" && params.category !== "products") {
        router.push('/admin')
    }

    if (!cookies.get("token")) {
        router.push('/')
    }

    async function getIds() {

        await getAllBrands()
            .then((result)=>{
                setAllBrands(result.data)
            })
    }



    async function handlePostProduct(event: any) {

        event.preventDefault();
        console.log("OUAI2")

        const data = {
            name: name,
            price: parseFloat(price),
            img: img,
            desc: desc,
            newprice: parseFloat(newprice),
            promo: parseInt(promo),
            brand: parseInt(brand_id),
            gender: parseInt(gender),
            token: cookies.get("token")
        }

        if (reg_general_bis.test(name) === false) {
            return setMessage("Merci de mettre un nom correct.")
        }

        if (reg_price.test(price) === false) {
            return setMessage("Merci de mettre un prix décimal correct.")
        }

        if (reg_img.test(img) === false) {
            return setMessage("Merci de mettre un lien d'image correct.")
        }

        if (reg_general_bis.test(desc) === false) {
            return setMessage("Merci de mettre une description correct.")
        }

        if (reg_price.test(newprice) === false) {
            return setMessage("Merci de mettre un prix décimal correct.")
        }

        if (reg_id.test(brand_id) === true) {
            return setMessage("Erreur de valeur Id Brand")
        }

        if (reg_id.test(promo) === true) {
            return setMessage("Erreur de valeur number Promo")
        }

        if (reg_id.test(gender) === true) {
            return setMessage("Erreur de valeur number Gender")
        }



        

        await newProduct(data)
        .then((result)=> {
            if (result.status === 201) {

                setMessage(result.data.message)
            } else {
                setMessage(result.data.message)

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

    useEffect(() => {
        getIds()
        checkUsersAdmin()

    }, [])

    if (params.category === "products") {
        if (adminState === true) {
            return (
                <section style={{ display: "flex", flexDirection: "column", width: "100%", alignItems: "center", justifyContent: "center" }}>
                    <h2 className="text-3xl">Modifier Produit</h2>
                    <h2>{message}</h2>
                    {cookies.get("token") ?
                        (
                            <form action="" onSubmit={handlePostProduct} className="w-11/12 flex flex-col justify-center items-center h-auto lg:w-4/6" method="post">
                                <div className="w-11/12 flex flex-col justify-center items-center h-auto lg:w-4/6" style={{ backgroundColor: "#EDEDED" }}>
                                    <h4>Nom du produit</h4>
                                    <input pattern="^[a-zA-Z\d\s]{5,80}$"  required value={name} onChange={(b) => setName(b.target.value)} className="w-11/12 lg:w-96" type="text" />
                                    <h4>Prix</h4>
                                    <input pattern="^([\d]{1,3})+\.+([\d]{2,2})$"  required value={price} onChange={(b) => setPrice(b.target.value)} className="w-11/12 lg:w-96" type="text" />
                                    <h4>Image du produit (Lien)</h4>
                                    <input pattern="^(http://|https://)+([a-zA-Z\d\/\.]{5,250})+(.jpg|.png|.jpeg)$" required value={img} onChange={(b) => setImg(b.target.value)} className="w-11/12 lg:w-96" type="text" />
                                    <h4>Description</h4>
                                    <textarea required value={desc} onChange={(b) => setDesc(b.target.value)} className="w-11/12 lg:w-96" ></textarea>
                                    <h4>Prix de promo</h4>
                                    <input pattern="^([\d]{1,3})\.+([\d]{2,2})$"  required value={newprice} onChange={(b) => setNewPrice(b.target.value)} className="w-11/12 lg:w-96" type="text" />
                                    <h4>Promotion ?</h4>
                                    <select value={promo} onChange={(b) => setPromo(b.target.value)} name="" id="">
                                        <option value="0">Choisissez si promo</option>
                                        <option value="1">Non</option>
                                        <option value="2">Oui</option>
                                    </select>
                                    <h4>Marque du produit</h4>
                                    <select value={brand_id} onChange={(b) => setBrandId(b.target.value)} name="" id="">
                                    <option value="0">Choisissez la marque</option>
                                        
                                        {allBrands.map((brand, index)=>{
                                            return (
                                                <option key={index} value={brand.pk}>{brand.fields.name}</option>
                                            )
                                        })}
                                    </select>
                                    <h4>Genre du produit</h4>
                                    <select value={gender} onChange={(b) => setGender(b.target.value)} name="" id="">
                                        <option value="0">Choisissez le genre</option>
                                        <option value="1">Homme</option>
                                        <option value="2">Femme</option>
                                        <option value="3">Mixte</option>
                                    </select>
                                </div>
                                <button className="bg-black rounded-full font-xl h-8 w-28 text-white" >Modifier</button>
                            </form>
                        ) : null} 
                </section>
            )

        } else {
            return (
                <h3>Vous n'avez pas la permission</h3>
            )
        }
        
    }
} 