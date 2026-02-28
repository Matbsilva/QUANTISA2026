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
        const { itens, tc, matFix, tmf, equipes, oc, header } = body;

        if (!itens || itens.length === 0) {
            return Response.json(
                { error: "Orçamento sem itens. Adicione composições primeiro." },
                { status: 400 }
            );
        }

        const promptsPath = path.join(process.cwd(), "prompts");

        let systemInst = "";
        let prompt7Text = "";
        try {
            systemInst = await fs.readFile(path.join(promptsPath, "SYSTEM-INSTRUCTION-QUANTISA.md"), "utf-8");
            prompt7Text = await fs.readFile(path.join(promptsPath, "PROMPT-7-MEMORIAL.md"), "utf-8");
        } catch (e) {
            console.warn("Could not load Prompt 7 from disk, using fallback...", e);
            systemInst = "Você é o QUANTISA-AI.";
            prompt7Text = "Gere o Memorial Descritivo de todo o orçamento.";
        }

        const SYSTEM_PROMPT = `${systemInst}
Sua missão é gerar o PROMPT-7 (MEMORIAL DESCRITIVO).

AS REGRAS E O FORMATO DE SAÍDA OBRIGATÓRIOS FORAM DEFINIDOS AQUI:
${prompt7Text}

O QUE VOCÊ DEVE DEVOLVER (Obrigatório respeitar formato JSON para renderização):
RETORNE O MEMORIAL INTEIRO EM MARKDOWN DENTRO DE UM JSON com a chave "memorial_descritivo".
`;

        const userPrompt = `DADOS GERAIS DO PROJETO PARA O MEMORIAL:
- Obra: ${header?.nome || "Projeto"}
- Cliente: ${header?.cliente || "Não informado"}
- Data do Orçamento: ${header?.data || new Date().toLocaleDateString("pt-BR")}
- Custo Direto (Itens + Mat + MO + Outros): R$ ${(tc.t + tmf).toFixed(2)}
- Total HH Prof: ${tc?.hp?.toFixed(2)} | Ajudante: ${tc?.ha?.toFixed(2)}

ITENS COMPOSIÇÕES:
${itens.map(i => `- ${i.rank ? `[${i.classe}] ` : ''}${i.d} | Qtd: ${i.q} ${i.u} | Total: R$ ${((i.m + i.mo + i.e) * i.q).toFixed(2)}`).join("\n")}

EQUIPES E OUTROS CUSTOS:
Equipes: ${JSON.stringify(equipes)}
Outros custos: ${JSON.stringify(oc)}

ATENÇÃO: Este documento deve conter o histórico completo das decisões. Use placeholders [N/A] onde a informação não foi fornecida pelo JSON.

RETORNE EXATAMENTE NESTE FORMATO JSON:
{
  "memorial_descritivo": "## 📋 MEMORIAL DESCRITIVO DO PROJETO... (Texto markdown completo)"
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
        console.error("Erro na API Memorial:", err);
        return Response.json(
            { error: err.message || "Erro interno ao gerar Memorial Descritivo" },
            { status: 500 }
        );
    }
}
