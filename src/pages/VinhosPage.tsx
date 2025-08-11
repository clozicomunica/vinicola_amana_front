import { useEffect, useState, useMemo } from "react";
import { Search, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import wineImage from "../assets/wine-bottle.jpg";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface WineVariant {
  id: number;
  price: string;
  compare_at_price?: string;
  values: { pt: string }[];
}

interface Wine {
  id: number;
  name: { pt: string };
  variants: WineVariant[];
  images: { src: string; alt?: string[] }[];
  categories: { id: number; name: { pt: string } }[];
  description: { pt: string };
  created_at: string;
}

const CATEGORIES = [
  { id: "tinto", name: "Vinhos Tintos" },
  { id: "branco", name: "Vinhos Brancos" },
  { id: "rosé", name: "Vinhos Rosé" },
  { id: "amana", name: "Amana" },
  { id: "una", name: "Una" },
  { id: "singular", name: "Singular" },
  { id: "cafe", name: "Cafés" },
  { id: "diversos", name: "Diversos" },
];

const VinhosPage = () => {
  const [wines, setWines] = useState<Wine[]>([]);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<string>("");
  const { addToCart } = useCart();

  // Função para normalizar strings, igual ao backend
  const cleanString = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const fetchWines = async (
    pageNumber: number,
    category: string = selectedCategory,
    search: string = searchTerm
  ) => {
    const isFirstPage = pageNumber === 1;

    if (isFirstPage) {
      setLoading(true);
      setWines([]);
    } else {
      setLoadingMore(true);
    }

    try {
      let url = `https://vinicola-amana-back.onrender.com/api/products?page=${pageNumber}&per_page=8&published=true`;

      if (category !== "all") {
        url += `&category=${encodeURIComponent(category)}`;
      }

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      console.log("Fetching wines with URL:", url);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
      const data: Wine[] = await res.json();

      // Log detalhado para depuração
      console.log(
        "API Response:",
        data.map((w) => ({
          name: w.name.pt,
          categories: w.categories.map((c) => c.name.pt),
          variantValues: w.variants.flatMap((v) =>
            v.values.map((val) => val.pt)
          ),
        }))
      );

      // Filtrar "Visita Guiada" e "Degustação"
      let filteredData = data.filter(
        (wine) =>
          !wine.name.pt.toLowerCase().includes("visita guiada") &&
          !wine.name.pt.toLowerCase().includes("degustação")
      );

      // Filtragem local para garantir que apenas a variante correta seja exibida
      if (
        category !== "all" &&
        ["tinto", "branco", "rosé"].includes(category)
      ) {
        const normalizedCategory = cleanString(category);
        filteredData = filteredData.filter((wine) =>
          wine.variants.some((variant) =>
            variant.values.some(
              (value) => cleanString(value.pt) === normalizedCategory
            )
          )
        );
      }

      setHasMore(data.length === 8);

      if (isFirstPage) {
        setWines(filteredData);
      } else {
        setWines((prev) => [...prev, ...filteredData]);
      }
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const sortProducts = (products: Wine[], order: string) => {
    if (order === "price_asc") {
      return [...products].sort(
        (a, b) =>
          parseFloat(a.variants[0]?.price || "0") -
          parseFloat(b.variants[0]?.price || "0")
      );
    } else if (order === "price_desc") {
      return [...products].sort(
        (a, b) =>
          parseFloat(b.variants[0]?.price || "0") -
          parseFloat(a.variants[0]?.price || "0")
      );
    }
    return products;
  };

  useEffect(() => {
    setPage(1);
    fetchWines(1);
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    if (page > 1) {
      fetchWines(page);
    }
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
    setPage(1);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setSelectedCategory("all");
    setSortOrder("");
    setPage(1);
  };

  const handleAddToCart = (wine: Wine) => {
    if (!wine.variants[0]) return;

    addToCart({
      id: wine.id,
      variant_id: wine.variants[0]?.id || wine.id,
      name: wine.name.pt,
      price: parseFloat(wine.variants[0].price),
      quantity: 1,
      image: wine.images[0]?.src || wineImage,
      category:
        wine.variants[0]?.values[0]?.pt ||
        wine.categories[0]?.name.pt ||
        "Vinho",
    });

    toast.success(`${wine.name.pt} adicionado ao carrinho!`, {
      position: "bottom-right",
      style: {
        background: "#89764b",
        color: "#fff",
        borderRadius: "8px",
        padding: "16px 24px",
        fontFamily: "'Oswald', sans-serif",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#89764b",
      },
    });
  };

  function decodeHtmlEntities(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const wineList = useMemo(() => {
    const sortedWines = sortOrder ? sortProducts(wines, sortOrder) : wines;

    return sortedWines.map((wine) => {
      const price = parseFloat(wine.variants[0]?.price ?? "0");
      const compareAtPrice = wine.variants[0]?.compare_at_price
        ? parseFloat(wine.variants[0].compare_at_price)
        : null;
      const isOnSale = compareAtPrice && compareAtPrice > price;

      // Escolher a variante correta para exibição
      const displayCategory =
        selectedCategory !== "all" &&
        ["tinto", "branco", "rosé"].includes(selectedCategory)
          ? wine.variants.find((v) =>
              v.values.some(
                (val) => cleanString(val.pt) === cleanString(selectedCategory)
              )
            )?.values[0]?.pt
          : wine.variants[0]?.values[0]?.pt ||
            wine.categories[0]?.name.pt ||
            "Vinho";

      return (
        <motion.div
          key={wine.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="group bg-white rounded-xl overflow-hidden border border-[#9c9c9c]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full font-['Oswald']"
        >
          <div className="relative flex items-center justify-center h-60 md:h-80 bg-gradient-to-b from-[#f5f5f5] to-[#e5e5e5] p-4 md:p-6">
            <Link
              to={`/produto/${wine.id}`}
              className="h-full w-full flex items-center justify-center"
            >
              <motion.img
                src={wine.images[0]?.src || wineImage}
                alt={wine.images[0]?.alt?.[0] || wine.name.pt}
                className="max-h-[150px] sm:max-h-[200px] md:max-h-full w-auto object-contain transition duration-500 group-hover:scale-105"
                style={{
                  mixBlendMode: "multiply",
                  filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))",
                }}
                whileHover={{ scale: 1.05 }}
              />
            </Link>
            {isOnSale && (
              <motion.span
                className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#9a3324] text-white text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-md uppercase tracking-tight font-['Oswald']"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                Oferta
              </motion.span>
            )}
            <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 flex items-center gap-2 md:gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
              <Link
                to={`/produto/${wine.id}`}
                className="p-2 md:p-3 bg-white/90 rounded-full hover:bg-white transition transform hover:scale-110 shadow-md"
                aria-label="Visualização rápida"
              >
                <Eye className="h-4 w-4 md:h-5 md:w-5 text-[#000000]" />
              </Link>
              <motion.button
                onClick={() => handleAddToCart(wine)}
                className="p-2 md:p-3 bg-[#89764b] text-white rounded-full hover:bg-[#756343] transition transform hover:scale-110 shadow-md"
                aria-label="Adicionar ao carrinho"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              </motion.button>
            </div>
          </div>
          <div className="p-4 md:p-6 flex flex-col flex-grow">
            <div className="mb-3 md:mb-4">
              <h3 className="text-[#000000] text-base md:text-lg uppercase tracking-tight mb-1 md:mb-2 line-clamp-1 font-['Oswald']">
                {wine.name.pt}
              </h3>
              <div className="flex items-center gap-2 md:gap-3">
                <span className="text-xs md:text-sm text-[#000000] font-['Oswald']">
                  {displayCategory}
                </span>
                <span className="w-1 h-1 bg-[#9c9c9c] rounded-full"></span>
                <span className="text-xs md:text-sm text-[#000000] font-['Oswald']">
                  Safra {new Date(wine.created_at).getFullYear()}
                </span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-[#000000] line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 flex-grow font-['Oswald']">
              {decodeHtmlEntities(wine.description.pt.replace(/<[^>]*>/g, ""))}
            </p>

            <div className="mt-auto">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <span className="text-lg md:text-xl text-[#000000] font-['Oswald']">
                  R${price.toFixed(2).replace(".", ",")}
                </span>
                {isOnSale && (
                  <span className="text-xs md:text-sm text-[#000000] line-through font-['Oswald']">
                    R${compareAtPrice.toFixed(2).replace(".", ",")}
                  </span>
                )}
              </div>
              <motion.button
                onClick={() => handleAddToCart(wine)}
                className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 uppercase tracking-wide text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2 font-['Oswald']"
                aria-label="Adicionar ao carrinho"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                Adicionar
              </motion.button>
            </div>
          </div>
        </motion.div>
      );
    });
  }, [wines, sortOrder, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f8f5f0] font-['Oswald']">
      {/* Hero Section */}
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

      {/* Filtros e Busca */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="sticky top-0 z-10 py-3 md:py-4 bg-black/95 backdrop-blur-sm border-b border-white/10"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Categorias Scrolláveis em Mobile */}
            <div className="md:hidden w-full overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex space-x-2 w-max">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryChange("all")}
                  className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 uppercase tracking-tight whitespace-nowrap font-['Oswald'] ${
                    selectedCategory === "all"
                      ? "bg-[#89764b] text-white"
                      : "bg-black text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-label="Filtrar por todos os produtos"
                >
                  Todos
                </motion.button>
                {CATEGORIES.map((category) => (
                  <motion.button
                    key={category.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 uppercase tracking-tight whitespace-nowrap font-['Oswald'] ${
                      selectedCategory === category.id
                        ? "bg-[#89764b] text-white"
                        : "bg-black text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                    aria-label={`Filtrar por ${category.name}`}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Categorias em Desktop */}
            <div className="hidden md:flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange("all")}
                className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 uppercase tracking-tight font-['Oswald'] ${
                  selectedCategory === "all"
                    ? "bg-[#89764b] text-white"
                    : "bg-black text-white/90 hover:bg-white/10 hover:text-white"
                }`}
                aria-label="Filtrar por todos os produtos"
              >
                Todos
              </motion.button>
              {CATEGORIES.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 uppercase tracking-tight font-['Oswald'] ${
                    selectedCategory === category.id
                      ? "bg-[#89764b] text-white"
                      : "bg-black text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-label={`Filtrar por ${category.name}`}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>

            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              {/* Seletor de Ordenação */}
              <div className="flex items-center gap-2 md:gap-3">
                <label
                  htmlFor="sort"
                  className="text-xs md:text-sm text-white/80 font-['Oswald']"
                >
                  Ordenar por:
                </label>
                <select
                  id="sort"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-black/70 text-white border border-white/20 rounded-full px-3 py-1.5 text-xs md:text-sm focus:border-[#89764b] focus:ring-2 focus:ring-[#89764b]/50 transition-all font-['Oswald'] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTcuMjQ3IDEwLjE0TDQuNDU3IDcuMzVhLjUuNSAwIDAgMSAwLS43MDdsLjM1LS4zNWEuNS41IDAgMCAxIC43MDcgMGwyLjE0NiAyLjE0NyAyLjE0Ni0yLjE0N2EuNS41IDAgMCAxIC43MDcgMGwuMzUuMzVhLjUuNSAwIDAgMSAwIC43MDdsLTIuNzkgMi43OWEuNS41IDAgMCAxLS43MDcgMHoiLz48L3N2Zz4=')] bg-no-repeat bg-[center_right_0.5rem] pr-6"
                >
                  <option value="">Padrão</option>
                  <option value="price_asc">Mais barato</option>
                  <option value="price_desc">Mais caro</option>
                </select>
              </div>

              {/* Campo de busca */}
              <div className="w-full md:w-auto md:flex-1 md:max-w-md">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative">
                    <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                    <motion.input
                      type="text"
                      placeholder="Buscar..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-black/70 text-white border border-white/20 rounded-full focus:border-[#89764b] focus:ring-2 focus:ring-[#89764b]/50 transition-all text-sm md:text-base font-['Oswald']"
                      aria-label="Buscar produtos"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>

          {(searchTerm || selectedCategory !== "all" || sortOrder) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-center mt-3 md:mt-4 overflow-hidden"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearFilters}
                className="px-4 py-1.5 md:px-6 md:py-2 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-colors uppercase text-xs md:text-sm font-['Oswald']"
                aria-label="Limpar busca e filtros"
              >
                Limpar busca e filtros
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Lista de Produtos */}
      <section
        className="py-8 md:py-12 lg:py-16 bg-[#f8f5f0] pt-16 md:pt-20"
        role="region"
        aria-label="Lista de produtos"
      >
        <div className="container mx-auto px-4">
          {wines.length > 0 && (
            <p className="text-sm text-[#9c9c9c] mb-4 text-center font-['Oswald']">
              {wines.length} produto{wines.length !== 1 ? "s" : ""} encontrado
              {wines.length !== 1 ? "s" : ""}
            </p>
          )}
          <AnimatePresence mode="wait">
            {loading && page === 1 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8"
              >
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="bg-white rounded-xl overflow-hidden border border-[#9c9c9c]/30"
                  >
                    <div className="h-60 md:h-80 bg-gradient-to-br from-[#f5f5f5] to-[#e5e5e5] animate-pulse">
                      <motion.div
                        animate={{
                          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="h-full w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      />
                    </div>
                    <div className="p-4 md:p-6">
                      <div className="h-5 md:h-6 bg-gradient-to-r from-[#f5f5f5] to-[#e5e5e5] rounded mb-3 md:mb-4"></div>
                      <div className="h-3 md:h-4 bg-gradient-to-r from-[#f5f5f5] to-[#e5e5e5] rounded mb-2 md:mb-3 w-3/4"></div>
                      <div className="h-12 md:h-16 bg-gradient-to-r from-[#f5f5f5] to-[#e5e5e5] rounded mb-4 md:mb-6"></div>
                      <div className="h-8 md:h-10 bg-gradient-to-r from-[#f5f5f5] to-[#e5e5e5] rounded"></div>
                    </div>
                  </motion.div>
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
                    onClick={() => fetchWines(1)}
                    className="px-6 py-2 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-colors uppercase text-sm font-['Oswald']"
                    aria-label="Tentar novamente"
                  >
                    Tentar novamente
                  </motion.button>
                </div>
              </motion.div>
            ) : wines.length === 0 ? (
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
                    onClick={handleClearFilters}
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
                <AnimatePresence>{wineList}</AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {hasMore && !loadingMore && wines.length > 0 && (
            <div className="text-center mt-8 md:mt-12 lg:mt-16">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage((p) => p + 1)}
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
    </div>
  );
};

export default VinhosPage;
