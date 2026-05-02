import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { 
    name: "Services", 
    path: "/services",
    dropdown: [
      { name: "Web Development", path: "/services#web" },
      { name: "Mobile Apps", path: "/services#mobile" },
      { name: "Desktop Apps", path: "/services#desktop" },
      { name: "UI/UX Design", path: "/services#design" },
    ]
  },
  { name: "Pricing", path: "/pricing" },
  { 
    name: "Projects", 
    path: "/projects",
    dropdown: [
      { name: "Portfolio", path: "/projects#portfolio" },
      { name: "Case Studies", path: "/projects#cases" },
    ]
  },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { 
    name: "Apps", 
    path: "/apps",
    dropdown: [
      { name: "Workspace", path: "/apps", description: "Collaborative JSON editor & project management" },
      { name: "More Coming Soon", path: "#", description: "New apps on the way...", disabled: true },
    ]
  },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/src/assets/tevrocsoft-logo.svg" 
                alt="TevrocSoft" 
                className="h-12 w-auto"
              />
            </Link>
          </div>

        {/* 👇 Title */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2">
            <span className="text-lg font-bold text-gray-900">
            TevrocSoft
            </span>
        </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" ref={dropdownRef}>
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.dropdown ? (
                  <button
                    onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                    className={`flex items-center gap-1 px-4 py-2 text-base font-medium transition-colors duration-200 ${
                      location.pathname === link.path
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {link.name}
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-200 ${openDropdown === link.name ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`px-4 py-2 text-base font-medium transition-colors duration-200 ${
                      location.pathname === link.path
                        ? "text-blue-600"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}

                {link.dropdown && openDropdown === link.name && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {link.dropdown.map((item) => (
                      item.disabled ? (
                        <div
                          key={item.name}
                          className="block px-4 py-3 text-base text-gray-400 cursor-not-allowed"
                        >
                          <div className="font-medium">{item.name}</div>
                          {"description" in item && item.description && (
                            <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
                          )}
                        </div>
                      ) : (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-4 py-3 hover:bg-blue-50 transition-colors duration-150"
                        >
                          <div className="font-medium text-gray-900">{item.name}</div>
                          {"description" in item && item.description && (
                            <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                          )}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              to="/booking"
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                      className="flex items-center justify-between w-full py-3 text-base font-medium text-gray-700"
                    >
                      {link.name}
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${openDropdown === link.name ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown === link.name && (
                      <div className="pl-4 space-y-1 border-l-2 border-blue-100 ml-2">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className="block py-2.5 text-base text-gray-600 hover:text-blue-600"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.path}
                    className={`block py-3 text-base font-medium ${
                      location.pathname === link.path
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
            <Link
              to="/booking"
              className="block text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full font-medium mt-4"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
