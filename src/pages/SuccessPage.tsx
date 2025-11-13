import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Wine, ArrowRight, Home } from "lucide-react";
import { motion } from "framer-motion";

interface NuvemshopOrder {
  id: number | string;
  created_at: string;
  payment_status: string;
  gateway?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const OrderSuccessPage = () => {
  const [params] = useSearchParams();
  const orderId = params.get("order_id");

  const [order, setOrder] = useState<NuvemshopOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    fetch(`${API_URL}/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => setOrder(data))
      .catch((err) => console.error("Erro ao carregar pedido:", err))
      .finally(() => setLoading(false));
  }, [orderId]);

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
            <Wine className="h-6 w-6 text-[#89764b]" />
          </div>
        </div>
      </div>

      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-[#89764b] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-[#89764b]/30 animate-ping"></div>
              </div>
            </motion.div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-black mb-6">
              Compra Confirmada!
            </h1>

            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
              Obrigado por escolher os vinhos Amana. Seu pedido foi processado
              com sucesso e em breve estará a caminho.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/50 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-white/20 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600 uppercase tracking-wider mb-1">
                    Nº do Pedido
                  </p>
                  <p className="text-lg font-medium text-black">
                    {loading ? "Carregando..." : order?.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 uppercase tracking-wider mb-1">
                    Data da Compra
                  </p>
                  <p className="text-lg font-medium text-black">
                    {loading
                      ? "..."
                      : order?.created_at
                      ? new Date(order.created_at).toLocaleDateString("pt-BR")
                      : "Data indisponível"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 uppercase tracking-wider mb-1">
                    Forma de Pagamento
                  </p>
                  <p className="text-lg font-medium text-black">
                    {loading ? "..." : order?.gateway || "Mercado Pago"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 uppercase tracking-wider mb-1">
                    Status
                  </p>
                  <p className="text-lg font-medium text-[#89764b]">
                    {loading ? "..." : order?.payment_status}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Informações */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-black/80 text-white p-6 rounded-lg mb-8"
            >
              <h3 className="text-xl font-light mb-4 text-[#89764b]">
                Próximos Passos
              </h3>
              <ul className="text-left space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#89764b] rounded-full"></div>
                  <span>Você receberá um e-mail de confirmação</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#89764b] rounded-full"></div>
                  <span>Seu pedido será preparado para envio</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#89764b] rounded-full"></div>
                  <span>Acompanhe o status pelo e-mail cadastrado</span>
                </li>
              </ul>
            </motion.div>

            {/* Botões */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#89764b] hover:bg-[#756343] text-white transition-colors uppercase tracking-wider text-sm font-light"
              >
                <Home className="h-4 w-4" />
                Voltar ao Início
              </Link>

              <Link
                to="/vinhos"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-black text-black hover:bg-black hover:text-white transition-all uppercase tracking-wider text-sm font-light"
              >
                Continuar Comprando
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Contato */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 p-4 bg-white/30 rounded-lg"
            >
              <p className="text-sm text-gray-600">
                Dúvidas? Entre em contato:{" "}
                <a
                  href="mailto:sac@vinicolaamana.com.br"
                  className="text-[#89764b] hover:underline"
                >
                  sac@vinicolaamana.com.br
                </a>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OrderSuccessPage;
