import React from "react";
import { Wine, Calendar, Award, MapPin } from "lucide-react"; // Make sure this path matches your icon library

export type Feature = {
  icon: () => React.ReactNode;
  title: string;
  description: string;
};

export const features: Feature[] = [
  {
    icon: () => React.createElement(Wine, { className: "w-8 h-8" }),
    title: "Nossos Vinhedos",
    description: `
    Atualmente, abrangemos quase 100 hectares de terras, com 11 hectares já dedicados
    ao cultivo de videiras francesas, incluindo variedades como Syrah, Cabernet Sauvignon,
    Cabernet Franc, Malbec, Sauvignon Blanc e Chenin Blanc. Além dos vinhedos em crescimento,
    nossas terras são ocupadas pela cultura de cafés especiais, oliveiras e áreas
    de matas nativas preservadas.
  `,
  },
  {
    icon: () => React.createElement(Calendar, { className: "w-8 h-8" }),
    title: "Safras Limitadas",
    description: `
    Investimos em uma vinícola de ponta, capacitada para mais de 200 mil garrafas por ano.
    Aqui, a expertise dos enólogos se encontra com maquinários modernos, resultando em vinhos
    inesquecíveis. Porém, respeitamos a natureza e as nossas safras ainda estão em desenvolvimento.
  `,
  },
  {
    icon: () => React.createElement(Award, { className: "w-8 h-8" }),
    title: "Premiações",
    description: `
    Somos uma Vinícola nova, aberta ao público apenas em 2023, e neste pouco tempo já possuímos
    06 prêmios na Decanter.
  `,
  },
  {
    icon: () => React.createElement(MapPin, { className: "w-8 h-8" }),
    title: "Terroir Único",
    description: `
    Nossa propriedade fica nas serras que dividem São Paulo e Minas Gerais e tem potencial único.
    A qualidade do solo de Espírito Santo do Pinhal é refletida em nossos rótulos.
  `,
  },
];
