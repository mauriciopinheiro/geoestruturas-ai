/**
 * Alerta de qualidade de imagem aérea insuficiente ou de baixa resolução.
 */
import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { ResultadoQualidadeImagem } from '../../servicos/avaliador-qualidade-imagem';

interface AlertaQualidadeProps {
  qualidade: ResultadoQualidadeImagem;
  aoContinuarMesmoAssim: () => void;
}

export const AlertaQualidade: React.FC<AlertaQualidadeProps> = ({
  qualidade,
  aoContinuarMesmoAssim
}) => {
  if (qualidade.aprovada) return null;

  return (
    <div className="alerta-qualidade-insuficiente" role="alert">
      <div className="icone-alerta-qualidade">
        <AlertCircle size={22} />
      </div>
      <div className="conteudo-alerta-qualidade">
        <h4 className="titulo-aviso-qualidade">
          Aviso: Qualidade / Nitidez da Imagem em Nível de Atenção
        </h4>
        <p className="descricao-aviso-qualidade">
          A resolução ou o contraste da imagem atual pode dificultar a individualização precisa de estruturas muito adjacentes:
        </p>
        <ul className="lista-motivos-qualidade">
          {qualidade.mensagensDiagnostico.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
        <div className="acoes-aviso-qualidade">
          <button
            type="button"
            className="btn-continuar-alerta"
            onClick={aoContinuarMesmoAssim}
          >
            <span>Prosseguir para análise com conferência humana obrigatória</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
