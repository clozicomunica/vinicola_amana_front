import { Link } from "react-router-dom";
import { Clock, ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import experienceBg from "../assets/experienceBg.jpg";

const ExperiencesPage = () => {
  // Dados das experiências com micro-interações
  const experiences = [
    {
      id: 1,
      title: "Visita Guiada",
      tagline: "Imersão Sensorial",
      description:
        "Conheça a história Amana através de uma jornada multisensorial pelos vinhedos",
      highlight:
        "Degustação dirigida pela nossa sommelière em sala com vista panorâmica",
      schedule: "Sexta a Domingo • 10h30 / 15h",
      image:
        "https://images.unsplash.com/photo-1470338622423-81a89b56393f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      color: "from-[#89764b] to-[#a08d63]",
    },
    {
      id: 2,
      title: "Jardim Amana",
      tagline: "Convivência Premium",
      description:
        "Um oásis para apreciar nossos vinhos com a vista mais cobiçada da Mantiqueira",
      highlight: "Espaço exclusivo para grupos e celebrações especiais",
      schedule: "Sexta e Sábado • 10h-19h | Domingo • 10h-16h",
      image:
        "https://images.unsplash.com/photo-1494318401918-8c59e4432e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      color: "from-[#756343] to-[#8a774d]",
    },
    {
      id: 3,
      title: "Loja Conceito",
      tagline: "Discovery Bar",
      description:
        "Experimente nossos vinhos no balcão de degustação interativo",
      highlight: "Tecnologia de harmonização digital com realidade aumentada",
      schedule: "Terça a Domingo • Horários variados",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200",
      color: "from-[#5e4b32] to-[#756343]",
    },
  ];

  // Animations com tipagem correta
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

  return (
    <div className="bg-[#0a0a0a] text-white font-oswald overflow-hidden">
      {/* Hero Cinematográfico */}
      <section className="relative h-screen min-h-[800px] flex items-center">
        {/* Imagem de fundo no lugar do vídeo */}
        <div
          className="absolute z-0 w-full h-full bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${experienceBg})` }}
        ></div>

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-1"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-6 leading-[0.9]">
              <span className="block mb-4">VIVA</span>
              <span className="text-[#89764b]">AMANA</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Experiências imersivas que redefinem o conceito de enoturismo
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="#experiencias"
                className="inline-flex items-center px-8 py-4 bg-[#89764b] hover:bg-[#756343] text-white rounded-sm transition-all duration-300 uppercase tracking-wider text-sm group"
              >
                Explorar
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
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

      {/* Experiências */}
      <section id="experiencias" className="py-24 relative">
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {experiences.map((exp) => (
              <motion.div
                key={exp.id}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.3 }}
                variants={cardVariants}
                className="group relative overflow-hidden"
              >
                <div className="relative h-[500px] overflow-hidden">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${exp.color} opacity-90 mix-blend-multiply`}
                  ></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <span className="text-sm uppercase tracking-widest opacity-80">
                      {exp.tagline}
                    </span>
                    <h3 className="text-3xl font-light mb-4">{exp.title}</h3>
                    <div className="w-12 h-px bg-white mb-4"></div>
                    <p className="mb-6">{exp.description}</p>
                    <ul className="text-sm opacity-90 space-y-2 mb-6">
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {exp.schedule}
                      </li>
                    </ul>
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Link
                        to={`/experiencias/${exp.id}`}
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
