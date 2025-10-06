import { useState } from "react";
import { useCart } from "../context/useCart";
import { ShoppingCart, X, ArrowLeft, Wine, ChevronRight, MapPin, User, Mail, FileText, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { CartItem } from "../context/CartProvider";

/** Base da API vinda de env pública (funciona em Vite e Next) */
const API_URL =
  // Vite
  (typeof import.meta !== "undefined" &&
    // @ts-ignore
    (import.meta.env?.VITE_API_URL as string)) ||
  // Next.js
  (typeof process !== "undefined" && (process.env.NEXT_PUBLIC_API_URL as string)) ||
  // fallback local
  "http://localhost:3001";

/** Caminho do endpoint que cria a preferência/checkout no seu backend */
const CREATE_CHECKOUT_PATH = "/api/orders/create-checkout";

// Lista de cidades brasileiras (exemplo)
const CITIES = [
  "São Paulo - SP",
  "Rio de Janeiro - RJ",
  "Belo Horizonte - MG",
  "Porto Alegre - RS",
  "Curitiba - PR",
  "Salvador - BA",
  "Fortaleza - CE",
  "Recife - PE",
  "Brasília - DF",
  "Goiânia - GO",
  "Manaus - AM",
  "Belém - PA"
];

const CartPage = () => {
  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const [customer, setCustomer] = useState<{
    email: string;
    name: string;
    document: string;
    address: string;
    city: string;
    zipcode: string;
  }>({
    email: "",
    name: "",
    document: "",
    address: "",
    city: "",
    zipcode: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCitiesDropdown, setShowCitiesDropdown] = useState(false);

  // Total do carrinho
  const total = cart.reduce(
    (sum, item: CartItem) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const handleIncrement = (item: CartItem) => {
    addToCart({ ...item, quantity: 1 });
  };

  const handleDecrement = (item: CartItem) => {
    if ((item.quantity || 1) > 1) {
      addToCart({ ...item, quantity: -1 });
    } else {
      removeFromCart(item.id);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    // Validações básicas
    if (!cart.length) {
      const msg = "O carrinho está vazio!";
      setError(msg);
      toast.error(msg);
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
      const msg = "Preencha todos os campos obrigatórios!";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    // CPF e CEP
    const cleanDocument = customer.document.replace(/\D/g, "");
    const cleanZipcode = customer.zipcode.replace(/\D/g, "");
    if (cleanDocument.length !== 11) {
      const msg = "CPF inválido (deve ter 11 dígitos)";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }
    if (cleanZipcode.length !== 8) {
      const msg = "CEP inválido (deve ter 8 dígitos)";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    // Payload esperado pelo backend
    const checkoutData = {
      produtos: cart.map((item: CartItem) => ({
        name: item.name,
        quantity: item.quantity || 1,
        price: Number(item.price),
        variant_id: item.variant_id || 0, // em produção usar IDs reais
      })),
      cliente: {
        name: customer.name,
        email: customer.email,
        document: cleanDocument,
        address: customer.address,
        city: customer.city,
        zipcode: cleanZipcode,
      },
      total,
    };

    try {
      // CHAMADA CORRETA: base + endpoint (nada de localhost em produção)
      const response = await fetch(`${API_URL}${CREATE_CHECKOUT_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      const text = await response.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        // mantém data vazio mesmo se vier HTML / não-JSON
      }

      if (response.ok) {
        // pega a URL de redirecionamento qualquer que seja o nome que seu backend/mP retornam
        const redirect =
          data.redirect_url || data.init_point || data.sandbox_init_point;

        if (!redirect) {
          throw new Error(
            "O servidor não retornou a URL de pagamento (redirect_url/init_point)."
          );
        }

        toast.success("Redirecionando para o pagamento...");
        window.location.href = redirect;
      } else {
        const msg = `Erro ao iniciar checkout: ${
          data?.error || data?.message || `${response.status} ${response.statusText}`
        }`;
        setError(msg);
        toast.error(msg);
        console.error("create-checkout error:", { status: response.status, data });
      }
    } catch (err) {
      const msg = "Erro ao conectar com o servidor. Tente novamente.";
      setError(msg);
      toast.error(msg);
      console.error("Erro ao iniciar checkout:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = CITIES.filter(city => 
    city.toLowerCase().includes(customer.city.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    setCustomer({ ...customer, city });
    setShowCitiesDropdown(false);
  };

  return (
    <div className="min-h-screen bg-[#d4d4d4] font-['Oswald'] antialiased">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#89764b] to-[#756343] text-white py-3 shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3">
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity uppercase tracking-wide text-sm"
              aria-label="Continuar comprando"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Continuar Comprando</span>
              <span className="sm:hidden">Voltar</span>
            </Link>
            <h1 className="text-lg flex items-center uppercase tracking-tight">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Carrinho
            </h1>
            <div className="text-xs bg-white/20 px-2 py-1 rounded-full uppercase tracking-wide">
              {cart.reduce((t, item: CartItem) => t + (item.quantity || 1), 0)} ITEM
              {cart.reduce((t, i: CartItem) => t + (i.quantity || 1), 0) !== 1 && "S"}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-6 pt-12">
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#89764b] to-[#a08d5f] rounded-full flex items-center justify-center mb-4 shadow-md">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-lg text-gray-800 mb-2 uppercase tracking-tight">
              Seu carrinho está vazio
            </h2>
            <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
              Parece que você ainda não adicionou nenhum vinho ao carrinho.
            </p>
            <Link
              to="/vinhos"
              className="inline-flex items-center px-4 py-2 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all hover:scale-105 uppercase tracking-wide text-sm"
              aria-label="Explorar vinhos"
            >
              Explorar Vinhos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - Items and Form */}
            <div className="lg:w-2/3 flex flex-col gap-6">
              {/* Cart Items */}
              <div className="bg-white rounded-lg shadow-md border border-[#89764b]/10">
                <div className="hidden sm:grid sm:grid-cols-2 sm:gap-6 sm:p-4 bg-[#89764b]/5">
                  <div className="text-base font-bold text-gray-900 uppercase tracking-tight">
                    Produto
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-base font-bold text-gray-900 uppercase tracking-tight text-center">
                      Preço
                    </div>
                    <div className="text-base font-bold text-gray-900 uppercase tracking-tight text-center">
                      Quantidade
                    </div>
                    <div className="text-base font-bold text-gray-900 uppercase tracking-tight text-right">
                      Total
                    </div>
                  </div>
                </div>
                <ul className="divide-y divide-gray-100">
                  {cart.map((item: CartItem) => (
                    <li key={item.id} className="p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col sm:grid sm:grid-cols-2 sm:gap-6">
                        <div className="flex items-start space-x-3">
                          <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center p-2">
                              <img
                                src={item.image || "/fallback-image.jpg"}
                                alt={item.name}
                                className="max-h-full max-w-full object-contain mix-blend-multiply"
                              />
                            </div>
                            {(item.quantity || 1) > 1 && (
                              <span className="absolute -top-2 -right-2 bg-[#89764b] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-md">
                                {item.quantity}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-sm text-gray-900 uppercase tracking-tight">
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                              {item.category || "Vinho"}
                            </p>
                            <div className="sm:hidden mt-2">
                              <span className="font-medium text-gray-700 text-sm">
                                R${Number(item.price || 0).toFixed(2).replace(".", ",")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="sm:hidden flex items-center justify-between mt-2 gap-2">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => handleDecrement(item)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              aria-label="Reduzir quantidade"
                            >
                              -
                            </button>
                            <span className="px-2 py-1 text-center min-w-[30px] border-x border-gray-200 font-medium text-sm">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => handleIncrement(item)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                              aria-label="Aumentar quantidade"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900 text-sm">
                              R$
                              {(Number(item.price || 0) * (item.quantity || 1))
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                              aria-label="Remover item"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-3 sm:items-center">
                          <div className="text-center text-gray-700 font-medium text-sm">
                            R${Number(item.price || 0).toFixed(2).replace(".", ",")}
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => handleDecrement(item)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                aria-label="Reduzir quantidade"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-center min-w-[40px] border-x border-gray-200 font-medium text-sm">
                                {item.quantity || 1}
                              </span>
                              <button
                                onClick={() => handleIncrement(item)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                aria-label="Aumentar quantidade"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-end space-x-3">
                            <span className="font-bold text-gray-900 text-sm">
                              R$
                              {(Number(item.price || 0) * (item.quantity || 1))
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                              aria-label="Remover item"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Coupon and Clear Cart */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="w-full sm:w-auto flex-1">
                  <div className="flex rounded-lg overflow-hidden shadow-md">
                    <input
                      type="text"
                      placeholder="CÓDIGO DE CUPOM"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] uppercase tracking-wider text-sm"
                      aria-label="Inserir código de cupom"
                    />
                    <button
                      className="px-3 py-2 bg-[#89764b] text-white hover:bg-[#756343] transition-all hover:scale-105 uppercase tracking-wider text-sm"
                      aria-label="Aplicar cupom"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
                <button
                  onClick={clearCart}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors uppercase tracking-wider text-sm"
                  aria-label="Limpar carrinho"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpar Carrinho
                </button>
              </div>

              {/* Customer Form */}
              <div className="bg-white rounded-lg shadow-md border border-[#89764b]/10 overflow-hidden">
                {/* Form Header */}
                <div className="bg-gradient-to-r from-[#89764b] to-[#756343] text-white p-4">
                  <h3 className="text-lg font-bold uppercase tracking-tight flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Dados de Entrega
                  </h3>
                  <p className="text-white/80 text-sm mt-1 uppercase tracking-wider">
                    Preencha suas informações para finalizar o pedido
                  </p>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Coluna 1 - Dados Pessoais */}
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-[#89764b] rounded-full flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900 uppercase tracking-tight">
                          Dados Pessoais
                        </h4>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            Email *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={customer.email}
                              onChange={(e) =>
                                setCustomer({ ...customer, email: e.target.value })
                              }
                              placeholder="seu@email.com"
                              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50"
                              aria-required="true"
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Nome Completo *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={customer.name}
                              onChange={(e) =>
                                setCustomer({ ...customer, name: e.target.value })
                              }
                              placeholder="Digite seu nome completo"
                              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50"
                              aria-required="true"
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            CPF *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={customer.document}
                              onChange={(e) =>
                                setCustomer({ ...customer, document: e.target.value })
                              }
                              placeholder="000.000.000-00"
                              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50"
                              aria-required="true"
                            />
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coluna 2 - Endereço */}
                    <div className="space-y-4">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 bg-[#89764b] rounded-full flex items-center justify-center mr-3">
                          <Home className="h-4 w-4 text-white" />
                        </div>
                        <h4 className="text-base font-bold text-gray-900 uppercase tracking-tight">
                          Endereço de Entrega
                        </h4>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                            <Home className="h-4 w-4 mr-1" />
                            Endereço Completo *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={customer.address}
                              onChange={(e) =>
                                setCustomer({ ...customer, address: e.target.value })
                              }
                              placeholder="Rua, número, bairro"
                              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50"
                              aria-required="true"
                            />
                            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm text-gray-600 uppercase tracking-wider mb-2">
                              CEP *
                            </label>
                            <input
                              type="text"
                              value={customer.zipcode}
                              onChange={(e) =>
                                setCustomer({ ...customer, zipcode: e.target.value })
                              }
                              placeholder="00000-000"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50"
                              aria-required="true"
                            />
                          </div>

                          <div className="relative">
                            <label className="block text-sm text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              Cidade *
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={customer.city}
                                onChange={(e) =>
                                  setCustomer({ ...customer, city: e.target.value })
                                }
                                onFocus={() => setShowCitiesDropdown(true)}
                                placeholder="Selecione sua cidade"
                                className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50 cursor-pointer"
                                aria-required="true"
                              />
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 rotate-90" />
                            </div>

                            {showCitiesDropdown && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {filteredCities.map((city) => (
                                  <button
                                    key={city}
                                    type="button"
                                    onClick={() => handleCitySelect(city)}
                                    className="w-full px-4 py-3 text-left text-sm hover:bg-[#89764b]/10 transition-colors border-b border-gray-100 last:border-b-0 uppercase tracking-wider"
                                  >
                                    {city}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer do Form */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 flex items-center">
                        <span className="w-2 h-2 bg-[#89764b] rounded-full mr-2"></span>
                        * Campos obrigatórios
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="uppercase tracking-wider">Entrega para todo Brasil</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md border border-[#89764b]/10 lg:sticky lg:top-20 overflow-hidden">
                {/* Header do Resumo */}
                <div className="bg-gradient-to-r from-[#89764b] to-[#756343] text-white p-4">
                  <h3 className="text-lg font-bold uppercase tracking-tight flex items-center">
                    <Wine className="h-5 w-5 mr-2" />
                    Resumo do Pedido
                  </h3>
                </div>

                <div className="p-4">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 uppercase tracking-wider text-sm">
                        Subtotal
                      </span>
                      <span className="text-gray-900 font-medium text-sm">
                        R${total.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-600 uppercase tracking-wider text-sm">
                        Desconto
                      </span>
                      <span className="text-[#89764b] font-medium text-sm">- R$ 0,00</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-600 uppercase tracking-wider text-sm">
                        Frete
                      </span>
                      <span className="text-[#89764b] font-medium text-sm">Grátis</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-3 border-t border-b border-gray-200 bg-gray-50 -mx-4 px-4">
                    <span className="font-bold text-lg uppercase tracking-tight">Total</span>
                    <span className="text-xl font-bold text-[#89764b]">
                      R${total.toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  {error && (
                    <div
                      className="flex items-center justify-between bg-red-50 text-red-600 p-3 rounded-lg mt-4 border border-red-200"
                      aria-live="polite"
                    >
                      <span className="text-sm flex-1">{error}</span>
                      <button
                        onClick={() => setError("")}
                        className="text-red-600 hover:text-red-800 ml-2"
                        aria-label="Fechar erro"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  {loading && (
                    <div className="flex items-center justify-center gap-2 text-gray-600 mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-4 h-4 border-2 border-[#89764b] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm uppercase tracking-wider">Processando...</span>
                    </div>
                  )}

                 <button
  disabled
  className="w-full mt-4 bg-gradient-to-r from-[#89764b] to-[#a08d5f] text-white py-4 px-6 rounded-lg transition-all shadow-md uppercase tracking-wider font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
>
  Finalizar compra
</button>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500 uppercase tracking-wider">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;