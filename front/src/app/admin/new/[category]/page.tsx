import AdminNewBrands from "./component/newbrand";
import AdminNewProducts from "./component/newproduct";

export default function AdminNew(){

    return(
        <main className="min-h-screen">
            <AdminNewBrands/>
            <AdminNewProducts/>
        </main>
    )
}