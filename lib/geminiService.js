import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Chama o Gemini 2.5 Flash para sugerir cenários de equipe
 * com base no total de HH e nos itens do orçamento.
 */
export async function sugerirEquipes({ totalHHP, totalHHA, itens }) {
    const prompt = `Você é um engenheiro civil experiente em orçamentação de obras.

Dados do orçamento:
- Total HH Profissional: ${totalHHP} horas (${Math.ceil(totalHHP / 8)} dias de 8h)
- Total HH Ajudante: ${totalHHA} horas (${Math.ceil(totalHHA / 8)} dias de 8h)

Itens de obra:
${itens.map((i) => `- ${i.d || "Item"}: ${i.q} ${i.u}, HH Prof=${i.hp}, HH Aju=${i.ha}`).join("\n")}

Gere exatamente 2 cenários de histograma de mão de obra em formato JSON válido:

CENÁRIO A: "Equipe Enxuta" — menos pessoas, mais dias
CENÁRIO B: "Equipe Reforçada" — mais pessoas, menos dias

Regras:
- Diárias padrão: Encarregado R$235, Profissional R$185, Ajudante R$165
- Jornada de 8h/dia
- O total de HH de cada cenário deve cobrir o HH necessário
- Agrupar por tipo de serviço quando possível

Responda APENAS com JSON válido neste formato (sem markdown, sem texto extra):
{
  "cenarios": [
    {
      "nome": "Equipe Enxuta",
      "equipes": [
        {
          "grupo": "CIVIL",
          "linhas": [
            { "funcao": "Encarregado", "diaria": 235, "pessoas": 1, "dias": 30 },
            { "funcao": "Profissional", "diaria": 185, "pessoas": 2, "dias": 30 },
            { "funcao": "Ajudante", "diaria": 165, "pessoas": 3, "dias": 30 }
          ]
        }
      ],
      "total": 99999,
      "prazo_dias": 30
    }
  ]
}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    const text = response.text.trim();

    // Try to parse JSON from response (may have markdown fences)
    let jsonStr = text;
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
        jsonStr = jsonMatch[1].trim();
    }

    try {
        const parsed = JSON.parse(jsonStr);
        return parsed;
    } catch (err) {
        console.error("Gemini returned invalid JSON:", text);
        throw new Error("A IA retornou um formato inválido. Tente novamente.");
    }
}

/**
 * Chamada genérica ao Gemini para uso futuro (memorial, ABC, etc.)
 */
export async function gerarTextoIA(systemPrompt, userPrompt) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
            systemInstruction: systemPrompt,
        },
    });

    return response.text;
}
