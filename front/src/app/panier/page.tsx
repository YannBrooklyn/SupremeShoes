import ButtonPayment from "./component/buttonpayment";
import ProductsPanier from "./component/products";
import TotalPrice from "./component/totalprice";

export default function Panier(){
    return(
        <main className="min-h-screen lg:text-center">
            <h2 className="text-3xl font-bold" >PANIER</h2>
            <ProductsPanier/>
            <TotalPrice/>
            
        </main>
    )
}