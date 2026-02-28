# 📚 PROMPT-7: MEMORIAL DESCRITIVO DO PROJETO — v1.0

**VERSÃO:** 1.0 (NOVO)
**DATA:** 26/02/2026
**STATUS:** ✅ PRONTO PARA USO
**QUANDO USAR:** Após PROMPT-6 (Textos Comerciais) — gerado ao final do projeto
**OBJETIVO:** Consolidar em um único documento o histórico completo do orçamento: como foi feito, por que, quais decisões foram tomadas e com quais dados

> **Por que o Memorial Descritivo é importante?**
> - Permite consulta rápida futura: "Como fizemos o EPS naquela obra Nubank?"
> - Serve de referência para projetos similares
> - Documenta as premissas adotadas para defesa em auditoria ou reclamação
> - Registra escolhas de EV para justificar preço ao cliente
> - É o "arquivo histórico" do projeto, independente da sessão de IA usada

---

## 🎯 INSTRUÇÕES CRÍTICAS

> **⚠️ REGRA DE OURO (TOLERÂNCIA DE ÁUDIO/TRANSCRIÇÃO):**
> Você receberá escopos e comandos transcritos de áudio via WhatsApp/celular. É **PROIBIDO** travar por erros gramaticais ou transições semânticas falhas (ex: "pitch" em vez de PIT, "viga M" em vez de Viga I). Execute um **filtro semântico** mental, deduza o termo correto da engenharia e avance silenciosamente corrigindo o escopo. NUNCA assuma um termo que não faça sentido construtivo.

**Quando Usar Este Prompt:**
```
IA: "✅ Proposta completa gerada. Deseja gerar o Memorial Descritivo do Projeto?
     É um resumão histórico de todo o orçamento — como foi feito e por quê.
     Leva 1 resposta e consolida todo o processo.
     [ ] Sim, gerar | [ ] Por enquanto não, salvo para depois"
```

**O Memorial é gerado em UMA ÚNICA RESPOSTA** — não fragmentar.
Se o projeto tinha muitas composições e a resposta não couber, aplicar Regra 8 (SYSTEM-INSTRUCTION): alertar e perguntar se quer versão condensada.

---

## 📋 ESTRUTURA COMPLETA DO MEMORIAL DESCRITIVO

```
# 📋 MEMORIAL DESCRITIVO DO PROJETO
Versão: [conforme versão do sistema usado, ex: Quantisa v4.6]
Gerado em: [DD/MM/AAAA]
Projeto: [Nome completo do projeto]
Cliente: [Nome do cliente / razão social]
Endereço: [Endereço completo da obra]
Responsável Técnico: Eng. Marcus Oliveira | CREA: [Número]
Status: [Em Orçamento / Proposta Enviada / Aprovado / Em Execução / Concluído]

---

## SEÇÃO 1: IDENTIFICAÇÃO DO PROJETO

| Campo | Valor |
|---|---|
| **Projeto** | [Nome completo] |
| **Cliente** | [Nome / empresa] |
| **Endereço Obra** | [Endereço completo] |
| **Tipo de Obra** | [ex: Reforma civil multi-pavimento] |
| **Regime de Trabalho** | [Diurno 08h-17h / Noturno / Misto] |
| **Área Total** | [N] m² [ou unidade equivalente] |
| **Data Orçamento** | [DD/MM/AAAA] |
| **Data Proposta Enviada** | [DD/MM/AAAA ou Pendente] |
| **Validade Proposta** | [DD/MM/AAAA] |
| **Custo Direto Total** | R$ XXX.XXX |
| **Preço de Venda** | R$ XXX.XXX |
| **Markup Médio** | XX% |
| **Prazo Estimado** | [N] dias [úteis/corridos] |
| **Sistema Utilizado** | Quantisa v[N.N] | 7 Etapas + PROMPT-[N] |

---

## SEÇÃO 2: HISTÓRICO DO PROCESSO

*Como e quando cada etapa foi executada.*

| Etapa | Prompt | Data | O que foi feito | Aprovação |
|---|---|---|---|---|
| ETAPA 0 | SYSTEM / PROMPT-1 | [DD/MM] | [N] dúvidas críticas identificadas, [N] respondidas | [Data aprovação] |
| ETAPA 1 | PROMPT-1 | [DD/MM] | [N] premissas documentadas, cenário [A/B/C] escolhido | [Data] |
| ETAPA 2 | PROMPT-1 | [DD/MM] | Escopo detalhado de [N] itens | [Data] |
| ETAPA 2.5 | PROMPT-1 | [DD/MM] | ABC Preliminar + EV Fase 1 ([N] alternativas) | [Data] |
| ETAPA 3 | PROMPT-2 | [DD/MM] | [N] composições geradas, [N] insumos validados | [Data] |
| ETAPA 4 | PROMPT-3 | [DD/MM] | Consolidação: [N] materiais, [N] HH total | [Data] |
| ETAPA 5 | PROMPT-4 | [DD/MM] | ABC Real + EV Detalhada + Cronograma + Riscos | [Data] |
| ETAPA 6 | PROMPT-5 | [DD/MM] | Precificação proporcional — preço R$ XXX.XXX | [Data] |
| ETAPA 7 | PROMPT-6 | [DD/MM] | Textos comerciais gerados + proposta enviada | [Data] |

---

## SEÇÃO 3: DEFINIÇÕES TÉCNICAS ADOTADAS

*Por que cada premissa foi escolhida.*

| # | Premissa | Valor Adotado | Por que foi escolhida | Alternativa Considerada |
|---|---|---|---|---|
| 1 | [Premissa 1 real do projeto] | [Valor] | [Justificativa técnica] | [O que foi considerado mas descartado] |
| 2 | [Premissa 2 real do projeto] | [Valor] | [Justificativa] | [Alternativa] |
| ... | ... | ... | ... | ... |

---

## SEÇÃO 4: ESCOPO E ITENS ORÇADOS

*Lista completa de todos os itens, com custo direto e preço de venda.*

| Item # | Descrição | Unid | Qtd | Custo Unit | Custo Total | Markup | Preço Venda | % Classe ABC |
|---|---|---|---|---|---|---|---|---|
| [X.X] | [Descrição real] | [un] | [qtd] | R$ X.XXX | R$ XX.XXX | XX% | **R$ XX.XXX** | A |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |
| | **TOTAL** | | | | **R$ XXX.XXX** | **XX%** | **R$ XXX.XXX** | |

---

## SEÇÃO 5: COMPOSIÇÕES RESUMIDAS

*Resumo das composições técnicas (Seções 1+5 de cada PROMPT-2 — sem a tabela completa de insumos).*

[Para cada item do projeto real:]

### Item [X.X] — [Nome do item]

**Sistema construtivo:** [Descrição resumida do método]
**Especificações principais:** [SINAPI ref, materiais-chave, espessuras, etc.]
**Coeficiente de produtividade:** [N] HH/[unidade]
**Custo unitário:** R$ X.XXX/[unidade]
**Norma aplicável:** [NBR XXXXX]
**Observação técnica:** [Qualquer detalhe relevante para futura consulta]

[Repetir para todos os itens]

---

## SEÇÃO 6: INSUMOS ESTRATÉGICOS VALIDADOS

*Os insumos com maior peso no custo e/ou onde houve validação especial.*

| # | Insumo | Unid | Preço Unit | Fonte | Data Validação | Obs |
|---|---|---|---|---|---|---|
| 1 | [Insumo 1 real] | [un] | R$ X,XX | [SINAPI/TCPO/Fornecedor] | [DD/MM] | [Obs] |
| 2 | [Insumo 2 real] | [un] | R$ X,XX | [Fonte] | [DD/MM] | [Obs] |
| ... | ... | | | | | |

---

## SEÇÃO 7: DECISÕES DE ENGENHARIA DE VALOR

*Quais alternativas foram propostas e quais foram escolhidas.*

| Item # | Alternativas Propostas | Alternativa Escolhida | Impacto Custo | Justificativa da Escolha |
|---|---|---|---|---|
| [X.X] | Padrão / Economia / Premium | [Escolha do cliente] | R$ ±X.XXX | [Por que essa alternativa] |
| ... | ... | ... | ... | ... |

---

## SEÇÃO 8: ANÁLISE ABC REAL

*Classificação final Pareto 80/20 dos itens.*

| Rank | Item # | Descrição | Custo Total | % | % Acumulado | Classe |
|---|---|---|---|---|---|---|
| 1º | [X.X] | [desc] | R$ XX.XXX | XX,X% | XX,X% | **A** |
| ... | ... | ... | ... | ... | ... | ... |
| Nº | [X.X] | [desc] | R$ XX.XXX | XX,X% | **100,0%** | **C** |

Classe A: [N] itens = R$ XX.XXX (XX% do custo)
Classe B: [N] itens = R$ XX.XXX (XX%)
Classe C: [N] itens = R$ XX.XXX (XX%)

---

## SEÇÃO 9: CRONOGRAMA RESUMIDO

*Visão macro do planejamento de execução.*

| Semana | Fase Principal | Itens | Data Início | Data Fim | Milestones |
|---|---|---|---|---|---|
| [1] | [Fase 1] | [X.X, X.X] | [DD/MM] | [DD/MM] | [Milestone] |
| ... | ... | ... | ... | ... | ... |

Prazo Total: [N] dias úteis | Início: [DD/MM] | Término: [DD/MM]
Equipe: [Cenário escolhido: X Pedreiros + X Ajudantes]

---

## SEÇÃO 10: RISCOS E MITIGAÇÕES

*Riscos identificados e como foram tratados na proposta.*

| Código | Risco | Item CGI | Mitigação | Status |
|---|---|---|---|---|
| [CRÍTICA-1] | [Risco real do projeto] | [X.X] | [Ação tomada na proposta] | [Resolvido/Monitorar] |
| ... | ... | ... | ... | ... |

---

## SEÇÃO 11: INDICADORES-CHAVE DO PROJETO (KPIs)

| KPI | Valor | Referência |
|---|---|---|
| **Custo Direto Total** | R$ XXX.XXX | Consolidação PROMPT-3 |
| **Preço de Venda** | R$ XXX.XXX | PROMPT-5 (markup proporcional) |
| **Markup Médio Ponderado** | XX,X% | Calculado por item |
| **Margem Bruta** | R$ XX.XXX (XX%) | Diferença venda - custo |
| **Total HH Profissional** | X.XXX hh | PROMPT-3 (M.O.) |
| **Total HH Ajudante** | X.XXX hh | PROMPT-3 (M.O.) |
| **Peso Total Materiais** | ~XX toneladas | PROMPT-3 (Lista Materiais) |
| **Prazo Execução** | [N] dias úteis | PROMPT-4 (cronograma) |
| **Normas Aplicadas** | [NBR XXXXX, NR-XX, etc.] | Seção 2 Composições |
| **Classe Maior Custo** | [Item X.X] (XX% total) | PROMPT-4 (ABC Real) |

---

## SEÇÃO 12: FONTES E REFERÊNCIAS UTILIZADAS

*Rastreabilidade completa das referências.*

| # | Referência | Tipo | Data Consulta | Itens Aplicados |
|---|---|---|---|---|
| 1 | SINAPI [mês/ano] | Tabela Preços | [DD/MM] | [Itens] |
| 2 | TCPO [edição] | Coeficientes | [DD/MM] | [Itens] |
| 3 | [Fabricante] — Ficha Técnica [Produto] | Fabricante | [DD/MM] | [Itens] |
| 4 | Expertise Eng. Marcus Oliveira | Expertise documentada | [DD/MM] | [Itens] |
| ... | ... | ... | ... | ... |

---

## ✅ CONCLUSÃO DO MEMORIAL

Projeto: [Nome Projeto]
Status: [✅ Proposta Enviada / 🔄 Em Negociação / ✅ Aprovado / 🔄 Em Execução]

Este memorial consolida todos os dados e decisões que fundamentaram o orçamento.
Gerados conforme metodologia Quantisa v[N.N].

Arquivado em: [AAAA-MM] | Responsável: Eng. Marcus Oliveira
```

---

## ❓ RESULTADO ESPERADO

```
✅ MEMORIAL DESCRITIVO GERADO — PROJETO [NOME]

12 seções completas:
☑ Identificação do Projeto
☑ Histórico do Processo (8 etapas)
☑ Definições Técnicas (N premissas)
☑ Escopo e Itens (N itens com preços)
☑ Composições Resumidas (N composições)
☑ Insumos Estratégicos (N insumos-chave)
☑ Decisões de EV (escolhas por item)
☑ Análise ABC Real (Pareto 80/20)
☑ Cronograma Resumido (macro)
☑ Riscos e Mitigações
☑ Indicadores-Chave (KPIs)
☑ Fontes e Referências

PROJETO QUANTISA COMPLETO ✅
Todas as etapas executadas, aprovadas e documentadas.
```

---

**FIM DE PROMPT-7 v1.0 — MEMORIAL DESCRITIVO**
