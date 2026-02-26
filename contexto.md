# QUANTISA Orçamento 2026: Documento Mestre e Diário de Bordo (Contexto)

## Preâmbulo: A Fonte Canônica da Verdade
Este documento (`contexto.md`) é a ata definitiva e a fonte única da verdade técnica e de produto para o aplicativo **QUANTISA Orçamento**. Ele contém as decisões de produto, a arquitetura do sistema e o histórico (versionamento de raciocínio) do desenvolvimento, e deve ser preservado e atualizado rigorosamente com 100% de fidelidade a cada nova alteração do sistema.

---

## 1. Nossas Regras de Engajamento

### 1.1. Diretiva Primordial: Ler e Atualizar
Toda nova interação com um Assistente IA sênior deve começar pela leitura deste arquivo (para obtenção de contexto histórico) e **sempre** ser finalizada com a criação de uma nova entrada no "Diário de Bordo" neste próprio documento, garantindo o versionamento do pensamento.

### 1.2. Papéis (Personas)
*   **Mat (Product/Business Owner & Executor):** Detentor da visão do produto, define requisitos técnicos e funcionais da ferramenta de orçamentação QUANTISA, realiza curadoria humana, validação em produção e executa comandos locais de controle, push e deploy.
*   **IA (Arquiteto de Software & Engenheiro Sênior):** Concebe soluções eficientes, desenvolve novos módulos e abas funcionais, manipula lógicas avançadas de código (React/Next.js, Node, Regex, Parser V4, integração Gemini), planeja integrações com Supabase e garante a execução otimizada da estética premium UI/UX.

### 1.3. Regra de Ouro: Textos Ditados (Digitação por Voz)
*   **Contexto:** O usuário (Mat) frequentemente utiliza ferramentas de digitação por voz (ditado) no celular ou no computador para se comunicar, acelerar o fluxo de trabalho e enviar requisições de código ou de design.
*   **Ação Obrigatória da IA:** A IA deve sempre interpretar o texto com uma tolerância hiper-elevada a erros de digitação, falta de pontuação, quebras de concordância e, principalmente, troca de palavras por fonemas parecidos (ex: o corretor trocar "renderizar" por "rendição", "array" por "rei", etc.).
*   **Comportamento:** A IA não deve travar nem corrigir o usuário. Ela deve inferir o significado técnico correto baseado no contexto do projeto. Se a intenção do usuário ficar completamente dúbia ou perigosa para o código devido a uma falha grave do ditado, a IA deve pausar e fazer uma pergunta de confirmação rápida antes de codificar, assumindo sempre a interpretação técnica mais lógica e coerente.

---

## 2. Visão do Produto e Funcionalidades Core

### 2.1. O que é o QUANTISA Orçamento?
O QUANTISA Orçamento é um **sistema web profissional de orçamentação de engenharia civil**, construído para gerenciamento completo do ciclo de vida de um orçamento — desde a importação e parsing de composições de serviços geradas por IA até a exportação de planilhas de preço de venda com markup inteligente.

A plataforma elimina as velhas planilhas manuais e complexas, transformando composições em formato Markdown (V4) em um fluxo modular de 9 abas especializadas, cobrindo Custo Direto, Materiais, Histograma de Equipe (com IA), Simulações de BDI, Resumo Financeiro, Análise ABC, Engenharia de Valor e Exportação.

### 2.2. Super Funcionalidades (Superpowers) do Sistema
1.  **Parser V4 (Motor de Extração):** Motor de Regex robusto (`lib/parser.js`) que extrai automaticamente de composições em Markdown: `Código`, `Título`, `Unidade`, `Grupo`, `Turno`, `Equipe`, custos unitários (Material, Mão de Obra, Equipamentos), HH Profissional/Ajudante e lista de insumos. Suporta fallback em múltiplas seções do documento.
2.  **Importação Inteligente:** Aba dedicada (`TabImportar.jsx`) para colar texto Markdown puro e importar composições completas de uma vez, com salvamento do texto raw no campo `composicao_raw` para usos futuros.
3.  **Histograma com IA (`TabHistograma.jsx`):** Equipe Padrão auto-calculada (2 Prof + 2 Aju) com cálculo de dias e custo. Botão **"🤖 Sugerir com IA"** que aciona o Gemini 2.5 Flash via API Route (`/api/ia/histograma`) para gerar 2 cenários otimizados: Rápido (mais gente, menos dias) e Econômico (menor custo total).
4.  **Simulações de BDI (`TabSimulacoes.jsx`):** Controles independentes de BDI para Mão de Obra e Material com taxas configuráveis (AC, CF, MI, TM, TE, TF, LC). Fórmula padrão: `((1 + AC + CF + MI) / (1 - (TM + TE + TF + LC))) - 1`.
5.  **Análise ABC Automática (`TabABC.jsx`):** Classificação Pareto 80/20 automática dos itens em Classe A (80%), B (15%) e C (5%), com cards de resumo, tabela ranked com percentuais unitários e acumulados, e box de recomendações por classe.
6.  **Engenharia de Valor com IA (`TabEV.jsx`):** Identifica itens Classe A automaticamente e gera via Gemini (`/api/ia/ev`) 3 alternativas por item (Padrão, Econômico, Premium) com variação de custo, vantagens e desvantagens.
7.  **Exportação de Preço de Venda (`TabExportar.jsx`):** 3 modos de markup (ABC Proporcional, Uniforme customizável, ABC Inverso), tabela completa de preço de venda, cards de resumo financeiro (Custo Direto / Lucro Bruto / Preço de Venda) e botão **"📥 Baixar Excel (CSV)"** com cabeçalho + itens + resumo.
8.  **Auto-Save com Supabase (`lib/useAutoSave.js`):** Hook React que salva automaticamente todas as alterações no banco de dados Supabase, garantindo que nenhuma edição se perca.
9.  **Tema Dark Industrial Premium:** Visual escuro profissional com paleta Amber (#F59E0B) sobre fundo Dark (#0C0A09), tipografia DM Sans + JetBrains Mono via Google Fonts.

---

## 3. Arquitetura e Tech Stack (A Engenharia por trás)

### 3.1. Frontend
*   **Framework:** Next.js 16 (App Router, `app/` directory).
*   **Biblioteca Base:** React 19.
*   **Estilização:** CSS-in-JS (Inline Objects via constantes temáticas em `lib/constants.js`), complementado por `globals.css` para resets e utilitários base.
*   **Tipografia:** DM Sans (sans-serif) + JetBrains Mono (monospace) via Google Fonts CDN.
*   **Estrutura de Abas:** 9 abas modulares, cada uma em seu próprio componente (`components/Tab*.jsx`):
    - `📥 Importar` → `📊 Custo` → `📦 Materiais` → `👷 Histograma` → `💰 Simulações` → `📋 Resumo`
    - **Seção Análise (opcionais):** `🎯 ABC` → `💡 Eng. Valor` → `📤 Exportar`
*   **Sidebar Lateral:** `components/Sidebar.jsx` — navegação entre abas com separador visual para abas opcionais.

### 3.2. Backend & Database
*   **BaaS:** Supabase (`@supabase/supabase-js`).
*   **Cliente:** Inicializado em `lib/supabase.js` com variáveis de ambiente `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
*   **Esquema de Dados:** Tabela `orcamentos` (projetos) com tabelas relacionais para `itens`, `materiais`, `equipes`, `outros_custos`, `simulacoes` e `resumo_fixos` — todas amarradas ao `orcamento_id`. CRUD completo em `lib/supabaseOrcamento.js` (25 funções exportadas incluindo helpers `*FromDb` para reconstituição de state).
*   **IA Backend:** Google Gemini 2.5 Flash via `@google/genai` SDK. Duas API Routes sob `app/api/ia/`:
    - `/api/ia/histograma` — cenários de equipe
    - `/api/ia/ev` — análise de engenharia de valor

### 3.3. Utilitários Core
*   `lib/parser.js` — Parser V4 de composições Markdown.
*   `lib/calculos.js` — Formatadores (`formatCurrency`, `formatNumber`) e cálculo de BDI (`calcBDI`).
*   `lib/constants.js` — Design tokens (COLORS, FONTS), configuração de TABS, defaults para BDI, Header, Materiais, Equipes, Outros Custos e Resumo.
*   `lib/useAutoSave.js` — Hook de auto-save debounced para Supabase.

### 3.4. Deploy e Versionamento
*   **Git local** → **GitHub** (branch `main`).
*   **Hospedagem:** **Vercel** com CI/CD automático.
*   **Config:** `vercel.json` com framework `nextjs` declarado explicitamente.

---

## 4. Estrutura de Arquivos (Mapa do Repositório)

```
quantisa-orcamento/
├── app/
│   ├── api/ia/
│   │   ├── histograma/route.js    # API Route — cenários IA (Gemini)
│   │   └── ev/route.js            # API Route — eng. de valor IA
│   ├── orcamento/[id]/page.js     # Página dinâmica do orçamento (todas as 9 abas)
│   ├── page.js                    # Dashboard de listagem de orçamentos
│   ├── layout.js                  # Root layout (HTML, metadata)
│   ├── globals.css                # CSS global / resets
│   └── page.module.css            # CSS módulo do dashboard
├── components/
│   ├── Sidebar.jsx                # Barra lateral de navegação
│   ├── Inputs.jsx                 # Componentes de input reutilizáveis
│   ├── TabImportar.jsx            # Aba 1: Importação de composições
│   ├── TabCusto.jsx               # Aba 2: Planilha de custo direto
│   ├── TabMateriais.jsx           # Aba 3: Materiais fixos + variáveis
│   ├── TabHistograma.jsx          # Aba 4: Histograma de equipe + IA
│   ├── TabSimulacoes.jsx          # Aba 5: Simulação de BDI
│   ├── TabResumo.jsx              # Aba 6: Resumo financeiro com KPIs
│   ├── TabABC.jsx                 # Aba 7: Análise ABC (Pareto)
│   ├── TabEV.jsx                  # Aba 8: Engenharia de Valor (IA)
│   └── TabExportar.jsx            # Aba 9: Exportação CSV / Markup
├── lib/
│   ├── calculos.js                # Formatadores e fórmula BDI
│   ├── constants.js               # Design tokens e defaults
│   ├── geminiService.js           # Serviço Gemini (sugerirEquipes, gerarTextoIA)
│   ├── parser.js                  # Parser V4 de composições
│   ├── supabase.js                # Cliente Supabase
│   ├── supabaseOrcamento.js       # CRUD completo (25 funções)
│   └── useAutoSave.js             # Hook de auto-save
├── public/                        # Assets estáticos (SVGs)
├── scripts/                       # Scripts utilitários
├── .env.local                     # Variáveis de ambiente (Supabase + Gemini)
├── vercel.json                    # Config Vercel
├── package.json                   # Dependências (next, react, supabase, genai)
└── contexto.md                    # ← ESTE ARQUIVO
```

---

## 5. Diário de Bordo (Histórico e Log de Alterações)

### O Padrão de Entrada
Toda nova feature, deploy ou bugfix crítico desenvolvido colaborativamente entre Mat & IA deverá constar aqui.

```
[DATA] - [TÍTULO DA TAREFA/SESSÃO]
- Objetivo/Motivo: Por que essa alteração foi iniciada?
- Alterações Arquiteturais ou UI: O que mudou em infra ou código profundo?
- Status: Concluído (Merge, Deploy) / Testes etc.
```

---

### [Novembro 2025] - Criação Inicial do Projeto QUANTISA Orçamento
- **Objetivo/Motivo:** Construir um sistema web profissional de orçamentação de engenharia civil que substitua as planilhas manuais, permitindo importação de composições V4 geradas por IA, cálculo automático de custos e gerenciamento de orçamentos.
- **Alterações Arquiteturais ou UI:**
    - Inicialização do projeto Next.js com App Router.
    - Criação da estrutura base: Dashboard (`app/page.js`) para listagem e criação de orçamentos.
    - Implementação da página dinâmica `app/orcamento/[id]/page.js` com o sistema de abas.
    - Desenvolvimento das abas iniciais: Importar, Custo, Materiais, Simulações e Resumo.
    - Construção do Parser V4 (`lib/parser.js`) para extração de dados de composições Markdown.
    - Integração com Supabase para persistência de dados (CRUD completo em `lib/supabaseOrcamento.js`).
    - Implementação do tema Dark Industrial com paleta Amber + fundo escuro.
    - Sistema de auto-save com hook React (`lib/useAutoSave.js`).
- **Status:** Concluído. Projeto funcional com fluxo básico completo (importar → custo → simular → resumir).

---

### [Novembro/Dezembro 2025] - Migração do SDK Gemini e Debugs Supabase
- **Objetivo/Motivo:** Migrar a integração Gemini da biblioteca depreciada `@google/generative-ai` para o novo SDK `@google/genai` e resolver erros de conexão com o Supabase (`ERR_NAME_NOT_RESOLVED`).
- **Alterações Arquiteturais ou UI:**
    - Refatoração do `lib/geminiService.js` para usar `GoogleGenAI` do `@google/genai`.
    - Atualização do modelo para `gemini-2.5-flash`.
    - Ajuste da forma de chamada para `ai.models.generateContent()` com `config.systemInstruction`.
    - Investigação e resolução de problemas de conexão com o Supabase (URLs e variáveis de ambiente).
- **Status:** Concluído. SDK migrado com sucesso.

---

### [Dezembro 2025] - Correção de Parsing e Ajustes UI
- **Objetivo/Motivo:** Corrigir problemas de renderização de Markdown (texto exibido como bloco de código por causa de indentação) e restaurar o Quadro de Produtividade.
- **Alterações Arquiteturais ou UI:**
    - Implementação de função utilitária de dedent para corrigir indentação em Markdown.
    - Ajuste no prompt do Gemini para geração correta de tabelas de produtividade com colunas "Função", "Coeficiente de Consumo", "Coeficiente de Produtividade".
    - Correção de erros de sintaxe em JSX (botões e inputs malformados).
- **Status:** Concluído.

---

### [23 de Fevereiro de 2026] - Feature de Pin para Sidebar + Fix no Parser de Tabelas Markdown
- **Objetivo/Motivo:** Implementar funcionalidade de fixar/recolher o painel lateral para maximizar a área de trabalho, e corrigir bugs de renderização nas tabelas Markdown.
- **Alterações Arquiteturais ou UI:**
    - Sidebar responsiva com toggle pin/unpin para desktop.
    - Comportamento off-canvas em telas menores com botão hamburger.
    - Fix no parser de tabelas Markdown — substituição de `.slice(2)` por `.filter(...)` para não engolir linhas de conteúdo.
    - Ajustes aplicados nas branches `main` e `theme-gold-slate`.
- **Status:** Concluído. Merge nas duas branches.

---

### [25 de Fevereiro de 2026] - Expansão Massiva: Histograma IA, ABC, Eng. Valor e Exportação
- **Objetivo/Motivo:** Implementar uma série de funcionalidades avançadas para tornar o QUANTISA um sistema completo de orçamentação com inteligência artificial.
- **Alterações Arquiteturais ou UI:**
    - **Histograma Inteligente (`TabHistograma.jsx`):** Equipe padrão auto-calculada + botão "🤖 Sugerir com IA" com 2 cenários via Gemini 2.5 Flash. Criação do `geminiService.js` com system prompt baseado nos Prompts 3 e 4 do QUANTISA. API Route em `/api/ia/histograma`.
    - **Aba ABC (`TabABC.jsx`):** Análise Pareto automática classificando itens em A (80%), B (15%), C (5%). Cards de resumo, tabela ranked e recomendações por classe. Aba opcional.
    - **Aba Engenharia de Valor (`TabEV.jsx`):** Identificação de itens Classe A + análise via Gemini com 3 alternativas (Padrão, Econômico, Premium). API Route em `/api/ia/ev`. Aba opcional.
    - **Aba Exportar (`TabExportar.jsx`):** 3 modos de markup (ABC Proporcional, Uniforme, ABC Inverso), tabela de preço de venda, cards de resumo financeiro e botão "📥 Baixar Excel (CSV)". Aba opcional.
    - **Composição Completa:** `confirmImport` agora salva texto inteiro no campo `composicao_raw` para features futuras.
    - **Sidebar Redesign:** Seção "ANÁLISE" com separador visual, abas opcionais com fonte menor e cor mais suave.
    - **Deploy:** `vercel.json` adicionado com framework `nextjs` explícito.
- **Status:** Concluído. Build 100% local. Deploy na Vercel com sucesso (após resolução temporária de `ERR_CONNECTION_TIMED_OUT` do lado da plataforma Vercel).

---

### [26 de Fevereiro de 2026] - Criação do Documento de Contexto (Diário de Bordo)
- **Objetivo/Motivo:** Criar um documento mestre (`contexto.md`) para servir como fonte única da verdade do projeto, contendo histórico completo, arquitetura, funcionalidades e log de todas as alterações.
- **Alterações Arquiteturais ou UI:**
    - Criação deste documento seguindo o padrão do "Contexto" utilizado no projeto H-QUANT, adaptado para as especificidades do QUANTISA Orçamento.
    - O arquivo de exemplo do H-QUANT foi renomeado para `contexto-exemplo-hquant.md` para referência futura.
- **Status:** Concluído.

---

## 6. Próximos Passos (Roadmap Pendente)

- [ ] **Importação expandida:** Múltiplas composições de uma vez (batch import de vários textos V4)
- [ ] **Verificação IA entre abas:** Cross-check inteligente entre Custo→Materiais, Materiais→Histograma
- [ ] **PDF de Instruções de Obra:** Usando campo `composicao_raw` (Seção 6 do V4)
- [ ] **Cronograma Visual:** Gantt simplificado baseado nos cenários do Histograma
- [ ] **Textos Comerciais com IA:** Geração automática de propostas (Prompt-6)
