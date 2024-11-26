"use client"
export default function Navbar(){

    function ShowBurger(){
        document.querySelector("#burger").style.display = "block";
    }

    return(
        <nav className="flex flex-col" style={{backgroundColor:"black", height:"100%", width:"100%"}}>
            <ul className="flex flex-row justify-between items-center w-full h-full lg:hidden">
              <li onClick={ShowBurger} ><img src="/images/icon/iconburger.png" alt="Burger"/></li>
              <li></li>
              <a href="/panier"><li><img src="/images/icon/iconshop.png" alt="Shop"/></li></a>
            </ul>
            <ul className="hidden lg:flex lg:text-2xl lg:bold lg:text-white lg:flex-row lg:justify-between lg:items-center lg:w-full lg:h-full">
                <a href="/marques"><li>MARQUES</li></a>
                <a href="/homme/chaussures"><li>HOMME</li></a>
                <a href="/femme/chaussures"><li>FEMME</li></a>
                <a href="/promos"><li>PROMOS</li></a>
            </ul>
            <ul className="hidden lg:flex lg:flex-row lg:gap-4 lg:text-right lg:w-full">
                <a href="/"><li><img style={{height:"2.5vh", width:"2.5vh"}} src="/images/icon/iconhome.jpg" alt="Shop"/></li></a>
                <a href="/profil"><li><img style={{height:"2.5vh", width:"2.5vh"}} src="/images/icon/iconprofil.jpeg" alt="Profil"/></li></a>
                <a href="/panier"><li><img style={{height:"2.5vh", width:"2.5vh"}} src="/images/icon/iconshop.png" alt="Shop"/></li></a>
            </ul>
            <Burger/>
        </nav>
    )
}


export function Burger() {

    function HideBurger(){
        document.querySelector("#burger").style.display = "none";
    }
    return(
        <div id="burger" style={{backgroundColor:"black", position:"fixed", top:"0", left:"0", height:"100%", width:"30vh", color:"white"}} className="text-2xl hidden lg:hidden">
            <h4 onClick={HideBurger} style={{position:"absolute", top:"0", right:"0"}}>X</h4>
            <ul>
                <a href="/"><li>Home</li></a>
                <a href="/marques"><li>Marques</li></a>
                <a href="/homme/chaussures"><li>Homme</li></a>
                <a href="/femme/chaussures"><li>Femme</li></a>
                <a href="/promos"><li>Promos</li></a>
            </ul>
        </div>
    )
}



