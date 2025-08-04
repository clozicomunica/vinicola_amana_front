import { useEffect, useState, useMemo } from "react";
import { Search, ShoppingCart, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import wineImage from "../assets/wine-bottle.jpg";

interface Wine {
  id: number;
  name: { pt: string };
  variants: { price: string; compare_at_price?: string }[];
  images: { src: string; alt?: string[] }[];
  categories: { name: { pt: string } }[];
  description: { pt: string };
  created_at: string;
}

const CATEGORIES = [
  { id: "all", name: "Todos" },
  { id: "tinto", name: "Vinhos Tintos" },
  { id: "branco", name: "Vinhos Brancos" },
  { id: "rose", name: "Vinhos Rosé" },
  { id: "cafe", name: "Cafés" },
  { id: "acessorio", name: "Acessórios" },
  { id: "combo", name: "Combos" },
  { id: "experiencia", name: "Experiências" },
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
      setWines([]); // Limpa a lista ao buscar novos resultados
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

  // Efeito para buscar quando categoria ou termo de busca mudam
  useEffect(() => {
    setPage(1); // Resetar para a primeira página
    fetchWines(1);
  }, [selectedCategory, searchTerm]);

  // Efeito para carregar mais itens quando a página muda
  useEffect(() => {
    if (page > 1) {
      fetchWines(page);
    }
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
    setPage(1); // Resetar para a primeira página ao fazer nova busca
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1); // Resetar para a primeira página ao mudar categoria
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
        className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
      >
        <div className="relative flex items-center justify-center h-80 bg-gradient-to-b from-gray-50 to-gray-100 p-6">
          <img
            src={wine.images[0]?.src || wineImage}
            alt={wine.images[0]?.alt?.[0] || wine.name.pt}
            className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
            style={{
              mixBlendMode: "multiply",
              filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.15))",
              height: "clamp(180px, 100%, 240px)",
            }}
          />
          {wine.variants[0]?.compare_at_price && (
            <span className="absolute top-3 left-3 bg-[#9a3324] text-white text-xs px-3 py-1 rounded-full shadow-md font-oswald uppercase tracking-tight">
              Oferta
            </span>
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
            <Link
              to={`/produto/${wine.id}`}
              className="p-3 bg-white/90 rounded-full hover:bg-white transition transform hover:scale-110 shadow-lg"
            >
              <Eye className="h-5 w-5 text-gray-800" />
            </Link>
            <button
              onClick={() => handleAddToCart(wine)}
              className="p-3 bg-[#89764b] text-white rounded-full hover:bg-[#756343] transition transform hover:scale-110 shadow-lg"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="mb-4">
            <h3 className="font-bold text-gray-900 text-lg uppercase tracking-tight font-oswald mb-2">
              {wine.name.pt}
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-gray-600 font-oswald">
                {wine.categories[0]?.name.pt || "Vinho"}
              </span>
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span className="text-sm text-gray-600 font-oswald">
                Safra {new Date(wine.created_at).getFullYear()}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-700 line-clamp-3 mb-6 flex-grow">
            {decodeHtmlEntities(wine.description.pt.replace(/<[^>]*>/g, ""))}
          </p>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-gray-900 text-xl font-oswald">
                R${" "}
                {parseFloat(wine.variants[0]?.price ?? "0")
                  .toFixed(2)
                  .replace(".", ",")}
              </span>
              {wine.variants[0]?.compare_at_price && (
                <span className="text-sm text-gray-500 line-through font-oswald">
                  R${" "}
                  {parseFloat(wine.variants[0].compare_at_price)
                    .toFixed(2)
                    .replace(".", ",")}
                </span>
              )}
            </div>
            <button
              onClick={() => handleAddToCart(wine)}
              className="w-full px-4 py-3 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-all duration-300 font-oswald uppercase tracking-wide text-sm flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              Adicionar
            </button>
          </div>
        </div>
      </div>
    ));
  }, [wines]);

  return (
    <div className="min-h-screen bg-[#f8f5f0]">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 text-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/90">
          <div className="absolute inset-0 bg-black bg-cover bg-center opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 font-oswald uppercase tracking-tight">
            <span className="bg-clip-text text-center text-white">
              Nossos Produtos
            </span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-gray-300 leading-relaxed">
            Vinhos, cafés e acessórios para garantir uma experiência Amana
            completa em sua casa.
          </p>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="top-0 z-10 py-6 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 text-sm rounded-full transition-all duration-200 font-oswald uppercase tracking-tight ${
                    selectedCategory === category.id
                      ? "bg-[#89764b] text-white"
                      : "bg-black text-white/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-auto flex-1 max-w-md">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/70" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/70 text-white border border-white/20 rounded-full focus:border-[#89764b] focus:ring-2 focus:ring-[#89764b]/50 transition-all font-oswald"
                  />
                </div>
              </form>
            </div>
          </div>

          {(searchTerm || selectedCategory !== "all") && (
            <div className="text-center mt-6">
              <button
                onClick={handleClearFilters}
                className="px-6 py-2 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-colors font-oswald uppercase text-sm"
              >
                Limpar busca e filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lista de Produtos */}
      <section className="py-16 bg-[#f8f5f0]">
        <div className="container mx-auto px-4">
          {loading && page === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 animate-pulse"
                >
                  <div className="h-80 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-16 bg-gray-200 rounded mb-6"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-100 text-red-700 p-6 rounded-xl max-w-md mx-auto">
                <p className="font-medium font-oswald mb-4">{error}</p>
                <button
                  onClick={() => fetchWines(1)}
                  className="px-6 py-2 bg-[#89764b] hover:bg-[#756343] text-white rounded-lg transition-colors font-oswald uppercase text-sm"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : wines.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-oswald">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Tente ajustar seus filtros de busca
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {wineList}
            </div>
          )}

          {hasMore && !loadingMore && wines.length > 0 && (
            <div className="text-center mt-16">
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={loadingMore}
                className="px-10 py-4 bg-transparent text-[#89764b] border-2 border-[#89764b] rounded-lg hover:bg-[#89764b]/10 transition-all font-oswald uppercase tracking-wider flex items-center justify-center gap-2 mx-auto"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
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
