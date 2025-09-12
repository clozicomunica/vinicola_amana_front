import { Grape, Award, Heart, Users, ChevronRight } from "lucide-react";
import wineTasting from "../assets/taças-bg.jpg";

const features = [
  {
    icon: Grape,
    title: "Nossas Uvas",
    description:
      "Abrangemos quase 100 hectares de terras, com 11 hectares dedicados ao cultivo de videiras francesas, incluindo Syrah, Cabernet Sauvignon, Cabernet Franc, Malbec, Sauvignon Blanc e Chenin Blanc. Também cultivamos cafés especiais, oliveiras e preservamos áreas de matas nativas.",
  },
  {
    icon: Award,
    title: "Vinhos Premiados",
    description:
      "Alguns rótulos foram premiados com medalhas de Prata e Bronze na Decanter 2024 e 2025. Confira-os na sessão premiados.",
  },
  {
    icon: Heart,
    title: "Paixão pelo Terroir",
    description:
      "Somos uma vinícola focada na experiência do cliente. Cada detalhe, da arquitetura à escolha de uvas, proporciona imersão na cultura Amana.",
  },
  {
    icon: Users,
    title: "Experiências Únicas",
    description:
      "Visitas guiadas, vindimas, eventos e outras experiências fazem parte do nosso dia a dia. Confira nosso calendário na aba Agenda.",
  },
];

// Componente para cada feature
const FeatureCard = ({ icon: Icon, title, description }: any) => (
  <div className="border border-[#9c9c9c]/50 rounded-lg hover:shadow-md transition-all hover:border-[#9a3324]/30 bg-black p-4 sm:p-5 w-full">
    <div className="flex items-start space-x-3 sm:space-x-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
      </div>
      <div>
        <h3 className="text-white text-sm sm:text-base mb-1 sm:mb-2">{title}</h3>
        <p className="text-[#9c9c9c] text-xs sm:text-sm">{description}</p>
      </div>
    </div>
  </div>
);

// Componente para badges ("Rótulos" e "Prêmios")
const Badge = ({ value, label, position }: any) => (
  <div
    className={`absolute ${position} bg-white/95 backdrop-blur-sm border border-[#9c9c9c]/50 rounded-lg p-3 sm:p-4 shadow w-24 sm:w-auto text-center`}
  >
    <div className="text-lg sm:text-xl lg:text-2xl text-black">{value}</div>
    <div className="text-xs sm:text-sm text-[#9c9c9c]">{label}</div>
  </div>
);

const AboutSection = () => (
  <section className="py-12 lg:py-24 bg-[#f5f5f5] overflow-hidden w-full font-['Oswald']">
    <div className="container mx-auto px-4 sm:px-6 w-full">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start w-full">
        {/* Texto e features */}
        <div className="order-2 lg:order-1 w-full space-y-6 lg:space-y-8">
          <div>
            <h2 className="text-black text-2xl sm:text-3xl lg:text-4xl mb-4 lg:mb-6">
              Somos apaixonados pela Mantiqueira e comprometidos com a excelência
            </h2>
            <p className="text-black text-base lg:text-lg leading-relaxed">
              Localizada nas encostas de Espírito Santo do Pinhal, a Vinícola Amana é um tributo ao terroir único da Serra da Mantiqueira, unido à técnica da dupla poda, criando condições perfeitas para vinhos inesquecíveis.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-5 w-full">
            {features.map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <a
              href="https://www.vinicolaamana.com.br/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="inline-flex items-center justify-center px-6 py-3 md:px-10 md:py-4 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl tracking-wide uppercase text-xs md:text-sm w-full sm:w-auto">
                Nossa História Completa
                <ChevronRight className="ml-2 h-4 w-4 md:ml-3 md:h-5 md:w-5" />
              </button>
            </a>
            <a
              href="https://widget.getinapp.com.br/zPQjaD1Y"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="inline-flex items-center justify-center px-6 py-3 md:px-10 md:py-4 border border-[#89764b] text-[#89764b] hover:bg-[#9a3324]/10 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl tracking-wide uppercase text-xs md:text-sm w-full sm:w-auto">
                Agende uma Visita
                <ChevronRight className="ml-2 h-4 w-4 md:ml-3 md:h-5 md:w-5" />
              </button>
            </a>
          </div>
        </div>

        {/* Imagem e badges */}
        <div className="order-1 lg:order-2 relative w-full h-full">
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg w-full">
            <img
              src={wineTasting}
              alt="Degustação de vinhos na Vinícola Amana"
              className="w-full h-full object-cover max-w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <Badge value={6} label="Rótulos" position="-bottom-4 left-4 sm:bottom-8 sm:left-8" />
          <Badge value={6} label="Prêmios" position="top-4 right-4 sm:top-8 sm:right-8" />
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
