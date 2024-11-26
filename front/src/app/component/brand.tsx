"use client"
import { getAllBrands } from "@/api/brands"
import { useEffect, useState } from "react"

export default function BrandHome() {

    const [brands, setBrands] = useState([])

    async function AllBrands() {

        await getAllBrands()
        .then((result)=>{
            console.log(result.data)
            setBrands(result.data)
        })
        .catch((error)=>{
            console.log(error)
        })

    }
        useEffect(()=>{
            AllBrands()
        },[])


    return(
        <section>
            <h2 style={{fontSize:"5vh", fontWeight:"bold"}}>NOS MARQUES</h2>
            <div style={{backgroundColor:"black", width:"100%", height:"20vh", display:"flex", flexDirection:"row", overflowX:"scroll", alignItems:"center", gap:"5vh"}}>
            {brands.map((brand, index)=>{
                return (
                    <a key={index} href={"/marques/" + brand.fields.name}>
                        <img  style={{maxHeight:"10vh", maxWidth:"20vh"}} src={brand.fields.img} alt={brand.fields.name} />

                    </a>
                )
            })}
            
            </div>
        </section>
    )
}