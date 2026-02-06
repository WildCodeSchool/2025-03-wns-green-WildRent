import { Outlet } from "react-router"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export const Layout = () => {
    return(
        <>
            <Navbar />
            <main>
                <Outlet/>
            </main>
            <Footer />
        </>
    )
}