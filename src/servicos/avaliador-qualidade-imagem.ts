/**
 * Avaliador de qualidade e nitidez de imagens aéreas para diagnóstico de resolução.
 */
import { converterParaEscalaCinza } from './processamento-imagem-base';

export interface ResultadoQualidadeImagem {
  aprovada: boolean;
  indiceNitidez: number; // Variância Laplaciana normalizada 0 a 100
  resolucaoMegapixels: number;
  largura: number;
  altura: number;
  mensagensDiagnostico: string[];
}

export function avaliarQualidadeImagem(
  dados: ImageData,
  larguraOriginal: number,
  alturaOriginal: number
): ResultadoQualidadeImagem {
  const { width, height } = dados;
  const cinza = converterParaEscalaCinza(dados);
  const mensagens: string[] = [];

  // Cálculo da variância do operador Laplaciano (indicador de nitidez)
  let soma = 0;
  let somaQuadrados = 0;
  let totalPontos = 0;

  for (let y = 1; y < height - 1; y += 2) {
    for (let x = 1; x < width - 1; x += 2) {
      const idx = y * width + x;
      // Kernel Laplaciano: [0, 1, 0; 1, -4, 1; 0, 1, 0]
      const laplaciano =
        cinza[idx - width] +
        cinza[idx + width] +
        cinza[idx - 1] +
        cinza[idx + 1] -
        4 * cinza[idx];

      soma += laplaciano;
      somaQuadrados += laplaciano * laplaciano;
      totalPontos++;
    }
  }

  const media = soma / (totalPontos || 1);
  const variancia = somaQuadrados / (totalPontos || 1) - media * media;
  // Normalização do índice de nitidez
  const indiceNitidez = Math.min(100, Math.round((variancia / 80) * 100));
  const megapixels = Number(((larguraOriginal * alturaOriginal) / 1000000).toFixed(2));

  if (megapixels < 0.5) {
    mensagens.push(
      'Resolução baixa detectada (< 0.5 MP). Pequenos barracos podem apresentar limites difusos.'
    );
  }

  if (indiceNitidez < 20) {
    mensagens.push(
      'Nitidez insuficiente na imagem. Algumas coberturas podem demandar conferência humana criteriosa.'
    );
  }

  const aprovada = megapixels >= 0.3 && indiceNitidez >= 15;

  return {
    aprovada,
    indiceNitidez,
    resolucaoMegapixels: megapixels,
    largura: larguraOriginal,
    altura: alturaOriginal,
    mensagensDiagnostico: mensagens
  };
}
