"use client"

import { getAllProducts } from "@/api/products"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ModalPromo(){
    const theGender = useParams().gender
    const theCategory = useParams().category
    const router = useRouter()
    let idGender = 1
    
    
   


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

    if (products.length !== 0) {

    
    return(
        <section>
            <h2 className="text-center text-3xl font-bold">PROMOTIONS</h2>
            <div style={{display:"flex", flexWrap:"wrap", justifyContent:"center"}}>
                {products.map((product, index)=>{
                    if (product.fields.promo === 2) {
                        
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
    } else {
        return(
            <h4>Aucune promotions.</h4>
        )
    }
}