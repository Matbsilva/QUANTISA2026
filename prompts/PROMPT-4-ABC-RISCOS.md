# 📊 PROMPT-4: ABC REAL + ENGENHARIA DE VALOR COMPLETA + CRONOGRAMA + ANÁLISE EQUIPE

**VERSÃO:** 4.0 → v2.0 → **v3.0**
**DATA ORIGINAL:** 18/12/2025 | **ATUALIZAÇÃO v3.0:** 26/02/2026
**STATUS:** ✅ PRONTO PARA USO
**QUANDO USAR:** Após aprovação PROMPT-3 (Consolidação Básica)

> **📌 CHANGELOG v3.0 (26/02/2026):**
> - ✅ **CORRIGIDO** nome interno: este prompt é PROMPT-4, não "PROMPT-3B" (bug de nomenclatura corrigido)
> - ✅ **CORRIGIDO** Cronograma: instruções explícitas para substituir placeholders por datas reais; campo [DATA INÍCIO] obrigatório
> - ✅ **CORRIGIDO** HH no Cenário C: reconciliação explícita do por que HH total é maior no cenário part-time
> - ✅ **ADICIONADO** EV para Classe B: 2 alternativas (Padrão/Economia) quando cliente solicitar
> - ✅ **MANTIDO** de v2.0: referência a insumos validados do PROMPT-2 em cada alternativa EV
> - ✅ **MANTIDO** de v2.0: coluna "Item CGI" na tabela de checklist de riscos
> - ✅ **NADA REMOVIDO** — todo conteúdo das versões v4.0 e v2.0 mantido integralmente

---

## 🎯 INSTRUÇÕES CRÍTICAS

> **⚠️ REGRA DE OURO (TOLERÂNCIA DE ÁUDIO/TRANSCRIÇÃO):**
> Você receberá escopos e comandos transcritos de áudio via WhatsApp/celular. É **PROIBIDO** travar por erros gramaticais ou transições semânticas falhas (ex: "pitch" em vez de PIT, "viga M" em vez de Viga I). Execute um **filtro semântico** mental, deduza o termo correto da engenharia e avance silenciosamente corrigindo o escopo. NUNCA assuma um termo que não faça sentido construtivo.

**Fluxo EXATO deste PROMPT-4:**

```
Você recebe: "Marcus, consolidação aprovada. Próximo: ABC + EV?"
     ↓
[1] ANÁLISE ABC REAL (Pareto 80/20 com valores consolidados)
├─ Ranking itens por custo (maior para menor)
├─ Calcular % acumulado
├─ Classificar em Classe A / B / C (regra 80/20)
└─ Identificar itens críticos (foco atenção)
     ↓
[2] ENGENHARIA DE VALOR COMPLETA (Alternativas viáveis)
├─ Para CADA item Classe A: 3 alternativas (Padrão / Economia / Premium)
├─ Para CADA item Classe B (se solicitado): 2 alternativas (Padrão / Economia)
├─ ✨ [v2.0] Referenciar insumos validados do PROMPT-2 em cada alternativa
├─ Detalhar impactos (custo, prazo, risco, garantia)
└─ PAUSA OBRIGATÓRIA: Cliente escolhe alternativa
     ↓
[3] CRONOGRAMA DETALHADO (Com datas reais)
├─ Solicitar data de início ao cliente (obrigatório)
├─ Calcular todas as datas a partir da data real (não usar [D], [D+N] genérico)
├─ Fases e dependências entre elas
├─ Caminhos críticos
├─ Contingências (dias buffer)
└─ Considerar fins de semana/feriados
     ↓
[4] ANÁLISE DE EQUIPE DETALHADA (3 Cenários)
├─ Cenário A: NORMAL (1 prof + 1 aj)
├─ Cenário B: RÁPIDO (2 prof + 2 aj)
├─ Cenário C: ECONÔMICO (1 prof part-time) — com reconciliação HH
└─ Cada cenário: Custo + Prazo + Produção
     ↓
[5] CHECKLIST DE PONTOS CRÍTICOS + GATILHOS SEGURANÇA
├─ Validações obrigatórias PRÉ-OBRA
├─ Riscos identificados em PROMPT-1
├─ ✨ [v2.0] Coluna "Item CGI" vinculando risco ao item do orçamento
├─ Segurança e Conformidade (NR-35, NBR, etc)
└─ PAUSA OBRIGATÓRIA: Cliente confirma tudo?
     ↓
CHECKPOINT: Cliente aprova ABC + EV + Cronograma + Equipe + Riscos?
     ↓
APENAS APÓS OK → PROMPT-5 (Precificação)
```

---

## 📊 AÇÃO 1: ANÁLISE ABC REAL

**Objetivo:** Ranking Pareto 80/20 com valores reais consolidados (fonte: PROMPT-3).

**Fonte de Dados:** Quadro 4-Colunas (AÇÃO 5 do PROMPT-3) — Coluna "TOTAL ITEM"

**TABELA ABC REAL:**

```
ANÁLISE ABC REAL — RANKING PARETO 80/20
Projeto: [Nome Projeto] | Data: [Data]
Fonte: Consolidação PROMPT-3 (aprovada em [data aprovação])

| Rank | Item # | Descrição | Custo Total (R$) | % Unitário | % Acumulado | Classe ABC |
|---|---|---|---|---|---|---|
| 1º | [X.X] | [Descrição real do projeto] | R$ XX.XXX | XX,X% | XX,X% | **A** |
| 2º | [X.X] | [Descrição real do projeto] | R$ XX.XXX | XX,X% | XX,X% | **A** |
| ... | ... | ... | ... | ... | ... | ... |
| Nº | [X.X] | [Descrição real do projeto] | R$ XX.XXX | XX,X% | **100,0%** | **C** |
| | | **TOTAL ORÇAMENTO** | **R$ XXX.XXX** | **100,0%** | | |

---

ANÁLISE ABC:

Classe A (itens até ~80% acumulado):
- [N] itens = R$ XX.XXX (XX% do total)
- Itens Críticos: [citar os itens reais]
- Ação: MÁXIMA ATENÇÃO, qualidade, acompanhamento técnico
- Impacto: Se errar em A, impacta XX% do orçamento

Classe B (itens de 80% a ~95%):
- [N] itens = R$ XX.XXX (XX% do total)
- Itens Importantes: [citar os itens reais]
- Ação: ATENÇÃO NORMAL, validar qualidade

Classe C (itens de ~95% a 100%):
- [N] itens = R$ XX.XXX (XX% do total)
- Itens Menores: [citar os itens reais]
- Ação: MONITORAR, não exige controle extremo

---

RECOMENDAÇÃO ABC:
✅ Focar 80% da atenção (qualidade, inspeção, testes) nos itens CLASSE A
✅ Monitorar os itens CLASSE B (não descuidar)
✅ Itens CLASSE C podem ter processo mais ágil

% Investimento de Controle Sugerido:
- Classe A: 50% do tempo técnico (qualidade máxima)
- Classe B: 30% do tempo técnico (qualidade padrão)
- Classe C: 20% do tempo técnico (qualidade funcional)
```

---

## 💡 AÇÃO 2: ENGENHARIA DE VALOR COMPLETA

**Objetivo:** Explorar alternativas técnicas/comerciais para CLASSE A (e B quando solicitado).

**Método:** Para cada item Classe A, propor 3 alternativas (Padrão, Economia, Premium).
Para Classe B (se cliente solicitar): 2 alternativas (Padrão, Economia).

### ✨ [MANTIDO v2.0] — INSTRUÇÃO DE REFERÊNCIA A INSUMOS DO PROMPT-2

> **Instrução para IA:** Em cada alternativa de EV abaixo, você DEVE referenciar os insumos reais validados no PROMPT-2 (composições aprovadas). Não estime preços genéricos — use os insumos confirmados. Se a alternativa mudar um insumo, explicite qual insumo está sendo substituído e o impacto no custo real.
>
> **Formato obrigatório para cada alternativa:**
> ```
> Insumos-base (PROMPT-2 validados): [listar materiais que permanecem iguais]
> Insumos alterados: [listar o que muda vs. PROMPT-2, com preço real]
> Δ Custo real vs. PROMPT-2: R$ [valor] ([+/-]%)
> ```
>
> **Por que isso importa:** A EV sem âncora nos insumos reais causa erros de 10-20% nos custos das alternativas.

**ESTRUTURA POR ITEM CLASSE A:**

```
### [ITEM X.X] — [NOME REAL DO SERVIÇO] (Classe A — R$ XX.XXX)

Contexto: [Por que este item é crítico no contexto deste projeto]

Alternativa 1: PADRÃO (RECOMENDADO)
Especificação: [spec real do projeto]
Custo: R$ XX.XXX
Prazo: [N] dias execução + [N] cura
Garantia: [N] meses | Risco: BAIXO

[v2.0] Insumos-base (PROMPT-2 validados): [listar os principais]
[v2.0] Insumos alterados: Nenhum — conforme composição PROMPT-2 aprovada
[v2.0] Δ Custo real vs. PROMPT-2: R$ 0,00 (0%) — referência

✅ RECOMENDADO — [justificativa resumida]

---

Alternativa 2: ECONOMIA (-X%)
Especificação: [spec alternativa mais simples] SEM [componente retirado]
Custo: R$ XX.XXX (-R$ X.XXX)
Prazo: [N] dias + [N] cura
Garantia: [N] meses | Risco: MÉDIO

[v2.0] Insumos-base (PROMPT-2 validados): [listar o que permanece]
[v2.0] Insumos alterados: [item X] REMOVIDO (economia de R$ [preço PROMPT-2] × [qtd])
[v2.0] Δ Custo real vs. PROMPT-2: aprox. -R$ X.XXX (-X%) — confirmar com preço exato PROMPT-2

⚠️ [RECOMENDADO/NÃO RECOMENDADO] — [justificativa técnica clara]

---

Alternativa 3: PREMIUM (+X%)
Especificação: [spec premium] com [componente adicional]
Custo: R$ XX.XXX (+R$ X.XXX)
Prazo: [N] dias + [N] cura
Garantia: [N] anos | Risco: BAIXÍSSIMO

[v2.0] Insumos-base (PROMPT-2 validados): [listar o que permanece]
[v2.0] Insumos alterados: [item X] → [substituto premium] (+R$ [dif]/[un])
[v2.0] Δ Custo real vs. PROMPT-2: +R$ X.XXX (+X%)

⭐ OPCIONAL — Se cliente quer máxima qualidade/durabilidade
```

**PAUSA — VALIDAÇÃO CLIENTE (OBRIGATÓRIA após apresentar todas as alternativas Classe A):**

```
ENGENHARIA DE VALOR — ESCOLHA CLIENTE OBRIGATÓRIA:

Para CADA item CLASSE A, escolha UMA alternativa:
☐ [ITEM X.X] ([Nome]):
   [ ] Alternativa 1 — PADRÃO (R$ XX.XXX) RECOMENDADO
   [ ] Alternativa 2 — ECONOMIA (R$ XX.XXX) -X%
   [ ] Alternativa 3 — PREMIUM (R$ XX.XXX) +X%
...

IMPACTO TOTAL ORÇAMENTO (conforme escolhas):
- Se todas PADRÃO: R$ XXX.XXX (conforme PROMPT-3)
- Se mix PADRÃO + algumas PREMIUM: R$ XXX.XXX (+X%)
- Se tudo ECONOMIA: R$ XXX.XXX (-X%, com riscos)

Aguardando suas ESCOLHAS de alternativas! (Após escolhas, geramos Cronograma)

---

EV PARA CLASSE B (opcional — solicitar se desejar):
Se quiser explorar economia nos itens Classe B, informe e proponho 2 alternativas (Padrão/Economia) para cada.
```

---

## 📅 AÇÃO 3: CRONOGRAMA DETALHADO

**Fonte de Dados:** HH total + Equipe Básica (PROMPT-3)

> ⚠️ **REGRA OBRIGATÓRIA:** Substituir placeholders genéricos por data real.
> - Solicitar data de início ao cliente ANTES de gerar o cronograma
> - Se data confirmada: usar datas reais (ex: "15/03/2026", "22/03/2026")
> - Se data não confirmada: usar "[DATA TBD]" e alertar
> - NUNCA publicar tabela apenas com [D], [D+N] sem data de referência confirmada

**Instrução de solicitação (antes de gerar a tabela):**

```
Para montar o cronograma com datas reais, preciso confirmar:
❓ Qual a data de início prevista da obra? [____/____/202X]
❓ Há feriados ou datas de restrição no período?
❓ Trabalho será em dias úteis (seg-sex) ou inclui sábados?

Aguardando confirmação para calcular e montar o cronograma com datas reais.
```

**TABELA CRONOGRAMA — FASES SEQUENCIAIS:**

```
CRONOGRAMA DETALHADO — FASES COM DATAS REAIS
Projeto: [Nome Projeto] | Início: [DD/MM/AAAA] | Término Estimado: [DD/MM/AAAA]
Base: Equipe [cenário escolhido] | Total: [N] dias úteis

| Semana | Fase/Serviço | Item# | Dias | Data Início | Data Fim | Atividades Principais | Dependência | Status |
|---|---|---|---|---|---|---|---|---|
| [N] | [Fase 1] | [X.X] | [N] | [DD/MM] | [DD/MM] | [Atividades reais do projeto] | Nenhuma | Crítica |
| [N] | [Cura/Espera] | [X.X] | [N] | [DD/MM] | [DD/MM] | Espera cura | Fase anterior | Crítica |
| ... | ... | ... | ... | [DD/MM] | [DD/MM] | ... | ... | ... |
| [N] | Contingência | — | [N] | [DD/MM] | [DD/MM] | Buffer para imprevistos | Qualquer | Buffer |
| | **TOTAL** | | **[N]** | [DD/MM] | **[DD/MM]** | | | ✅ |

---

ANÁLISE CRONOGRAMA:

Caminho Crítico (tarefas que NÃO podem atrasar):
[Listar as fases críticas reais do projeto em sequência]
Se qualquer tarefa crítica atrasar 1 dia, TODA obra atrasa 1 dia.

Paralelização Possível:
[Identificar se há tarefas que podem ocorrer simultaneamente com equipe adicional]

Contingência Incluída:
- [N] dias buffer no final (para imprevistos)

Observações Importantes:
- ✅ Aguarda [N]h entre demãos/camadas
- ✅ Cura é tempo de inatividade naquela área
- ✅ [Testes obrigatórios do projeto real, ex: estanqueidade 72h, nível laser]
```

---

## 👥 AÇÃO 4: ANÁLISE DE EQUIPE DETALHADA (3 CENÁRIOS)

**Objetivo:** Propor 3 cenários de equipe + impacto custo/prazo.

**Base Cálculo:** HH total (PROMPT-3) e composição da equipe recomendada

---

### **CENÁRIO A: NORMAL (RECOMENDADO)**

```
EQUIPE PADRÃO — [N] Profissional(is) + [N] Ajudante(s)

| Função | Qtd | Dias | HH/dia | HH Total | Custo/HH | Custo Total |
|---|---|---|---|---|---|---|
| Profissional (Pedreiro/Oficial) | [N] | [N] | [X,X] | [N] | R$ 40,00 | R$ XX.XXX |
| Ajudante | [N] | [N] | [X,X] | [N] | R$ 22,50 | R$ XX.XXX |
| Técnico QA | 1 | [N] visitas | 3,5 | [N] | R$ 90,00 | R$ XX.XXX |
| **TOTAL M.O.** | | **[N] dias** | **[X,X]/dia** | **[N] HH** | | **R$ XX.XXX** |

Vantagens: ✅ Equipe permanente, continuidade, aprendizado obra
Vantagens: ✅ Custo controlado (padrão) | ✅ Prazo viável | ✅ Produção conforme spec

Desvantagens: ❌ Prazo maior | ❌ Se atraso material, afeta equipe inteira

RECOMENDAÇÃO: Use este cenário como BASE
```

---

### **CENÁRIO B: RÁPIDO (PRAZO REDUZIDO)**

```
EQUIPE REFORÇADA — [2N] Profissionais + [2N] Ajudantes + Técnico

[Mesma estrutura de tabela — com valores dobrados e prazo ~60% do Cenário A]

Impacto Orçamento Total:
- M.O. aumenta: R$ XX.XXX → R$ XX.XXX (+R$ X.XXX)
- Custo Equipamentos pode reduzir: [N] dias → [N] dias (-R$ X.XXX)
- Impacto Líquido: +R$ X.XXX - R$ X.XXX = [calculado]
- Benefício: Prazo reduz ~40%

Quando usar: Se cliente tem prazo mandatório urgente
```

---

### **CENÁRIO C: ECONÔMICO (CUSTO REDUZIDO — NÃO RECOMENDADO)**

```
EQUIPE MÍNIMA — 1 Profissional Part-Time (4h/dia) + 1 Ajudante + Técnico

[Tabela estruturada igual aos outros cenários]

⚠️ NOTA DE RECONCILIAÇÃO DE HH:
O Cenário C apresenta HH total MAIOR que o Cenário A. Isso não é erro — é econômico real:
- No Cenário A: equipe integral produz ~[N] m²/dia em [N] dias = [N] HH
- No Cenário C: equipe part-time produz metade (~[N/2] m²/dia) em [2N] dias, porém:
  - O Ajudante trabalha 8h/dia (full) enquanto Profissional trabalha 4h/dia
  - Isso cria desbalanceamento: Ajudante "espera" sem ter profissional → horas ineficientes
  - Resultado: mais HH gastos no total para a mesma obra
  
Impacto Real no Orçamento:
- M.O. reduz: R$ XX.XXX → R$ XX.XXX (-R$ X.XXX) [economia aparente]
- Custo Equipamentos AUMENTA: [N] dias → [2N] dias (+R$ XX.XXX) [locação mais cara]
- Impacto Líquido: -R$ X.XXX + R$ X.XXX = +R$ X.XXX ❌ PIORA!

❌ NÃO RECOMENDADO:
- Prazo inviável ([2-3]× mais longo)
- Economia negativa (gasta mais no final com equipamentos)
- Risco qualidade alto (menos supervisão profissional por área)
- Cliente fica "permanentemente em obra"
```

---

**RECOMENDAÇÃO FINAL DE EQUIPE:**

✅ **Use CENÁRIO A (Normal)** como padrão — custo equilibrado, prazo viável, qualidade garantida

⭐ Se cliente quer prazo reduzido: CENÁRIO B (+custo mas -prazo)

❌ Evite CENÁRIO C — economia aparente que se torna prejuízo real

---

## ⚠️ AÇÃO 5: CHECKLIST DE PONTOS CRÍTICOS + GATILHOS SEGURANÇA

**PAUSA OBRIGATÓRIA PRÉ-OBRA**

### ✨ [MANTIDO v2.0] — INSTRUÇÃO PARA COLUNA "ITEM CGI" NOS RISCOS

> **Instrução para IA:** Em todos os itens do checklist abaixo, adicionar a coluna "Item CGI" que referencia o(s) número(s) de item(ns) do orçamento (ex: 1.1, 2.1, etc.) ao qual o risco está vinculado. Se o risco é transversal a todo orçamento, usar "TODOS". Isso permite rastrear cada risco ao seu impacto financeiro direto.
>
> **Benefício:** Riscos com CGI identificado permitem priorização direta — risco no item de maior custo tem prioridade absoluta.

```
✅ VALIDAÇÕES OBRIGATÓRIAS ANTES DE INICIAR OBRA
Projeto: [Nome Projeto]

SEGURANÇA E CONFORMIDADE:
| ☐ | Validação | Risco se não cumprido | Item CGI | Prioridade |
|---|---|---|---|---|
| ☐ | [Validação real do projeto] | [Risco específico] | [X.X] | 🔴 CRÍTICO |
| ☐ | [Validação real do projeto] | [Risco específico] | TODOS | 🟡 ALTO |
...

QUALIDADE E NORMAS:
| ☐ | Validação | Risco se não cumprido | Item CGI | Prioridade |
|---|---|---|---|---|
| ☐ | [Validação real] | [Risco] | [X.X] | 🔴 CRÍTICO |
...

LOGÍSTICA E ACESSO:
| ☐ | Validação | Risco se não cumprido | Item CGI | Prioridade |
|---|---|---|---|---|
| ☐ | [Validação real] | [Risco] | TODOS | 🟡 ALTO |
...

BASE E ESTRUTURA:
| ☐ | Validação | Risco se não cumprido | Item CGI | Prioridade |
|---|---|---|---|---|
...

MATERIAIS E ACABAMENTO:
| ☐ | Validação | Risco se não cumprido | Item CGI | Prioridade |
|---|---|---|---|---|
...

EQUIPE E PRAZOS:
| ☐ | Validação | Risco se não cumprido | Item CGI | Prioridade |
|---|---|---|---|---|
...

---

SE TODOS OS ☐ ESTÃO MARCADOS:
✅ OBRA ESTÁ 100% PRONTA PARA COMEÇAR

SE ALGUM ☐ NÃO ESTÁ MARCADO:
⚠️ PAUSA OBRIGATÓRIA — Resolva antes de iniciar!
```

---

❓ PRÓXIMO PASSO

```
✅ PROMPT-4 COMPLETO

Você aprovou:
☐ ABC Real (itens Classe A = XX% custo)
☐ Engenharia de Valor (3 alternativas por item Classe A, com referência insumos PROMPT-2)
☐ Cronograma Detalhado ([N] dias, com datas reais a partir de [data início])
☐ 3 Cenários Equipe (Normal/Rápido/Econômico)
☐ Checklist de Riscos (com coluna Item CGI por risco)

Impacto Orçamento Conforme Suas Escolhas:
- Se PADRÃO em tudo: R$ XXX.XXX (conforme PROMPT-3)
- Se mix PADRÃO + PREMIUM: R$ XXX.XXX (+X%)
- Se ECONOMIA: R$ XXX.XXX (-X%, com riscos)

Impacto Prazo Conforme Equipe:
- Cenário A (Normal): [N] dias ✅ RECOMENDADO
- Cenário B (Rápido): [N] dias (custo +X%, prazo -40%)
- Cenário C (Econômico): [2N]+ dias (NÃO RECOMENDADO)

❓ SUAS DECISÕES NECESSÁRIAS:
1. ☐ Qual alternativa EV para cada item? (Padrão/Economia/Premium)
2. ☐ Qual cenário equipe? (A-Normal / B-Rápido / C-Econômico)
3. ☐ Todos pontos críticos validados no checklist (com Item CGI)?
4. ☐ Data início confirmada: [____/____/202X]?

APÓS SUAS RESPOSTAS → PROMPT-5 (Precificação com Markup)
```

---

**FIM DE PROMPT-4 v3.0 — ABC REAL + EV COMPLETA + CRONOGRAMA + EQUIPE + RISCOS**
