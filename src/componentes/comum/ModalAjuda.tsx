/**
 * Modal de ajuda, instruções de uso e princípios metodológicos do sistema.
 */
import React from 'react';
import { X, ShieldCheck, Keyboard, Layers, Info } from 'lucide-react';

interface ModalAjudaProps {
  aberto: boolean;
  aoFechar: () => void;
}

export const ModalAjuda: React.FC<ModalAjudaProps> = ({ aberto, aoFechar }) => {
  if (!aberto) return null;

  return (
    <div className="overlay-modal-generico" onClick={aoFechar}>
      <div className="card-modal-ajuda" onClick={(e) => e.stopPropagation()}>
        <div className="cabecalho-modal-ajuda">
          <div className="titulo-modal">
            <Info size={20} />
            <h2>Guia Metodológico & Operacional — GeoEstruturas AI</h2>
          </div>
          <button type="button" className="btn-fechar-modal" onClick={aoFechar}>
            <X size={18} />
          </button>
        </div>

        <div className="corpo-modal-ajuda">
          <section className="secao-guia">
            <h3>
              <ShieldCheck size={16} />
              1. Princípio Fundamental de Contagem
            </h3>
            <p>
              O sistema <strong>não realiza estimativas arbitrárias por densidade</strong>.
              Cada número informado corresponde necessariamente a <strong>um marcador espacial auditável</strong> sobre o centro da cobertura da estrutura identificada:
            </p>
            <div className="formula-destaque">
              <strong>1 Marcador Visível = 1 Estrutura Física Contabilizada</strong>
            </div>
          </section>

          <section className="secao-guia">
            <h3>
              <Layers size={16} />
              2. Legenda de Cores dos Marcadores
            </h3>
            <div className="grade-legendas-ajuda">
              <div className="item-legenda-ajuda">
                <span className="ponto-amostra vermelho" />
                <div>
                  <strong>Vermelho:</strong> Estrutura detectada pela IA e confirmada.
                </div>
              </div>
              <div className="item-legenda-ajuda">
                <span className="ponto-amostra ambar" />
                <div>
                  <strong>Âmbar/Laranja:</strong> Baixa confiança ou estrutura na borda da AOI.
                </div>
              </div>
              <div className="item-legenda-ajuda">
                <span className="ponto-amostra azul" />
                <div>
                  <strong>Azul:</strong> Estrutura identificada e adicionada manualmente pelo técnico.
                </div>
              </div>
              <div className="item-legenda-ajuda">
                <span className="ponto-amostra cinza" />
                <div>
                  <strong>Cinza:</strong> Detecção removida/rejeitada (falso positivo na auditoria).
                </div>
              </div>
            </div>
          </section>

          <section className="secao-guia">
            <h3>
              <Keyboard size={16} />
              3. Atalhos de Teclado & Operação Rápida
            </h3>
            <ul className="lista-atalhos">
              <li><kbd>Ctrl + Z</kbd> Desfazer alteração no mapa</li>
              <li><kbd>Ctrl + Shift + Z</kbd> Refazer alteração desfeita</li>
              <li><kbd>Scroll Mouse</kbd> Zoom contínuo na posição do cursor</li>
              <li><kbd>Espaço + Arrastar</kbd> Pan / Mover enquadramento</li>
              <li><kbd>Clique no Marcador</kbd> Inspecionar detalhes e confirmar/rejeitar</li>
            </ul>
          </section>
        </div>

        <div className="rodape-modal-ajuda">
          <button type="button" className="btn-fechar-entendido" onClick={aoFechar}>
            Entendido, fechar guia
          </button>
        </div>
      </div>
    </div>
  );
};
