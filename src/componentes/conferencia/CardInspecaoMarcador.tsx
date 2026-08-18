/**
 * Card de inspeção individual de estrutura selecionada.
 */
import React from 'react';
import { CheckCircle, XCircle, Focus, X } from 'lucide-react';
import { DeteccaoEstrutura } from '../../tipos/deteccao';

interface CardInspecaoMarcadorProps {
  estrutura: DeteccaoEstrutura;
  aoConfirmar: (id: string) => void;
  aoRemover: (id: string) => void;
  aoCentralizar?: (x: number, y: number) => void;
  aoFechar: () => void;
}

export const CardInspecaoMarcador: React.FC<CardInspecaoMarcadorProps> = ({
  estrutura,
  aoConfirmar,
  aoRemover,
  aoCentralizar,
  aoFechar
}) => {
  const porcentagemConfianca = Math.round(estrutura.confianca * 100);

  return (
    <div className="card-inspecao-flutuante">
      <div className="cabecalho-inspecao">
        <div className="titulo-inspecao">
          <span className="badge-codigo">{estrutura.codigoIdentificador}</span>
          <span className="rotulo-tipo">
            {estrutura.origem === 'manual' ? 'Adição Manual' : 'Detecção Automática'}
          </span>
        </div>
        <button
          type="button"
          className="btn-fechar-inspecao"
          onClick={aoFechar}
          title="Fechar inspeção"
        >
          <X size={15} />
        </button>
      </div>

      <div className="detalhes-inspecao">
        <div className="linha-metrica">
          <span>Nível de Confiança:</span>
          <strong className={`confianca-${estrutura.nivelConfianca}`}>
            {porcentagemConfianca}% ({estrutura.nivelConfianca.toUpperCase()})
          </strong>
        </div>
        <div className="linha-metrica">
          <span>Coordenadas (PX):</span>
          <span>
            X: {estrutura.x} | Y: {estrutura.y}
          </span>
        </div>
        <div className="linha-metrica">
          <span>Situação Atual:</span>
          <span className={`status-tag status-${estrutura.status}`}>
            {estrutura.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        {estrutura.casoBorda && (
          <div className="alerta-borda-tag">
            ⚠️ Estrutura localizada na divisa da área
          </div>
        )}
      </div>

      <div className="acoes-inspecao">
        <button
          type="button"
          className="btn-acao-inspecao confirmar"
          onClick={() => aoConfirmar(estrutura.id)}
          disabled={estrutura.status === 'confirmado'}
        >
          <CheckCircle size={15} />
          <span>Confirmar</span>
        </button>

        <button
          type="button"
          className="btn-acao-inspecao remover"
          onClick={() => aoRemover(estrutura.id)}
          disabled={estrutura.status === 'rejeitado'}
        >
          <XCircle size={15} />
          <span>Não é Estrutura</span>
        </button>

        {aoCentralizar && (
          <button
            type="button"
            className="btn-acao-inspecao centralizar"
            onClick={() => aoCentralizar(estrutura.x, estrutura.y)}
            title="Centralizar câmera nesta estrutura"
          >
            <Focus size={15} />
          </button>
        )}
      </div>
    </div>
  );
};
