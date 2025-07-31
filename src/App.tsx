// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import VinhosPage from "./pages/VinhosPage";
import Footer from "./components/Footer";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsappButton";
import ScrollToTopLeft from "./components/ScrollToTopLeft";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <WhatsAppButton />
      <ScrollToTopLeft />
      <div className="min-h-screen flex flex-col bg-[#dad6d6]">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vinhos" element={<VinhosPage />} />
            <Route
              path="/produto/:id"
              element={<ProductDetailsPage recommendations={[]} />}
            />
            <Route path="/carrinho" element={<CartPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
