import { Link } from "react-router-dom";
import { Wine, Calendar, MapPin, Award } from "lucide-react";

const AboutPage = () => {
  // Dados fictícios (estilo premium)
  const features = [
    {
      icon: <Wine className="w-8 h-8" />,
      title: "Vinhedos Exclusivos",
      description: "30 hectares no Vale do São Francisco com microclima único",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Safras Limitadas",
      description: "Produção artesanal de apenas 15.000 garrafas/ano",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Premiações",
      description: "23 medalhas internacionais nos últimos 5 anos",
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Terroir Sertanejo",
      description: "Solo granítico e 360 dias de sol por ano",
    },
  ];

  const awards = [
    { year: "2023", name: "Decanter World Wine Awards - Ouro" },
    { year: "2022", name: "International Wine Challenge - Prata" },
    { year: "2021", name: "Berliner Wein Trophy - Gran Ouro" },
    { year: "2020", name: "Concours Mondial - 92 Pontos" },
  ];

  return (
    <div className="bg-[#d4d4d4] font-oswald">
      {/* Hero Cinematográfico */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1535957998253-26f1eec9d836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920')] bg-cover bg-center opacity-90">
          <div className="absolute inset-0"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-px bg-black"></div>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6 text-black">
            <span className="block mb-2">AMANA</span>
            <span className="text-2xl md:text-3xl font-normal text-black">
              Desde 2010
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-black">
            Onde a tradição vinícola encontra a ousadia do sertão brasileiro
          </p>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <Wine className="h-8 w-8 text-[#89764b]" />
        </div>
      </section>

      {/* Assinatura Visual */}
      <section className="py-24 bg-black text-white relative">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-2xl md:text-3xl italic font-light leading-relaxed">
              "Na Amana, cada garrafa é a materialização de um sonho sertanejo -
              onde a resistência da videira encontra a paixão do vinicultor para
              criar vinhos que desafiam o deserto."
            </p>
            <p className="mt-8 text-[#89764b] uppercase tracking-widest text-sm">
              Carlos Mendes, Fundador
            </p>
          </div>
        </div>
      </section>

      {/* Diferenciais em Blocos */}
      <section className="py-24 bg-[#d4d4d4]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 group">
                <div className="mx-auto mb-6 text-[#89764b] group-hover:text-black transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl uppercase tracking-tight mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* História em Parallax */}
      <section
        className="relative h-[500px] bg-fixed bg-center bg-cover flex items-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600788886242-5c96aabe3757?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl uppercase tracking-tight mb-6">
              Nossa Origem
            </h2>
            <p className="text-lg leading-relaxed mb-6">
              Em 2010, no coração do Vale do São Francisco, um grupo de
              visionários percebeu o potencial único do terroir sertanejo. Com
              técnicas inovadoras adaptadas ao clima semiárido, reinventamos a
              vitivinicultura tropical.
            </p>
            <Link
              to="/vinhos"
              className="inline-flex items-center px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors uppercase tracking-wider text-sm"
            >
              Conheça as Safras
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
      <section className="py-24 bg-[#d4d4d4] text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
              <h2 className="text-3xl md:text-4xl uppercase tracking-tight mb-6 text-black">
                Visite Nossa Vinícola
              </h2>
              <p className="text-black mb-8 leading-relaxed">
                Agende uma experiência imersiva em nosso complexo em
                Petrolina/PE. Degustações guiadas, tour pelos vinhedos e jantar
                harmonizado com vista para o Rio São Francisco.
              </p>
              <div className="space-y-4 mb-8">
                <p className="flex items-center gap-3 text-black">
                  <MapPin className="h-5 w-5 text-[#89764b]" />
                  <span>Rodovia BR-407, Km 12 - Petrolina/PE</span>
                </p>
                <p className="flex items-center gap-3 text-black">
                  <Calendar className="h-5 w-5 text-[#89764b]" />
                  <span>Terça a Sábado, das 9h às 17h</span>
                </p>
              </div>
              <Link
                to="/contato"
                className="inline-block px-8 py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-sm transition-colors uppercase tracking-wider text-sm"
              >
                Agendar Visita
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="relative aspect-w-16 aspect-h-9">
                <img
                  src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920"
                  alt="Vinícola Amana"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 border-2 border-[#89764b] m-4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
