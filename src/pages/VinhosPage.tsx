import React from "react";
import { motion } from "framer-motion";
import { useWines } from "../hooks/useWines";
import { FilterBar } from "../components/FilterBar";
import { ProductList } from "../components/ProductList";

const VinhosPage: React.FC = () => {
  const {
    wines,
    loading,
    loadingMore,
    error,
    hasMore,
    filters,
    setFilters,
    setPage,
    retry,
  } = useWines();
  const handleClearFilters = () => {
    setFilters({ category: "all", search: "", sort: "price_asc" });
  };

  return (
    <div className="min-h-screen bg-[#d4d4d4] font-['Oswald']">
      <section className="relative pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16 lg:pb-20 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-black bg-cover bg-center opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 uppercase tracking-tight font-['Oswald']"
          >
            Nossos Produtos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm md:text-base max-w-3xl mx-auto text-[#9c9c9c] leading-relaxed font-['Oswald']"
          >
            Vinhos, cafés e acessórios para garantir uma experiência Amana
            completa em sua casa.
          </motion.p>
        </div>
      </section>

      <FilterBar filters={filters} onFilterChange={setFilters} />
      <ProductList
        wines={wines}
        loading={loading}
        error={error}
        hasMore={hasMore}
        loadingMore={loadingMore}
        onRetry={retry}
        onLoadMore={() => setPage((p: number) => p + 1)}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};

export default VinhosPage;
