// src/components/QuickViewModal.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, X, Star, Award, Info } from "lucide-react";
import { useCartActions } from "../context/useCartActions";
import ImageGallery from "./ImageGallery";
import type { Wine } from "./WineCard";
import { decodeHtmlEntities } from "../utils/htmlUtils";

type QuickViewModalProps = {
  quickViewProduct: Wine;
  setQuickViewProduct: (product: Wine | null) => void;
};

const QuickViewModal = ({
  quickViewProduct,
  setQuickViewProduct,
}: QuickViewModalProps) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { addToCart } = useCartActions();

  const isOutOfStock = quickViewProduct.variants[0]?.stock === 0;

  const handleAddToCart = () => {
    addToCart(quickViewProduct);
    setQuickViewProduct(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-labelledby="quick-view-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl overflow-hidden w-full max-w-md sm:max-w-lg md:max-w-4xl lg:max-w-6xl max-h-[90vh] flex flex-col md:flex-row sm:shadow-2xl border border-gray-200 relative">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-all duration-200"
          aria-label="Fechar visualização rápida"
        >
          <X className="h-5 w-5 text-gray-700" />
        </button>

        <div className="w-full md:w-[50%] flex flex-col md:flex-row bg-white">
          <ImageGallery
            images={quickViewProduct.images}
            activeIndex={activeImageIndex}
            onSelect={setActiveImageIndex}
          />
        </div>

        <div className="w-full md:w-[50%] p-4 sm:p-6 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-200">
          <div className="space-y-4 sm:space-y-5">
            <div>
              <h2
                id="quick-view-title"
                className="text-xl sm:text-2xl lg:text-3xl text-black mb-1 uppercase tracking-tight font-oswald"
              >
                {quickViewProduct.name.pt}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-oswald">
                {quickViewProduct.categories[0]?.name.pt || "Vinho"}
              </p>
            </div>

            {/* Badge de status do produto */}
            {isOutOfStock && (
              <div className="bg-[#9c9c9c] text-white px-3 py-2 rounded-md text-xs sm:text-sm font-medium uppercase tracking-wide font-oswald">
                Indisponível
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl lg:text-3xl text-[#89764b] font-medium font-oswald">
                R${" "}
                {parseFloat(quickViewProduct.variants[0]?.price || "0")
                  .toFixed(2)
                  .replace(".", ",")}
              </span>
              {quickViewProduct.rating && (
                <div className="flex items-center bg-gray-100 px-2 py-1 rounded">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="ml-1 text-sm font-medium">
                    {quickViewProduct.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="prose max-w-none text-gray-700 text-xs sm:text-sm leading-relaxed border-b border-gray-200 pb-4 sm:pb-5">
              <p className="font-oswald">
                {quickViewProduct.description?.pt
                  ? decodeHtmlEntities(
                      quickViewProduct.description.pt.replace(/<[^>]*>/g, "")
                    )
                  : "Descrição não disponível."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {quickViewProduct.year && (
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-oswald">
                    Safra
                  </p>
                  <p className="font-medium text-xs sm:text-sm font-oswald">
                    {quickViewProduct.year}
                  </p>
                </div>
              )}
              {quickViewProduct.alcohol && (
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-oswald">
                    Teor Alcoólico
                  </p>
                  <p className="font-medium text-xs sm:text-sm font-oswald">
                    {quickViewProduct.alcohol}
                  </p>
                </div>
              )}
              {quickViewProduct.region && (
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-oswald">
                    Região
                  </p>
                  <p className="font-medium text-xs sm:text-sm font-oswald">
                    {quickViewProduct.region}
                  </p>
                </div>
              )}
              {quickViewProduct.sku && (
                <div className="bg-gray-50 p-2 sm:p-3 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-oswald">
                    Código
                  </p>
                  <p className="font-medium text-xs sm:text-sm font-oswald">
                    {quickViewProduct.sku}
                  </p>
                </div>
              )}
            </div>

            {quickViewProduct.awards && quickViewProduct.awards.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="font-medium flex items-center gap-2 text-gray-900 text-xs sm:text-sm font-oswald">
                  <Award className="h-4 w-4 text-amber-600" />
                  Prêmios e Reconhecimentos
                </h4>
                <ul className="space-y-1">
                  {quickViewProduct.awards.map((award, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-700 text-xs sm:text-sm font-oswald"
                    >
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4 sticky bottom-0 bg-white sm:static sm:bg-transparent">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-4 rounded-md transition-all duration-300 flex items-center justify-center gap-2 uppercase text-xs sm:text-sm font-medium ${
                  isOutOfStock
                    ? "bg-[#9c9c9c] text-white cursor-not-allowed"
                    : "bg-[#89764b] hover:bg-[#756343] text-white hover:shadow-md"
                } font-oswald`}
                aria-label={
                  isOutOfStock
                    ? "Produto indisponível"
                    : "Adicionar ao carrinho"
                }
              >
                <ShoppingCart className="h-4 w-4" />
                {isOutOfStock ? "Indisponível" : "Adicionar ao Carrinho"}
              </button>
              <Link
                to={`/produto/${quickViewProduct.id}`}
                className="flex-1 py-3 px-4 rounded-md border border-[#89764b] text-[#89764b] hover:bg-[#f8f5f0] transition-all duration-300 flex items-center justify-center gap-2 uppercase text-xs sm:text-sm font-medium font-oswald"
                onClick={() => setQuickViewProduct(null)}
                aria-label="Ver detalhes do produto"
              >
                <Info className="h-4 w-4" />
                Ver Detalhes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
