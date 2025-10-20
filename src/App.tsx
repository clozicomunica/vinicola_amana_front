// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import VinhosPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Footer from "./components/Footer";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage.tsx";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsappButton";
import ScrollToTopLeft from "./components/ScrollToTopLeft";
import SuccessPage from "./pages/SucessPage";
import ConfigPage from "./pages/Config";
import SupportPage from "./pages/Suporte";
import PrivacyPolicyPage from "./pages/Privacidade";

function DevBanner() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] bg-black text-white text-center text-xs sm:text-sm font-semibold tracking-wide py-2"
      role="status"
      aria-live="polite"
    >
      SITE EM DESENVOLVIMENTO - COMPRA NÃO DISPONÍVEL
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'font-["Oswald"]',
          duration: 3000,
          style: {
            background: "#89764b",
            color: "#fff",
            border: "1px solid #756343",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          },
        }}
      />

      {/* Banner fixo no topo, acima de tudo */}
      <DevBanner />

      <ScrollToTop />
      <WhatsAppButton />
      <ScrollToTopLeft />

      {/* pt-10 para compensar a altura do banner (aprox. 40px) */}
      <div className="min-h-screen flex flex-col bg-[#dad6d6] pt-10">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vinhos" element={<VinhosPage />} />
            <Route path="/produto/:id" element={<ProductDetailsPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/sobrenos" element={<AboutPage />} />
            <Route path="/contato" element={<ContactPage />} />
            <Route path="/config" element={<ConfigPage />} />
            <Route path="/suporte" element={<SupportPage />} />
            <Route path="/privacidade" element={<PrivacyPolicyPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
