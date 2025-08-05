import { useState } from "react";
import { useCart } from "../context/useCart";
import { ShoppingCart, X, ArrowLeft, Wine, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { CartItem } from "../context/CartProvider";

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
  const [orderSummary, setOrderSummary] = useState(null);

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
      setError(
        "Preencha todos os dados do cliente (email, nome, CPF, endereço, cidade, CEP)!"
      );
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
        variant_id: item.variant_id || "", // Garante que variant_id não seja undefined
        quantity: item.quantity || 1,
      })),
      customer: {
        email: customer.email,
        name: customer.name,
        document: customer.document,
        phone: "+55 11 99999-9999", // Substitua por campo dinâmico se possível
      },
      billing_address: {
        first_name: customer.name.split(" ")[0] || "Cliente",
        last_name: customer.name.split(" ").slice(1).join(" ") || "Sobrenome",
        address: customer.address,
        number: "s/n", // Substitua por campo dinâmico se possível
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

    console.log("Cart items:", cart); // Depuração
    console.log("Order data sent:", orderData); // Depuração

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
          // Fallback manual com base no domínio da loja
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
    <div className="min-h-screen bg-[#f8f5f0] pb-20">
      {/* Header do Carrinho */}
      <div className="bg-gradient-to-r from-[#89764b] to-[#756343] text-white py-6 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity font-oswald uppercase tracking-wider text-xs sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Continuar Comprando</span>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold flex items-center font-oswald uppercase tracking-tight">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              <span className="hidden sm:inline">Seu Carrinho</span>
              <span className="sm:hidden">Carrinho</span>
            </h1>
            <div className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-full font-oswald uppercase tracking-wide">
              {cart.reduce((total, item) => total + (item.quantity || 1), 0)}{" "}
              ITEM
              {cart.reduce((total, item) => total + (item.quantity || 1), 0) !==
                1 && "S"}
            </div>
          </div>
        </div>
      </div>

      {/* Corpo do Carrinho */}
      <div className="container mx-auto px-4 py-6">
        {cart.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#89764b] to-[#a08d5f] rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
              <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 font-oswald uppercase tracking-tight">
              Seu carrinho está vazio
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed text-sm sm:text-base">
              Parece que você ainda não adicionou nenhum vinho ao carrinho
            </p>
            <Link
              to="/vinhos"
              className="inline-flex items-center px-6 py-3 sm:px-10 sm:py-4 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-oswald uppercase tracking-wider text-xs sm:text-sm"
            >
              Explorar Vinhos
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Lista de Itens */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <li
                    key={item.id}
                    className="p-4 hover:bg-gray-50/50 transition-colors duration-300"
                  >
                    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-6 flex items-start space-x-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center p-2 sm:p-3">
                            <img
                              src={item.image || ""}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                              style={{
                                mixBlendMode: "multiply",
                                filter:
                                  "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                              }}
                            />
                          </div>
                          {(item.quantity || 1) > 1 && (
                            <span className="absolute -top-2 -right-2 bg-[#89764b] text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-medium shadow-md">
                              {item.quantity}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base font-oswald uppercase tracking-tight">
                            {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 font-oswald uppercase tracking-tight mt-1">
                            {item.category || "Vinho Tinto"}
                          </p>
                          <div className="sm:hidden mt-2">
                            <span className="font-medium text-gray-700">
                              R${" "}
                              {Number(item.price || 0)
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="sm:hidden flex items-center justify-between mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleDecrement(item)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                            aria-label="Reduzir quantidade"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-center min-w-[30px] border-x border-gray-200 font-medium text-sm">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => handleIncrement(item)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
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
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="hidden sm:grid sm:col-span-6 grid-cols-6 items-center">
                        <div className="col-span-2 text-center text-gray-700 font-medium text-sm">
                          R${" "}
                          {Number(item.price || 0)
                            .toFixed(2)
                            .replace(".", ",")}
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleDecrement(item)}
                              className="px-2 py-1 sm:px-3 sm:py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                              aria-label="Reduzir quantidade"
                            >
                              -
                            </button>
                            <span className="px-2 py-1 sm:px-3 sm:py-2 text-center min-w-[30px] sm:min-w-[40px] border-x border-gray-200 font-medium text-sm">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => handleIncrement(item)}
                              className="px-2 py-1 sm:px-3 sm:py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                              aria-label="Aumentar quantidade"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center justify-end space-x-2 sm:space-x-4">
                          <span className="font-bold text-gray-900 text-sm sm:text-base">
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
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cupom e Limpar Carrinho */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="w-full">
                <div className="flex rounded-lg overflow-hidden shadow-sm">
                  <input
                    type="text"
                    placeholder="CÓDIGO DE CUPOM"
                    className="flex-1 px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#89764b]/50 font-oswald uppercase tracking-wider text-xs sm:text-sm"
                  />
                  <button className="px-4 py-3 bg-gray-800 text-white hover:bg-gray-700 transition-colors font-oswald uppercase tracking-wider text-xs sm:text-sm">
                    Aplicar
                  </button>
                </div>
              </div>
              <button
                onClick={clearCart}
                className="flex items-center text-gray-600 hover:text-red-600 transition-colors font-oswald uppercase tracking-wider text-xs sm:text-sm whitespace-nowrap"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Limpar Carrinho
              </button>
            </div>

            {/* Formulário de Dados do Cliente */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 pb-3 border-b font-oswald uppercase tracking-tight">
                Dados do Cliente
              </h3>
              <div className="space-y-4">
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer({ ...customer, email: e.target.value })
                  }
                  placeholder="Email"
                  className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#89764b]/50"
                />
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer({ ...customer, name: e.target.value })
                  }
                  placeholder="Nome"
                  className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#89764b]/50"
                />
                <input
                  type="text"
                  value={customer.document}
                  onChange={(e) =>
                    setCustomer({ ...customer, document: e.target.value })
                  }
                  placeholder="CPF (somente números)"
                  className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#89764b]/50"
                />
                <input
                  type="text"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer({ ...customer, address: e.target.value })
                  }
                  placeholder="Endereço"
                  className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#89764b]/50"
                />
                <input
                  type="text"
                  value={customer.city}
                  onChange={(e) =>
                    setCustomer({ ...customer, city: e.target.value })
                  }
                  placeholder="Cidade"
                  className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#89764b]/50"
                />
                <input
                  type="text"
                  value={customer.zipcode}
                  onChange={(e) =>
                    setCustomer({ ...customer, zipcode: e.target.value })
                  }
                  placeholder="CEP (somente números)"
                  className="w-full px-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#89764b]/50"
                />
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 sticky bottom-0 sm:relative sm:bottom-auto">
              {orderSummary && (
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 pb-3 border-b font-oswald uppercase tracking-tight">
                    Resumo do Pedido Criado
                  </h3>
                  <p>
                    <strong>Número do Pedido:</strong>{" "}
                    {orderSummary.number || orderSummary.id}
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
                          (item) => `${item.name} (Qtd: ${item.quantity || 1})`
                        )
                        .join(", ")}
                  </p>
                  <p>
                    <strong>Total:</strong> R${" "}
                    {parseFloat(orderSummary.total || total + 20)
                      .toFixed(2)
                      .replace(".", ",")}
                  </p>
                  {orderSummary?.products?.[0]?.image?.src && (
                    <img
                      src={orderSummary.products[0].image.src}
                      alt={orderSummary.products[0].name}
                      style={{ maxWidth: "200px" }}
                    />
                  )}
                  <p>
                    <strong>Status:</strong> Aguardando pagamento
                  </p>
                </div>
              )}

              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 pb-3 border-b flex items-center font-oswald uppercase tracking-tight">
                <Wine className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-[#89764b]" />
                Resumo
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-oswald uppercase tracking-wider text-xs sm:text-sm">
                    Subtotal
                  </span>
                  <span className="text-gray-900 font-medium text-sm sm:text-base">
                    R${total.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-oswald uppercase tracking-wider text-xs sm:text-sm">
                    Frete
                  </span>
                  <span className="text-gray-900 font-medium text-sm sm:text-base">
                    R$ 20,00
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-600 font-oswald uppercase tracking-wider text-xs sm:text-sm">
                    Desconto
                  </span>
                  <span className="text-[#89764b] font-medium text-sm sm:text-base">
                    - R$ 0,00
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-3 border-t border-b">
                <span className="font-bold text-base sm:text-lg font-oswald uppercase tracking-tight">
                  Total
                </span>
                <span className="font-bold text-lg sm:text-xl text-[#89764b]">
                  R${(total + 20).toFixed(2).replace(".", ",")}
                </span>
              </div>

              {error && (
                <div
                  className="text-red-500 text-center mt-4"
                  dangerouslySetInnerHTML={{ __html: error }}
                />
              )}
              {loading && (
                <div className="text-center mt-4 text-gray-600">
                  Carregando...
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-4 bg-gradient-to-r from-[#89764b] to-[#a08d5f] hover:from-[#756343] hover:to-[#89764b] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-oswald uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 disabled:opacity-50"
              >
                Finalizar Compra
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs sm:text-sm text-gray-500 font-oswald uppercase tracking-wider">
                  ou{" "}
                  <Link
                    to="/vinhos"
                    className="text-[#89764b] hover:underline font-medium"
                  >
                    continuar comprando
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
