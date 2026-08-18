/**
 * Componente de visualização do histórico cronológico de auditoria.
 */
import React from 'react';
import { History, PlusCircle, CheckCircle2, Trash2, Move } from 'lucide-react';
import { RegistroAuditoria } from '../../tipos/estatisticas';

interface HistoricoAuditoriaProps {
  registros: RegistroAuditoria[];
}

export const HistoricoAuditoria: React.FC<HistoricoAuditoriaProps> = ({ registros }) => {
  const obterIcone = (acao: RegistroAuditoria['acao']) => {
    switch (acao) {
      case 'adicionar':
        return <PlusCircle size={14} className="icone-auditoria adicao" />;
      case 'confirmar':
        return <CheckCircle2 size={14} className="icone-auditoria confirmacao" />;
      case 'remover':
        return <Trash2 size={14} className="icone-auditoria remocao" />;
      case 'mover':
        return <Move size={14} className="icone-auditoria movimento" />;
      default:
        return <History size={14} className="icone-auditoria padrao" />;
    }
  };

  return (
    <div className="container-historico-auditoria">
      <div className="cabecalho-historico">
        <History size={16} />
        <span>Trilha de Auditoria e Rastreabilidade</span>
      </div>

      {registros.length === 0 ? (
        <div className="mensagem-vazio-historico">
          Nenhuma alteração manual realizada até o momento.
        </div>
      ) : (
        <div className="lista-eventos-auditoria">
          {registros.map((reg) => (
            <div key={reg.id} className="item-evento-auditoria">
              <div className="horario-evento">{reg.dataHora}</div>
              <div className="corpo-evento">
                {obterIcone(reg.acao)}
                <span className="texto-descricao">{reg.descricao}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
