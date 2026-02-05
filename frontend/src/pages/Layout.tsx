import { Outlet } from "react-router"

export const Layout = () => {
    return(
        <>
            {/* Futur NAVBAR*/ }
            <main>
                <Outlet/>
            </main>
            {/* Futur FOOTER*/ }
        </>
    )
}