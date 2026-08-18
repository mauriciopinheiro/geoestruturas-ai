/**
 * Levantamentos territoriais pré-carregados para testes imediatos e demonstração.
 */
import { ProjetoLevantamento } from '../tipos/levantamento';
import { DeteccaoEstrutura, NivelConfianca, StatusDeteccao } from '../tipos/deteccao';
import { calcularEstatisticasLevantamento } from './calculador-estatisticas';

export function obterProjetosAmostra(): ProjetoLevantamento[] {
  const agora = '2026-08-18T10:00:00.000Z';

  const projetoVitoria: ProjetoLevantamento = {
    id: 'proj-amostra-vitoria-001',
    codigoProjeto: 'LEV-2026-001',
    nomeProjeto: 'Levantamento de Edificações — Setor Itapuã',
    nomeComunidade: 'Comunidade Vitória',
    municipio: 'Piracicaba',
    unidadeFederativa: 'SP',
    dataLevantamento: '18/08/2026',
    responsavelTecnico: 'Maurício Pinheiro — Eng. Sênior',
    observacoes: 'Área com delimitação por polígono amarelo ao longo do Córrego Itapuã.',
    status: 'concluido',
    etapaAtiva: 'resultado',
    imagem: {
      urlOriginal: '/assets/amostras/comunidade_vitoria_poligono.jpg',
      largura: 1000,
      altura: 500,
      nomeArquivo: 'comunidade_vitoria_poligono.jpg',
      tamanhoBytes: 470338,
      tipoMime: 'image/jpeg',
      indiceNitidez: 78,
      qualidadeAprovada: true
    },
    areaInteresse: {
      id: 'aoi-vitoria-01',
      nome: 'Perímetro Comunidade Vitória',
      pontos: [
        { x: 145, y: 285 },
        { x: 310, y: 190 },
        { x: 345, y: 235 },
        { x: 410, y: 235 },
        { x: 590, y: 40 },
        { x: 685, y: 130 },
        { x: 480, y: 365 },
        { x: 440, y: 495 }
      ],
      fechado: true,
      corBorda: '#FACC15',
      corPreenchimento: 'rgba(250, 204, 21, 0.12)',
      detectadoAutomaticamente: true
    },
    deteccoes: [],
    estatisticas: {
      totalContabilizado: 0,
      detectadosIA: 0,
      confirmadosIA: 0,
      adicionadosManualmente: 0,
      removidosManualmente: 0,
      necessitamRevisao: 0,
      revisadosManualmente: 0,
      altaConfianca: 0,
      mediaConfianca: 0,
      baixaConfianca: 0,
      confiancaMediaGeral: 92.4,
      percentualRevisado: 100
    },
    historicoAuditoria: [
      {
        id: 'aud-1',
        dataHora: '2026-08-18 10:15',
        acao: 'reprocessar',
        codigoEstrutura: 'GERAL',
        descricao: 'Análise por Visão Computacional executada com sucesso.'
      }
    ],
    criadoEm: agora,
    atualizadoEm: agora
  };

  const projetoEsperanca: ProjetoLevantamento = {
    id: 'proj-amostra-esperanca-002',
    codigoProjeto: 'LEV-2026-002',
    nomeProjeto: 'Regularização e Cadastro Domiciliar — Nova Esperança',
    nomeComunidade: 'Comunidade Nova Esperança',
    municipio: 'Piracicaba',
    unidadeFederativa: 'SP',
    dataLevantamento: '15/08/2026',
    responsavelTecnico: 'Maurício Pinheiro — Eng. Sênior',
    observacoes: 'Levantamento territorial em alta resolução com vias principais mapeadas.',
    status: 'em_conferencia',
    etapaAtiva: 'conferencia',
    imagem: {
      urlOriginal: '/assets/amostras/comunidade_nova_esperanca.jpg',
      largura: 890,
      altura: 790,
      nomeArquivo: 'comunidade_nova_esperanca.jpg',
      tamanhoBytes: 416349,
      tipoMime: 'image/jpeg',
      indiceNitidez: 84,
      qualidadeAprovada: true
    },
    areaInteresse: {
      id: 'aoi-esperanca-01',
      nome: 'Setor Habitacional Noroeste',
      pontos: [
        { x: 180, y: 170 },
        { x: 450, y: 90 },
        { x: 780, y: 60 },
        { x: 740, y: 620 },
        { x: 500, y: 720 },
        { x: 190, y: 880 }
      ],
      fechado: true,
      corBorda: '#00A896',
      corPreenchimento: 'rgba(0, 168, 150, 0.10)',
      detectadoAutomaticamente: false
    },
    deteccoes: [],
    estatisticas: {
      totalContabilizado: 0,
      detectadosIA: 0,
      confirmadosIA: 0,
      adicionadosManualmente: 0,
      removidosManualmente: 0,
      necessitamRevisao: 0,
      revisadosManualmente: 0,
      altaConfianca: 0,
      mediaConfianca: 0,
      baixaConfianca: 0,
      confiancaMediaGeral: 89.1,
      percentualRevisado: 75
    },
    historicoAuditoria: [],
    criadoEm: agora,
    atualizadoEm: agora
  };

  gerarDeteccoesAmostra(projetoVitoria, 142);
  gerarDeteccoesAmostra(projetoEsperanca, 186);

  return [projetoVitoria, projetoEsperanca];
}

function gerarDeteccoesAmostra(proj: ProjetoLevantamento, qtd: number): void {
  const pts = proj.areaInteresse?.pontos || [];
  let minX = 100, maxX = 800, minY = 100, maxY = 600;
  if (pts.length > 0) {
    minX = Math.min(...pts.map((p) => p.x)) + 20;
    maxX = Math.max(...pts.map((p) => p.x)) - 20;
    minY = Math.min(...pts.map((p) => p.y)) + 20;
    maxY = Math.max(...pts.map((p) => p.y)) - 20;
  }

  const dets: DeteccaoEstrutura[] = [];
  const agora = new Date().toISOString();

  for (let i = 1; i <= qtd; i++) {
    const rx = minX + Math.random() * (maxX - minX);
    const ry = minY + Math.random() * (maxY - minY);
    const conf = Number((0.72 + Math.random() * 0.26).toFixed(2));
    const nivel: NivelConfianca = conf >= 0.85 ? 'alta' : conf >= 0.75 ? 'media' : 'baixa';
    const status: StatusDeteccao = nivel === 'baixa' ? 'necessita_revisao' : 'confirmado';

    dets.push({
      id: `det-${proj.id}-${i}`,
      codigoIdentificador: `B${String(i).padStart(4, '0')}`,
      x: Math.round(rx),
      y: Math.round(ry),
      confianca: conf,
      nivelConfianca: nivel,
      origem: 'ia',
      status,
      dentroAreaInteresse: true,
      casoBorda: conf < 0.76,
      criadoEm: agora,
      atualizadoEm: agora
    });
  }

  proj.deteccoes = dets;
  proj.estatisticas = calcularEstatisticasLevantamento(dets);
}
