// src/components/FilterBar.tsx

import React, { useState } from 'react';
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "../types";

type SortOrder = "price_asc" | "price_desc";
interface Filters {
  category: string;
  search: string;
  sort: SortOrder;
}

interface FilterBarProps {
  filters: Filters;
  onFilterChange: React.Dispatch<React.SetStateAction<Filters>>;
}

const CATEGORIES: Category[] = [
    { id: "tinto", name: "Vinhos Tintos" },
    { id: "branco", name: "Vinhos Brancos" },
    { id: "rosé", name: "Vinhos Rosé" },
    { id: "amana", name: "Amana" },
    { id: "una", name: "Una" },
    { id: "singular", name: "Singular" },
    { id: "cafe", name: "Cafés" },
    { id: "diversos", name: "Diversos" },
];

export const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  
    const [searchInput, setSearchInput] = useState(filters.search);

    const handleCategoryChange = (categoryId: string) => {
        onFilterChange(prev => ({ ...prev, category: categoryId }));
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange(prev => ({ ...prev, sort: e.target.value as SortOrder }));
    };

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onFilterChange(prev => ({ ...prev, search: searchInput.trim() }));
    };

    const handleClearFilters = () => {
        setSearchInput("");
        onFilterChange({ category: 'all', search: '', sort: 'price_asc' });
    };

    const hasActiveFilters = filters.category !== 'all' || filters.search !== '' || filters.sort !== 'price_asc';

    return (
        <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="sticky top-0 z-20 py-3 md:py-4 bg-black/95 backdrop-blur-sm border-b border-white/10"
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                    
                    <div className="md:hidden w-full overflow-x-auto pb-2 scrollbar-hide">
                        <div className="flex space-x-2 w-max">
                            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleCategoryChange("all")} className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 uppercase tracking-tight whitespace-nowrap font-['Oswald'] ${filters.category === "all" ? "bg-[#89764b] text-white" : "bg-black text-white/90 hover:bg-white/10 hover:text-white"}`} aria-label="Filtrar por todos os produtos">Todos</motion.button>
                            {CATEGORIES.map((category) => (
                                <motion.button key={category.id} whileTap={{ scale: 0.95 }} onClick={() => handleCategoryChange(category.id)} className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 uppercase tracking-tight whitespace-nowrap font-['Oswald'] ${filters.category === category.id ? "bg-[#89764b] text-white" : "bg-black text-white/90 hover:bg-white/10 hover:text-white"}`} aria-label={`Filtrar por ${category.name}`}>{category.name}</motion.button>
                            ))}
                        </div>
                    </div>
                    <div className="hidden md:flex flex-wrap gap-2">
                         <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleCategoryChange("all")} className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 uppercase tracking-tight font-['Oswald'] ${filters.category === "all" ? "bg-[#89764b] text-white" : "bg-black text-white/90 hover:bg-white/10 hover:text-white"}`} aria-label="Filtrar por todos os produtos">Todos</motion.button>
                        {CATEGORIES.map((category) => (
                             <motion.button key={category.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => handleCategoryChange(category.id)} className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 uppercase tracking-tight font-['Oswald'] ${filters.category === category.id ? "bg-[#89764b] text-white" : "bg-black text-white/90 hover:bg-white/10 hover:text-white"}`} aria-label={`Filtrar por ${category.name}`}>{category.name}</motion.button>
                        ))}
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 md:gap-3">
                            <label htmlFor="sort" className="text-xs md:text-sm text-white/80 font-['Oswald']">Ordenar por:</label>
                            <select id="sort" value={filters.sort} onChange={handleSortChange} className="bg-black/70 text-white border border-white/20 rounded-full px-3 py-1.5 text-xs md:text-sm focus:border-[#89764b] focus:ring-2 focus:ring-[#89764b]/50 transition-all font-['Oswald'] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTcuMjQ3IDEwLjE0TDQuNDU3IDcuMzVhLjUuNSAwIDAgMSAwLS43MDdsLjM1LS4zNWEuNS4NSAwIDAgxIC43MDcgMGwyLjE0NiAyLjE0NyAyLjE0Ni0yLjE0N2EuNS4NSAwIDAgxIC43MDcgMGwuMzUuMzVhLjUuNSAwIDAgMSAwIC43MDdsLTIuNzkgMi43OWEuNS4NSAwIDAgxLS43MDcgMHoiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem] pr-6">
                                <option value="price_asc">Mais barato</option>
                                <option value="price_desc">Mais caro</option>
                            </select>
                        </div>
                        <div className="w-full md:w-auto md:flex-1 md:max-w-md">
                            <form onSubmit={handleSearchSubmit}>
                                <div className="relative">
                                    <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                                    <motion.input type="text" placeholder="Buscar..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-black/70 text-white border border-white/20 rounded-full focus:border-[#89764b] focus:ring-2 focus:ring-[#89764b]/50 transition-all text-sm md:text-base font-['Oswald']" aria-label="Buscar produtos" whileFocus={{ scale: 1.02 }} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                {hasActiveFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-center mt-3 md:mt-4 overflow-hidden"
                    >
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleClearFilters} className="px-4 py-1.5 md:px-6 md:py-2 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-colors uppercase text-xs md:text-sm font-['Oswald']" aria-label="Limpar busca e filtros">
                            Limpar busca e filtros
                        </motion.button>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </motion.section>
    );
};