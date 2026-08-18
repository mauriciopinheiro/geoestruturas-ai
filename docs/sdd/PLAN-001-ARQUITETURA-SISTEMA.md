# PLAN-001: Arquitetura do Sistema GeoEstruturas AI

## 1. Arquitetura em Camadas
- **Camada de Apresentação (UI/GIS)**: React 19 + TypeScript + Pure CSS Design System + Canvas 2D API.
- **Camada de Visão Computacional**: Pipeline de processamento de imagem em Canvas/ImageData com convolução Sobel, limiarização adaptativa e separação de telhados.
- **Camada de Geometria Espacial**: Ray-Casting algorithm para teste de ponto em polígono, convex hull para detecção de polígonos amarelos e IoU para deduplicação.
- **Camada de Serviços & Persistência**: Gerenciamento de projetos via LocalStorage/IndexedDB, exportação de imagens em alta resolução e gerador de relatórios técnicos.

## 2. Padrões de Rastreabilidade e Arquivos
- Nomenclatura em Português Brasileiro (PT-BR).
- Limite físico rígido de 200 linhas por arquivo.
