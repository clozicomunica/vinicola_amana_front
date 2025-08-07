import { useEffect, useState, useMemo } from "react";
import { Search, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import wineImage from "../assets/wine-bottle.jpg";

interface WineVariant {
  id: number;
  price: string;
  compare_at_price?: string;
}

interface Wine {
  id: number;
  name: { pt: string };
  variants: WineVariant[];
  images: { src: string; alt?: string[] }[];
  categories: { name: { pt: string } }[];
  description: { pt: string };
  created_at: string;
}

const CATEGORIES = [
  { id: "tinto", name: "Vinhos Tintos" },
  { id: "branco", name: "Vinhos Brancos" },
  { id: "rose", name: "Vinhos Rosé" },
  { id: "amana", name: "Amana" },
  { id: "una", name: "Una" },
  { id: "singular", name: "Singular" },
  { id: "cafe", name: "Cafés" },
  { id: "em grao", name: "Em grão" },
  { id: "em po", name: "Em pó" },
  { id: "diversos", name: "Diversos" },
  { id: "experiencias", name: "Experiências" },
  { id: "vale-presente", name: "Vale Presente" },
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
  const { addToCart } = useCart();

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
      let url = `https://vinicola-amana-back.onrender.com/api/products?page=${pageNumber}&per_page=8`;

      if (category !== "all") {
        url += `&category=${category}`;
      }

      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Erro ao carregar os produtos");
      const data = await res.json();

      setHasMore(data.length === 8);

      if (isFirstPage) {
        setWines(data);
      } else {
        setWines((prev) => [...prev, ...data]);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
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
      category: wine.categories[0]?.name.pt || "Vinho",
    });
  };

  function decodeHtmlEntities(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  const wineList = useMemo(() => {
    return wines.map((wine) => (
      <div
        key={wine.id}
        className="group bg-white rounded-xl overflow-hidden border border-[#9c9c9c]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full font-['Oswald']"
      >
        <div className="relative flex items-center justify-center h-60 md:h-80 bg-gradient-to-b from-[#f5f5f5] to-[#e5e5e5] p-4 md:p-6">
          <img
            src={wine.images[0]?.src || wineImage}
            alt={wine.images[0]?.alt?.[0] || wine.name.pt}
            className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
            style={{
              mixBlendMode: "multiply",
              filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))",
              height: "clamp(120px, 100%, 200px)",
            }}
          />
          {wine.variants[0]?.compare_at_price && (
            <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-[#9a3324] text-white text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-md uppercase tracking-tight">
              Oferta
            </span>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 md:gap-3">
            <Link
              to={`/produto/${wine.id}`}
              className="p-2 md:p-3 bg-white/90 rounded-full hover:bg-white transition transform hover:scale-110 shadow-lg"
            >
              <Eye className="h-4 w-4 md:h-5 md:w-5 text-[#000000]" />
            </Link>
            <button
              onClick={() => handleAddToCart(wine)}
              className="p-2 md:p-3 bg-[#89764b] text-white rounded-full hover:bg-[#756343] transition transform hover:scale-110 shadow-lg"
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 md:p-6 flex flex-col flex-grow">
          <div className="mb-3 md:mb-4">
            <h3 className="text-[#000000] text-base md:text-lg uppercase tracking-tight mb-1 md:mb-2 line-clamp-1">
              {wine.name.pt}
            </h3>
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xs md:text-sm text-[#000000]">
                {wine.categories[0]?.name.pt || "Vinho"}
              </span>
              <span className="w-1 h-1 bg-[#9c9c9c] rounded-full"></span>
              <span className="text-xs md:text-sm text-[#000000]">
                Safra {new Date(wine.created_at).getFullYear()}
              </span>
            </div>
          </div>

          <p className="text-xs md:text-sm text-[#000000] line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 flex-grow">
            {decodeHtmlEntities(wine.description.pt.replace(/<[^>]*>/g, ""))}
          </p>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <span className="text-lg md:text-xl text-[#000000]">
                R${" "}
                {parseFloat(wine.variants[0]?.price ?? "0")
                  .toFixed(2)
                  .replace(".", ",")}
              </span>
              {wine.variants[0]?.compare_at_price && (
                <span className="text-xs md:text-sm text-[#000000] line-through">
                  R${" "}
                  {parseFloat(wine.variants[0].compare_at_price)
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              )}
            </div>
            <button
              onClick={() => handleAddToCart(wine)}
              className="w-full px-3 py-2 md:px-4 md:py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 uppercase tracking-wide text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2"
            >
              <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
              Adicionar
            </button>
          </div>
        </div>
      </div>
    ));
  }, [wines]);

  return (
    <div className="min-h-screen bg-[#f8f5f0] font-['Oswald']">
      {/* Hero Section */}
      <section className="relative pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-16 lg:pb-20 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-black bg-cover bg-center opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 uppercase tracking-tight">
            <span className="text-center text-white">Nossos Produtos</span>
          </h1>
          <p className="text-sm md:text-base max-w-3xl mx-auto text-[#9c9c9c] leading-relaxed">
            Vinhos, cafés e acessórios para garantir uma experiência Amana
            completa em sua casa.
          </p>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="sticky top-0 z-10 py-3 md:py-4 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Categorias Scrolláveis em Mobile */}
            <div className="md:hidden w-full overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex space-x-2 w-max">
                <button
                  onClick={() => handleCategoryChange("all")}
                  className={`px-3 py-1 text-xs rounded-full transition-all duration-200 uppercase tracking-tight whitespace-nowrap ${
                    selectedCategory === "all"
                      ? "bg-[#89764b] text-white"
                      : "bg-black text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  Todos
                </button>
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-3 py-1 text-xs rounded-full transition-all duration-200 uppercase tracking-tight whitespace-nowrap ${
                      selectedCategory === category.id
                        ? "bg-[#89764b] text-white"
                        : "bg-black text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Categorias em Desktop */}
            <div className="hidden md:flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 uppercase tracking-tight ${
                    selectedCategory === category.id
                      ? "bg-[#89764b] text-white"
                      : "bg-black text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="w-full md:w-auto md:flex-1 md:max-w-md">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 bg-black/70 text-white border border-white/20 rounded-full focus:border-[#89764b] focus:ring-2 focus:ring-[#89764b]/50 transition-all text-sm md:text-base"
                  />
                </div>
              </form>
            </div>
          </div>

          {(searchTerm || selectedCategory !== "all") && (
            <div className="text-center mt-3 md:mt-4">
              <button
                onClick={handleClearFilters}
                className="px-4 py-1.5 md:px-6 md:py-2 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-colors uppercase text-xs md:text-sm"
              >
                Limpar busca e filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lista de Produtos */}
      <section className="py-8 md:py-12 lg:py-16 bg-[#d4d4d4]">
        <div className="container mx-auto px-4">
          {loading && page === 1 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl overflow-hidden border border-[#9c9c9c]/30 animate-pulse"
                >
                  <div className="h-60 md:h-80 bg-[#e5e5e5]"></div>
                  <div className="p-4 md:p-6">
                    <div className="h-5 md:h-6 bg-[#e5e5e5] rounded mb-3 md:mb-4"></div>
                    <div className="h-3 md:h-4 bg-[#e5e5e5] rounded mb-2 md:mb-3 w-3/4"></div>
                    <div className="h-12 md:h-16 bg-[#e5e5e5] rounded mb-4 md:mb-6"></div>
                    <div className="h-8 md:h-10 bg-[#e5e5e5] rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 md:py-16">
              <div className="bg-[#f5f5f5] text-[#9a3324] p-4 md:p-6 rounded-xl max-w-md mx-auto border border-[#9a3324]/30">
                <p className="mb-3 md:mb-4">{error}</p>
                <button
                  onClick={() => fetchWines(1)}
                  className="px-6 py-2 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-colors uppercase text-sm"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : wines.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg md:text-xl text-[#000000] mb-2 md:mb-3">
                  Nenhum produto encontrado
                </h3>
                <p className="text-xs md:text-sm text-[#9c9c9c] mb-4 md:mb-6">
                  Tente ajustar seus filtros de busca
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-colors uppercase text-sm"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {wineList}
            </div>
          )}

          {hasMore && !loadingMore && wines.length > 0 && (
            <div className="text-center mt-8 md:mt-12 lg:mt-16">
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={loadingMore}
                className="px-6 md:px-8 py-2 md:py-3 bg-transparent text-[#89764b] border border-[#89764b] rounded-lg hover:bg-[#89764b]/10 transition-all uppercase tracking-wider flex items-center justify-center gap-2 mx-auto text-sm md:text-base"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                    Carregando...
                  </>
                ) : (
                  "Carregar Mais"
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default VinhosPage;
