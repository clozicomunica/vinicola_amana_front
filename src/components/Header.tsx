import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Menu, X } from "lucide-react";
import logo from "../assets/logo.png";
import { useCart } from "../context/useCart";

const navLinks = [
  { path: "/vinhos", label: "Nossos Vinhos" },
  { path: "/sobrenos", label: "Sobre Nós" },
  { path: "/experiencias", label: "Experiências" },
  { path: "/contato", label: "Contato" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const { cart } = useCart();
  const totalQuantity = cart.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(window.location.pathname);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-500 font-['Oswald'] ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md py-2 border-b border-[#89764b]/20"
          : "bg-black py-3"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2"
            onClick={() => {
              closeMenu();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src={logo}
              alt="Logo da Vinícola"
              className="w-12 h-12 object-contain transition-all duration-300 group-hover:rotate-6 group-hover:scale-105"
            />
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-1 text-transform: uppercase">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                className={`relative px-5 py-2 transition-all duration-300 ${
                  activeLink === item.path
                    ? "text-[#89764b]"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                <span className="relative group">
                  {item.label}
                  <span
                    className={`absolute left-0 bottom-0 w-full h-px ${
                      activeLink === item.path
                        ? "bg-[#89764b] scale-100"
                        : "bg-white scale-0 group-hover:scale-100"
                    } transition-all duration-300 origin-left`}
                  ></span>
                </span>
              </Link>
            ))}
          </nav>

          {/* Ícones (Mobile e Desktop) */}
          <div className="flex items-center gap-4">
            {/* Carrinho */}
            <Link
              to="/carrinho"
              className="p-2 relative transition-all duration-200 group"
              aria-label="Ver carrinho"
            >
              <div className="relative">
                <ShoppingCart
                  className={`h-6 w-6 transition-colors duration-300 ${
                    activeLink === "/carrinho"
                      ? "text-[#89764b]"
                      : "text-gray-300 hover:text-white"
                  }`}
                />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#9a3324] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium group-hover:scale-110 transition-transform duration-200 shadow-md">
                    {totalQuantity > 9 ? "9+" : totalQuantity}
                  </span>
                )}
              </div>
            </Link>

            {/* Botão menu mobile */}
            <button
              className="p-2 text-gray-300 hover:text-white md:hidden transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isMenuOpen ? (
                <X className="h-7 w-7" />
              ) : (
                <Menu className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-black shadow-xl">
            <nav className="flex flex-col">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-6 py-5 text-lg uppercase font-medium transition-all duration-200 ${
                    activeLink === item.path
                      ? "text-[#89764b] bg-[#ffffff05]"
                      : "text-gray-300 hover:text-white hover:bg-[#89764b]/10"
                  }`}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
