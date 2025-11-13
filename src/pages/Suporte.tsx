import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";

const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      window.location.href = `mailto:sac@vinicolaamana.com?subject=Suporte App - ${formData.name}&body=${formData.message}%0D%0A%0D%0AResponder para: ${formData.email}`;

      toast.success("Mensagem enviada com sucesso!", {
        position: "bottom-right",
        style: {
          background: "#89764b",
          color: "#fff",
          borderRadius: "8px",
          padding: "16px 24px",
          fontFamily: "'Oswald', sans-serif",
        },
        iconTheme: { primary: "#fff", secondary: "#89764b" },
      });
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      toast.error("Erro ao enviar mensagem. Tente novamente.", {
        position: "bottom-right",
        style: {
          background: "#9a3324",
          color: "#fff",
          borderRadius: "8px",
          padding: "16px 24px",
          fontFamily: "'Oswald', sans-serif",
        },
      });
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#d4d4d4] font-['Oswald']">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16 lg:pb-20 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-black bg-cover bg-center opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 uppercase tracking-tight"
          >
            Suporte ao App
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm md:text-base max-w-3xl mx-auto text-[#9c9c9c] leading-relaxed"
          >
            Entre em contato para suporte com a integração do app Vinícola Amana
            na Nuvemshop.
          </motion.p>
        </div>
      </section>

      {/* Contato e Formulário */}
      <section className="py-12 md:py-16 lg:py-20 bg-[#f8f5f0]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
            {/* Informações de Contato */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:w-2/5"
            >
              <div className="bg-black p-8 md:p-10 rounded-lg border border-[#ffffff10] h-full">
                <h2 className="text-2xl md:text-3xl text-[#89764b] mb-8 uppercase tracking-tight border-b border-[#89764b]/30 pb-4">
                  Canais de Suporte
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#89764b]/10 rounded-full">
                      <Mail className="h-5 w-5 text-[#89764b]" />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-300 mb-1">E-mail</h3>
                      <a
                        href="mailto:sac@vinicolaamana.com"
                        className="text-gray-400 hover:text-[#89764b] transition-colors text-sm"
                      >
                        sac@vinicolaamana.com
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
                        +55 (19) 99842-3261
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
                        Estrada vicinal Alberto Bartholomei, s/n Barthô -<br />
                        Espírito Santo do Pinhal - SP CEP 13990-000
                      </address>
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
              className="lg:w-3/5"
            >
              <div className="bg-black p-8 md:p-10 rounded-lg border border-[#ffffff10]">
                <h2 className="text-2xl md:text-3xl text-[#89764b] mb-8 uppercase tracking-tight border-b border-[#89764b]/30 pb-4">
                  Envie sua Mensagem
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="Descreva sua dúvida ou problema..."
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
                      Mensagem enviada com sucesso! Responderemos em até 24
                      horas.
                    </motion.div>
                  )}
                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-900/20 text-red-300 rounded-sm border border-red-800/50 text-sm"
                    >
                      Erro ao enviar. Tente novamente ou envie para{" "}
                      <a
                        href="mailto:sac@vinicolaamana.com"
                        className="text-[#89764b] hover:text-[#756343] underline"
                      >
                        sac@vinicolaamana.com
                      </a>
                      .
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
