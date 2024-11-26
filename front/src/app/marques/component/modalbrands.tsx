"use client"

import { getAllBrands } from "@/api/brands"
import { useEffect, useState } from "react"

export default function ModalBrands() {

    const [brands, setBrands] = useState([])

    async function allBrands() {

        
        
        await getAllBrands()
        .then((result)=>{
            setBrands(result.data)
        })

     
    }


    useEffect(()=>{
        allBrands()
    },[])
    return(
        <section className="w-full text-center">
            <h3 className="font-bold text-3xl">MARQUES</h3>
            <div className="w-full flex flex-wrap justify-center gap-3">

            
            {brands.map((brand, index)=>{
                return(
                    <a href={"/marques/" + brand.fields.name}>

                        <div key={index} className="h-40 w-40 text-center">
                            <img src={brand.fields.img} className="h-11/12 w-11/12" alt={brand.fields.name} />
                            <h3>{brand.fields.name}</h3>
                        </div>
                    </a>
                )
            })}
            </div>
        </section>
    )
}