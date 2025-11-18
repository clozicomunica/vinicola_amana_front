/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { CartItem } from "../context/CartProvider";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const CREATE_CHECKOUT_PATH = "/api/orders/create-checkout";
// NOVO ENDPOINT → frete mais caro da Jadlog
const CALCULATE_SHIPPING_PATH = "/api/shipping/most-expensive";

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

interface ShippingOption {
  id: number;
  name: string;
  price: string;
  delivery_time: number;
  delivery_range?: {
    min: number;
    max: number;
  };
  company: {
    id: number;
    name: string;
    picture: string;
  };
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
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    id: string;
    type: string;
    value: number;
    minPrice: number;
  } | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");

  // Estados de frete
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingCalculated, setShippingCalculated] = useState(false);

  const subtotal = cart.reduce(
    (sum, item: CartItem) => sum + Number(item.price) * (item.quantity || 1),
    0,
  );
  const shippingCost = selectedShipping ? parseFloat(selectedShipping.price) : 0;
  const finalTotal = subtotal - discountAmount + shippingCost;

  const handleIncrement = (item: CartItem) =>
    addToCart({ ...item, quantity: 1 });
  const handleDecrement = (item: CartItem) =>
    (item.quantity || 1) > 1
      ? addToCart({ ...item, quantity: -1 })
      : removeFromCart(item.id);

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponError("Digite um código válido!");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/coupons/validate`, {
        code: couponCode,
      });
      const coupon = response.data;
      if (coupon.minPrice > subtotal) {
        setCouponError(
          `Requer subtotal mínimo de R$ ${coupon.minPrice
            .toFixed(2)
            .replace(".", ",")}.`,
        );
        return;
      }
      let calcDiscount = 0;
      if (coupon.type === "percentage") {
        calcDiscount = subtotal * (coupon.value / 100);
      } else if (coupon.type === "absolute") {
        calcDiscount = coupon.value;
      }
      setAppliedCoupon(coupon);
      setDiscountAmount(calcDiscount);
      setCouponError("");
      toast.success(
        `Cupom aplicado! Desconto de ${coupon.value}${coupon.type === "percentage" ? "%" : ""}.`,
      );
    } catch (err: any) {
      setCouponError(err.response?.data?.message || "Cupom inválido.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    setCouponError("");
    toast.success("Cupom removido.");
  };

  // FUNÇÃO ATUALIZADA: usa o novo endpoint e envia variant_id
  const calculateShipping = async (zipcode: string) => {
    if (!cart.length) {
      toast.error("Adicione produtos ao carrinho primeiro");
      return;
    }

    const cep = onlyDigits(zipcode);
    if (cep.length !== 8) {
      toast.error("CEP inválido");
      return;
    }

    setShippingLoading(true);
    setShippingCalculated(false);
    setSelectedShipping(null);

    try {
      const response = await axios.post(`${API_URL}${CALCULATE_SHIPPING_PATH}`, {
        zipcode: cep,
        products: cart.map((item: CartItem) => ({
          id: item.id,
          variant_id: item.variant_id, // ← OBRIGATÓRIO agora!
          quantity: item.quantity || 1,
          price: Number(item.price),
          // Não manda mais peso fixo → backend busca da variante
        })),
      });

      if (response.data.success && response.data.option) {
        const option: ShippingOption = response.data.option;
        setSelectedShipping(option);
        setShippingCalculated(true);
        toast.success(
          `Frete calculado: ${option.company.name} - R$ ${parseFloat(option.price).toFixed(2).replace(".", ",")}`,
        );
      } else {
        toast.error("Nenhuma opção de frete disponível para este CEP");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Erro ao calcular frete. Tente novamente.",
      );
    } finally {
      setShippingLoading(false);
    }
  };

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

      // Calcula o automaticamente
      await calculateShipping(cep);
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
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  };

  const formatPhone = (value: string) => {
    const digits = onlyDigits(value).slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10)
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
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
      toast.error("Email inválido.");
      setLoading(false);
      return;
    }
    if (!validateCPF(customer.document)) {
      toast.error("CPF inválido.");
      setLoading(false);
      return;
    }

    const phoneDigits = onlyDigits(customer.phone);
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      toast.error("WhatsApp inválido (use DDD + número).");
      setLoading(false);
      return;
    }

    if (!shippingCalculated || !selectedShipping) {
      toast.error("Por favor, calcule o frete antes de finalizar.");
      setLoading(false);
      return;
    }

    const checkoutData = {
      produtos: cart.map((item: CartItem) => ({
        name: item.name,
        quantity: item.quantity || 1,
        price: Number(item.price),
        variant_id: item.variant_id || 0,
        idProduto: item.id,
      })),
      cliente: {
        ...customer,
        document: onlyDigits(customer.document),
        phone: phoneDigits,
        zipcode: onlyDigits(customer.zipcode),
      },
      couponCode: appliedCoupon ? couponCode : undefined,
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
          data?.error || data?.message || `${response.status} ${response.statusText}`
        }`;
        setError(msg);
        toast.error(msg);
      }
    } catch (err: unknown) {
      const msg = "Erro ao conectar com o servidor. Tente novamente.";
      setError(msg);
      toast.error(msg);
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
            >
              Explorar Vinhos
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 flex flex-col gap-6">
              {/* LISTA DE PRODUTOS (igual antes) */}
              <div className="bg-white rounded-lg shadow-md border border-[#89764b]/10">
                {/* ... seu código de itens do carrinho permanece 100% igual ... */}
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
                      {/* ... resto do item do carrinho igual ... */}
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
                          </div>
                        </div>
                        <div className="hidden sm:grid sm:grid-cols-3 sm:gap-3 sm:items-center mt-4 sm:mt-0">
                          <div className="text-center text-gray-700 font-medium text-sm">
                            R$ {Number(item.price || 0).toFixed(2).replace(".", ",")}
                          </div>
                          <div className="flex items-center justify-center">
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button onClick={() => handleDecrement(item)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">-</button>
                              <span className="px-3 py-1 text-center min-w-[40px] border-x border-gray-200 font-medium text-sm">
                                {item.quantity || 1}
                              </span>
                              <button onClick={() => handleIncrement(item)} className="px-3 py-1 text-gray-600 hover:bg-gray-100">+</button>
                            </div>
                          </div>
                          <div className="flex items-center justify-end space-x-3">
                            <span className="font-bold text-gray-900 text-sm">
                              R$ {(Number(item.price || 0) * (item.quantity || 1)).toFixed(2).replace(".", ",")}
                            </span>
                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cupom e Limpar Carrinho */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="w-full sm:w-auto flex-1">
                  <div className="flex rounded-lg overflow-hidden shadow-md">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="CÓDIGO DE CUPOM"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#89764b] uppercase tracking-wider text-sm"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-2 bg-[#89764b] text-white hover:bg-[#756343] transition-all hover:scale-105 uppercase tracking-wider text-sm"
                    >
                      Aplicar
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div className="mt-2 flex justify-between text-sm text-gray-600">
                      <span>Cupom aplicado: {couponCode}</span>
                      <button onClick={handleRemoveCoupon} className="text-[#89764b] hover:underline">
                        Remover
                      </button>
                    </div>
                  )}
                  {couponError && <p className="mt-2 text-sm text-red-600">{couponError}</p>}
                </div>
                <button onClick={clearCart} className="flex items-center text-gray-600 hover:text-red-600 uppercase tracking-wider text-sm">
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
                          {shippingLoading && (
                            <p className="mt-1 text-xs text-[#89764b] flex items-center">
                              <Truck className="h-3 w-3 mr-1 animate-pulse" />
                              Calculando frete...
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

              {/* FRETE FIXO (agora só mostra o frete mais caro) */}
              {shippingCalculated && selectedShipping && (
                <div className="bg-white rounded-lg shadow-md border border-[#89764b]/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#89764b] to-[#756343] text-white p-4">
                    <h3 className="text-lg font-bold uppercase tracking-tight flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Frete Selecionado
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                          <img
                            src={selectedShipping.company.picture}
                            alt={selectedShipping.company.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 uppercase text-sm">
                            {selectedShipping.company.name} - {selectedShipping.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Entrega em até {selectedShipping.delivery_time} dias úteis
                          </p>
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-[#89764b]">
                        R$ {parseFloat(selectedShipping.price).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Resumo do Pedido */}
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
                      <span className="text-gray-600 uppercase tracking-wider text-sm">Subtotal</span>
                      <span className="text-gray-900 font-medium text-sm">
                        R${subtotal.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between items-center py-2 border-t border-gray-100">
                        <span className="text-gray-600 uppercase tracking-wider text-sm">Desconto</span>
                        <span className="text-[#89764b] font-medium text-sm">
                          - R$ {discountAmount.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between items-center py-2 border-t border-gray-100">
                      <span className="text-gray-600 uppercase tracking-wider text-sm flex items-center">
                        <Truck className="h-4 w-4 mr-1" />
                        Frete
                      </span>
                      <span className={`font-medium text-sm ${shippingCost > 0 ? 'text-gray-900' : 'text-[#89764b]'}`}>
                        {shippingCalculated ? (
                          shippingCost > 0 ? `R$ ${shippingCost.toFixed(2).replace(".", ",")}` : "Grátis"
                        ) : (
                          <span className="text-gray-500 text-xs">Preencha o CEP</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-3 border-t border-b border-gray-200 bg-gray-50 -mx-4 px-4">
                    <span className="font-bold text-lg uppercase tracking-tight">Total</span>
                    <span className="text-xl font-bold text-[#89764b]">
                      R${finalTotal.toFixed(2).replace(".", ",")}
                    </span>
                  </div>

                  {error && (
                    <div className="flex items-center justify-between bg-red-50 text-red-600 p-3 rounded-lg mt-4 border border-red-200">
                      <span className="text-sm flex-1">{error}</span>
                      <button onClick={() => setError("")} className="text-red-600 hover:text-red-800 ml-2">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={loading || !shippingCalculated}
                    className="w-full mt-6 bg-gradient-to-r from-[#89764b] to-[#a08d5f] hover:from-[#756343] hover:to-[#89764b] text-white py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 uppercase tracking-wider font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <>Processando...</>
                    ) : !shippingCalculated ? (
                      <>Calcule o frete primeiro</>
                    ) : (
                      <>Finalizar Compra <ChevronRight className="h-4 w-4" /></>
                    )}
                  </button>
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