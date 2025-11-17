// src/hooks/useWines.ts

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Wine } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

const PER_PAGE = 12;

// Definindo o tipo para os filtros
type SortOrder = "price_asc" | "price_desc";
interface Filters {
  category: string;
  search: string;
  sort: SortOrder;
}

export const useWines = () => {
  const [wines, setWines] = useState<Wine[]>([]);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    category: "all",
    search: "",
    sort: "price_asc",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchWines = useCallback(
    async (pageNumber: number, currentFilters: Filters) => {
      const isFirstPage = pageNumber === 1;
      isFirstPage ? setLoading(true) : setLoadingMore(true);
      if (isFirstPage) setWines([]);

      try {
        const params = new URLSearchParams({
          page: String(pageNumber),
          per_page: String(PER_PAGE),
        });
        if (currentFilters.category !== "all") {
          params.append("category", currentFilters.category);
        }
        if (currentFilters.search) {
          params.append("search", currentFilters.search);
        }

        const url = `${API_URL}/api/products?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);

        const data: Wine[] = await res.json();

        const filteredData = data.filter(
          (wine) =>
            !wine.name.pt.toLowerCase().includes("visita guiada") &&
            !wine.name.pt.toLowerCase().includes("degustação")
        );

        setHasMore(data.length === PER_PAGE);
        setWines((prev) =>
          isFirstPage ? filteredData : [...prev, ...filteredData]
        );
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao buscar vinhos"
        );
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  useEffect(() => {
    setPage(1);
    fetchWines(1, filters);
  }, [filters.category, filters.search, fetchWines]);

  useEffect(() => {
    if (page > 1) {
      fetchWines(page, filters);
    }
  }, [page, fetchWines, filters]);

  const sortedWines = useMemo(() => {
    const sorted = [...wines];
    if (filters.sort === "price_asc") {
      return sorted.sort(
        (a, b) =>
          parseFloat(a.variants[0]?.price || "0") -
          parseFloat(b.variants[0]?.price || "0")
      );
    }
    if (filters.sort === "price_desc") {
      return sorted.sort(
        (a, b) =>
          parseFloat(b.variants[0]?.price || "0") -
          parseFloat(a.variants[0]?.price || "0")
      );
    }
    return sorted;
  }, [wines, filters.sort]);

  return {
    wines: sortedWines,
    loading,
    loadingMore,
    error,
    hasMore,
    filters,
    setFilters,
    setPage,
    retry: () => fetchWines(1, filters),
  };
};
