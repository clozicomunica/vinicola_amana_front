import { Link } from "react-router-dom";
import { Wine, Calendar, MapPin, Award, Instagram } from "lucide-react";
import bgHero from "../assets/AMANA LOGO MONTANHA.png";
import logoAmana from "../assets/blacklogo.png";
import vinhos from "../assets/aboutus1.jpg";
import parallaxVinhos from "../assets/parallax.jpg";
import visita from "../assets/visiteamana.jpg";
const AboutPage = () => {
  // Dados fictícios (estilo premium)
  const features = [
    {
      icon: <Wine className="w-8 h-8" />,
      title: "Nossos Vinhedos",
      description: `
      Atualmente, abrangemos quase 100 hectares de terras, com 11 hectares já dedicados
      ao cultivo de videiras francesas, incluindo variedades como Syrah, Cabernet Sauvignon,
      Cabernet Franc, Malbec, Sauvignon Blanc e Chenin Blanc. Além dos vinhedos em crescimento,
      nossas terras são ocupadas pela cultura de cafés especiais, oliveiras e áreas
      de matas nativas preservadas.
    `,
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Safras Limitadas",
      description: `
      Investimos em uma vinícola de ponta, capacitada para mais de 200 mil garrafas por ano.
      Aqui, a expertise dos enólogos se encontra com maquinários modernos, resultando em vinhos
      inesquecíveis. Porém, respeitamos a natureza e as nossas safras ainda estão em desenvolvimento.
    `,
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premiações",
      description: `
      Somos uma Vinícola nova, aberta ao público apenas em 2023, e neste pouco tempo já possuímos
      06 prêmios na Decanter.
    `,
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Terroir Único",
      description: `
      Nossa propriedade fica nas serras que dividem São Paulo e Minas Gerais e tem potencial único.
      A qualidade do solo de Espírito Santo do Pinhal é refletida em nossos rótulos.
    `,
    },
  ];

  const awards = [
    {
      year: "2017",
      name: `Quando um grupo de sócios apaixonados por vinho e confiantes no potencial único do terroir de Espírito Santo do Pinhal adquiriu uma propriedade nas serras que dividem São Paulo e Minas Gerais.`,
    },
    {
      year: "2024",
      name: "Abertura ao público",
    },
    {
      year: "2024",
      name: "Primeiro Prêmio na Decanter",
    },
    {
      year: "2025",
      name: `Lançamento do T4, rótulo exclusivo e de máxima qualidade, destacando a qualidade do conceito de microterroir da Amana.`,
    },
  ];

  return (
    <div className="bg-[#d4d4d4] font-oswald">
      {/* Hero Cinematográfico - Versão Atualizada */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#d4d4d4]">
        {/* Container da imagem com tamanho controlado */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#89764b]"></div>
          <div className="absolute bottom-0 right-0 w-1 h-full bg-[#89764b]"></div>

          <img
            src={bgHero}
            alt="Amana Vineyards"
            className="absolute inset-0 w-full h-full object-contain object-center"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 60%, transparent 100%)",
            }}
          />
        </div>

        {/* Conteúdo sobreposto */}
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="mb-6 flex justify-center"></div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6 text-black">
            <img
              src={logoAmana}
              alt="Logo Amana"
              className="h-10 mb-2 mx-auto"
            />
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-black">
            O nome Amana-Tykyra, ou Mantiqueira em Tupi, presta homenagem às
            características especiais dessa região. Bem vindo à Amana.
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Wine className="h-8 w-8 text-[#89764b]" />
        </div>
      </section>

      {/* Assinatura Visual */}
      <section
        className="py-24 text-white relative bg-center bg-cover bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url(${vinhos})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>{" "}
        {/* Sobreposição escura */}
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl italic font-light leading-relaxed">
              O vinho é a poesia engarrafada
            </p>
            <p className="mt-8 text-[#89764b] uppercase tracking-widest text-sm">
              Robert Louis Stevenson
            </p>
          </div>
        </div>
      </section>
      {/* Diferenciais - Texto Alinhado à Esquerda */}
      <section className="py-20 bg-[#d4d4d4]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 group">
                <div className="mb-5 text-[#89764b] group-hover:text-black transition-colors duration-200">
                  {feature.icon}
                </div>

                <h3 className="text-xl uppercase tracking-tight mb-3 font-normal text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-left">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* História em Parallax */}
      <section
        className="relative h-[500px] bg-fixed bg-center bg-cover flex items-center"
        style={{
          backgroundImage: `url(${parallaxVinhos})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl uppercase tracking-tight mb-6">
              Nossos vinhos
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Cada vinho Amana traz em seu interior uma história de paixão. Uma
              combinação perfeita entre o melhor de cada uva, de cada safra com
              o amor pela terra e pela Mantiqueira. Temos três linha de vinhos:
              linha Amana, linha Amana Una e linha Amana Singular.
            </p>
            <Link
              to="/vinhos"
              className="inline-flex items-center px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors uppercase tracking-wider text-sm"
            >
              Conheça nossos vinhos
              <Wine className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Premiações em Timeline */}
      <section className="py-24 bg-[#d4d4d4]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl uppercase tracking-tight mb-3">
              Linha do Tempo
            </h2>
            <p className="text-black uppercase tracking-widest text-sm">
              Nossas Conquistas
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="absolute left-0 md:left-1/2 h-full w-0.5 bg-[#89764b]/30 transform md:-translate-x-1/2"></div>

            {awards.map((award, index) => (
              <div
                key={index}
                className={`relative mb-12 ${
                  index % 2 === 0
                    ? "md:pr-8 md:text-right"
                    : "md:pl-8 md:text-left"
                }`}
              >
                <div
                  className={`md:w-1/2 p-6 ${
                    index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                  }`}
                >
                  <div
                    className={`absolute top-6 w-4 h-4 rounded-full bg-[#89764b] ${
                      index % 2 === 0 ? "md:-right-2" : "md:-left-2"
                    }`}
                  ></div>
                  <h3 className="text-xl text-[#89764b] mb-1">{award.year}</h3>
                  <p className="text-gray-700">{award.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiência na Vinícola */}
      <section className="py-24 bg-[#d4d4d4]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-stretch gap-12">
            {/* Texto e informações (mantido todas as melhorias) */}
            <div className="lg:w-1/2 flex flex-col justify-center">
              <div className="max-w-lg">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-3xl md:text-4xl uppercase tracking-tight text-black font-light">
                    VIVÊNCIA AMANA
                  </h2>
                </div>

                <p className="text-black text-lg leading-relaxed mb-8">
                  Venha viver a experiência Amana: atendimento de excelência,
                  vinhos espetaculares e uma vista de tirar o fôlego.
                </p>

                {/* Bloco de endereço premium */}
                <div className="mb-8 p-8 bg-white rounded-lg shadow-sm border border-[#e0e0e0]">
                  <div className="flex items-start gap-5">
                    <div className="bg-[#89764b]/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-[#89764b]" />
                    </div>
                    <div>
                      <p className="text-black font-medium text-lg">
                        Estrada Vicinal Alberto Bartholomei, s/n - Barthô
                      </p>
                      <p className="text-black mt-1">
                        Espírito Santo do Pinhal
                      </p>
                      <p className="text-black">SP - CEP 13990-000</p>
                    </div>
                  </div>
                </div>

                {/* Bloco de redes sociais */}
                <div className="mb-8 flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://www.instagram.com/vinicola_amana/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-white border border-[#e0e0e0] rounded-lg hover:bg-[#f5f5f5] transition-colors"
                  >
                    <Instagram className="h-5 w-5 text-[#89764b]" />
                    <span className="text-[#89764b] font-medium">
                      @vinicola_amana
                    </span>
                  </a>

                  <a
                    href="https://widget.getinapp.com.br/zPQjaD1Y"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-colors text-center"
                  >
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">AGENDAR VISITA</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Imagem COM MOLDURA (como no original) */}
            <div className="lg:w-1/2">
              <div className="relative h-full min-h-[400px]">
                <div className="absolute inset-0 m-4 border-2 border-[#89764b] rounded-lg z-10 pointer-events-none"></div>
                <img
                  src={visita}
                  alt="Vinícola Amana"
                  className="w-full h-full object-cover absolute inset-0 rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
                <div className="absolute bottom-8 left-8 right-8 z-20"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
