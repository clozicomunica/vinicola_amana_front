import { Link } from "react-router-dom";
import { Wine, Calendar, MapPin, Award, Instagram } from "lucide-react";
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import bgHero from "../assets/MONTANHA AMANA LOGO.svg";
import logoAmana from "../assets/blacklogo.png";
import vinhos from "../assets/vinhosbackground1.jpg";
import parallaxVinhos from "../assets/parallax.jpg";
import visita from "../assets/visiteamana.jpg";

const AboutPage = () => {

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
      month: "Maio",
      name: "Aquisição da primeira propriedade por um grupo de amigos apaixonados pelo universo do vinho, e confiantes no enorme potencial do terroir de Espírito Santo do Pinhal para a produção de vinhos de excelência.",
      icon: <MapPin className="h-4 w-4 mx-auto my-3" /> // Ícone de localização para aquisição
    },
    {
      year: "2017",
      month: "Agosto",
      name: "Inicia-se o processo de mapeamento da propriedade e preparo do solo dos primeiros talhões, visando o plantio de nossas primeiras videiras.",
      icon: <Calendar className="h-4 w-4 mx-auto my-3" /> // Ícone de calendário para preparo
    },
    {
      year: "2018",
      month: "", // Sem mês específico
      name: "Plantio dos primeiros 3 hectares, sendo 1,5 de Syrah e 1,5 de Sauvignon Blanc vindos da França.",
      icon: <Wine className="h-4 w-4 mx-auto my-3" /> // Ícone de vinho para plantio
    },
    {
      year: "2019",
      month: "",
      name: "Plantio de mais dois talhões com 1,7 hectares de Syrah vindas da Itália.",
      icon: <Wine className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2020",
      month: "Junho",
      name: "Compra das primeiras Barricas Francesas.",
      icon: <Award className="h-4 w-4 mx-auto my-3" /> // Ícone de prêmio para aquisição de equipamentos
    },
    {
      year: "2020",
      month: "Agosto",
      name: "Primeira colheita experimental em uma área de aproximadamente 0,5 Hectare de Syrah, na ocasião com apenas 1 ANO E 10 meses de idade. A qualidade alcançada surpreende a todos.",
      icon: <Calendar className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2020",
      month: "Outubro",
      name: "Segue a expansão da área plantada com 0,7 hectares de Cabernet Sauvignon e 0,5 hectares de Chenin Blanc, a primeira experiencia dessa casta em vinhos de inverno.",
      icon: <Wine className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2021",
      month: "Julho",
      name: "Primeira colheita de Sauvignon Blanc.",
      icon: <Calendar className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2021",
      month: "Agosto",
      name: "Segunda colheita de Syrah (primeira comercial).",
      icon: <Calendar className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2021",
      month: "Setembro",
      name: "Expansão com mais 1,0 hectare de Cabernet Sauvignon e 1,0 Hectare de Cabernet Franc.",
      icon: <Wine className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2022",
      month: "Julho",
      name: "Primeira colheita de Chenin Blanc.",
      icon: <Calendar className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2022",
      month: "Agosto",
      name: "Primeira colheita de Cabernet Sauvignon.",
      icon: <Calendar className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2022",
      month: "Setembro",
      name: "Nova expansão com mais 1,0 Hectare de Cabernet Franc e 0,7 Hectares de Malbec.",
      icon: <Wine className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2023",
      month: "Setembro",
      name: "Plantio de mais uma área pequena com a variedade Cabernet Sauvignon.",
      icon: <Wine className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2023",
      month: "Novembro",
      name: "No dia 05/11/2023 é formalmente inaugurada a estrutura de Enoturismo, com loja, degustações, jardim etc.",
      icon: <Award className="h-4 w-4 mx-auto my-3" /> // Ícone de prêmio para inauguração
    },
    {
      year: "2024",
      month: "Março",
      name: "Inicio das visitas guiadas.",
      icon: <MapPin className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2024",
      month: "Junho",
      name: "Inauguração da fábrica (cantina), com o início da colheita e vinificação 100% interna. Ganhamos Medalhas de BRONZE na premiação internacional DECANTER.",
      icon: <Award className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2024",
      month: "Agosto",
      name: "Primeira Safra de Cabernet Franc.",
      icon: <Calendar className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2024",
      month: "Setembro",
      name: "Fechamos a safra de 2024 ultrapassando pela primeira vez as 40 toneladas.",
      icon: <Award className="h-4 w-4 mx-auto my-3" />
    },
    {
      year: "2025",
      month: "Junho",
      name: "Ganhamos Medalhas de BRONZE E PRATA na premiação internacional DECANTER. Lançamento do rótulo T4 da linha Singular. Um rótulo diferenciado de nosso micro-terroir.",
      icon: <Award className="h-4 w-4 mx-auto my-3" />
    }
  ];

  return (
    <div className="bg-[#d4d4d4] font-['Oswald']">
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
              top: "125px",
              maskImage:
                "linear-gradient(to bottom, black 60%, transparent 100%)",
            }}
          />
        </div>

        {/* Conteúdo sobreposto */}
        <div className="container mx-auto px-4 relative z-10 text-center mb-66">
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

      {/* Assinatura Visual - Altura responsiva, texto ajustado */}
      <section
        className="relative h-[400px] sm:h-[500px] bg-fixed bg-center bg-cover flex items-center text-white"
        style={{
          backgroundImage: `url(${vinhos})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>{" "}
        {/* Sobreposição escura */}
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

      {/* Diferenciais - Grid responsiva, padding ajustado para mobile */}
      <section className="py-16 sm:py-20 bg-[#d4d4d4]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-4 sm:p-6 group">
                <div className="mb-4 sm:mb-5 text-[#89764b] group-hover:text-black transition-colors duration-200">
                  {feature.icon}
                </div>

                <h3 className="text-lg sm:text-xl uppercase tracking-tight mb-3 font-normal text-gray-900">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed text-left font-light text-sm sm:text-base">
                  {feature.description.trim()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* História em Parallax - Desativar bg-fixed em mobile para melhor performance */}
      <section
        className="relative h-[400px] sm:h-[500px] bg-center bg-cover flex items-center bg-no-repeat bg-scroll sm:bg-fixed"
        style={{
          backgroundImage: `url(${parallaxVinhos})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-white">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight mb-6 font-light">
              Nossos vinhos
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-6 font-light">
              Cada vinho Amana traz em seu interior uma história de paixão. Uma
              combinação perfeita entre o melhor de cada uva, de cada safra com
              o amor pela terra e pela Mantiqueira. Temos três linha de vinhos:
              linha Amana, linha Amana Una e linha Amana Singular.
            </p>
            <Link
              to="/vinhos"
              className="inline-flex items-center px-6 sm:px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors uppercase tracking-wider text-xs sm:text-sm font-light"
            >
              Conheça nossos vinhos
              <Wine className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Premiações em Timeline Vertical - Ajustes para mobile: texto menor, padding */}
      <section className="py-12 sm:py-16 lg:py-24 bg-[#d4d4d4]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 lg:mb-20">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight mb-3 font-light">
              Linha do Tempo
            </h2>
            <p className="text-black uppercase tracking-widest text-xs font-light">
              Nossas Conquistas
            </p>
          </div>

          <VerticalTimeline lineColor="#89764b" animate={true}>
            {awards.map((award, index) => (
              <VerticalTimelineElement
                key={index}
                className="vertical-timeline-element--work hover:scale-[1.02] transition-transform duration-200"
                contentStyle={{
                  background: '#ffffff',
                  color: '#000000',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 3px 5px rgba(0,0,0,0.1)',
                  borderRadius: '8px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  padding: '1rem', // Padding responsivo
                }}
                contentArrowStyle={{ borderRight: '7px solid #ffffff' }}
                date={award.month ? `${award.month.toUpperCase()} ${award.year}` : award.year}
                dateClassName="font-light text-[#89764b] uppercase tracking-wider text-xs sm:text-sm"
                iconStyle={{ 
                  background: '#89764b', 
                  color: '#fff',
                  boxShadow: '0 0 0 4px #d4d4d4, inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)'
                }}
                icon={award.icon}
              >
                {award.month && (
                  <h3 className="vertical-timeline-element-title text-sm sm:text-base text-[#89764b] font-light uppercase tracking-wide mb-2 border-b border-[#89764b]/20 pb-1">
                    {award.month.toUpperCase()}
                  </h3>
                )}
                <p className="text-gray-700 font-light leading-relaxed text-xs sm:text-sm">
                  {award.name}
                </p>
              </VerticalTimelineElement>
            ))}
            
            {/* Elemento final */}
            <VerticalTimelineElement
              iconStyle={{ 
                background: '#89764b', 
                color: '#fff',
                boxShadow: '0 0 0 4px #d4d4d4, inset 0 2px 0 rgba(0,0,0,.08), 0 3px 0 4px rgba(0,0,0,.05)'
              }}
              icon={<Wine className="h-4 w-4 mx-auto my-3" />}
            />
          </VerticalTimeline>
        </div>
      </section>

      {/* Experiência na Vinícola - Flex responsivo, stack em mobile */}
      <section className="py-16 sm:py-24 bg-[#d4d4d4]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-stretch gap-8 sm:gap-12">
            {/* Texto e informações */}
            <div className="lg:w-1/2 flex flex-col justify-center">
              <div className="max-w-lg">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight text-black font-light">
                    VIVÊNCIA AMANA
                  </h2>
                </div>

                <p className="text-black text-base sm:text-lg leading-relaxed mb-8 font-light">
                  Venha viver a experiência Amana: atendimento de excelência,
                  vinhos espetaculares e uma vista de tirar o fôlego.
                </p>

                {/* Bloco de endereço */}
                <div className="mb-8 p-6 sm:p-8 bg-white rounded-lg shadow-sm border border-[#e0e0e0]">
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="bg-[#89764b]/10 p-2 sm:p-3 rounded-full">
                      <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-[#89764b]" />
                    </div>
                    <div>
                      <p className="text-black font-medium text-base sm:text-lg font-light">
                        Estrada Vicinal Alberto Bartholomei, s/n - Barthô
                      </p>
                      <p className="text-black mt-1 font-light">
                        Espírito Santo do Pinhal
                      </p>
                      <p className="text-black font-light">SP - CEP 13990-000</p>
                    </div>
                  </div>
                </div>

                {/* Bloco de redes sociais - Stack em mobile */}
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
            </div>

            {/* Imagem COM MOLDURA */}
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