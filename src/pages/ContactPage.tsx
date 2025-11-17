import { MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f5f0] font-['Oswald']">
      <section className="relative pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16 lg:pb-20 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-black bg-cover bg-center opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 uppercase tracking-tight">
            Fale Conosco
          </h1>
          <p className="text-sm md:text-base max-w-3xl mx-auto text-[#9c9c9c] leading-relaxed">
            Estamos aqui para responder suas dúvidas e receber seu feedback.
          </p>
        </div>
      </section>

      {/* Canais */}
      <section className="py-12 md:py-16 lg:py-20 bg-[#d4d4d4]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <div className="bg-black p-6 md:p-8 lg:p-10 rounded-lg border border-[#ffffff10]">
              <h2 className="text-2xl md:text-3xl text-[#89764b] mb-6 md:mb-8 uppercase tracking-tight border-b border-[#89764b]/30 pb-4 text-center">
                Nossos Canais
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {/* Email */}
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-[#89764b]/10 rounded-full mb-4">
                    <Mail className="h-7 w-7 text-[#89764b]" />
                  </div>
                  <h3 className="text-xl text-gray-300 mb-2">E-mail</h3>
                  <a
                    href="mailto:sac@vinicolaamana.com.br"
                    className="text-gray-400 hover:text-[#89764b] transition-colors"
                  >
                    sac@vinicolaamana.com.br
                  </a>
                </div>

                {/* Telefone */}
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-[#89764b]/10 rounded-full mb-4">
                    <Phone className="h-7 w-7 text-[#89764b]" />
                  </div>
                  <h3 className="text-xl text-gray-300 mb-2">Telefone</h3>
                  <a
                    href="tel:+5519971799448"
                    className="text-gray-400 hover:text-[#89764b] transition-colors"
                  >
                    (19) 97179-9448
                  </a>
                </div>

                {/* Endereço */}
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-[#89764b]/10 rounded-full mb-4">
                    <MapPin className="h-7 w-7 text-[#89764b]" />
                  </div>
                  <h3 className="text-xl text-gray-300 mb-2">Endereço</h3>
                  <address className="text-gray-400 not-italic leading-relaxed">
                    Estrada vicinal Alberto Bartholomei, s/n Barthô
                    <br />
                    Espírito Santo do Pinhal - SP
                    <br />
                    CEP 13990-000
                  </address>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mapa */}
      <section className="py-12 md:py-16 lg:py-20 bg-[#f8f5f0]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl uppercase text-black tracking-tight mb-4">
              Onde Estamos
            </h2>
            <div className="w-16 h-1 bg-[#89764b] mx-auto"></div>
          </motion.div>

          <div className="w-full h-[450px] overflow-hidden rounded-lg border-2 border-[#1e1e1e] shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3694.0586548280908!2d-46.69281202577093!3d-22.199877112987824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c9aff9c4f10f69%3A0xd538a953f2a8769d!2sVinicola%20AMANA!5e0!3m2!1spt-BR!2sbr!4v1754678940776!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
