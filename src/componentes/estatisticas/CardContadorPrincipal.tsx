/**
 * Card com número principal de barracos/estruturas contabilizadas.
 */
import React from 'react';
import { Building2, ShieldCheck } from 'lucide-react';

interface CardContadorPrincipalProps {
  totalContabilizado: number;
  confiancaMedia: number;
  percentualRevisado: number;
}

export const CardContadorPrincipal: React.FC<CardContadorPrincipalProps> = ({
  totalContabilizado,
  confiancaMedia,
  percentualRevisado
}) => {
  return (
    <div className="card-contador-destaque">
      <div className="topo-contador">
        <div className="rotulo-icone">
          <Building2 size={18} className="icone-predio" />
          <span>Estruturas Contabilizadas</span>
        </div>
        <div className="selo-auditoria" title="Regra: 1 Marcador = 1 Estrutura Física">
          <ShieldCheck size={14} />
          <span>Auditado</span>
        </div>
      </div>

      <div className="valor-gigante-contador">{totalContabilizado}</div>

      <div className="subtotais-resumo">
        <div className="item-subtotal">
          <span className="rotulo">Confiança Geral</span>
          <strong className="valor">{confiancaMedia}%</strong>
        </div>
        <div className="divisor-vertical-contador" />
        <div className="item-subtotal">
          <span className="rotulo">Revisão Humana</span>
          <strong className="valor">{percentualRevisado}%</strong>
        </div>
      </div>
    </div>
  );
};
