/**
 * Gancho mestre para controle de estado de um Projeto de Levantamento Territorial.
 */
import { useState, useCallback, useEffect } from 'react';
import { ProjetoLevantamento, EtapaFluxo } from '../tipos/levantamento';
import { DeteccaoEstrutura } from '../tipos/deteccao';
import { PoligonoAreaInteresse } from '../tipos/poligono';
import { calcularEstatisticasLevantamento } from '../servicos/calculador-estatisticas';
import { salvarProjeto } from '../servicos/armazenamento-projetos';
import { useHistoricoAuditoria } from './useHistoricoAuditoria';

export function useLevantamento(projetoInicial: ProjetoLevantamento) {
  const [projeto, setProjeto] = useState<ProjetoLevantamento>(projetoInicial);
  const [estruturaSelecionada, setEstruturaSelecionada] = useState<DeteccaoEstrutura | null>(null);

  const {
    deteccoes,
    registrosAuditoria,
    podeDesfazer,
    podeRefazer,
    registrarAlteracao,
    desfazer,
    refazer,
    redefinirHistorico
  } = useHistoricoAuditoria(projetoInicial.deteccoes);

  // Sincroniza estatísticas e histórico no projeto
  useEffect(() => {
    const novasEstatisticas = calcularEstatisticasLevantamento(deteccoes);
    setProjeto((atual) => {
      const atualizado: ProjetoLevantamento = {
        ...atual,
        deteccoes,
        estatisticas: novasEstatisticas,
        historicoAuditoria: registrosAuditoria,
        atualizadoEm: new Date().toISOString()
      };
      salvarProjeto(atualizado);
      return atualizado;
    });
  }, [deteccoes, registrosAuditoria]);

  const definirEtapa = useCallback((etapa: EtapaFluxo) => {
    setProjeto((atual) => ({ ...atual, etapaAtiva: etapa }));
  }, []);

  const definirAreaInteresse = useCallback((area: PoligonoAreaInteresse) => {
    setProjeto((atual) => ({ ...atual, areaInteresse: area }));
  }, []);

  const aplicarResultadoIA = useCallback(
    (novasDeteccoes: DeteccaoEstrutura[]) => {
      redefinirHistorico(novasDeteccoes);
      setProjeto((atual) => ({
        ...atual,
        status: 'em_conferencia',
        etapaAtiva: 'conferencia'
      }));
    },
    [redefinirHistorico]
  );

  const confirmarEstrutura = useCallback(
    (id: string) => {
      const agora = new Date().toISOString();
      const alvo = deteccoes.find((d) => d.id === id);
      if (!alvo) return;

      const atualizadas = deteccoes.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'confirmado' as const,
              nivelConfianca: 'alta' as const,
              revisadoEm: agora
            }
          : d
      );

      registrarAlteracao(
        atualizadas,
        'confirmar',
        alvo.codigoIdentificador,
        `Estrutura ${alvo.codigoIdentificador} confirmada pelo usuário.`
      );
    },
    [deteccoes, registrarAlteracao]
  );

  const removerEstrutura = useCallback(
    (id: string) => {
      const agora = new Date().toISOString();
      const alvo = deteccoes.find((d) => d.id === id);
      if (!alvo) return;

      const atualizadas = deteccoes.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'rejeitado' as const,
              revisadoEm: agora
            }
          : d
      );

      registrarAlteracao(
        atualizadas,
        'remover',
        alvo.codigoIdentificador,
        `Estrutura ${alvo.codigoIdentificador} removida da contagem (falso positivo).`
      );
      if (estruturaSelecionada?.id === id) setEstruturaSelecionada(null);
    },
    [deteccoes, estruturaSelecionada, registrarAlteracao]
  );

  const adicionarEstruturaManual = useCallback(
    (x: number, y: number) => {
      const proximoNumero = deteccoes.length + 1;
      const codigo = `B${String(proximoNumero).padStart(4, '0')}`;
      const agora = new Date().toISOString();

      const nova: DeteccaoEstrutura = {
        id: `det-manual-${Date.now()}`,
        codigoIdentificador: codigo,
        x: Math.round(x),
        y: Math.round(y),
        confianca: 1.0,
        nivelConfianca: 'alta',
        origem: 'manual',
        status: 'manual',
        dentroAreaInteresse: true,
        casoBorda: false,
        criadoEm: agora,
        atualizadoEm: agora,
        revisadoEm: agora
      };

      const atualizadas = [...deteccoes, nova];
      registrarAlteracao(
        atualizadas,
        'adicionar',
        codigo,
        `Nova estrutura ${codigo} adicionada manualmente na coordenada (${nova.x}, ${nova.y}).`
      );
      setEstruturaSelecionada(nova);
    },
    [deteccoes, registrarAlteracao]
  );

  const moverEstrutura = useCallback(
    (id: string, novoX: number, novoY: number) => {
      const alvo = deteccoes.find((d) => d.id === id);
      if (!alvo) return;

      const atualizadas = deteccoes.map((d) =>
        d.id === id
          ? { ...d, x: Math.round(novoX), y: Math.round(novoY), atualizadoEm: new Date().toISOString() }
          : d
      );

      registrarAlteracao(
        atualizadas,
        'mover',
        alvo.codigoIdentificador,
        `Marcador ${alvo.codigoIdentificador} reposicionado para (${Math.round(novoX)}, ${Math.round(novoY)}).`
      );
    },
    [deteccoes, registrarAlteracao]
  );

  return {
    projeto,
    deteccoes,
    estruturaSelecionada,
    setEstruturaSelecionada,
    definirEtapa,
    definirAreaInteresse,
    aplicarResultadoIA,
    confirmarEstrutura,
    removerEstrutura,
    adicionarEstruturaManual,
    moverEstrutura,
    podeDesfazer,
    podeRefazer,
    desfazer,
    refazer
  };
}
