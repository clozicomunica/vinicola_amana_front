import { useLocation, Link } from "react-router-dom";
import { CheckCircle, Wine, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface OrderSummary {
  id?: number;
  number?: string;
  contact_name?: string;
  contact_email?: string;
  products?: { name: string; quantity: number; image?: { src: string } }[];
  total?: number | string;
}

interface Customer {
  email: string;
  name: string;
  document: string;
  address: string;
  city: string;
  zipcode: string;
}

const SuccessPage = () => {
  const { state } = useLocation();
  const orderSummary: OrderSummary | null = state?.orderSummary || null;
  const customer: Customer | null = state?.customer || null;

  // Função para formatar o total de forma segura
  const formatTotal = (total?: number | string) => {
    if (total === undefined || total === null) return "N/A";
    const parsed = typeof total === "string" ? parseFloat(total) : total;
    if (isNaN(parsed)) return "N/A";
    return parsed.toFixed(2).replace(".", ",");
  };

  return (
    <div className="min-h-screen bg-[#f8f5f0] font-['Oswald'] antialiased">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#89764b] to-[#756343] text-white py-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity uppercase tracking-wide text-sm"
              aria-label="Voltar à página inicial"
            >
              <ChevronRight className="h-4 w-4 mr-1 transform rotate-180" />
              <span className="hidden sm:inline">Voltar à Home</span>
              <span className="sm:hidden">Home</span>
            </Link>
            <h1 className="text-lg md:text-xl flex items-center uppercase tracking-tight">
              <CheckCircle className="h-5 w-5 mr-2" />
              Pedido Confirmado
            </h1>
            <div className="w-4" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-[#89764b]/10 p-6 md:p-10"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-[#89764b] to-[#a08d5f] rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-2xl md:text-3xl text-gray-900 uppercase tracking-tight mb-2">
              Pedido Realizado com Sucesso!
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-lg mx-auto font-light">
              Obrigado por escolher a Vinícola Amana. Você receberá um e-mail
              com os detalhes do pedido e instruções de pagamento.
            </p>
          </div>

          <div className="border-t border-b border-[#89764b]/10 py-6 mb-8">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight flex items-center">
              <Wine className="h-5 w-5 mr-2 text-[#89764b]" />
              Detalhes do Pedido
            </h3>
            <div className="space-y-3 text-sm md:text-base text-gray-700">
              <p>
                <strong>Número do Pedido:</strong>{" "}
                {orderSummary?.number || orderSummary?.id?.toString() || "N/A"}
              </p>
              <p>
                <strong>Cliente:</strong>{" "}
                {orderSummary?.contact_name || customer?.name || "Cliente"} (
                {orderSummary?.contact_email || customer?.email || "N/A"})
              </p>
              <p>
                <strong>Endereço de Entrega:</strong>{" "}
                {customer
                  ? `${customer.address}, ${customer.city}, ${customer.zipcode}`
                  : "N/A"}
              </p>
              <p>
                <strong>Produtos:</strong>{" "}
                {orderSummary?.products
                  ?.map((p) => `${p.name} (Qtd: ${p.quantity})`)
                  .join(", ") || "N/A"}
              </p>
              <p>
                <strong>Total:</strong> R$ {formatTotal(orderSummary?.total)}
              </p>
              <p>
                <strong>Status:</strong> Aguardando pagamento
              </p>
            </div>

            {/* Grid de Imagens dos Produtos */}
            {orderSummary?.products && orderSummary.products.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3 uppercase tracking-tight">
                  Produtos Comprados
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {orderSummary.products.map((product, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex flex-col items-center"
                    >
                      <img
                        src={
                          product.image?.src || "/path/to/fallback-image.jpg"
                        }
                        alt={product.name || "Produto"}
                        className="max-w-[120px] md:max-w-[150px] h-auto rounded-lg shadow-md object-contain mix-blend-multiply"
                        onError={(e) => {
                          e.currentTarget.src = "/path/to/fallback-image.jpg";
                        }}
                      />
                      <p className="text-xs md:text-sm text-gray-600 mt-2 text-center line-clamp-2">
                        {product.name} (Qtd: {product.quantity})
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/vinhos"
              className="flex items-center justify-center px-6 py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all hover:scale-105 uppercase tracking-wide text-sm md:text-base shadow-md"
              aria-label="Continuar comprando"
            >
              Continuar Comprando
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3 bg-transparent border border-[#89764b] text-[#89764b] hover:bg-[#89764b]/10 rounded-lg transition-all hover:scale-105 uppercase tracking-wide text-sm md:text-base shadow-md"
              aria-label="Voltar à página inicial"
            >
              Voltar à Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;
