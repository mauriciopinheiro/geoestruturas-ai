/**
 * Utilitários fundamentais para carregamento e manipulação de imagens em Canvas.
 */

export async function carregarElementoImagem(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const imagem = new Image();
    imagem.crossOrigin = 'anonymous';
    imagem.onload = () => resolve(imagem);
    imagem.onerror = (erro) => reject(new Error(`Falha ao carregar imagem: ${erro}`));
    imagem.src = url;
  });
}

export function obterDadosPixels(
  imagem: HTMLImageElement,
  larguraMaxima?: number,
  alturaMaxima?: number
): { dados: ImageData; canvas: HTMLCanvasElement; escala: number } {
  let largura = imagem.naturalWidth || imagem.width;
  let altura = imagem.naturalHeight || imagem.height;
  let escala = 1.0;

  if (larguraMaxima && largura > larguraMaxima) {
    escala = larguraMaxima / largura;
    largura = larguraMaxima;
    altura = Math.round(altura * escala);
  }

  if (alturaMaxima && altura > alturaMaxima) {
    const escalaAlt = alturaMaxima / altura;
    escala = escala * escalaAlt;
    altura = alturaMaxima;
    largura = Math.round(largura * escalaAlt);
  }

  const canvas = document.createElement('canvas');
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Não foi possível obter contexto 2D do Canvas.');

  ctx.drawImage(imagem, 0, 0, largura, altura);
  const dados = ctx.getImageData(0, 0, largura, altura);
  return { dados, canvas, escala };
}

export function converterParaEscalaCinza(dados: ImageData): Uint8Array {
  const { width, height, data } = dados;
  const cinza = new Uint8Array(width * height);
  for (let i = 0; i < data.length; i += 4) {
    // Luminância padrão ITU-R BT.601
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    cinza[i / 4] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  return cinza;
}
