/**
 * Gerador de Relatório Técnico de Levantamento Territorial (Impressão / PDF).
 */
import { ProjetoLevantamento } from '../tipos/levantamento';

export function imprimirRelatorioTecnico(projeto: ProjetoLevantamento): void {
  const janelaImpressao = window.open('', '_blank');
  if (!janelaImpressao) {
    alert('Por favor, permita popups para gerar a impressão do relatório técnico.');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Relatório Técnico — ${projeto.nomeProjeto}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1E293B; margin: 30px; line-height: 1.5; }
        .cabecalho { display: flex; justify-content: space-between; border-bottom: 2px solid #003B46; padding-bottom: 15px; margin-bottom: 20px; }
        .titulo { font-size: 20px; font-weight: bold; color: #003B46; }
        .subtitulo { font-size: 13px; color: #64748B; margin-top: 4px; }
        .grid-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; background: #F8FAFC; padding: 15px; border-radius: 6px; }
        .item-info label { font-size: 11px; text-transform: uppercase; color: #64748B; display: block; font-weight: 600; }
        .item-info span { font-size: 14px; font-weight: 600; color: #0F172A; }
        .bloco-contagem { text-align: center; background: #E6FFFA; border: 1px solid #38B2AC; border-radius: 8px; padding: 18px; margin-bottom: 25px; }
        .numero-destaque { font-size: 42px; font-weight: 800; color: #007A78; line-height: 1; }
        .rotulo-destaque { font-size: 14px; font-weight: 600; color: #2C7A7B; margin-top: 6px; }
        .tabela-metricas { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; }
        .tabela-metricas th, .tabela-metricas td { border: 1px solid #CBD5E1; padding: 8px 12px; text-align: left; }
        .tabela-metricas th { background: #F1F5F9; font-weight: 600; }
        .rodape-assinatura { margin-top: 40px; display: flex; justify-content: space-between; page-break-inside: avoid; }
        .linha-assinatura { width: 45%; border-top: 1px solid #475569; text-align: center; padding-top: 6px; font-size: 12px; }
        @media print { @page { margin: 15mm; size: A4 portrait; } body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="cabecalho">
        <div>
          <div class="titulo">LAUDO DE LEVANTAMENTO TERRITORIAL DE ESTRUTURAS</div>
          <div class="subtitulo">GeoEstruturas AI — Plataforma de Visão Computacional Aplicada ao Saneamento</div>
        </div>
        <div style="text-align: right; font-size: 12px; color: #475569;">
          Código: <strong>${projeto.codigoProjeto}</strong><br>
          Emissão: ${new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>

      <div class="grid-info">
        <div class="item-info"><label>Projeto</label><span>${projeto.nomeProjeto}</span></div>
        <div class="item-info"><label>Comunidade</label><span>${projeto.nomeComunidade}</span></div>
        <div class="item-info"><label>Município / UF</label><span>${projeto.municipio} - ${projeto.unidadeFederativa}</span></div>
        <div class="item-info"><label>Data do Levantamento</label><span>${projeto.dataLevantamento}</span></div>
        <div class="item-info"><label>Responsável Técnico</label><span>${projeto.responsavelTecnico || 'Engenharia de Saneamento'}</span></div>
        <div class="item-info"><label>Status da Revisão</label><span>${projeto.estatisticas.percentualRevisado}% Concluído</span></div>
      </div>

      <div class="bloco-contagem">
        <div class="numero-destaque">${projeto.estatisticas.totalContabilizado}</div>
        <div class="rotulo-destaque">TOTAL DE EDIFICAÇÕES / BARRACOS INDIVIDUALIZADOS</div>
      </div>

      <h3>Quadro Consolidado de Estruturas e Métricas de Auditoria</h3>
      <table class="tabela-metricas">
        <thead>
          <tr>
            <th>Classificação / Origem</th>
            <th>Quantidade</th>
            <th>Proporção</th>
            <th>Metodologia de Validação</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Detecções Confirmadas por IA</td>
            <td><strong>${projeto.estatisticas.confirmadosIA}</strong></td>
            <td>${Math.round((projeto.estatisticas.confirmadosIA / (projeto.estatisticas.totalContabilizado || 1)) * 100)}%</td>
            <td>Instance segmentation de coberturas e gradiente de contraste</td>
          </tr>
          <tr>
            <td>Adicionadas Manualmente por Técnico</td>
            <td><strong>${projeto.estatisticas.adicionadosManualmente}</strong></td>
            <td>${Math.round((projeto.estatisticas.adicionadosManualmente / (projeto.estatisticas.totalContabilizado || 1)) * 100)}%</td>
            <td>Inclusão após conferência em ortofoto / imagem de satélite</td>
          </tr>
          <tr>
            <td>Falsos Positivos Excluídos</td>
            <td><strong>${projeto.estatisticas.removidosManualmente}</strong></td>
            <td>-</td>
            <td>Rejeitado pelo operador humano durante auditoria técnica</td>
          </tr>
          <tr>
            <td>Nível Médio de Confiança da IA</td>
            <td><strong>${projeto.estatisticas.confiancaMediaGeral}%</strong></td>
            <td>-</td>
            <td>Acurácia espectral e definição geométrica das coberturas</td>
          </tr>
        </tbody>
      </table>

      <h3>Declaração Técnica e Metodologia</h3>
      <p style="font-size: 12px; color: #334155; text-align: justify;">
        A presente contagem foi executada através de processamento de imagem aérea com delimitação rigorosa de Área de Interesse (AOI), obedecendo ao princípio de <strong>uma estrutura física correspondente a exatamente um marcador auditável</strong>. O número total apurado é fruto exclusivo do somatório espacial das coberturas identificadas e conferidas, sem estimativas por densidade populacional ou aproximações estatísticas arbitrárias.
      </p>

      <div class="rodape-assinatura">
        <div class="linha-assinatura">
          <strong>${projeto.responsavelTecnico || 'Responsável Técnico'}</strong><br>
          Engenharia Territorial / Saneamento
        </div>
        <div class="linha-assinatura">
          <strong>Coordenação Operacional</strong><br>
          SEMAE — Saneamento e Levantamento Territorial
        </div>
      </div>
    </body>
    </html>
  `;

  janelaImpressao.document.write(html);
  janelaImpressao.document.close();
  janelaImpressao.focus();
  setTimeout(() => {
    janelaImpressao.print();
  }, 350);
}
