"use client"

import { getAllProducts, getOneProduct } from "@/api/products"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react" 
import { useCookies } from "next-client-cookies"
import { newCommande } from "@/api/commandes"

export default function Article(){

    const idProduct = useParams().refproduct
    const theGender = useParams().gender
    const [product, setProduct] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const router = useRouter()
    const refproduct = useParams().refproduct
    let idGender = 0
    const cookie = useCookies()
    const [message, setMessage] = useState("")

    if (theGender.toLowerCase() === "hommes" || theGender.toLowerCase() === "homme"){
        idGender = 1
    }
    else if (theGender.toLowerCase() === "femmes" || theGender.toLowerCase() === "femme") {
        idGender = 2
    } else {
        idGender = 3
    }

    async function theOneProduct() {
        
        await getOneProduct(parseInt(idProduct))
        .then((result)=>{ 
            setProduct(result.data[0].fields)
            
        })
    }

    if (useParams().gender.toLowerCase() !== "hommes" && useParams().gender.toLowerCase() !== "homme" && useParams().gender.toLowerCase() !== "hommes" && useParams().gender.toLowerCase() !== "femmes" && useParams().gender.toLowerCase() !== "femme" && useParams().gender.toLowerCase() !== "mixte") {
        router.push('/')
    }

    if (useParams().category.toLowerCase() !== "chaussures" && useParams().category.toLowerCase() !== "chaussure" && useParams().category.toLowerCase() !== "promos" && useParams().category.toLowerCase() !== "promo" && useParams().category.toLowerCase() !== "marques" && useParams().category.toLowerCase() !== "marque") {
        router.push('/')
    }

    if (useParams().gender.toLowerCase() === "hommes" || useParams().gender.toLowerCase() === "homme" || useParams().gender.toLowerCase() === "femme" || useParams().gender.toLowerCase() === "femmes" || useParams().gender.toLowerCase() === "mixte"){
        if (useParams().category.toLowerCase() !== "chaussures" && useParams().category.toLowerCase() !== "chaussure"){
            router.push('/')
        }
    }
    console.log(product.gender)

    async function AllProducts() {

        await getAllProducts()
        .then((result)=>{
            console.log(result.data)
            setAllProducts(result.data)
            let arrayOfIDs:number[] = []
            result.data.forEach(element => {
                arrayOfIDs.push(element.pk)
            });
            if (arrayOfIDs.includes(parseInt(refproduct)) === false) {
                router.push('/')
            }
        })
        .catch((error)=>{
            console.log(error)
        }) 
    } 
    
    useEffect(()=>{
        theOneProduct()
        AllProducts()
        
    },[])

    useEffect(()=>{
        if (product.gender !== undefined) {
            if (idGender !== parseInt(product.gender)) {
                router.push('/')
            }
        }
    }, [product])

    async function addProductShop() {

        if (cookie.get("token")) {
            const data = {
                product: parseInt(idProduct),
                isDelivred: false,
                isCommanded: false,
                token: cookie.get('token')
            }
    
            await newCommande(data)
                .then((result)=>{
                    if (result.status === 201) {

                        router.push("/panier")
                    } else {
                        setMessage(result.response.data.message)
                    }
                })
        } else {
            router.push("/connexion")
        }

        

    }
    


    return(
        <section>
            <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", gap:"2vh"}}>
                <div style={{width:"100%", textAlign:"left"}}>
                    <h3 className="lg:text-center" style={{fontSize:"4vh"}}>{product.name}</h3>

                    <h4 className="lg:text-center" style={{fontSize:"2vh"}}>Chaussure pour {theGender.substring(0, 1).toUpperCase() + theGender.substring(1).toLowerCase()}</h4>
                    {product.promo === 2 ?
                        (
                            <>
                                <h4 className="lg:text-center" style={{textDecorationLine:"line-through", textDecorationColor:"red"}}>€ {product.price}</h4>
                                <h4 className="lg:text-center">€ {product.newprice} !</h4>
                            </>
                        ) : (

                                <h4 className="lg:text-center" style={{fontSize:"2vh"}}>€ {product.price}</h4>
                            )
                        }
                </div>
                <img src={product.img} alt={product.name} className="h-80 w-80 lg:h-96 lg:w-96"  />
                <p className="h-80 w-80 text-center">{product.desc}</p>
                <h3>{message}</h3>
                <button className="bg-black w-72 rounded-full text-xl text-white h-12" onClick={addProductShop} >AJOUTER AU PANIER</button>
                
            </div>
            
        </section>
    )
}