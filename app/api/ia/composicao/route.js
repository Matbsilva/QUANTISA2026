import { GoogleGenAI } from "@google/genai";
import fs from "fs/promises";
import path from "path";
import { checkRateLimit } from "@/lib/rateLimit";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
    try {
        const limitRes = checkRateLimit("global_ai", 10, 60000); // Max 10 por min
        if (!limitRes.success) {
            return Response.json(
                { error: `Limite de requisições excedido. Aguarde ${Math.ceil((limitRes.resetTime - Date.now()) / 1000)}s e tente novamente.` },
                { status: 429 }
            );
        }
        const body = await request.json();
        const { descricao } = body;

        if (!descricao) {
            return Response.json(
                { error: "Descrição do serviço não fornecida." },
                { status: 400 }
            );
        }

        const refPath = path.join(process.cwd(), "..", "_referencia", "ARQUIVOS BASE");

        let systemInst = "";
        let biblioteca = "";
        let prompt2Text = "";

        try {
            systemInst = await fs.readFile(path.join(refPath, "SYSTEM-INSTRUCTION-QUANTISA-v4.6.md"), "utf-8");
            biblioteca = await fs.readFile(path.join(refPath, "BIBLIOTECA-INSUMOS-v7.md"), "utf-8");
            prompt2Text = await fs.readFile(path.join(refPath, "PROMPT-2-COMPOSICOES-v7.3.md"), "utf-8");
        } catch (e) {
            console.warn("Could not load one or more Prompt files from disk.", e);
        }

        const SYSTEM_PROMPT = `${systemInst}\n\n${biblioteca}\n\nVocê é o QUANTISA-AI. Sua missão é gerar o PROMPT-2 (Composições) estritamente seguindo o formato V4 exigido no Prompt 2.`;

        const userPrompt = `${prompt2Text}\n\nO CLIENTE PEDIU A SEGUINTE COMPOSIÇÃO / ESCOPO:\n"${descricao}"\n\nGERE A COMPOSIÇÃO COMPLETA NAS 7 SEÇÕES AGORA.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: userPrompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
            },
        });

        const text = response.text.trim();

        return Response.json({
            markdown: text
        });

    } catch (err) {
        console.error("Erro na API Composicao:", err);
        return Response.json(
            { error: err.message || "Erro interno ao gerar Composição via IA" },
            { status: 500 }
        );
    }
}
