import { ArrowRight, Play } from "lucide-react";
import heroImage from "../assets/hero.jpg";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image com prioridade mobile */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundPosition: "center 20%", // melhor para mobile
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/30 md:from-black/60 md:via-black/40 md:to-transparent" />
      </div>

      {/* Conteúdo com margem para o Header */}
      <div className="relative z-10 w-full pt-24 pb-20 px-4 sm:px-6 lg:px-8 text-center lg:text-left">
        <div className="max-w-4xl mx-auto lg:mx-0">
          {/* Título */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Vinhos Únicos,
            <br />
            <span className="text-gray-300 md:text-white">
              Experiências Inesquecíveis
            </span>
          </h1>

          {/* Descrição */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white mb-6 md:mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Tradição e excelência da Vinícola Amana em cada garrafa.
          </p>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-12 md:mb-0">
            <Link to={"/vinhos"}>
              <button className="cursor-pointer px-6 py-3 sm:px-8 sm:py-4 bg-[#89764b] hover:bg-[#89764b]/90 text-white text-base sm:text-lg font-medium rounded-lg shadow-lg transition-all duration-300 group flex items-center justify-center">
                Explore Nossos Vinhos
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a
              href="https://www.youtube.com/watch?v=VWN9h289xbo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="cursor-pointer px-6 py-3 sm:px-8 sm:py-4 bg-white/10 hover:bg-white/20 text-white text-base sm:text-lg font-medium rounded-lg border border-white/30 transition-all duration-300 flex items-center justify-center group">
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Nossa História
              </button>
            </a>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-sm sm:max-w-md mx-auto lg:mx-0 mt-8">
            <div className="text-center lg:text-left">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                100
              </div>
              <div className="text-white/70 text-xs sm:text-sm">Hectares</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                06
              </div>
              <div className="text-white/70 text-xs sm:text-sm">Uvas</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                06
              </div>
              <div className="text-white text-xs sm:text-sm whitespace-nowrap">
                prêmios internacionais
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 sm:h-3 bg-white/60 rounded-full mt-1 sm:mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
