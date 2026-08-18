# Política Normativa SDD — GeoEstruturas AI

## 1. Princípios de Governança
- Nenhuma linha de código em caminhos protegidos (`src/**`) pode ser escrita sem especificação aprovada em `docs/sdd/`.
- Toda alteração deve ser rastreada no arquivo `.sdd/traceability.yml`.
- A validação automática via `python scripts/validate_sdd.py` é pré-requisito mandatório para commits e releases.

## 2. Nomenclatura e Limite de Linhas
- Todos os arquivos devem conter no máximo **200 linhas físicas**.
- Todo código, variáveis, tipos e comentários devem ser redigidos em **Português Brasileiro (PT-BR)**.
- 100% de implementação real sem supressões ou pseudocódigo.
