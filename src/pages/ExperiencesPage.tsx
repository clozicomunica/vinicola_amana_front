import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import experienceBg from "../assets/experienceBg.jpg";
import wineImage from "../assets/wine-bottle.jpg"; // Fallback image from VinhosPage

interface Wine {
  id: number;
  name: { pt: string };
  variants: { id: number; price: string; compare_at_price?: string }[];
  images: { src: string; alt?: string[] }[];
  categories: { name: { pt: string } }[];
  description: { pt: string };
  created_at: string;
}

const ExperiencesPage = () => {
  const [products, setProducts] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://vinicola-amana-back.onrender.com/api/products?per_page=2"
        );

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data: Wine[] = await response.json();
        setProducts(data); // Fetch only 2 products
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Erro desconhecido ao carregar os produtos");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const cardVariants: Variants = {
    offscreen: { y: 50, opacity: 0 },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  // Function to decode HTML entities (from VinhosPage)
  function decodeHtmlEntities(html: string) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-white bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        Carregando produtos...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] text-white font-oswald overflow-hidden">
      {/* Hero Cinematográfico */}
      <section className="relative h-screen min-h-[800px] flex items-center">
        <div
          className="absolute z-0 w-full h-full bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${experienceBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-1" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6 leading-[0.9]">
              <span className="block mb-4">VIVA</span>
              <span className="text-white">AMANA</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Produtos exclusivos que elevam sua experiência de enoturismo
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronRight className="h-8 w-8 text-[#89764b] rotate-90" />
          </motion.div>
        </div>
      </section>

      {/* Produtos */}
      <section id="produtos" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="text-[#89764b] uppercase tracking-[0.3em] text-sm mb-4 inline-block">
                Jornadas Únicas
              </span>
              <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
                <span className="block">Nossas</span>
                <span className="text-[#89764b]">Experiências</span>
              </h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                className="group relative overflow-hidden"
              >
                <div className="relative h-[500px] overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={product.images[0]?.src || wineImage}
                    alt={product.name.pt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#89764b] to-transparent opacity-90 mix-blend-multiply rounded-xl" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <span className="text-sm uppercase tracking-widest opacity-80">
                      {product.categories[0]?.name.pt || "Produto Amana"}
                    </span>
                    <h3 className="text-3xl font-light mb-4">
                      {product.name.pt}
                    </h3>
                    <div className="w-12 h-px bg-white mb-4"></div>
                    <p className="mb-6">
                      {decodeHtmlEntities(
                        product.description.pt.replace(/<[^>]*>/g, "")
                      ).slice(0, 100)}
                      ...
                    </p>
                    <ul className="text-sm opacity-90 space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Disponível para compra imediata
                      </li>
                    </ul>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        to={`/produto/${product.id}`}
                        className="inline-flex items-center text-sm uppercase tracking-widest border-b border-white pb-1"
                      >
                        Saiba mais
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExperiencesPage;
