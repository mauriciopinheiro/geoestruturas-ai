/**
 * Etapa 2 do Assistente: Upload e Inspeção de Imagem Aérea.
 */
import React, { useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, FileImage } from 'lucide-react';
import { MetadadosImagem } from '../../tipos/levantamento';
import {
  carregarElementoImagem,
  obterDadosPixels
} from '../../servicos/processamento-imagem-base';
import { avaliarQualidadeImagem } from '../../servicos/avaliador-qualidade-imagem';

interface EtapaUploadImagemProps {
  imagem: MetadadosImagem | null;
  aoDefinirImagem: (img: MetadadosImagem) => void;
}

export const EtapaUploadImagem: React.FC<EtapaUploadImagemProps> = ({
  imagem,
  aoDefinirImagem
}) => {
  const inputArquivoRef = useRef<HTMLInputElement | null>(null);

  const processarArquivoImagem = async (arquivo: File) => {
    const url = URL.createObjectURL(arquivo);
    const imgEl = await carregarElementoImagem(url);
    const { dados } = obterDadosPixels(imgEl, 1000, 1000);
    const avaliacao = avaliarQualidadeImagem(dados, imgEl.naturalWidth, imgEl.naturalHeight);

    aoDefinirImagem({
      urlOriginal: url,
      largura: imgEl.naturalWidth,
      altura: imgEl.naturalHeight,
      nomeArquivo: arquivo.name,
      tamanhoBytes: arquivo.size,
      tipoMime: arquivo.type,
      indiceNitidez: avaliacao.indiceNitidez,
      qualidadeAprovada: avaliacao.aprovada
    });
  };

  const selecionarAmostra = async (nomeArquivo: string, rotulo: string) => {
    const url = `/assets/amostras/${nomeArquivo}`;
    const imgEl = await carregarElementoImagem(url);
    const { dados } = obterDadosPixels(imgEl, 1000, 1000);
    const avaliacao = avaliarQualidadeImagem(dados, imgEl.naturalWidth, imgEl.naturalHeight);

    aoDefinirImagem({
      urlOriginal: url,
      largura: imgEl.naturalWidth,
      altura: imgEl.naturalHeight,
      nomeArquivo: rotulo,
      tamanhoBytes: 450000,
      tipoMime: 'image/jpeg',
      indiceNitidez: avaliacao.indiceNitidez,
      qualidadeAprovada: avaliacao.aprovada
    });
  };

  const lidarDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processarArquivoImagem(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="conteudo-etapa-assistente">
      <div className="cabecalho-etapa-texto">
        <h3>Etapa 2 — Seleção e Upload da Imagem Aérea</h3>
        <p>Envie uma imagem aérea/satélite ou utilize uma amostra real de teste.</p>
      </div>

      <div
        className={`zona-drag-drop-imagem ${imagem ? 'com-imagem' : ''}`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={lidarDrop}
        onClick={() => inputArquivoRef.current?.click()}
      >
        <input
          ref={inputArquivoRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processarArquivoImagem(e.target.files[0]);
            }
          }}
        />

        {imagem ? (
          <div className="preview-imagem-upload">
            <img src={imagem.urlOriginal} alt="Preview" className="img-preview" />
            <div className="painel-meta-imagem-upload">
              <div className="nome-arquivo-upload">
                <FileImage size={16} />
                <span>{imagem.nomeArquivo}</span>
              </div>
              <div className="dimensoes-upload">
                {imagem.largura} &times; {imagem.altura} px (
                {(imagem.tamanhoBytes / 1024).toFixed(1)} KB)
              </div>
              <div className="badge-nitidez">
                {imagem.qualidadeAprovada ? (
                  <span className="nitidez-ok">
                    <CheckCircle2 size={14} /> Nitidez Aprovada ({imagem.indiceNitidez}%)
                  </span>
                ) : (
                  <span className="nitidez-alerta">
                    <AlertTriangle size={14} /> Resolução Baixa ({imagem.indiceNitidez}%)
                  </span>
                )}
              </div>
              <span className="link-trocar-imagem">Clique para selecionar outra imagem</span>
            </div>
          </div>
        ) : (
          <div className="instrucoes-upload">
            <UploadCloud size={48} className="icone-nuvem-upload" />
            <h4>Arraste uma imagem aérea para cá</h4>
            <p>ou clique para navegar no seu computador (JPG, PNG, WEBP)</p>
          </div>
        )}
      </div>

      <div className="secao-amostras-rapidas">
        <span className="rotulo-amostras">Ou selecione uma imagem aérea real para teste:</span>
        <div className="botoes-amostras-grid">
          <button
            type="button"
            className="btn-amostra-card"
            onClick={() =>
              selecionarAmostra(
                'comunidade_vitoria_poligono.jpg',
                'Comunidade Vitória (Com Delimitação Amarela)'
              )
            }
          >
            <img
              src="/assets/amostras/comunidade_vitoria_poligono.jpg"
              alt="Amostra 1"
              className="thumb-amostra"
            />
            <div className="info-amostra">
              <strong>Comunidade Vitória</strong>
              <span>Satélite com polígono amarelo</span>
            </div>
          </button>

          <button
            type="button"
            className="btn-amostra-card"
            onClick={() =>
              selecionarAmostra(
                'comunidade_nova_esperanca.jpg',
                'Comunidade Nova Esperança (Ortofoto)'
              )
            }
          >
            <img
              src="/assets/amostras/comunidade_nova_esperanca.jpg"
              alt="Amostra 2"
              className="thumb-amostra"
            />
            <div className="info-amostra">
              <strong>Comunidade Nova Esperança</strong>
              <span>Ortofoto alta resolução</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
