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
                { error: "Nenhum item na tabela de custo para consolidar." },
                { status: 400 }
            );
        }

        // 1. Load the Prompts from the local prompts folder
        const promptsPath = path.join(process.cwd(), "prompts");

        let instrucaoGabriel = "";
        let prompt3Text = "";
        let prompt6Text = "";

        try {
            instrucaoGabriel = await fs.readFile(path.join(promptsPath, "INSTRUCAO-GABRIEL.md"), "utf-8");
            prompt3Text = await fs.readFile(path.join(promptsPath, "PROMPT-3-CONSOLIDACAO.md"), "utf-8");
            prompt6Text = await fs.readFile(path.join(promptsPath, "PROMPT-6-TEXTOS-COMERCIAIS.md"), "utf-8");
        } catch (e) {
            console.warn("Could not load real Prompts from disk, using fallback...", e);
            instrucaoGabriel = "Você é o QUANTISA-AI, um Engenheiro de Custos Sênior atuando no padrão Geforce Engenharia.\nSua missão é gerar a CONSOLIDAÇÃO metodológica em 4 Fases e OS TEXTOS COMERCIAIS para envio ao cliente.";
            prompt3Text = "Gere a consolidação técnica de custos focada em HH e Mão de obra.";
            prompt6Text = "Gere a proposta comercial baseada nos dados fornecidos.";
        }

        const SYSTEM_PROMPT = `${instrucaoGabriel}

AS DUAS REGRAS DE OURO DA GEFORCE FORAM DEFINIDAS AQUI:
--- REGRA DE CONSOLIDAÇÃO ---
${prompt3Text}

--- REGRA DE TEXTOS COMERCIAIS ---
${prompt6Text}

O QUE VOCÊ DEVE DEVOLVER (Obrigatório respeitar formato JSON para renderização):
Você deve mesclar a entrega das 4 fases da consolidação e dos modelos de e-mail em um ÚNICO JSON.
Seja denso nas descrições comerciais (Imagem 4), respeitando as travas de "Área Lacrada" e "Cura de 7 dias" exigidos pela metodologia Geforce.
`;

        const userPrompt = `DADOS DO PROJETO:
- Nome: ${header?.nome || "Projeto"}
- Cliente: ${header?.cliente || "Não informado"}
- Total Custo Direto Itens: R$ ${tc.t.toFixed(2)}
- Total Materiais Fixos: R$ ${tmf.toFixed(2)}

ITENS DO ORÇAMENTO:
${itens.map(i => `- ${i.d} | Qtd: ${i.q} ${i.u} | Mat: ${i.m} | MO: ${i.mo} | Eq: ${i.e} | HH Prof: ${i.hp} | HH Aju: ${i.ha}`).join("\n")}

EQUIPES E OUTROS CUSTOS:
Equipes: ${JSON.stringify(equipes)}
Outros: ${JSON.stringify(oc)}

RETORNE EXATAMENTE NESTE FORMATO JSON:
{
  "fase1_caixa_preta": "Texto markdown com a Tabela de Custos e Metodologia 1...",
  "fase2_suprimentos": "Texto markdown com a Tabela de Materiais/Logística...",
  "fase3_histograma": "Texto markdown com as equipes...",
  "fase4_resumo_cliente": "Texto markdown com a tabela Resumo Cliente (Descrições Densas)...",
  "textos_comerciais": "O e-mail pronto de proposta seguindo os modelos da Geforce (Destacando tempos de cura, áreas lacradas, etc)..."
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
        console.error("Erro na API de consolidação:", err);
        return Response.json(
            { error: err.message || "Erro interno ao gerar consolidação" },
            { status: 500 }
        );
    }
}
