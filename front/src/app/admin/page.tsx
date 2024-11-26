import ModalBrands from "./component/modalbrands";
import ModalProducts from "./component/modalproduct";
import ModalUser from "./component/modaluser";

export default function Admin(){
    return (
        <main className="min-h-screen">
            <h2 className="text-3xl font-bold text-center">PANNEAU ADMIN</h2>
            
            <section className="flex flex-col gap-12">

                <ModalUser/>
                <ModalProducts/>
                <ModalBrands/>
            </section>
        </main>
    )
}