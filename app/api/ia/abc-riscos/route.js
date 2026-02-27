import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";
import { checkRateLimit } from "@/lib/rateLimit";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
    try {
        const limitRes = checkRateLimit("global_ai", 10, 60000);
        if (!limitRes.success) {
            return Response.json(
                { error: `Limite de requisições excedido. Aguarde ${Math.ceil((limitRes.resetTime - Date.now()) / 1000)}s e tente novamente.` },
                { status: 429 }
            );
        }
        const body = await request.json();
        const { itens, tc, equipes, header } = body;

        if (!itens || itens.length === 0) {
            return Response.json(
                { error: "Nenhum item na tabela de custo." },
                { status: 400 }
            );
        }

        const refPath = path.join(process.cwd(), "..", "_referencia", "ARQUIVOS BASE");

        let prompt4Text = "";
        try {
            prompt4Text = await fs.readFile(path.join(refPath, "PROMPT-4-ABC-REAL-EV-CRONOGRAMA-RISCOS-v3.0.md"), "utf-8");
        } catch (e) {
            console.warn("Could not load Prompt 4 from disk, using fallback...", e);
            prompt4Text = "Gere análise ABC, Engenharia de Valor, Cronograma e Riscos.";
        }

        const SYSTEM_PROMPT = `Você é o QUANTISA-AI.
Sua missão é gerar o PROMPT-4 (ABC REAL + EV COMPLETA + CRONOGRAMA + ANÁLISE DE EQUIPE E RISCOS).

AS REGRAS E O FORMATO DE SAÍDA OBRIGATÓRIOS FORAM DEFINIDOS AQUI:
${prompt4Text}

O QUE VOCÊ DEVE DEVOLVER (Obrigatório respeitar formato JSON para renderização):
Você deve mesclar a entrega das 5 ações do Prompt 4 em um ÚNICO JSON.
Seja preciso nos cálculos de curva ABC, e sempre exija que o cliente selecione o cenário no texto gerado!
`;

        const userPrompt = `DADOS DO PROJETO:
- Nome: ${header?.nome || "Projeto"}
- Total Custo Direto Itens: R$ ${tc?.t?.toFixed(2) || "0.00"}

ITENS DO ORÇAMENTO PARA CURVA ABC:
${itens.map(i => `- ${i.d} | Custo Total: R$ ${((i.m + i.mo + i.e) * i.q).toFixed(2)}`).join("\n")}

EQUIPES E HOMEM-HORA:
Total HH Prof: ${tc?.hp?.toFixed(2)}
Total HH Ajud: ${tc?.ha?.toFixed(2)}
Equipe Base Sugerida: ${JSON.stringify(equipes)}

RETORNE EXATAMENTE NESTE FORMATO JSON:
{
  "abc_real": "Texto markdown com a Tabela ABC (Ação 1)...",
  "engenharia_valor": "Texto markdown com a EV dos Itens Classe A (Ação 2)...",
  "cronograma": "Texto markdown com o Cronograma (Ação 3)...",
  "analise_equipes": "Texto markdown com os 3 Cenários de Equipe (Ação 4)...",
  "riscos_checklist": "Texto markdown com o Checklist de Riscos detalhado do projeto (Ação 5)..."
}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
            },
        });

        const text = response.text.trim();

        let jsonStr = text;
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1].trim();
        }

        try {
            const parsed = JSON.parse(jsonStr);
            return Response.json(parsed);
        } catch (err) {
            console.error("Parse error:", err, text);
            return Response.json(
                { error: "A IA retornou um formato inválido.", raw: text },
                { status: 500 }
            );
        }

    } catch (err) {
        console.error("Erro na API ABC/Riscos:", err);
        return Response.json(
            { error: err.message || "Erro interno ao gerar Análise ABC e Riscos" },
            { status: 500 }
        );
    }
}
