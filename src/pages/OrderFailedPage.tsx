import { XCircle, RefreshCw, Home, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const OrderFailedPage = () => {
  return (
    <div className="min-h-screen bg-[#d4d4d4] font-['Oswald'] antialiased">
      {/* Header */}
      <div className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-xl uppercase tracking-tight hover:text-[#89764b] transition-colors"
            >
              Amana Vineyards
            </Link>
            <div className="w-6 h-6"></div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Ícone de Erro */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="h-12 w-12 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-red-600/30 animate-ping"></div>
              </div>
            </motion.div>

            {/* Título e Mensagem */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-black mb-6">
              Pagamento Não Processado
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Ocorreu um problema ao processar seu pagamento. Sua compra não foi
              finalizada.
            </p>

            {/* Detalhes do Erro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-red-50 border border-red-200 p-6 md:p-8 rounded-lg mb-8"
            >
              <h3 className="text-xl font-light mb-4 text-red-800">
                Possíveis Causas
              </h3>
              <ul className="text-left space-y-3 text-red-700">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span>Problemas temporários com a operadora do cartão</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span>Dados do cartão incorretos ou incompletos</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span>Limite insuficiente no cartão</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span>Problemas de conexão com a internet</span>
                </li>
              </ul>
            </motion.div>

            {/* Soluções */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-black/80 text-white p-6 rounded-lg mb-8"
            >
              <h3 className="text-xl font-light mb-4 text-[#89764b]">
                O Que Fazer Agora
              </h3>
              <ul className="text-left space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#89764b] rounded-full"></div>
                  <span>
                    Tente novamente com outro cartão ou método de pagamento
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#89764b] rounded-full"></div>
                  <span>Verifique os dados do cartão e tente novamente</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#89764b] rounded-full"></div>
                  <span>Entre em contato com sua operadora de cartão</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#89764b] rounded-full"></div>
                  <span>Ou fale diretamente conosco para ajudarmos</span>
                </li>
              </ul>
            </motion.div>

            {/* Botões de Ação */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#89764b] hover:bg-[#756343] text-white transition-colors uppercase tracking-wider text-sm font-light"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar Novamente
              </button>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-black text-black hover:bg-black hover:text-white transition-all uppercase tracking-wider text-sm font-light"
              >
                <Home className="h-4 w-4" />
                Voltar ao Início
              </Link>
            </motion.div>

            {/* Suporte Imediato */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20"
            >
              <h4 className="text-lg font-light text-black mb-3">
                Precisa de Ajuda Imediata?
              </h4>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="tel:+5519971799448"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white transition-colors rounded-lg"
                >
                  <Phone className="h-4 w-4" />
                  (19) 97179-9448
                </a>
                <a
                  href="mailto:sac@vinicolaamana.com.br"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white transition-colors rounded-lg"
                >
                  sac@vinicolaamana.com.br
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OrderFailedPage;
