import { Outlet } from "react-router"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--beige)]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};