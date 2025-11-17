import { Wine, Calendar, MapPin, Award } from "lucide-react";
import React from "react";

export type Award = {
  year: string;
  month: string;
  name: string;
  icon: React.ReactNode;
};

export const awards: Award[] = [
    {
      year: "2017",
      month: "Maio",
      name: "Aquisição da primeira propriedade por um grupo de amigos apaixonados pelo universo do vinho, e confiantes no enorme potencial do terroir de Espírito Santo do Pinhal para a produção de vinhos de excelência.",
      icon: React.createElement(MapPin, { className: "h-4 w-4 mx-auto my-3" }) // Ícone de localização para aquisição
    },
    {
      year: "2017",
      month: "Agosto",
      name: "Inicia-se o processo de mapeamento da propriedade e preparo do solo dos primeiros talhões, visando o plantio de nossas primeiras videiras.",
      icon: React.createElement(Calendar, { className: "h-4 w-4 mx-auto my-3" }) // Ícone de calendário para preparo
    },
    {
      year: "2018",
      month: "", // Sem mês específico
      name: "Plantio dos primeiros 3 hectares, sendo 1,5 de Syrah e 1,5 de Sauvignon Blanc vindos da França.",
      icon: React.createElement(Wine, { className: "h-4 w-4 mx-auto my-3" }) // Ícone de vinho para plantio
    },
    {
      year: "2019",
      month: "",
      name: "Plantio de mais dois talhões com 1,7 hectares de Syrah vindas da Itália.",
      icon: React.createElement(Wine, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2020",
      month: "Junho",
      name: "Compra das primeiras Barricas Francesas.",
      icon: React.createElement(Award, { className: "h-4 w-4 mx-auto my-3" }) // Ícone de prêmio para aquisição de equipamentos
    },
    {
      year: "2020",
      month: "Agosto",
      name: "Primeira colheita experimental em uma área de aproximadamente 0,5 Hectare de Syrah, na ocasião com apenas 1 ANO E 10 meses de idade. A qualidade alcançada surpreende a todos.",
      icon: React.createElement(Calendar, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2020",
      month: "Outubro",
      name: "Segue a expansão da área plantada com 0,7 hectares de Cabernet Sauvignon e 0,5 hectares de Chenin Blanc, a primeira experiencia dessa casta em vinhos de inverno.",
      icon: React.createElement(Wine, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2021",
      month: "Julho",
      name: "Primeira colheita de Sauvignon Blanc.",
      icon: React.createElement(Calendar, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2021",
      month: "Agosto",
      name: "Segunda colheita de Syrah (primeira comercial).",
      icon: React.createElement(Calendar, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2021",
      month: "Setembro",
      name: "Expansão com mais 1,0 hectare de Cabernet Sauvignon e 1,0 Hectare de Cabernet Franc.",
      icon: React.createElement(Wine, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2022",
      month: "Julho",
      name: "Primeira colheita de Chenin Blanc.",
      icon: React.createElement(Calendar, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2022",
      month: "Agosto",
      name: "Primeira colheita de Cabernet Sauvignon.",
      icon: React.createElement(Calendar, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2022",
      month: "Setembro",
      name: "Nova expansão com mais 1,0 Hectare de Cabernet Franc e 0,7 Hectares de Malbec.",
      icon: React.createElement(Wine, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2023",
      month: "Setembro",
      name: "Plantio de mais uma área pequena com a variedade Cabernet Sauvignon.",
      icon: React.createElement(Wine, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2023",
      month: "Novembro",
      name: "No dia 05/11/2023 é formalmente inaugurada a estrutura de Enoturismo, com loja, degustações, jardim etc.",
      icon: React.createElement(Award, { className: "h-4 w-4 mx-auto my-3" }) // Ícone de prêmio para inauguração
    },
    {
      year: "2024",
      month: "Março",
      name: "Inicio das visitas guiadas.",
      icon: React.createElement(MapPin, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2024",
      month: "Junho",
      name: "Inauguração da fábrica (cantina), com o início da colheita e vinificação 100% interna. Ganhamos Medalhas de BRONZE na premiação internacional DECANTER.",
      icon: React.createElement(Award, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2024",
      month: "Agosto",
      name: "Primeira Safra de Cabernet Franc.",
      icon: React.createElement(Calendar, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2024",
      month: "Setembro",
      name: "Fechamos a safra de 2024 ultrapassando pela primeira vez as 40 toneladas.",
      icon: React.createElement(Award, { className: "h-4 w-4 mx-auto my-3" })
    },
    {
      year: "2025",
      month: "Junho",
      name: "Ganhamos Medalhas de BRONZE E PRATA na premiação internacional DECANTER. Lançamento do rótulo T4 da linha Singular. Um rótulo diferenciado de nosso micro-terroir.",
      icon: React.createElement(Award, { className: "h-4 w-4 mx-auto my-3" })
    }
  ];
