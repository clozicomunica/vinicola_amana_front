import { useState } from "react";
import { useCart } from "../context/useCart";
import {
  ShoppingCart,
  X,
  Wine,
  ChevronRight,
  MapPin,
  User,
  Mail,
  FileText,
  Home,
  Phone,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { CartItem } from "../context/CartProvider";

const API_URL =
  (typeof import.meta !== "undefined" &&
    (import.meta.env?.VITE_API_URL as string)) ||
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL as string)) ||
  "https://vinicola-amana-nestjs.onrender.com";

const CREATE_CHECKOUT_PATH = "/api/orders/create-checkout";

const onlyDigits = (v: string) => v.replace(/\D/g, "");

function validateCPF(cpfRaw: string) {
  const cpf = onlyDigits(cpfRaw);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  const calc = (base: string, factor: number) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) sum += Number(base[i]) * (factor - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  const d1 = calc(cpf.slice(0, 9), 10);
  const d2 = calc(cpf.slice(0, 10), 11);
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
}

const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

interface AddressInfo {
  address: string;
  city: string;
  state: string;
}

async function lookupByCEP(cepRaw: string): Promise<AddressInfo> {
  const cep = onlyDigits(cepRaw);
  if (cep.length !== 8) throw new Error("CEP deve ter 8 dígitos");
  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  if (!res.ok) throw new Error("Falha ao consultar CEP");
  const data = await res.json();
  if (data.erro) throw new Error("CEP não encontrado");
  const addressParts = [data.logradouro, data.bairro]
    .filter(Boolean)
    .join(", ");
  return {
    address: addressParts,
    city: data.localidade || "",
    state: data.uf || "",
  };
}

const CartPage = () => {
  const { cart, removeFromCart, clearCart, addToCart } = useCart();
  const [customer, setCustomer] = useState({
    email: "",
    name: "",
    document: "",
    phone: "",
    address: "",
    number: "",
    complement: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cepLoading, setCepLoading] = useState(false);

  const total = cart.reduce(
    (sum, item: CartItem) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  const handleIncrement = (item: CartItem) =>
    addToCart({ ...item, quantity: 1 });
  const handleDecrement = (item: CartItem) =>
    (item.quantity || 1) > 1
      ? addToCart({ ...item, quantity: -1 })
      : removeFromCart(item.id);

  const handleCepBlur = async () => {
    const cep = onlyDigits(customer.zipcode);
    if (cep.length !== 8) return;
    try {
      setCepLoading(true);
      const info = await lookupByCEP(cep);
      setCustomer((prev) => ({
        ...prev,
        address: info.address,
        city: info.city,
        state: info.state,
      }));
      toast.success("Endereço preenchido pelo CEP 😉");
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Não foi possível buscar o CEP.";
      setCustomer((prev) => ({ ...prev, address: "" }));
      toast.error(message);
    } finally {
      setCepLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
    if (digits.length <= 9)
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
      6,
      9
    )}-${digits.slice(9, 11)}`;
  };

  const formatPhone = (value: string) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(
      7,
      11
    )}`;
  };

  const formatCEP = (value: string) => {
    const digits = onlyDigits(value).slice(0, 8);
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  };

  const handleCheckout = async () => {
    setLoading(true);
    setError("");

    if (!cart.length) {
      const msg = "O carrinho está vazio!";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    const requiredFields = [
      "name",
      "document",
      "phone",
      "email",
      "zipcode",
      "address",
      "number",
      "city",
      "state",
    ] as const;

    for (const field of requiredFields) {
      if (!customer[field]) {
        const msg = "Preencha todos os campos obrigatórios!";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }
    }

    if (!validateEmail(customer.email)) {
      const msg = "Email inválido.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }
    if (!validateCPF(customer.document)) {
      const msg = "CPF inválido.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    const phoneDigits = onlyDigits(customer.phone);
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      const msg = "WhatsApp inválido (use DDD + número).";
      setError(msg);
      toast.error(msg);
      setLoading(false);
      return;
    }

    const checkoutData = {
      produtos: cart.map((item: CartItem) => ({
        name: item.name,
        quantity: item.quantity || 1,
        price: Number(item.price),
        variant_id: item.variant_id || 0,
      })),
      cliente: {
        ...customer,
        document: onlyDigits(customer.document),
        phone: phoneDigits,
        zipcode: onlyDigits(customer.zipcode),
      },
      total,
    };

    try {
      const response = await fetch(`${API_URL}${CREATE_CHECKOUT_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (response.ok) {
        const redirect =
          data.redirect_url || data.init_point || data.sandbox_init_point;
        if (!redirect)
          throw new Error("Servidor não retornou URL de pagamento.");
        toast.success("Redirecionando para o pagamento...");
        window.location.href = redirect;
      } else {
        const msg = `Erro ao iniciar checkout: ${
          data?.error ||
          data?.message ||
          `${response.status} ${response.statusText}`
        }`;
        setError(msg);
        toast.error(msg);
        console.error("create-checkout error:", {
          status: response.status,
          data,
        });
      }
    } catch (err: unknown) {
      const msg = "Erro ao conectar com o servidor. Tente novamente.";
      setError(msg);
      toast.error(msg);
      console.error("Erro ao iniciar checkout:", err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#d4d4d4] font-['Oswald'] antialiased">
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
            <div className="lg:w-2/3 flex flex-col gap-6">
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
                    <li
                      key={item.id}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
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
                                R$
                                {Number(item.price || 0)
                                  .toFixed(2)
                                  .replace(".", ",")}
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
                            R$
                            {Number(item.price || 0)
                              .toFixed(2)
                              .replace(".", ",")}
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

              <div className="bg-white rounded-lg shadow-md border border-[#89764b]/10 overflow-hidden">
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
                          <label className="text-sm text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            Nome Completo *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={customer.name}
                              onChange={(e) =>
                                setCustomer({
                                  ...customer,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Digite seu nome completo"
                              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50"
                              aria-required="true"
                            />
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            CPF *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={customer.document}
                              onChange={(e) =>
                                setCustomer({
                                  ...customer,
                                  document: formatCPF(e.target.value),
                                })
                              }
                              placeholder="000.000.000-00"
                              maxLength={14}
                              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50"
                              aria-required="true"
                            />
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            WhatsApp *
                          </label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={customer.phone}
                              onChange={(e) =>
                                setCustomer({
                                  ...customer,
                                  phone: formatPhone(e.target.value),
                                })
                              }
                              placeholder="(11) 90000-0000"
                              maxLength={15}
                              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50"
                              aria-required="true"
                            />
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label className="text-sm text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            Email *
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={customer.email}
                              onChange={(e) =>
                                setCustomer({
                                  ...customer,
                                  email: e.target.value,
                                })
                              }
                              placeholder="seu@email.com"
                              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50"
                              aria-required="true"
                            />
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
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
                          <label className="text-sm text-gray-600 uppercase tracking-wider mb-2">
                            CEP *
                          </label>
                          <input
                            type="text"
                            value={customer.zipcode}
                            onChange={(e) =>
                              setCustomer({
                                ...customer,
                                zipcode: formatCEP(e.target.value),
                              })
                            }
                            onBlur={handleCepBlur}
                            placeholder="00000-000"
                            maxLength={9}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50"
                            aria-required="true"
                          />
                          {cepLoading && (
                            <p className="mt-1 text-xs text-gray-500">
                              Consultando CEP...
                            </p>
                          )}
                        </div>
                        <div title="Campo preenchido automaticamente pelo CEP">
                          <label className="text-sm text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                            <Home className="h-4 w-4 mr-1" />
                            Endereço (auto) *
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={customer.address}
                              readOnly
                              placeholder="Preencha o CEP para carregar a rua e bairro"
                              className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed select-none"
                              aria-required="true"
                              aria-readonly="true"
                            />
                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-1">
                            <label className="text-sm text-gray-600 uppercase tracking-wider mb-2">
                              Número *
                            </label>
                            <input
                              type="text"
                              value={customer.number}
                              onChange={(e) =>
                                setCustomer({
                                  ...customer,
                                  number: e.target.value,
                                })
                              }
                              placeholder="Nº"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50"
                              aria-required="true"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="text-sm text-gray-600 uppercase tracking-wider mb-2">
                              Complemento
                            </label>
                            <input
                              type="text"
                              value={customer.complement}
                              onChange={(e) =>
                                setCustomer({
                                  ...customer,
                                  complement: e.target.value,
                                })
                              }
                              placeholder="Apto, bloco, referência..."
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] focus:border-transparent transition-all text-sm bg-gray-50"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <label className="text-sm text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              Cidade (auto)
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={customer.city}
                                readOnly
                                placeholder="Preencha o CEP"
                                className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed select-none"
                                aria-readonly="true"
                              />
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>

                          <div className="relative">
                            <label className="text-sm text-gray-600 uppercase tracking-wider mb-2 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              Estado (UF) (auto)
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={customer.state}
                                readOnly
                                placeholder="Preencha o CEP"
                                className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed select-none"
                                aria-readonly="true"
                              />
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 flex items-center">
                        <span className="w-2 h-2 bg-[#89764b] rounded-full mr-2"></span>
                        * Campos obrigatórios
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="uppercase tracking-wider">
                          Entrega para todo Brasil
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md border border-[#89764b]/10 lg:sticky lg:top-20 overflow-hidden">
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
                      <span className="text-[#89764b] font-medium text-sm">
                        - R$ 0,00
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-600 uppercase tracking-wider text-sm">
                        Frete
                      </span>
                      <span className="text-[#89764b] font-medium text-sm">
                        Grátis
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-3 border-t border-b border-gray-200 bg-gray-50 -mx-4 px-4">
                    <span className="font-bold text-lg uppercase tracking-tight">
                      Total
                    </span>
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
                      <span className="text-sm uppercase tracking-wider">
                        Processando...
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full mt-4 bg-gradient-to-r from-[#89764b] to-[#a08d5f] hover:from-[#756343] hover:to-[#89764b] text-white py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 uppercase tracking-wider font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    aria-label="Finalizar compra"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processando...
                      </>
                    ) : (
                      <>
                        Finalizar Compra
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
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
