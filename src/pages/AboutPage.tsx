import { Wine, MapPin, Calendar, Instagram } from "lucide-react";
import { VerticalTimeline, VerticalTimelineElement } from "react-vertical-timeline-component";
import 'react-vertical-timeline-component/style.min.css';

import { features } from "../Data/featuresData";
import { awards } from "../Data/awardsData";
import FeatureCard from "../components/FeaturedCard";
import AwardTimelineItem, { timelineIconStyle } from "../components/AwardTimelineItem";

import bgHero from "../assets/MONTANHA AMANA LOGO.svg";
import logoAmana from "../assets/blacklogo.png";
import vinhos from "../assets/vinhosbackground1.jpg";
import parallaxVinhos from "../assets/parallax.jpg";
import visita from "../assets/visiteamana.jpg";

const AboutPage = () => {
  return (
    <div className="bg-[#d4d4d4] font-['Oswald']">
      {/* Hero Cinematográfico */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#d4d4d4]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#89764b]"></div>
          <div className="absolute bottom-0 right-0 w-1 h-full bg-[#89764b]"></div>

          <img
            src={bgHero}
            alt="Amana Vineyards"
            className="absolute inset-0 w-full h-full object-contain object-center"
            style={{ top: "125px", maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)" }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center mb-66">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6 text-black">
            <img src={logoAmana} alt="Logo Amana" className="h-10 mb-2 mx-auto" />
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-black">
            O nome Amana-Tykyra, ou Mantiqueira em Tupi, presta homenagem às características especiais dessa região. Bem vindo à Amana.
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Wine className="h-8 w-8 text-[#89764b]" />
        </div>
      </section>

      {/* Assinatura Visual */}
      <section
        className="relative h-[400px] sm:h-[500px] bg-fixed bg-center bg-cover flex items-center text-white"
        style={{ backgroundImage: `url(${vinhos})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative container mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-xl sm:text-2xl md:text-3xl italic font-light leading-relaxed">
              O vinho é a poesia engarrafada
            </p>
            <p className="mt-6 sm:mt-8 text-[#89764b] uppercase tracking-widest text-xs sm:text-sm">
              Robert Louis Stevenson
            </p>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 sm:py-20 bg-[#d4d4d4]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Vinhos */}
      <section
        className="relative h-[400px] sm:h-[500px] bg-center bg-cover flex items-center bg-no-repeat bg-scroll sm:bg-fixed"
        style={{ backgroundImage: `url(${parallaxVinhos})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-white">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight mb-6 font-light">
              Nossos vinhos
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6 font-light">
              Cada vinho Amana traz em seu interior uma história de paixão. Uma combinação perfeita entre o melhor de cada uva, de cada safra com o amor pela terra e pela Mantiqueira.
              Temos três linha de vinhos: linha Amana, linha Amana Una e linha Amana Singular.
            </p>
            <a
              href="/vinhos"
              className="inline-flex items-center px-6 sm:px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors uppercase tracking-wider text-xs sm:text-sm font-light"
            >
              Conheça nossos vinhos
              <Wine className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Linha do Tempo */}
      <section className="py-12 sm:py-16 lg:py-24 bg-[#d4d4d4]">
        <div className="container mx-auto px-4 sm:px-6">
          <VerticalTimeline lineColor="#89764b" animate>
            {awards.map((award, idx) => (
              <AwardTimelineItem key={idx} award={award} />
            ))}
            <VerticalTimelineElement
              iconStyle={timelineIconStyle}
              icon={<Wine className="h-4 w-4 mx-auto my-3" />}
            />
          </VerticalTimeline>
        </div>
      </section>

      {/* Vivência Amana */}
      <section className="py-16 sm:py-24 bg-[#d4d4d4]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-stretch gap-8 sm:gap-12">
            <div className="lg:w-1/2 flex flex-col justify-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-black font-light mb-6">
                VIVÊNCIA AMANA
              </h2>
              <p className="text-black text-base sm:text-lg leading-relaxed mb-8 font-light">
                Venha viver a experiência Amana: atendimento de excelência, vinhos espetaculares e uma vista de tirar o fôlego.
              </p>

              <div className="mb-8 p-6 sm:p-8 bg-white rounded-lg shadow-sm border border-[#e0e0e0]">
                <div className="flex items-start gap-4 sm:gap-5">
                  <div className="bg-[#89764b]/10 p-2 sm:p-3 rounded-full">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-[#89764b]" />
                  </div>
                  <div>
                    <p className="text-black font-medium text-base sm:text-lg font-light">
                      Estrada Vicinal Alberto Bartholomei, s/n - Barthô
                    </p>
                    <p className="text-black mt-1 font-light">Espírito Santo do Pinhal</p>
                    <p className="text-black font-light">SP - CEP 13990-000</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <a
                  href="https://www.instagram.com/vinicola_amana/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 px-4 sm:px-6 py-3 bg-white border border-[#e0e0e0] rounded-lg hover:bg-[#f5f5f5] transition-colors font-light"
                >
                  <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-[#89764b]" />
                  <span className="text-[#89764b] font-medium font-light text-sm sm:text-base">
                    @vinicola_amana
                  </span>
                </a>

                <a
                  href="https://widget.getinapp.com.br/zPQjaD1Y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-3 px-4 sm:px-6 py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-colors text-center font-light"
                >
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="font-medium font-light text-sm sm:text-base">AGENDAR VISITA</span>
                </a>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="relative h-[300px] sm:h-[400px] lg:h-full min-h-[300px]">
                <div className="absolute inset-0 m-2 sm:m-4 border-2 border-[#89764b] rounded-lg z-10 pointer-events-none"></div>
                <img
                  src={visita}
                  alt="Vinícola Amana"
                  className="w-full h-full object-cover absolute inset-0 rounded-lg"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
