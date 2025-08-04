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
  }); // Estado pra dados do cliente

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleIncrement = (item: CartItem) => {
    addToCart({ ...item, quantity: 1 });
  };

  const handleDecrement = (item: CartItem) => {
    if (item.quantity > 1) {
      addToCart({ ...item, quantity: -1 });
    } else {
      removeFromCart(item.id);
    }
  };

  const handleCheckout = async () => {
    // Mapeia os itens do carrinho
    const cartItems = cart.map((item) => ({
      id: item.id,
      quantity: item.quantity || 1, // Ajuste se houver variantes
    }));

    // Validação básica
    if (!cartItems.length) {
      alert("O carrinho está vazio!");
      return;
    }
    if (!customer.email || !customer.name || !customer.document) {
      alert("Preencha todos os dados do cliente (email, nome e CPF)!");
      return;
    }

    try {
      const response = await fetch(
        "https://vinicola-amana-back.onrender.com/api/products/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items: cartItems, customer }),
        }
      );

      if (response.redirected) {
        window.location.href = response.url; // Segue o redirecionamento pra Nuvemshop
      } else {
        const data = await response.json();
        console.error("Erro no checkout:", data.error);
        alert("Erro ao finalizar compra: " + data.error);
      }
    } catch (err) {
      console.error("Erro ao iniciar checkout:", err);
      alert("Erro ao conectar com o servidor.");
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
              {cart.reduce((total, item) => total + item.quantity, 0)} ITEM
              {cart.reduce((total, item) => total + item.quantity, 0) !== 1 &&
                "S"}
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
                      {/* Imagem e Nome */}
                      <div className="sm:col-span-6 flex items-start space-x-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center p-2 sm:p-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="max-h-full max-w-full object-contain"
                              style={{
                                mixBlendMode: "multiply",
                                filter:
                                  "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
                              }}
                            />
                          </div>
                          {item.quantity > 1 && (
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
                              {Number(item.price).toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Controles Mobile */}
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
                            {item.quantity}
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
                            {(Number(item.price) * item.quantity)
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

                      {/* Desktop Layout */}
                      <div className="hidden sm:grid sm:col-span-6 grid-cols-6 items-center">
                        {/* Preço Unitário */}
                        <div className="col-span-2 text-center text-gray-700 font-medium text-sm">
                          R$ {Number(item.price).toFixed(2).replace(".", ",")}
                        </div>

                        {/* Controle de Quantidade */}
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
                              {item.quantity}
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

                        {/* Total e Remover */}
                        <div className="col-span-2 flex items-center justify-end space-x-2 sm:space-x-4">
                          <span className="font-bold text-gray-900 text-sm sm:text-base">
                            R${" "}
                            {(Number(item.price) * item.quantity)
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
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 sticky bottom-0 sm:relative sm:bottom-auto">
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
                    Grátis
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
                  R${total.toFixed(2).replace(".", ",")}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-4 bg-gradient-to-r from-[#89764b] to-[#a08d5f] hover:from-[#756343] hover:to-[#89764b] text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl font-oswald uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2"
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
