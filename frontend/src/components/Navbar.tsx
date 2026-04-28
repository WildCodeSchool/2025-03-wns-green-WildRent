import { User, ShoppingCart, LogOut, UserCircle } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  /** Close the dropdown when clicking outside. */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Show/hide entire navbar based on scroll direction. */
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY <= 10) {
        setVisible(true);
      } else if (currentY > lastScrollY.current) {
        setVisible(false);
        setMenuOpen(false);
      } else {
        setVisible(true);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <nav className={`fixed top-0 inset-x-0 z-50 bg-[#fdffe9] shadow-sm overflow-hidden transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"
        }`}>
        <div className="px-4 xl:px-6 2xl:px-24 py-3 lg:py-4">
          <div className="flex items-center justify-between">

            {/* Spacer gauche mobile pour centrer le logo */}
            <div className="w-16 md:hidden" />

            {/* Logo */}
            <div
              className="flex items-center cursor-pointer md:flex-none"
              onClick={() => navigate("/")}
            >
              <span className="font-[family-name:var(--font-title)] font-bold text-2xl lg:text-[28px] tracking-wider text-[#31380d]">
                WILDRENT
              </span>
            </div>

            {/* Search DESKTOP — inside navbar */}
            <div className="hidden md:flex flex-[2] mx-6 xl:mx-12">
              <div className="mx-auto w-full flex justify-center">
                <SearchBar />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5 md:gap-3">

              {/* Auth button */}
              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="flex flex-col items-center gap-2 text-[#31380d] hover:text-[#87a700] transition-colors"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-6 h-6 md:w-5 md:h-5 rounded-full object-cover"
                      />
                    ) : (
                      <>
                        <User size={24} strokeWidth={2} className="md:hidden" />
                        <User size={20} strokeWidth={2} className="hidden md:block" />
                      </>
                    )}
                    <span className="hidden md:block text-[11px] font-medium font-[family-name:var(--font-text)] leading-none">
                      {user.firstname !== "non renseigné" ? user.firstname : "Mon compte"}
                    </span>
                  </button>

                  {/* Dropdown menu */}
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#e5e7eb] rounded-xl shadow-lg py-1 z-50">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-[family-name:var(--font-text)] text-[#31380d] hover:bg-[#fdffe9] transition-colors"
                      >
                        <UserCircle size={16} strokeWidth={2} />
                        Mon profil
                      </button>
                      <div className="border-t border-[#e5e7eb] mx-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-[family-name:var(--font-text)] text-[#31380d] hover:bg-[#fdffe9] transition-colors"
                      >
                        <LogOut size={16} strokeWidth={2} />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="flex flex-col items-center gap-2 text-[#31380d] hover:text-[#87a700] transition-colors"
                >
                  <User size={24} strokeWidth={2} className="md:hidden" />
                  <User size={20} strokeWidth={2} className="hidden md:block" />
                  <span className="hidden md:block text-[11px] font-medium font-[family-name:var(--font-text)] leading-none">
                    Se connecter
                  </span>
                </button>
              )}

              {/* Cart */}
              <button
                onClick={() => navigate("/cart")}
                className="flex flex-col items-center gap-2 text-[#31380d] hover:text-[#87a700] transition-colors"
              >
                <ShoppingCart size={24} strokeWidth={2} className="md:hidden" />
                <ShoppingCart size={20} strokeWidth={2} className="hidden md:block" />
                <span className="hidden md:block text-[11px] font-medium font-[family-name:var(--font-text)] leading-none">
                  Mon panier
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== SEARCH MOBILE — floating over content, no background ===== */}
      <div
        className={`fixed left-0 right-0 z-40 px-4 md:hidden transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"
          }`}
        style={{ top: "4rem" }}
      >
        <SearchBar />
      </div>
    </>
  );
};
