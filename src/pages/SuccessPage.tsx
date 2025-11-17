/* src/pages/SuccessPage.tsx */
import { useLocation, Link, useParams } from "react-router-dom";
import { CheckCircle, Wine, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { translateOrderStatus } from "../utils/enumUtils";

interface ProductItem {
  name: string;
  quantity: number;
  id: number | string;
  image?: { src?: string } | string;
}

interface OrderSummary {
  id?: number;
  number?: string;
  contact_name?: string;
  contact_email?: string;
  products?: ProductItem[];
  total?: number | string;
  status: string;
  // campos que seu backend pode retornar
  address?: string;
  city?: string;
  zipcode?: string;
  document?: string;
}

interface Customer {
  email?: string;
  name?: string;
  document?: string;
  address?: string;
  city?: string;
  zipcode?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const SuccessPage: React.FC = () => {
  // pega id da URL: /sucesso/:id
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation();

  // caso você ainda envie dados pelo state, ele serve como fallback
  const fallbackOrder: OrderSummary | null = state?.orderSummary || null;
  const fallbackCustomer: Customer | null = state?.customer || null;

  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(
    fallbackOrder
  );
  const [customer, setCustomer] = useState<Customer | null>(fallbackCustomer);
  const [similarProducts, setSimilarProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        // Ajuste da rota: /api/orders/:id (conforme seu controller NestJS)
        const res = await fetch(`${API_URL}/api/orders/${id}`);
        if (!res.ok) {
          throw new Error(`Erro ${res.status} ao buscar pedido`);
        }
        const data = await res.json();

        const orderSummaryData: OrderSummary = data.orderSummary;
        const orderCustomerData: Customer = data.customer;

        setOrderSummary(orderSummaryData);

        setCustomer(orderCustomerData);
      } catch (err: unknown) {
        console.error("Erro ao carregar pedido:", err);
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const loadSimilares = async () => {
      try {
        if (!orderSummary?.products || orderSummary.products.length === 0)
          return;

        // pega id do primeiro produto (ajuste se seu schema usar another field)
        const first = orderSummary.products[0];
        const prodId = first?.id;

        if (!prodId) return;

        const similarResponse = await fetch(
          `${API_URL}/api/products/${prodId}/similares`
        );
        if (!similarResponse.ok) {
          console.warn("Similares retornou não-ok", similarResponse.status);
          return;
        }
        const data = await similarResponse.json();
        setSimilarProducts(data || []);
      } catch (err) {
        console.error("Erro ao carregar similares", err);
      }
    };

    loadSimilares();
  }, [orderSummary]);

  const formatTotal = (total?: number | string) => {
    if (total === undefined || total === null) return "N/A";
    const parsed = typeof total === "string" ? parseFloat(total) : total;
    if (isNaN(parsed as number)) return "N/A";
    return (parsed as number).toFixed(2).replace(".", ",");
  };

  return (
    <div className="min-h-screen bg-[#d4d4d4] font-['Oswald'] antialiased">
      <div className="bg-gradient-to-r from-[#89764b] to-[#756343] text-white py-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity uppercase tracking-wide text-sm"
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

            {loading && <p>Carregando pedido...</p>}
            {error && <p className="text-red-600">Erro: {error}</p>}

            {!loading && !error && (
              <div className="space-y-3 text-sm md:text-base text-gray-700">
                <p>
                  <strong>Número do Pedido:</strong>{" "}
                  {orderSummary?.number ||
                    orderSummary?.id?.toString() ||
                    "N/A"}
                </p>
                <p>
                  <strong>Cliente:</strong>{" "}
                  {orderSummary?.contact_name || customer?.name || "Cliente"} (
                  {orderSummary?.contact_email || customer?.email || "N/A"})
                </p>
                <p>
                  <strong>Endereço de Entrega:</strong>{" "}
                  {customer
                    ? `${customer.address || "N/A"}, ${customer.city || ""}, ${
                        customer.zipcode || ""
                      }`
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
                  <strong>Status:</strong>{" "}
                  {translateOrderStatus(orderSummary?.status ?? "")}
                </p>
              </div>
            )}

            {orderSummary?.products && orderSummary.products.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm md:text-base font-bold text-gray-900 mb-3 uppercase tracking-tight">
                  Produtos Comprados
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {orderSummary.products.map((product, index) => {
                    // suporta image como string ou objeto { src }
                    let imageSrc = "/path/to/fallback-image.jpg";
                    if (typeof product.image === "string") {
                      imageSrc = product.image;
                    } else if (
                      product.image &&
                      typeof product.image === "object"
                    ) {
                      imageSrc =
                        product.image.src || "/path/to/fallback-image.jpg";
                    }

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex flex-col items-center"
                      >
                        <img
                          src={imageSrc}
                          alt={product.name || "Produto"}
                          className="w-[150px] h-[150px] rounded-lg shadow-md object-contain bg-[#d4d4d4] p-2"
                          onError={(e) => {
                            e.currentTarget.src = "/path/to/fallback-image.jpg";
                          }}
                        />
                        <p className="text-xs md:text-sm text-gray-600 mt-2 text-center line-clamp-2">
                          {product.name} (Qtd: {product.quantity})
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SIMILARES */}
          {similarProducts.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-tight">
                Você também pode gostar
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similarProducts.map((prod, i) => {
                  // suporta image como string ou objeto { src }
                  let imageSrc = "/path/to/fallback-image.jpg";
                  if (typeof prod.image === "string") {
                    imageSrc = prod.image;
                  } else if (prod.image && typeof prod.image === "object") {
                    imageSrc = prod.image.src || "/path/to/fallback-image.jpg";
                  }

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white shadow-md rounded-lg p-3 flex flex-col items-center"
                    >
                      <img
                        src={imageSrc}
                        alt={prod.name}
                        className="w-[130px] h-[130px] object-contain rounded"
                      />

                      <p className="text-sm text-center mt-2">{prod.name}</p>

                      <Link
                        to={`/produto/${prod.id}`}
                        className="mt-3 text-[#89764b] font-semibold hover:underline text-xs"
                      >
                        Ver produto
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link
              to="/vinhos"
              className="flex items-center justify-center px-6 py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all hover:scale-105 uppercase tracking-wide text-sm md:text-base shadow-md"
            >
              Continuar Comprando
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center px-6 py-3 bg-transparent border border-[#89764b] text-[#89764b] hover:bg-[#89764b]/10 rounded-lg transition-all hover:scale-105 uppercase tracking-wide text-sm md:text-base shadow-md"
            >
              Página Inicial
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessPage;
