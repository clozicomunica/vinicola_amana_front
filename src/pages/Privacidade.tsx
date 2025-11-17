import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#d4d4d4] font-['Oswald']">
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
            className="text-2xl md:text-3xl lg:text-4xl mb-4 md:mb-6 uppercase tracking-tight"
          >
            Política de Privacidade
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm md:text-base max-w-3xl mx-auto text-[#9c9c9c] leading-relaxed"
          >
            Saiba como a <strong>Vinícola Amana</strong> coleta, utiliza e
            protege seus dados ao utilizar nossa aplicação integrada à
            Nuvemshop.
          </motion.p>
        </div>
      </section>

      {/* Conteúdo da Política */}
      <section className="py-12 md:py-16 lg:py-20 bg-[#f8f5f0]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="bg-black p-8 md:p-10 rounded-lg border border-[#ffffff10]">
              <h2 className="text-2xl md:text-3xl text-[#89764b] mb-8 uppercase tracking-tight border-b border-[#89764b]/30 pb-4">
                Nossa Política
              </h2>
              <div className="space-y-8 text-gray-300 text-sm md:text-base leading-relaxed">
                <div>
                  <h3 className="text-lg md:text-xl text-[#89764b] mb-3 uppercase">
                    1. Introdução
                  </h3>
                  <p>
                    A <strong>Vinícola Amana</strong> respeita a sua privacidade
                    e está comprometida com a proteção dos seus dados pessoais.
                    Esta Política descreve como coletamos, usamos, armazenamos e
                    protegemos suas informações em conformidade com a Lei Geral
                    de Proteção de Dados (Lei nº 13.709/2018 - LGPD).
                  </p>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl text-[#89764b] mb-3 uppercase">
                    2. Dados Coletados
                  </h3>
                  <p>
                    Ao utilizar nossa aplicação na Nuvemshop, podemos coletar
                    dados fornecidos voluntariamente por você ou pelo lojista,
                    incluindo:
                  </p>
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Nome e informações de contato (e-mail e telefone);</li>
                    <li>Informações de pedidos e histórico de compras;</li>
                    <li>
                      Dados de identificação enviados pela Nuvemshop para fins
                      de integração;
                    </li>
                    <li>
                      Preferências de configuração relacionadas à sua loja.
                    </li>
                  </ul>
                  <p className="mt-2">
                    Não coletamos dados sensíveis sem seu consentimento
                    explícito.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl text-[#89764b] mb-3 uppercase">
                    3. Finalidade do Uso dos Dados
                  </h3>
                  <p>
                    Utilizamos seus dados apenas para as finalidades necessárias
                    à execução dos nossos serviços, incluindo:
                  </p>
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>
                      Processamento de pedidos e integração com a Nuvemshop;
                    </li>
                    <li>
                      Envio de notificações transacionais relacionadas ao seu
                      uso da aplicação;
                    </li>
                    <li>
                      Melhoria contínua da experiência e funcionamento da
                      plataforma.
                    </li>
                  </ul>
                  <p className="mt-2">
                    Não vendemos, alugamos ou compartilhamos seus dados pessoais
                    com terceiros, exceto quando necessário para a prestação do
                    serviço ou exigido por lei.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl text-[#89764b] mb-3 uppercase">
                    4. Compartilhamento de Dados
                  </h3>
                  <p>Podemos compartilhar suas informações com:</p>
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>
                      A plataforma Nuvemshop, para manter a integração entre sua
                      loja e nossa aplicação;
                    </li>
                    <li>
                      Provedores de serviços que nos auxiliam na operação e
                      segurança da aplicação;
                    </li>
                    <li>
                      Autoridades competentes, quando exigido por lei ou por
                      ordem judicial.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl text-[#89764b] mb-3 uppercase">
                    5. Direitos do Titular
                  </h3>
                  <p>Você tem o direito de solicitar, a qualquer momento:</p>
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Acesso aos seus dados pessoais;</li>
                    <li>
                      Correção de dados incompletos, inexatos ou desatualizados;
                    </li>
                    <li>
                      Exclusão de dados tratados com base em consentimento;
                    </li>
                    <li>Informações sobre o compartilhamento de seus dados;</li>
                    <li>
                      Portabilidade dos dados a outro fornecedor de serviço.
                    </li>
                  </ul>
                  <p className="mt-2">
                    Para exercer seus direitos, entre em contato pelo e-mail{" "}
                    <a
                      href="mailto:sac@vinicolaamana.com"
                      className="text-[#89764b] hover:text-[#756343] underline"
                    >
                      sac@vinicolaamana.com
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl text-[#89764b] mb-3 uppercase">
                    6. Cookies e Segurança
                  </h3>
                  <p>
                    Utilizamos cookies para melhorar a experiência de navegação.
                    Todos os dados são armazenados com segurança e protegidos
                    por medidas técnicas e administrativas adequadas, incluindo
                    criptografia e controle de acesso.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl text-[#89764b] mb-3 uppercase">
                    7. Retenção e Exclusão de Dados
                  </h3>
                  <p>
                    Os dados são mantidos apenas pelo tempo necessário ao
                    cumprimento das finalidades descritas nesta política ou
                    conforme exigido por lei. Caso você solicite a exclusão,
                    atenderemos sua requisição em conformidade com a LGPD.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg md:text-xl text-[#89764b] mb-3 uppercase">
                    8. Alterações nesta Política
                  </h3>
                  <p>
                    Esta política poderá ser atualizada periodicamente. A versão
                    mais recente estará sempre disponível nesta página.
                    Recomendamos que você a consulte regularmente.
                  </p>
                </div>

                <div>
                  <p>
                    Em caso de dúvidas, acesse nossa{" "}
                    <Link
                      to="/suporte"
                      className="text-[#89764b] hover:text-[#756343] underline"
                    >
                      página de suporte
                    </Link>{" "}
                    ou envie um e-mail para{" "}
                    <a
                      href="mailto:sac@vinicolaamana.com"
                      className="text-[#89764b] hover:text-[#756343] underline"
                    >
                      sac@vinicolaamana.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
