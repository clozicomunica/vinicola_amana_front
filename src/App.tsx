// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // Importe o Toaster
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import VinhosPage from "./pages/ProductsPage";
import AboutPage from "./pages/AboutPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import ContactPage from "./pages/ContactPage";
import Footer from "./components/Footer";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsappButton";
import ScrollToTopLeft from "./components/ScrollToTopLeft";
import SuccessPage from "./pages/SucessPage";
import ConfigPage from "./pages/Config";
import SupportPage from "./pages/Suporte";
import PrivacyPolicyPage from "./pages/Privacidade";

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

      <ScrollToTop />
      <WhatsAppButton />
      <ScrollToTopLeft />
      <div className="min-h-screen flex flex-col bg-[#dad6d6]">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vinhos" element={<VinhosPage />} />
            <Route path="/produto/:id" element={<ProductDetailsPage />} />
            <Route path="/carrinho" element={<CartPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/sobrenos" element={<AboutPage />} />
            <Route path="/experiencias" element={<ExperiencesPage />} />
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
