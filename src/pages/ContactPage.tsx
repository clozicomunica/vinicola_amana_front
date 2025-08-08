import { useRef, useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";

const ContactPage = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      window.location.href = `mailto:vinicolaamana@gmail.com?subject=Contato via Site - ${formData.name}&body=${formData.message}%0D%0A%0D%0AResponder para: ${formData.email}`;

      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] font-['Oswald']">
      {/* Hero Section - Estilo Vinícola */}
      <section className="relative pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16 lg:pb-20 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-black bg-cover bg-center opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 uppercase tracking-tight">
            <span className="text-center text-white">Fale Conosco</span>
          </h1>
          <p className="text-sm md:text-base max-w-3xl mx-auto text-[#9c9c9c] leading-relaxed">
            Estamos aqui para responder suas dúvidas e receber seu feedback
          </p>
        </div>
      </section>

      {/* Contato e Formulário - Estilo Minimalista */}
      <section className="py-12 md:py-16 lg:py-20 bg-[#d4d4d4]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
            {/* Informações de Contato - Card Elegante */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-2/5"
            >
              <div className="bg-black p-8 md:p-10 rounded-lg border border-[#ffffff10] h-full">
                <h2 className="text-2xl md:text-3xl text-[#89764b] mb-8 uppercase tracking-tight border-b border-[#89764b]/30 pb-4">
                  Nossos Canais
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#89764b]/10 rounded-full">
                      <Mail className="h-5 w-5 text-[#89764b]" />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-300 mb-1">E-mail</h3>
                      <a
                        href="mailto:vinicolaamana@gmail.com"
                        className="text-gray-400 hover:text-[#89764b] transition-colors text-sm"
                      >
                        vinicolaamana@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#89764b]/10 rounded-full">
                      <Phone className="h-5 w-5 text-[#89764b]" />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-300 mb-1">Telefone</h3>
                      <a
                        href="tel:+5581999999999"
                        className="text-gray-400 hover:text-[#89764b] transition-colors text-sm"
                      >
                        (81) 99999-9999
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#89764b]/10 rounded-full">
                      <MapPin className="h-5 w-5 text-[#89764b]" />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-300 mb-1">Endereço</h3>
                      <address className="text-gray-400 not-italic text-sm">
                        Estrada vicinal Alberto Bartholomei, s/n Barthô -
                        <br />
                        Espírito Santo do Pinhal - SP CEP 13990-000
                      </address>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Formulário - Estilo Sofisticado */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-3/5"
            >
              <div className="bg-black p-8 md:p-10 rounded-lg border border-[#ffffff10]">
                <h2 className="text-2xl md:text-3xl text-[#89764b] mb-8 uppercase tracking-tight border-b border-[#89764b]/30 pb-4">
                  Envie sua Mensagem
                </h2>

                <form
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-gray-300 mb-3 uppercase text-xs tracking-wider"
                    >
                      Nome
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 bg-[#1a1a1a] border border-[#ffffff10] rounded-sm focus:border-[#89764b] focus:ring-1 focus:ring-[#89764b]/30 transition-all text-white placeholder-gray-500 text-sm"
                      placeholder="Seu nome completo"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-300 mb-3 uppercase text-xs tracking-wider"
                    >
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 bg-[#1a1a1a] border border-[#ffffff10] rounded-sm focus:border-[#89764b] focus:ring-1 focus:ring-[#89764b]/30 transition-all text-white placeholder-gray-500 text-sm"
                      placeholder="seu@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-300 mb-3 uppercase text-xs tracking-wider"
                    >
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-3 bg-[#1a1a1a] border border-[#ffffff10] rounded-sm focus:border-[#89764b] focus:ring-1 focus:ring-[#89764b]/30 transition-all text-white placeholder-gray-500 text-sm"
                      placeholder="Escreva sua mensagem aqui..."
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-4 bg-[#89764b] hover:bg-[#756343] text-white rounded-sm transition-all uppercase tracking-wider text-sm font-medium flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        "Enviando..."
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Enviar Mensagem
                        </>
                      )}
                    </motion.button>
                  </div>

                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-green-900/20 text-green-300 rounded-sm border border-green-800/50 text-sm"
                    >
                      Mensagem enviada com sucesso! Responderemos em breve.
                    </motion.div>
                  )}

                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-900/20 text-red-300 rounded-sm border border-red-800/50 text-sm"
                    >
                      Ocorreu um erro. Por favor, tente novamente ou envie
                      diretamente para vinicolaamana@gmail.com
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mapa - Estilo Integrado */}
      <section className="py-12 md:py-16 lg:py-20 bg-[#f8f5f0]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-3xl text-black uppercase tracking-tight mb-4">
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
              allowFullScreen
              loading="lazy"
              className="w-full h-full block"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
