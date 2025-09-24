import React, { useState } from "react";
import { motion } from "framer-motion";
import {  Settings } from "lucide-react";
import toast from "react-hot-toast";

const ConfigPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    apiKey: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simula API
      toast.success("Configurações salvas com sucesso!", {
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
      setFormData({ email: "", apiKey: "" });
    } catch {
      toast.error("Erro ao salvar configurações. Tente novamente.", {
        position: "bottom-right",
        style: {
          background: "#9a3324",
          color: "#fff",
          borderRadius: "8px",
          padding: "16px 24px",
          fontFamily: "'Oswald', sans-serif",
        },
      });
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
            Configurações do App
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm md:text-base max-w-3xl mx-auto text-[#9c9c9c] leading-relaxed"
          >
            Configure a integração do app Vinícola Amana com sua loja Nuvemshop.
          </motion.p>
        </div>
      </section>

      {/* Formulário de Configuração */}
      <section className="py-12 md:py-16 lg:py-20 bg-[#f8f5f0]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-black p-8 md:p-10 rounded-lg border border-[#ffffff10]">
              <h2 className="text-2xl md:text-3xl text-[#89764b] mb-8 uppercase tracking-tight border-b border-[#89764b]/30 pb-4">
                Configurar Integração
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-gray-300 mb-3 uppercase text-xs tracking-wider"
                  >
                    Email da Loja
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 bg-[#1a1a1a] border border-[#ffffff10] rounded-sm focus:border-[#89764b] focus:ring-1 focus:ring-[#89764b]/30 transition-all text-white placeholder-gray-500 text-sm"
                    placeholder="ex: loja@vinicolaamana.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="apiKey"
                    className="block text-gray-300 mb-3 uppercase text-xs tracking-wider"
                  >
                    Chave API
                  </label>
                  <input
                    type="text"
                    id="apiKey"
                    name="apiKey"
                    value={formData.apiKey}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-3 bg-[#1a1a1a] border border-[#ffffff10] rounded-sm focus:border-[#89764b] focus:ring-1 focus:ring-[#89764b]/30 transition-all text-white placeholder-gray-500 text-sm"
                    placeholder="Insira sua chave API"
                  />
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
                      "Salvando..."
                    ) : (
                      <>
                        <Settings className="h-4 w-4" />
                        Salvar Configurações
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ConfigPage;