/**
 * Etapa 1 do Assistente: Informações Cadastrais do Levantamento.
 */
import React from 'react';

export interface DadosCadastroLevantamento {
  nomeProjeto: string;
  nomeComunidade: string;
  municipio: string;
  unidadeFederativa: string;
  dataLevantamento: string;
  responsavelTecnico: string;
  observacoes: string;
}

interface EtapaInformacoesProps {
  dados: DadosCadastroLevantamento;
  aoAtualizar: (novosDados: Partial<DadosCadastroLevantamento>) => void;
}

export const EtapaInformacoes: React.FC<EtapaInformacoesProps> = ({ dados, aoAtualizar }) => {
  return (
    <div className="conteudo-etapa-assistente">
      <div className="cabecalho-etapa-texto">
        <h3>Etapa 1 — Informações do Levantamento</h3>
        <p>Informe os dados de identificação institucional e territorial da área.</p>
      </div>

      <div className="grade-formulario-etapa">
        <div className="campo-form-completo">
          <label htmlFor="nomeProjeto">Nome do Projeto / Levantamento *</label>
          <input
            id="nomeProjeto"
            type="text"
            placeholder="Ex: Levantamento de Edificações — Setor Norte"
            value={dados.nomeProjeto}
            onChange={(e) => aoAtualizar({ nomeProjeto: e.target.value })}
            className="input-form-padrao"
            required
          />
        </div>

        <div className="campo-form-metade">
          <label htmlFor="nomeComunidade">Nome da Comunidade / Assentamento *</label>
          <input
            id="nomeComunidade"
            type="text"
            placeholder="Ex: Comunidade Vitória"
            value={dados.nomeComunidade}
            onChange={(e) => aoAtualizar({ nomeComunidade: e.target.value })}
            className="input-form-padrao"
            required
          />
        </div>

        <div className="campo-form-metade grade-dupla">
          <div>
            <label htmlFor="municipio">Município *</label>
            <input
              id="municipio"
              type="text"
              placeholder="Ex: Piracicaba"
              value={dados.municipio}
              onChange={(e) => aoAtualizar({ municipio: e.target.value })}
              className="input-form-padrao"
              required
            />
          </div>
          <div>
            <label htmlFor="unidadeFederativa">UF *</label>
            <input
              id="unidadeFederativa"
              type="text"
              placeholder="SP"
              maxLength={2}
              value={dados.unidadeFederativa}
              onChange={(e) => aoAtualizar({ unidadeFederativa: e.target.value.toUpperCase() })}
              className="input-form-padrao"
              required
            />
          </div>
        </div>

        <div className="campo-form-metade">
          <label htmlFor="dataLevantamento">Data do Levantamento *</label>
          <input
            id="dataLevantamento"
            type="date"
            value={dados.dataLevantamento}
            onChange={(e) => aoAtualizar({ dataLevantamento: e.target.value })}
            className="input-form-padrao"
            required
          />
        </div>

        <div className="campo-form-metade">
          <label htmlFor="responsavelTecnico">Responsável Técnico / Engenheiro</label>
          <input
            id="responsavelTecnico"
            type="text"
            placeholder="Ex: Maurício Pinheiro — Arquiteto de Dados Sênior"
            value={dados.responsavelTecnico}
            onChange={(e) => aoAtualizar({ responsavelTecnico: e.target.value })}
            className="input-form-padrao"
          />
        </div>

        <div className="campo-form-completo">
          <label htmlFor="observacoes">Observações Técnicas / Contexto de Saneamento</label>
          <textarea
            id="observacoes"
            placeholder="Descreva detalhes como área de preservação permanente, linhas de divisa, relevo, etc."
            value={dados.observacoes}
            onChange={(e) => aoAtualizar({ observacoes: e.target.value })}
            rows={3}
            className="textarea-form-padrao"
          />
        </div>
      </div>
    </div>
  );
};
