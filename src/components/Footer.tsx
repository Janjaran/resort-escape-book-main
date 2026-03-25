import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display text-2xl font-bold mb-4">The Serene Escape</h3>
            <p className="font-body text-sm opacity-80 leading-relaxed">
              A luxury coastal resort where tranquility meets sophistication. Experience the perfect
              blend of natural beauty and world-class hospitality.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/rooms", label: "Rooms & Suites" },
                { to: "/booking", label: "Reservations" },
                { to: "/contact", label: "Contact Us" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block font-body text-sm opacity-80 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 font-body text-sm opacity-80">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>123 Coastal Drive, Paradise Bay</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>sansairomualdo@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="font-body text-xs opacity-60">
            © {new Date().getFullYear()} The Serene Escape Resort. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
