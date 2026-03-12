import { Link } from "react-router-dom";
import { Keyboard, Github, Twitter, Instagram } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-surface/50 mt-auto">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Keyboard className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground-strong">Qwerty</span>
          </div>
          <p className="text-sm text-foreground max-w-xs">
            Build your dream mechanical keyboard with an easy and fun customization experience.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground-strong mb-4">Navigate</h4>
          <div className="flex flex-col gap-2">
            {[{ to: "/", l: "Home" }, { to: "/builder", l: "Builder" }, { to: "/products", l: "Products" }, { to: "/community", l: "Community" }, { to: "/about", l: "About" }].map((lnk) => (
              <Link key={lnk.to} to={lnk.to} className="text-sm text-foreground hover:text-foreground-strong transition-colors">{lnk.l}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground-strong mb-4">Support</h4>
          <div className="flex flex-col gap-2 text-sm text-foreground">
            <span>contact@qwerty.build</span>
            <span>FAQ</span>
            <span>Shipping & Returns</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground-strong mb-4">Follow Us</h4>
          <div className="flex gap-3">
            {[Github, Twitter, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="p-2 rounded-md bg-accent hover:bg-accent/80 text-foreground-strong transition-colors">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Qwerty. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
