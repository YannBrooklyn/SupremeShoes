import Image from "next/image";
import { NouveauteHome } from "./component/nouveaute";
import BrandHome from "./component/brand";
import { PromoHome } from "./component/promo";
import { Burger } from "./component/navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      
      <NouveauteHome/>
      <BrandHome/>
      <PromoHome/>
    </main>
  );
}
