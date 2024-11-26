"use client"

import { getAllProducts } from "@/api/products"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProductBrand(){
    const [products, setProducts] = useState([])
    const brandParams: string = useParams().brand
    const router = useRouter()
    const [message, setMessage] = useState("")
    async function allProducts(){

        await getAllProducts()
        .then((result)=>{
            setProducts(result.data)
            let arrayVerify: string[] = []
            result.data.forEach(element => {
                arrayVerify.push(element.fields.brand__name)
            });
            if (arrayVerify.includes(brandParams) === false) {
                setMessage("Aucun article pour cette marque pour le moment.")
                setTimeout(() => {
                    router.push("/marques")
                }, 1300);
            }
        })

    }

    useEffect(()=>{
        allProducts()

    },[])
    return(
        <section className="flex justify-center gap-4 flex-wrap">
            <h3 style={{color:"black"}} className="text-xl">{message}</h3>
            {products.map((product, index)=>{
                    if (brandParams === product.fields.brand__name) {
                        return (
                            <article key={index} style={{height:"25vh", width:"25vh",display:"flex", flexDirection:"column", textAlign:"center", alignItems:"center", justifyContent:"center"}}> 
                                <img style={{height:"20vh", width:"20vh"}} src={product.fields.img} alt={product.fields.name} />
                                <h4>{product.fields.name}</h4>
                                {product.fields.promo === 2 ?
                                    (
                                        <div style={{display:"flex", gap:"1vh"}}>
                                            <h4 style={{textDecorationLine:"line-through", textDecorationColor:"red"}}>€ {product.fields.price}</h4>
                                            <h4>€ {product.fields.newprice} !</h4>
                                        </div>
                                        
                                    ) : (
                                        <h4>€ {product.fields.price}</h4>
                                    )}
                            </article>
                        )
                    }
                })}
        </section>
    )
}