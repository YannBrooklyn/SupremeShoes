"use client"
import { getAllProducts } from "@/api/products"
import { allUsers } from "@/api/users"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"
import { useCookies } from "next-client-cookies"

export default function ModalProducts(){
    const cookies = useCookies()

    const [products, setProducts] = useState([])

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

    async function getProducts() {
        await getAllProducts()
        .then((result)=>{
            setProducts(result.data)
        })
    }

    useEffect(()=>{
        getProducts()
        checkUsersAdmin()
        
    },[adminState])

    if (adminState === true) {

        return(
            <section style={{display:"flex", flexDirection:"column", width:"100%", alignItems:"center", justifyContent:"center"}}>
                
                <div style={{backgroundColor:"#EDEDED", width:"90%", height:"55vh", display:"flex", flexDirection:"column", justifyContent:"center", overflowY:"scroll"}}>
                    <h3 className="text-center text-2xl" >Produits</h3> 
                    <table style={{borderColor:"black", borderWidth:"0.2vh"}}>
                        <thead>
                            <tr>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Nom Produit</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Prix</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Description</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Prix Promo</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Promo</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Marque</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Genre</th>
                                <th style={{borderColor:"black", borderWidth:"0.2vh"}}>Modifier</th>
                            </tr>
                        </thead>
                        <tbody>
                        {products.map((product, index)=>{
                            return (
                            <tr key={index}>
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}>{product.fields.name}</td>
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}>{product.fields.price}</td>
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}>{product.fields.desc.substring(0,10) + "..."}</td>
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}>{product.fields.newprice}</td>
                                {product.fields.promo === 1 ? (
                                    <td style={{borderColor:"black", borderWidth:"0.2vh"}}>Non</td>
                                    ) : (
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}>Oui</td>
                                    )
                                }
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}>{product.fields.brand__name}</td>
                                {
                                    product.fields.gender === 1 ? (
                                        <td style={{borderColor:"black", borderWidth:"0.2vh"}}>Homme</td>
                                    ) : null
                                }
    
                                {
                                    product.fields.gender === 2 ? (
                                        <td style={{borderColor:"black", borderWidth:"0.2vh"}}>Femme</td>
                                    ) : null
                                }
           
                                {
                                    product.fields.gender === 3 ? (
                                        <td style={{borderColor:"black", borderWidth:"0.2vh"}}>Mixte</td>
                                    ) : null
                                }
                                <td style={{borderColor:"black", borderWidth:"0.2vh"}}><a href={"/admin/products/" + product.pk}><button style={{backgroundColor:"black", color:"white"}}>Modifier</button></a></td>
                                 
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