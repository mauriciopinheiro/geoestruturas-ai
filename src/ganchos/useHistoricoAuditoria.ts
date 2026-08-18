/**
 * Gancho para gerenciamento de histórico, desfazer (Undo) e refazer (Redo).
 */
import { useState, useCallback } from 'react';
import { DeteccaoEstrutura } from '../tipos/deteccao';
import { RegistroAuditoria } from '../tipos/estatisticas';

interface EstadoHistorico {
  passado: DeteccaoEstrutura[][];
  presente: DeteccaoEstrutura[];
  futuro: DeteccaoEstrutura[][];
  registros: RegistroAuditoria[];
}

export function useHistoricoAuditoria(estadoInicial: DeteccaoEstrutura[]) {
  const [estado, setEstado] = useState<EstadoHistorico>({
    passado: [],
    presente: estadoInicial,
    futuro: [],
    registros: []
  });

  const registrarAlteracao = useCallback(
    (
      novoPresente: DeteccaoEstrutura[],
      acao: RegistroAuditoria['acao'],
      codigoEstrutura: string,
      descricao: string
    ) => {
      setEstado((atual) => {
        const novoRegistro: RegistroAuditoria = {
          id: `aud-${Date.now()}`,
          dataHora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          acao,
          codigoEstrutura,
          descricao
        };

        return {
          passado: [...atual.passado.slice(-15), atual.presente],
          presente: novoPresente,
          futuro: [],
          registros: [novoRegistro, ...atual.registros.slice(0, 49)]
        };
      });
    },
    []
  );

  const desfazer = useCallback(() => {
    setEstado((atual) => {
      if (atual.passado.length === 0) return atual;
      const anterior = atual.passado[atual.passado.length - 1];
      const novoPassado = atual.passado.slice(0, -1);

      return {
        passado: novoPassado,
        presente: anterior,
        futuro: [atual.presente, ...atual.futuro],
        registros: atual.registros
      };
    });
  }, []);

  const refazer = useCallback(() => {
    setEstado((atual) => {
      if (atual.futuro.length === 0) return atual;
      const proximo = atual.futuro[0];
      const novoFuturo = atual.futuro.slice(1);

      return {
        passado: [...atual.passado, atual.presente],
        presente: proximo,
        futuro: novoFuturo,
        registros: atual.registros
      };
    });
  }, []);

  const redefinirHistorico = useCallback((novasDeteccoes: DeteccaoEstrutura[]) => {
    setEstado({
      passado: [],
      presente: novasDeteccoes,
      futuro: [],
      registros: []
    });
  }, []);

  return {
    deteccoes: estado.presente,
    registrosAuditoria: estado.registros,
    podeDesfazer: estado.passado.length > 0,
    podeRefazer: estado.futuro.length > 0,
    registrarAlteracao,
    desfazer,
    refazer,
    redefinirHistorico
  };
}
