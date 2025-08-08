import { useState } from "react";
import { useCart } from "../context/useCart";
import { ShoppingCart, X, ArrowLeft, Wine, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { CartItem } from "../context/CartProvider";

// Interface para a resposta do pedido
interface OrderSummary {
  id?: number;
  number?: string;
  contact_name?: string;
  contact_email?: string;
  products?: { name: string; quantity: number; image?: { src: string } }[];
  total?: number;
}

const CartPage = () => {
  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const [customer, setCustomer] = useState({
    email: "",
    name: "",
    document: "",
    address: "",
    city: "",
    zipcode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);

  // Calcula o total do carrinho
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  // Incrementa a quantidade de um item
  const handleIncrement = (item: CartItem) => {
    addToCart({ ...item, quantity: 1 });
  };

  // Decrementa a quantidade de um item
  const handleDecrement = (item: CartItem) => {
    if ((item.quantity || 1) > 1) {
      addToCart({ ...item, quantity: -1 });
    } else {
      removeFromCart(item.id);
    }
  };

  // Função de checkout
  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    setOrderSummary(null);

    // Validações
    if (!cart.length) {
      setError("O carrinho está vazio!");
      setLoading(false);
      return;
    }
    if (
      !customer.email ||
      !customer.name ||
      !customer.document ||
      !customer.address ||
      !customer.city ||
      !customer.zipcode
    ) {
      setError("Preencha todos os campos obrigatórios!");
      setLoading(false);
      return;
    }

    // Monta o JSON para a Nuvemshop
    const orderData = {
      currency: "BRL",
      language: "pt",
      status: "open",
      gateway: "mercadopago",
      payment_status: "pending",
      products: cart.map((item) => ({
        variant_id: item.variant_id || 0,
        quantity: item.quantity || 1,
      })),
      customer: {
        email: customer.email,
        name: customer.name,
        document: customer.document,
        phone: "+55 11 99999-9999",
      },
      billing_address: {
        first_name: customer.name.split(" ")[0] || "Cliente",
        last_name: customer.name.split(" ").slice(1).join(" ") || "Sobrenome",
        address: customer.address,
        number: "s/n",
        city: customer.city,
        province: "SP",
        zipcode: customer.zipcode,
        country: "BR",
        phone: "+55 11 99999-9999",
      },
      shipping_address: {
        first_name: customer.name.split(" ")[0] || "Cliente",
        last_name: customer.name.split(" ").slice(1).join(" ") || "Sobrenome",
        address: customer.address,
        number: "s/n",
        city: customer.city,
        province: "SP",
        zipcode: customer.zipcode,
        country: "BR",
        phone: "+55 11 99999-9999",
      },
      shipping_pickup_type: "ship",
      shipping: "correios",
      shipping_option: "Correios - PAC",
      shipping_cost_customer: 20.0,
      shipping_cost_owner: 20.0,
      checkout_enabled: true,
    };

    try {
      const response = await fetch(
        "https://vinicola-amana-back.onrender.com/api/orders/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();

      setLoading(false);

      if (response.ok) {
        setOrderSummary(data);
        if (data.checkout_url) {
          window.location.href = data.checkout_url;
        } else if (data.id) {
          const fallbackUrl = `https://vinicolaamana.lojavirtualnuvem.com.br/checkout/${data.id}`;
          window.location.href = fallbackUrl;
        } else {
          setError(
            "Link de checkout não retornado. Contate o suporte ou tente novamente."
          );
        }
      } else {
        setError(`Erro ao criar pedido: ${data.error || "Tente novamente"}`);
      }
    } catch (err) {
      setLoading(false);
      setError("Erro ao conectar com o servidor. Tente novamente.");
      console.error("Erro ao iniciar checkout:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#d4d4d4] font-['Oswald'] antialiased">
      {/* Header do Carrinho */}
      <div className="bg-gradient-to-r from-[#89764b] to-[#756343] text-white py-4 sm:py-6 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity uppercase tracking-wider text-xs sm:text-sm"
              aria-label="Continuar comprando"
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Continuar Comprando</span>
              <span className="sm:hidden">Voltar</span>
            </Link>
            <h1 className="text-base sm:text-xl flex items-center uppercase tracking-tight">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="hidden sm:inline">Seu Carrinho</span>
              <span className="sm:hidden">Carrinho</span>
            </h1>
            <div className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full uppercase tracking-wide">
              {cart.reduce((total, item) => total + (item.quantity || 1), 0)}{" "}
              ITEM
              {cart.reduce((total, item) => total + (item.quantity || 1), 0) !==
                1 && "S"}
            </div>
          </div>
        </div>
      </div>

      {/* Corpo do Carrinho */}
      <div className="container mx-auto px-4 sm:px-8 py-6 sm:py-12 pt-16 sm:pt-20">
        {cart.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#89764b] to-[#a08d5f] rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
              <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>
            <h2 className="text-lg sm:text-2xl text-gray-800 mb-3 sm:mb-4 uppercase tracking-tight">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto leading-relaxed text-sm sm:text-base">
              Parece que você ainda não adicionou nenhum vinho ao carrinho.
            </p>
            <Link
              to="/vinhos"
              className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl uppercase tracking-wider text-xs sm:text-sm"
              aria-label="Explorar vinhos"
            >
              Explorar Vinhos
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-10">
            {/* Coluna esquerda - Itens e formulário */}
            <div className="lg:w-2/3 flex flex-col gap-6 sm:gap-10">
              {/* Lista de Itens */}
              <div className="bg-white rounded-xl shadow-lg border border-[#89764b]/10 overflow-hidden">
                <div className="hidden sm:grid sm:grid-cols-2 sm:gap-8 sm:p-6 bg-[#89764b]/5">
                  <div className="text-lg font-bold text-gray-900 uppercase tracking-tight">
                    Produto
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-lg font-bold text-gray-900 uppercase tracking-tight text-center">
                      Preço
                    </div>
                    <div className="text-lg font-bold text-gray-900 uppercase tracking-tight text-center">
                      Quantidade
                    </div>
                    <div className="text-lg font-bold text-gray-900 uppercase tracking-tight text-right">
                      Total
                    </div>
                  </div>
                </div>
                <ul className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <li
                      key={item.id}
                      className="p-3 sm:p-6 hover:bg-gray-50 transition-colors duration-300"
                    >
                      <div className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-8">
                        <div className="flex items-start space-x-3 sm:space-x-6">
                          <div className="relative flex-shrink-0">
                            <div className="w-16 h-16 sm:w-28 sm:h-28 bg-gray-50 rounded-lg flex items-center justify-center p-2 sm:p-4">
                              <img
                                src={item.image || ""}
                                alt={item.name}
                                className="max-h-full max-w-full object-contain mix-blend-multiply"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "/path/to/fallback-image.jpg";
                                }}
                              />
                            </div>
                            {(item.quantity || 1) > 1 && (
                              <span className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 bg-[#89764b] text-white text-xs sm:text-sm rounded-full h-5 w-5 sm:h-8 sm:w-8 flex items-center justify-center font-medium shadow-md">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm sm:text-lg text-gray-900 uppercase tracking-tight">
                              {item.name}
                            </h3>
                            <p className="text-xs sm:text-base text-gray-500 uppercase tracking-wider mt-1">
                              {item.category || "Vinho"}
                            </p>
                            <div className="sm:hidden mt-2">
                              <span className="font-medium text-gray-700 text-sm">
                                R${" "}
                                {Number(item.price || 0)
                                  .toFixed(2)
                                  .replace(".", ",")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="sm:hidden flex items-center justify-between mt-2 gap-2">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleDecrement(item)}
                              className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              aria-label="Reduzir quantidade"
                            >
                              -
                            </button>
                            <span className="px-2 sm:px-3 py-1 text-center min-w-[30px] border-x border-gray-200 font-medium text-sm">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => handleIncrement(item)}
                              className="px-2 sm:px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                              aria-label="Aumentar quantidade"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900 text-sm">
                              R${" "}
                              {(Number(item.price || 0) * (item.quantity || 1))
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              aria-label="Remover item"
                            >
                              <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </div>
                        </div>
                        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4 sm:items-center">
                          <div className="text-center text-gray-700 font-medium text-base">
                            R${" "}
                            {Number(item.price || 0)
                              .toFixed(2)
                              .replace(".", ",")}
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleDecrement(item)}
                                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="Reduzir quantidade"
                              >
                                -
                              </button>
                              <span className="px-5 py-2.5 text-center min-w-[56px] border-x border-gray-200 font-medium text-lg">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() => handleIncrement(item)}
                                className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 transition-colors"
                                aria-label="Aumentar quantidade"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-end space-x-4">
                            <span className="font-bold text-gray-900 text-base">
                              R${" "}
                              {(Number(item.price || 0) * (item.quantity || 1))
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-2.5"
                              aria-label="Remover item"
                            >
                              <X className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cupom e Limpar Carrinho */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-8">
                <div className="w-full sm:w-auto flex-1">
                  <div className="flex rounded-lg overflow-hidden shadow-md">
                    <input
                      type="text"
                      placeholder="CÓDIGO DE CUPOM"
                      className="flex-1 px-3 sm:px-5 py-2 sm:py-4 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] uppercase tracking-wider text-xs sm:text-lg"
                      aria-label="Inserir código de cupom"
                    />
                    <button
                      className="px-3 sm:px-5 py-2 sm:py-4 bg-[#89764b] text-white hover:bg-[#756343] transition-all duration-300 hover:scale-105 uppercase tracking-wider text-xs sm:text-lg"
                      aria-label="Aplicar cupom"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
                <button
                  onClick={clearCart}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors uppercase tracking-wider text-xs sm:text-lg"
                  aria-label="Limpar carrinho"
                >
                  <X className="h-3 w-3 sm:h-5 sm:w-5 mr-1" />
                  Limpar Carrinho
                </button>
              </div>

              {/* Formulário de Dados do Cliente */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 border border-[#89764b]/10">
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 pb-3 border-b uppercase tracking-tight">
                  Dados do Cliente
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-8">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs sm:text-lg text-gray-600 uppercase tracking-wider mb-2"
                    >
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={customer.email}
                      onChange={(e) =>
                        setCustomer({ ...customer, email: e.target.value })
                      }
                      placeholder="Digite seu email"
                      className="w-full px-3 sm:px-5 py-2 sm:py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] text-sm sm:text-lg"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs sm:text-lg text-gray-600 uppercase tracking-wider mb-2"
                    >
                      Nome *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={customer.name}
                      onChange={(e) =>
                        setCustomer({ ...customer, name: e.target.value })
                      }
                      placeholder="Digite seu nome"
                      className="w-full px-3 sm:px-5 py-2 sm:py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] text-sm sm:text-lg"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="document"
                      className="block text-xs sm:text-lg text-gray-600 uppercase tracking-wider mb-2"
                    >
                      CPF (somente números) *
                    </label>
                    <input
                      id="document"
                      type="text"
                      value={customer.document}
                      onChange={(e) =>
                        setCustomer({ ...customer, document: e.target.value })
                      }
                      placeholder="Digite seu CPF"
                      className="w-full px-3 sm:px-5 py-2 sm:py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] text-sm sm:text-lg"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-xs sm:text-lg text-gray-600 uppercase tracking-wider mb-2"
                    >
                      Endereço *
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={customer.address}
                      onChange={(e) =>
                        setCustomer({ ...customer, address: e.target.value })
                      }
                      placeholder="Digite seu endereço"
                      className="w-full px-3 sm:px-5 py-2 sm:py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] text-sm sm:text-lg"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-xs sm:text-lg text-gray-600 uppercase tracking-wider mb-2"
                    >
                      Cidade *
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={customer.city}
                      onChange={(e) =>
                        setCustomer({ ...customer, city: e.target.value })
                      }
                      placeholder="Digite sua cidade"
                      className="w-full px-3 sm:px-5 py-2 sm:py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] text-sm sm:text-lg"
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zipcode"
                      className="block text-xs sm:text-lg text-gray-600 uppercase tracking-wider mb-2"
                    >
                      CEP (somente números) *
                    </label>
                    <input
                      id="zipcode"
                      type="text"
                      value={customer.zipcode}
                      onChange={(e) =>
                        setCustomer({ ...customer, zipcode: e.target.value })
                      }
                      placeholder="Digite seu CEP"
                      className="w-full px-3 sm:px-5 py-2 sm:py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] text-sm sm:text-lg"
                      aria-required="true"
                    />
                  </div>
                </div>
                <p className="text-xs sm:text-base text-gray-500 mt-3 sm:mt-4">
                  * Campos obrigatórios
                </p>
              </div>
            </div>

            {/* Coluna direita - Resumo do Pedido */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 border border-[#89764b]/10 lg:sticky lg:top-28">
                {orderSummary && (
                  <div className="mb-4 sm:mb-8 border-b pb-4 sm:pb-6">
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-tight">
                      Resumo do Pedido Criado
                    </h3>
                    <div className="space-y-2 sm:space-y-4 text-sm sm:text-lg">
                      <p>
                        <strong>Número do Pedido:</strong>{" "}
                        {orderSummary.number ||
                          orderSummary.id?.toString() ||
                          "N/A"}
                      </p>
                      <p>
                        <strong>Cliente:</strong>{" "}
                        {orderSummary.contact_name || customer.name} (
                        {orderSummary.contact_email || customer.email})
                      </p>
                      <p>
                        <strong>Produtos:</strong>{" "}
                        {orderSummary.products
                          ?.map((p) => `${p.name} (Qtd: ${p.quantity})`)
                          .join(", ") ||
                          cart
                            .map(
                              (item) =>
                                `${item.name} (Qtd: ${item.quantity || 1})`
                            )
                            .join(", ")}
                      </p>
                      <p>
                        <strong>Total:</strong> R${" "}
                        {parseFloat(
                          (orderSummary.total || total + 20).toString()
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                      </p>
                      {orderSummary?.products?.[0]?.image?.src && (
                        <img
                          src={orderSummary.products[0].image.src}
                          alt={orderSummary.products[0].name || "Produto"}
                          className="max-w-[120px] sm:max-w-[200px] rounded-lg mt-2 sm:mt-4"
                        />
                      )}
                      <p>
                        <strong>Status:</strong> Aguardando pagamento
                      </p>
                    </div>
                  </div>
                )}

                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 pb-3 border-b flex items-center uppercase tracking-tight">
                  <Wine className="h-4 w-4 sm:h-6 sm:w-6 mr-2 text-[#89764b]" />
                  Resumo
                </h3>

                <div className="space-y-6 mb-4 sm:mb-8">
                  <div className="flex justify-between">
                    <span className="text-gray-600 uppercase tracking-wider text-sm sm:text-lg">
                      Subtotal
                    </span>
                    <span className="text-gray-900 font-medium text-base sm:text-xl">
                      R${total.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 uppercase tracking-wider text-sm sm:text-lg">
                      Frete
                    </span>
                    <span className="text-gray-900 font-medium text-base sm:text-xl">
                      R$ 20,00
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="text-gray-600 uppercase tracking-wider text-sm sm:text-lg">
                      Desconto
                    </span>
                    <span className="text-[#89764b] font-medium text-base sm:text-xl">
                      - R$ 0,00
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-3 border-t border-b">
                  <span className="font-bold text-base sm:text-2xl uppercase tracking-tight">
                    Total
                  </span>
                  <span className="text-lg sm:text-3xl text-[#89764b]">
                    R${(total + 20).toFixed(2).replace(".", ",")}
                  </span>
                </div>

                {error && (
                  <div className="flex items-center justify-between bg-red-50 text-red-600 p-3 sm:p-5 rounded-lg mt-4">
                    <span className="text-sm sm:text-lg">{error}</span>
                    <button
                      onClick={() => setError("")}
                      className="text-red-600 hover:text-red-800"
                      aria-label="Fechar erro"
                    >
                      <X className="h-4 w-4 sm:h-6 w-6" />
                    </button>
                  </div>
                )}
                {loading && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 mt-4">
                    <Wine className="h-4 w-4 sm:h-6 sm:w-6 animate-spin" />
                    <span className="text-sm sm:text-lg">Carregando...</span>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full mt-4 sm:mt-8 bg-gradient-to-r from-[#89764b] to-[#a08d5f] hover:from-[#756343] hover:to-[#89764b] text-white py-3 sm:py-5 px-4 sm:px-10 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 uppercase tracking-wider text-xs sm:text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Finalizar compra"
                >
                  Finalizar Compra
                  <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
                </button>

                <div className="mt-3 sm:mt-6 text-center">
                  <p className="text-xs sm:text-lg text-gray-500 uppercase tracking-wider">
                    ou{" "}
                    <Link
                      to="/vinhos"
                      className="text-[#89764b] hover:text-[#756343] hover:underline font-medium"
                      aria-label="Continuar comprando"
                    >
                      continuar comprando
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
