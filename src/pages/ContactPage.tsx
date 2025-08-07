import { useRef, useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
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
      // Simulação de envio (substitua pelo seu método real)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Abre o cliente de e-mail padrão
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
    <div className="bg-[#d4d4d4] text-white font-oswald">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#d4d4d4] bg-center opacity-70">
          <div className="absolute inset-0 "></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6"
          >
            <span className="block text-black">FALE</span>
            <span className="text-black">CONOSCO</span>
          </motion.h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Estamos aqui para responder suas dúvidas e receber seu feedback
          </p>
        </div>
      </section>

      {/* Contato e Formulário */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Informações de Contato */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-1/3"
            >
              <div className="bg-[#111111] p-8 rounded-lg border border-[#1e1e1e] h-full">
                <h2 className="text-2xl text-[#89764b] mb-8 uppercase tracking-tight">
                  Nossos Canais
                </h2>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#89764b]">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-1">E-mail</h3>
                      <a
                        href="mailto:vinicolaamana@gmail.com"
                        className="text-gray-400 hover:text-[#89764b] transition-colors"
                      >
                        vinicolaamana@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#89764b]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-1">Telefone</h3>
                      <a
                        href="tel:+5581999999999"
                        className="text-gray-400 hover:text-[#89764b] transition-colors"
                      >
                        (81) 99999-9999
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#89764b]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-1">Endereço</h3>
                      <address className="text-gray-400 not-italic">
                        Rodovia BR-407, Km 12
                        <br />
                        Petrolina/PE
                      </address>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="mt-1 text-[#89764b]">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg mb-1">Horário</h3>
                      <p className="text-gray-400">
                        Sexta a Domingo
                        <br />
                        10h às 18h
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Formulário */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-2/3"
            >
              <div className="bg-[#111111] p-8 rounded-lg border border-[#1e1e1e]">
                <h2 className="text-2xl text-[#89764b] mb-8 uppercase tracking-tight">
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
                      className="block text-gray-300 mb-2 uppercase text-sm tracking-wider"
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
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm focus:border-[#89764b] focus:ring-1 focus:ring-[#89764b]/50 transition-all text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-gray-300 mb-2 uppercase text-sm tracking-wider"
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
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm focus:border-[#89764b] focus:ring-1 focus:ring-[#89764b]/50 transition-all text-white"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-300 mb-2 uppercase text-sm tracking-wider"
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
                      className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-sm focus:border-[#89764b] focus:ring-1 focus:ring-[#89764b]/50 transition-all text-white"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#89764b] hover:bg-[#756343] text-white rounded-sm transition-colors uppercase tracking-wider text-sm font-medium"
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
                    <div className="mt-4 p-4 bg-green-900/30 text-green-400 rounded-sm border border-green-800">
                      Mensagem enviada com sucesso! Responderemos em breve.
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="mt-4 p-4 bg-red-900/30 text-red-400 rounded-sm border border-red-800">
                      Ocorreu um erro. Por favor, tente novamente ou envie
                      diretamente para vinicolaamana@gmail.com
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-lg border border-[#1e1e1e] shadow-2xl"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15733.215635621966!2d-40.500728!3d-9.569678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMzQnMTAuOCJTIDQwwrAzMCcwMi42Ilc!5e0!3m2!1sen!2sbr!4v1620000000000!5m2!1sen!2sbr"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="block"
            ></iframe>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
