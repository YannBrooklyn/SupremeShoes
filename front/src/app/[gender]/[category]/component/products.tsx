"use client"

import { getAllProducts } from "@/api/products"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProductsCategory(){
    const theGender = useParams().gender
    const theCategory = useParams().category
    const router = useRouter()
    let idGender = 1
    
    if (theGender.toLowerCase() === "hommes" || theGender.toLowerCase() === "homme"){
        idGender = 1
    }
    else if (theGender.toLowerCase() === "femmes" || theGender.toLowerCase() === "femme") {
        idGender = 2
    } else {
        idGender = 3
    }
    console.log(theGender)
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


    const [products, setProducts] = useState([])

    async function AllProducts() {

        await getAllProducts()
        .then((result)=>{
            console.log(result.data)
            setProducts(result.data)
        })
        .catch((error)=>{
            console.log(error)
        })

    }
        useEffect(()=>{
            AllProducts()
        },[])


    return(
        <section>
            <h2 style={{fontSize:"4vh", fontWeight:"bold"}}>{theCategory.toUpperCase()} {theGender.toUpperCase()}</h2>
            <div style={{display:"flex", flexWrap:"wrap", justifyContent:"center"}}>
                {products.map((product, index)=>{
                    if (idGender === product.fields.gender || product.fields.gender === 3) {
                        if (product.fields.gender === 1) {
                            return (
                                <a key={index} href={"/homme/chaussures/" + product.pk}>

                                    
                                    <article  style={{height:"25vh", width:"25vh",display:"flex", flexDirection:"column", textAlign:"center", alignItems:"center", justifyContent:"center"}}> 
                                        <img style={{height:"20vh", width:"20vh"}} src={product.fields.img} alt={product.fields.name} />
                                        <h4>{product.fields.name}</h4>
                                        {product.fields.promo === 2 ?
                                            (
                                                <div style={{display:"flex", gap:"1vh"}}>
                                                    <h4 style={{textDecorationLine:"line-through", textDecorationColor:"red"}}>€ {product.fields.price}</h4>
                                                    <h4>€ {product.fields.newprice} !</h4>
                                                </div>
                                                
                                            ) : <h4>€ {product.fields.price}</h4>}
                                    </article>
                                </a>
                            )
                        }
                        else if (product.fields.gender === 2) {
                            return (
                                <a key={index} href={"/femme/chaussures/" + product.pk}>

                                    
                                    <article  style={{height:"25vh", width:"25vh",display:"flex", flexDirection:"column", textAlign:"center", alignItems:"center", justifyContent:"center"}}> 
                                        <img style={{height:"20vh", width:"20vh"}} src={product.fields.img} alt={product.fields.name} />
                                        <h4>{product.fields.name}</h4>
                                        {product.fields.promo === 2 ?
                                            (
                                                <div style={{display:"flex", gap:"1vh"}}>
                                                    <h4 style={{textDecorationLine:"line-through", textDecorationColor:"red"}}>€ {product.fields.price}</h4>
                                                    <h4>€ {product.fields.newprice} !</h4>
                                                </div>
                                                
                                            ) : <h4>€ {product.fields.price}</h4>}
                                    </article>
                                </a>
                            )
                        }
                        else if (product.fields.gender === 3) {
                            return (
                                <a key={index} href={"/mixte/chaussures/" + product.pk}>

                                    
                                    <article  style={{height:"25vh", width:"25vh",display:"flex", flexDirection:"column", textAlign:"center", alignItems:"center", justifyContent:"center"}}> 
                                        <img style={{height:"20vh", width:"20vh"}} src={product.fields.img} alt={product.fields.name} />
                                        <h4>{product.fields.name}</h4>
                                        {product.fields.promo === 2 ?
                                            (
                                                <div style={{display:"flex", gap:"1vh"}}>
                                                    <h4 style={{textDecorationLine:"line-through", textDecorationColor:"red"}}>€ {product.fields.price}</h4>
                                                    <h4>€ {product.fields.newprice} !</h4>
                                                </div>
                                                
                                            ) : <h4>€ {product.fields.price}</h4>}
                                    </article>
                                </a>
                            )
                        }
                    }
                })}
            </div>
        </section>
    )
}