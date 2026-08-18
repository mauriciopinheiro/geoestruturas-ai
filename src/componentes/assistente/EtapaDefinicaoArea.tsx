/**
 * Etapa 3 do Assistente: Definição da Área de Interesse (AOI).
 */
import React, { useState } from 'react';
import { Sparkles, Edit3, Maximize, CheckCircle2, AlertCircle } from 'lucide-react';
import { MetadadosImagem } from '../../tipos/levantamento';
import { PoligonoAreaInteresse } from '../../tipos/poligono';
import {
  carregarElementoImagem,
  obterDadosPixels
} from '../../servicos/processamento-imagem-base';
import { detectarPoligonoAmarelo } from '../../servicos/detector-poligono-amarelo';

interface EtapaDefinicaoAreaProps {
  imagem: MetadadosImagem;
  areaInteresse: PoligonoAreaInteresse | null;
  aoDefinirArea: (area: PoligonoAreaInteresse | null) => void;
}

export const EtapaDefinicaoArea: React.FC<EtapaDefinicaoAreaProps> = ({
  imagem,
  areaInteresse,
  aoDefinirArea
}) => {
  const [detectando, setDetectando] = useState(false);
  const [mensagemDeteccao, setMensagemDeteccao] = useState<string | null>(null);

  const executarAutoDeteccao = async () => {
    setDetectando(true);
    setMensagemDeteccao(null);
    try {
      const imgEl = await carregarElementoImagem(imagem.urlOriginal);
      const { dados } = obterDadosPixels(imgEl, 1000, 1000);
      const resultado = detectarPoligonoAmarelo(dados, imagem.largura, imagem.altura);

      if (resultado) {
        aoDefinirArea(resultado);
        setMensagemDeteccao('Delimitação amarela identificada com sucesso!');
      } else {
        setMensagemDeteccao(
          'Nenhum polígono amarelo explícito foi detectado na imagem. Você pode desenhar manualmente.'
        );
      }
    } catch (err) {
      setMensagemDeteccao('Erro ao analisar contornos da imagem.');
    } finally {
      setDetectando(false);
    }
  };

  const definirAreaTotal = () => {
    const areaTotal: PoligonoAreaInteresse = {
      id: `aoi-total-${Date.now()}`,
      nome: 'Área Total da Imagem',
      pontos: [
        { x: 0, y: 0 },
        { x: imagem.largura, y: 0 },
        { x: imagem.largura, y: imagem.altura },
        { x: 0, y: imagem.altura }
      ],
      fechado: true,
      corBorda: '#00A896',
      corPreenchimento: 'rgba(0, 168, 150, 0.08)',
      detectadoAutomaticamente: false
    };
    aoDefinirArea(areaTotal);
    setMensagemDeteccao('Toda a extensão da imagem será analisada.');
  };

  return (
    <div className="conteudo-etapa-assistente">
      <div className="cabecalho-etapa-texto">
        <h3>Etapa 3 — Delimitação da Área de Interesse (AOI)</h3>
        <p>A imagem já possui um polígono amarelo desenhado ou deseja desenhar agora?</p>
      </div>

      <div className="grade-opcoes-area">
        <div className="card-opcao-area" onClick={executarAutoDeteccao}>
          <div className="icone-opcao-area amarelo">
            <Sparkles size={24} />
          </div>
          <h4>Detectar Delimitação Automaticamente</h4>
          <p>A IA busca por contornos amarelos ou perímetros pré-desenhados no mapa.</p>
          <button type="button" className="btn-acao-opcao" disabled={detectando}>
            {detectando ? 'Analisando Imagem...' : 'Detectar Limite Amarelo'}
          </button>
        </div>

        <div
          className="card-opcao-area"
          onClick={() => {
            aoDefinirArea(null);
            setMensagemDeteccao('Você poderá desenhar o polígono na bancada GIS.');
          }}
        >
          <div className="icone-opcao-area azul">
            <Edit3 size={24} />
          </div>
          <h4>Desenhar Área Manualmente</h4>
          <p>Você poderá clicar nos vértices da imagem na bancada para definir o perímetro.</p>
          <button type="button" className="btn-acao-opcao">
            Desenhar na Bancada
          </button>
        </div>

        <div className="card-opcao-area" onClick={definirAreaTotal}>
          <div className="icone-opcao-area verde">
            <Maximize size={24} />
          </div>
          <h4>Analisar Imagem Inteira</h4>
          <p>Todas as estruturas visíveis em 100% da imagem serão identificadas.</p>
          <button type="button" className="btn-acao-opcao">
            Selecionar Imagem Total
          </button>
        </div>
      </div>

      {mensagemDeteccao && (
        <div
          className={`alerta-resultado-deteccao-area ${
            areaInteresse ? 'sucesso' : 'aviso'
          }`}
        >
          {areaInteresse ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{mensagemDeteccao}</span>
        </div>
      )}

      {areaInteresse && (
        <div className="resumo-area-selecionada">
          <strong>Área Selecionada:</strong> {areaInteresse.nome} (
          {areaInteresse.pontos.length} vértices definidos)
        </div>
      )}
    </div>
  );
};
