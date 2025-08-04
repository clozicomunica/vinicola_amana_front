import { Grape, Award, Heart, Users, ChevronRight } from "lucide-react";
import wineTasting from "../assets/taças-bg.jpg";

const features = [
  {
    icon: Grape,
    title: "Nossas Uvas",
    description:
      "Atualmente, abrangemos quase 100 hectares de terras, com 11 hectares já dedicados ao cultivo de videiras francesas, incluindo variedades como Syrah, Cabernet Sauvignon, Cabernet Franc, Malbec, Sauvignon Blanc e Chenin Blanc. Além dos vinhedos em crescimento, nossas terras são ocupadas pela cultura de cafés especiais, oliveiras e áreas de matas nativas preservadas.",
  },
  {
    icon: Award,
    title: "Vinhos Premiados",
    description:
      "Alguns de nossos rótulos foram premiados com medalhas de Prata e Bronze na Decanter 2024 e 2025. Confira-os na sessão premiados.",
  },
  {
    icon: Heart,
    title: "Paixão pelo Terroir",
    description:
      "Somos uma vinícola focada na experiência do cliente. Por isso, desde a escolha do local, a arquitetura, a escolha de cardápio e uvas plantadas; tudo isso é pensado em uma imersão na cultura Amana..",
  },
  {
    icon: Users,
    title: "Experiências Únicas",
    description:
      "Visitas Guiadas, Vindimas, Eventos e outras experiências fazem parte do nosso dia a dia. Acesse a aba Agenda e fique por dentro de nosso calendário.",
  },
];

const AboutSection = () => {
  return (
    <section className="py-12 lg:py-24 bg-[#dad6d6] overflow-hidden w-full">
      <div className="container mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start w-full">
          {/* Content - Ordem alterada para mobile */}
          <div className="order-2 lg:order-1 w-full space-y-6 lg:space-y-8">
            <div>
              <h2 className="text-black text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">
                Somos apaixonados pela Mantiqueira e comprometidos com a
                excelência
              </h2>

              <div className="space-y-3 lg:space-y-4">
                <p className="text-black text-base lg:text-lg leading-relaxed">
                  Localizada nas encostas de Espírito Santo do Pinhal, a
                  Vinícola Amana é a máxima homenagem à Serra da Mantiqueira ou
                  Amana-Tykyra em tupi. Um tributo a esse terroir único que,
                  unido à técnica da dupla poda, cria condições perfeitas para a
                  elaboração de vinhos tão inesquecíveis quanto as paisagens da
                  região.
                </p>
              </div>
            </div>

            {/* Features Grid - Simplificado para mobile */}
            <div className="grid grid-cols-1 gap-4 sm:gap-5 w-full">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="border border-gray-300/50 rounded-lg hover:shadow-md transition-all hover:border-[#9a3324]/30 w-full bg-white p-4 sm:p-5"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-lg flex items-center justify-center">
                        <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botões - Stack em mobile */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <a
                href="https://www.vinicolaamana.com.br/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="cursor-pointer inline-flex items-center justify-center px-6 py-3 md:px-10 md:py-4 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-medium tracking-wide uppercase text-xs md:text-sm w-full sm:w-auto">
                  Nossa História Completa
                  <ChevronRight className="ml-2 h-4 w-4 md:ml-3 md:h-5 md:w-5" />
                </button>
              </a>
              <a
                href="https://widget.getinapp.com.br/zPQjaD1Y"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="cursor-pointer inline-flex items-center justify-center px-6 py-3 md:px-10 md:py-4 border border-[#89764b] text-[#89764b] hover:bg-[#9a3324]/10 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-medium tracking-wide uppercase text-xs md:text-sm w-full sm:w-auto">
                  Agende uma Visita
                  <ChevronRight className="ml-2 h-4 w-4 md:ml-3 md:h-5 md:w-5" />
                </button>
              </a>
            </div>
          </div>

          {/* Image - Ordem alterada para mobile */}
          <div className="order-1 lg:order-2 relative w-full">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg w-full">
              <img
                src={wineTasting}
                alt="Degustação de vinhos na Vinícola Mana"
                className="w-full h-auto sm:h-[400px] lg:h-[600px] object-cover max-w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Floating Stats - Reduzidos para mobile */}
            <div className="absolute -bottom-4 left-4 sm:bottom-8 sm:left-8 bg-white/95 backdrop-blur-sm border border-gray-300/50 rounded-lg p-3 sm:p-4 shadow w-24 sm:w-auto">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
                  70+
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Anos</div>
              </div>
            </div>

            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-white/95 backdrop-blur-sm border border-gray-300/50 rounded-lg p-3 sm:p-4 shadow w-24 sm:w-auto">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-black">
                  25+
                </div>
                <div className="text-xs sm:text-sm text-gray-600">Prêmios</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
