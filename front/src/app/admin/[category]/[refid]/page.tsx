import AdminBrands from "./component/adminbrands";
import AdminProducts from "./component/adminproducts";
import AdminUsers from "./component/adminuser";

export default function AdminData(){

    return(
        <main className="min-h-screen">
            <AdminUsers/>
            <AdminProducts/>
            <AdminBrands/>
        </main>
    )
}