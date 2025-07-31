import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.pageYOffset > 200);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className={`fixed left-6 bottom-10 bg-[#89764b] text-white rounded-full shadow-lg transition-all duration-300 z-50 flex items-center justify-center ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${
        isHovered
          ? "bg-[#756343] shadow-xl scale-110 ring-2 ring-[#a08d5f] ring-opacity-40"
          : "scale-100"
      }`}
      style={{
        width: "52px",
        height: "52px",
        backdropFilter: "blur(4px)",
        backgroundColor: isHovered ? "#756343" : "rgba(137, 118, 75, 0.9)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Efeito de pulsação sutil */}
      <div
        className={`absolute inset-0 rounded-full border border-[#89764b] ${
          isHovered ? "animate-ping opacity-20" : "opacity-0"
        }`}
        style={{ animationDuration: "1500ms" }}
      ></div>

      {/* Ícone com animação */}
      <ChevronUp
        className={`w-6 h-6 transition-transform duration-300 ${
          isHovered ? "translate-y-[-2px]" : "translate-y-0"
        }`}
        strokeWidth={2.5}
      />

      {/* Tooltip */}
      <div
        className={`absolute right-full mr-3 bg-black text-white text-sm px-3 py-1 rounded whitespace-nowrap transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        Voltar ao topo
        <div className="absolute top-1/2 right-0 transform translate-x-1 -translate-y-1/2 w-2 h-2 bg-black rotate-45"></div>
      </div>
    </button>
  );
};

export default ScrollToTopButton;
