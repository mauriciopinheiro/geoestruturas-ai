# SPEC-001: Sistema de Levantamento e Contagem de Estruturas em Imagens Aéreas

## 1. Visão Geral e Objetivo
Desenvolvimento de uma bancada GIS digital para detecção, contagem individual, conferência humana e exportação de edificações/barracos em imagens aéreas e de satélite para saneamento e regularização fundiária.

## 2. Requisitos de Negócio e Funcionais
- **REQ-001**: Dashboard com listagem de levantamentos territoriais e amostras reais.
- **REQ-002**: Assistente de criação de levantamento em 3 etapas com metadados, upload e inspeção.
- **REQ-003**: Delimitação de Área de Interesse (AOI) com detecção automática de contorno amarelo e desenho manual.
- **REQ-004**: Motor de Visão Computacional para detecção de coberturas com centróides, confiança e teste ponto-no-polígono.
- **REQ-005**: Canvas GIS de alta performance com zoom contínuo, pan, marcadores proporcionais e arrasto.
- **REQ-006**: Painel de conferência com inspeção de pontos, recorte ampliado e galeria de incertezas.
- **REQ-007**: Suporte a adição e remoção manual com recálculo matemático estrito ($1\text{ ponto} = 1\text{ estrutura}$).
- **REQ-008**: Comparador interativo antes/depois com slider vertical e modos lado a lado.
- **REQ-009**: Exportação de imagem marcada em resolução nativa com legenda e relatórios PDF/JSON/GeoJSON/CSV.
- **REQ-010**: Histórico de auditoria cronológico e Undo/Redo (`Ctrl+Z`/`Ctrl+Shift+Z`).

## 3. Critérios de Aceite
- **AC-001**: Total de barracos igual à soma exata de marcadores ativos.
- **AC-002**: Preservação integral da imagem original.
- **AC-003**: Funcionamento sem dependências de backend em modo cliente e extensível para microserviço.
