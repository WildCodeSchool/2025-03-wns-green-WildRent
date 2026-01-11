import { Instagram, Facebook, Twitter } from "lucide-react";
import { footerStyles as s } from "../Footer/footer.styles";

export const Footer = () => {
  return (
    <footer className={s.wrapper}>
      <div className="w-full">
        {/* Desktop & Tablet */}
        <div className={s.desktop.container}>
          <span className={s.desktop.logo}>WILDRENT</span>

          <nav className={s.desktop.nav}>
            <a href="/contact">Contact</a>
            <a href="/privacy">Données personnelles</a>
            <a href="/cookies">Gestion des cookies</a>
            <a href="/accessibility">Accessibilité</a>
          </nav>

          <div className={s.desktop.social}>
            <Instagram size={18} className={s.desktop.icon} />
            <Facebook size={18} className={s.desktop.icon} />
            <Twitter size={18} className={s.desktop.icon} />
          </div>
        </div>

        {/* Mobile */}
        <div className={s.mobile.container}>
          <span className={s.mobile.logo}>WILDRENT</span>

          <nav className={s.mobile.nav}>
            <a href="/contact">Contact</a>
            <span className={s.mobile.divider} />
            <a href="/privacy">Données personnelles</a>
            <span className={s.mobile.divider} />
            <a href="/cookies">Gestion des cookies</a>
            <span className={s.mobile.divider} />
            <a href="/accessibility">Accessibilité</a>
          </nav>

          <div className={s.mobile.social}>
            <Instagram size={20} className={s.mobile.icon} />
            <Facebook size={20} className={s.mobile.icon} />
            <Twitter size={20} className={s.mobile.icon} />
          </div>
        </div>
      </div>
    </footer>
  );
};
