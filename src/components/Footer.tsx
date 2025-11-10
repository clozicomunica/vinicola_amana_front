import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import logo from "../assets/Amana.png";
import developedby from "../assets/developedby.png";

const Footer = () => {
  // Links de navegação
  const navLinks = [
    { label: "Nossos Vinhos", to: "/vinhos" },
    { label: "Nossa História", to: "/sobrenos" },
    { label: "Contato", to: "/contato" },
  ];

  const categoryLinks = [
    { label: "Vinhos", to: "/vinhos" },
    { label: "Cafés", to: "/vinhos" },
  ];

  const socialLinks = [
    { icon: Facebook, url: "https://www.facebook.com/vinicolaamana/" },
    { icon: Instagram, url: "https://www.instagram.com/vinicola_amana/" },
    { icon: Youtube, url: "https://www.youtube.com/@Vin%C3%ADcolaAmana" },
  ];
  const FooterLinkList = ({
    links,
  }: {
    links: { label: string; to: string }[];
  }) => (
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.to}
            className="text-white/80 hover:text-white transition-colors text-sm md:text-base"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  const SocialIcons = () => (
    <div className="flex gap-4 mt-6">
      {socialLinks.map(({ icon: Icon, url }) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );

  return (
    <footer className="bg-black text-white font-['Oswald']">
      <div className="container mx-auto px-4">
        {/* Newsletter */}
        <div className="py-8 md:py-12 border-b border-white/20">
          <div className="max-w-4xl mx-auto text-center px-2 md:px-0">
            <h3 className="text-xl md:text-2xl mb-3 md:mb-4 text-white">
              Receba Novidades Exclusivas
            </h3>
            <p className="text-white/80 mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Seja o primeiro a saber sobre novos lançamentos, eventos especiais
              e ofertas exclusivas da Vinícola Amana.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded text-white placeholder:text-white/60 focus:outline-none focus:ring-1 focus:ring-white/50 text-base"
              />
              <button className="px-6 py-2 bg-transparent text-white border border-white rounded hover:bg-white/10 transition whitespace-nowrap">
                Inscrever-se
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Logo e contatos */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex flex-col items-start gap-4">
              <img
                src={logo}
                alt="Logo da Vinícola"
                className="w-32 h-auto max-h-20 object-contain"
              />
              <p className="text-white/80 leading-relaxed max-w-md text-sm md:text-base mt-2">
                Desfrute de vinhos excepcionais, cardápio cuidadoso e um
                ambiente único, imerso nas encostas da serra da Mantiqueira.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white mt-0.5 flex-shrink-0" />
                <span className="text-white/90 text-sm md:text-base leading-relaxed">
                  Estrada Vicinal Alberto Bartholomei, s/n
                  <br /> Barthô - Espírito Santo do Pinhal - SP
                  <br /> CEP 13990-000
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white" />
                <span className="text-white/90 text-sm md:text-base">
                  +55 19 97179-9448
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white" />
                <span className="text-white/90 text-sm md:text-base">
                  sac@vinicolaamana.com.br
                </span>
              </div>
            </div>

            <SocialIcons />
          </div>

          {/* Navegação e categorias */}
          <div>
            <h3 className="mb-4 text-white/70 text-base">Navegação</h3>
            <FooterLinkList links={navLinks} />
          </div>

          <div>
            <h3 className="mb-4 text-white/70 text-base">Categorias</h3>
            <FooterLinkList links={categoryLinks} />
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="py-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-sm text-white order-1 md:order-none">
              © {new Date().getFullYear()} Vinícola Amana. Todos os direitos
              reservados.
            </p>

            <div className="flex items-center gap-2 text-sm text-white bg-black/20 px-3 py-2 rounded-lg">
              <span className="opacity-80">DESENVOLVIDO POR</span>
              <a
                href="https://clozicomunica.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <img
                  src={developedby}
                  alt="Clozi Comunica"
                  className="h-5 w-auto object-contain"
                />
                <span className="tracking-tight">
                  CLOZI COMUNICAÇÃO E IMAGEM
                </span>
              </a>
            </div>

            <div className="flex gap-4 md:gap-6 order-2 md:order-none">
              <Link
                to="/privacidade"
                className="text-sm text-white hover:text-[#9a3324] transition-colors"
              >
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
