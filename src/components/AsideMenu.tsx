import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight, Phone, Mail, MapPin } from "lucide-react";

const asideLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Get Started", path: "/booking" },
];

export default function AsideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-50 bg-white shadow-lg p-2 rounded-r-lg transition-all duration-300 ${
          isOpen ? "left-72" : "left-0"
        }`}
        style={{ left: isOpen ? "288px" : "0px" }}
        aria-label={isOpen ? "Close aside menu" : "Open aside menu"}
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Aside Menu */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold text-gray-900"
            >
              Tevroc<span className="text-blue-600">Tech</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {asideLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${
                      location.pathname === link.path
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Contact Info
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={16} className="text-blue-600" />
                <span>+27 66 253 1653</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={16} className="text-blue-600" />
                <span>smthubakgale@gmail.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin size={16} className="text-blue-600" />
                <span>Mankweng, Polokwane, SA</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="p-4">
            <Link
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-blue-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
