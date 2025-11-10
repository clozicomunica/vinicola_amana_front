import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductSkeleton } from "./ProductSkeleton";
import type { Wine } from "../types";

interface ProductListProps {
  wines: Wine[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadingMore: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
  onClearFilters: () => void;
}

const PER_PAGE = 12;

export const ProductList: React.FC<ProductListProps> = ({
  wines,
  loading,
  error,
  hasMore,
  loadingMore,
  onRetry,
  onLoadMore,
  onClearFilters,
}) => {
  const showEmptyState = !loading && !error && wines.length === 0;

  return (
    <section
      className="py-8 md:py-12 lg:py-16 bg-[#d4d4d4] pt-16 md:pt-20"
      role="region"
      aria-label="Lista de produtos"
    >
      <div className="container mx-auto px-4">
        {!loading && wines.length > 0 && (
          <p className="text-sm text-[#9c9c9c] mb-4 text-center font-['Oswald']">
            {wines.length} produto{wines.length !== 1 ? "s" : ""} encontrado
            {wines.length !== 1 ? "s" : ""}
          </p>
        )}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8"
            >
              {[...Array(PER_PAGE)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 md:py-16"
            >
              <div className="bg-[#f5f5f5] text-[#9a3324] p-4 md:p-6 rounded-xl max-w-md mx-auto border border-[#9a3324]/30">
                <p className="mb-3 md:mb-4 font-['Oswald']">{error}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onRetry}
                  className="px-6 py-2 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-colors uppercase text-sm font-['Oswald']"
                  aria-label="Tentar novamente"
                >
                  Tentar novamente
                </motion.button>
              </div>
            </motion.div>
          ) : showEmptyState ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 md:py-16"
            >
              <div className="max-w-md mx-auto">
                <h3 className="text-lg md:text-xl text-[#000000] mb-2 md:mb-3 font-['Oswald']">
                  Nenhum produto encontrado
                </h3>
                <p className="text-xs md:text-sm text-[#9c9c9c] mb-4 md:mb-6 font-['Oswald']">
                  Tente ajustar seus filtros de busca
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClearFilters}
                  className="px-6 py-2 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-colors uppercase text-sm font-['Oswald']"
                  aria-label="Limpar filtros"
                >
                  Limpar filtros
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8"
            >
              <AnimatePresence>
                {wines.map((wine, index) => (
                  <ProductCard
                    key={`${wine.id}-${wine.variants[0]?.id || index}`}
                    wine={wine}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {hasMore && !loadingMore && wines.length > 0 && (
          <div className="text-center mt-8 md:mt-12 lg:mt-16">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLoadMore}
              disabled={loadingMore}
              className="px-6 md:px-8 py-2 md:py-3 bg-transparent text-[#89764b] border border-[#89764b] rounded-lg hover:bg-[#89764b]/10 transition-all uppercase tracking-wider flex items-center justify-center gap-2 mx-auto text-sm md:text-base font-['Oswald']"
              aria-label="Carregar mais produtos"
            >
              {loadingMore ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="h-4 w-4 md:h-5 md:w-5" />
                  </motion.div>
                  Carregando...
                </>
              ) : (
                "Carregar Mais"
              )}
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};
