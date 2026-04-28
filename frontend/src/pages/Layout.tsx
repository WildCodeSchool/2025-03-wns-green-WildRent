import { Outlet } from "react-router"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--beige)] overflow-x-hidden">
      <Navbar />
      <main className="flex-1 pt-14 md:pt-16 pb-28 md:pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
