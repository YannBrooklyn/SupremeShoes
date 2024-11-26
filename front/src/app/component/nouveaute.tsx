"use client"

import { getAllProducts } from "@/api/products"
import { useEffect, useState } from "react"



export function NouveauteHome(){
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
            <h2 style={{fontSize:"5vh", fontWeight:"bold"}}>NOUVEAUTE</h2>
            <div style={{height:"auto", display:"flex" , overflowX:"scroll" }}>
                {products.map((product,index )=>{
                    if (product.fields.gender === 1) {

                        return (
                            <a href={"/homme/chaussures/" + product.pk}>
                            
                                <article key={index} style={{height:"30vh", width:"30vh",display:"flex", flexDirection:"column", textAlign:"center", alignItems:"center", justifyContent:"center"}}> 
                                    <img  style={{height:"20vh", width:"20vh"}} src={product.fields.img} alt={product.fields.name} />
                                    <h4>{product.fields.name}</h4>
                                    <h4>€ {product.fields.price}</h4>
                                </article>
                            </a>
                        )
                    }
                    else if (product.fields.gender === 2) {
                        return (
                            <a href={"/femme/chaussures/" + product.pk}>
                            
                                <article key={index} style={{height:"30vh", width:"30vh",display:"flex", flexDirection:"column", textAlign:"center", alignItems:"center", justifyContent:"center"}}> 
                                    <img  style={{height:"20vh", width:"20vh"}} src={product.fields.img} alt={product.fields.name} />
                                    <h4>{product.fields.name}</h4>
                                    <h4>€ {product.fields.price}</h4>
                                </article>
                            </a>
                        )
                    }
                    else if (product.fields.gender === 3) {
                        return (
                            <a href={"/mixte/chaussures/" + product.pk}>
                            
                                <article key={index} style={{height:"30vh", width:"30vh",display:"flex", flexDirection:"column", textAlign:"center", alignItems:"center", justifyContent:"center"}}> 
                                    <img  style={{height:"20vh", width:"20vh"}} src={product.fields.img} alt={product.fields.name}/>
                                    <h4>{product.fields.name}</h4>
                                    <h4>€ {product.fields.price}</h4>
                                </article>
                            </a>
                        )
                    }
                })}
            </div>
        </section>
    )
}