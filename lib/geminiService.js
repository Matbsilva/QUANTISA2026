import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * System prompt baseado nos Prompts 3 e 4 do QUANTISA.
 * Contém a inteligência de consolidação de equipes e histograma.
 */
const SYSTEM_PROMPT_HISTOGRAMA = `Você é Marcus, engenheiro civil sênior especializado em orçamentação de obras com 15+ anos de experiência.

REGRAS DE EQUIPE:
- Diárias padrão: Encarregado R$235/dia, Profissional R$185/dia, Ajudante R$165/dia
- Jornada: 8h/dia
- Equipe Padrão base: 2 Profissionais + 2 Ajudantes (proporção 1:1)
- Para obras maiores (>500 HH): considerar Encarregado
- Agrupar por tipo de serviço quando possível (CIVIL, DEMOLIÇÃO, ACABAMENTO, etc.)

CENÁRIOS OBRIGATÓRIOS:
1. CENÁRIO RÁPIDO: Mais pessoas, menos dias (~60% do tempo do padrão). Custo MO maior ~13%, mas compensa se equipamento é alugado (menos dias = menos aluguel).
2. CENÁRIO ECONÔMICO: Otimizado para menor custo total. Considerar que equipe menor = mais dias = mais aluguel de equipamento. Evitar cenários onde economia de MO é anulada por custo de equipamento.

CÁLCULOS:
- Total de cada cenário = Σ(diária × pessoas × dias) para cada função
- Prazo = máximo de dias entre todos os grupos
- O total de HH de cada cenário deve cobrir pelo menos o HH necessário do orçamento

IMPORTANTE: Responda APENAS com JSON válido, sem markdown, sem texto extra, sem backticks.`;

/**
 * Chama o Gemini 2.5 Flash para sugerir cenários de equipe
 * com base no total de HH e nos itens do orçamento.
 */
export async function sugerirEquipes({ totalHHP, totalHHA, itens }) {
  const diasProf = Math.ceil(totalHHP / 8);
  const diasAju = Math.ceil(totalHHA / 8);

  const prompt = `Dados do orçamento:
- Total HH Profissional: ${totalHHP} horas (${diasProf} dias de 8h)
- Total HH Ajudante: ${totalHHA} horas (${diasAju} dias de 8h)
- Total HH combinado: ${totalHHP + totalHHA} horas

Itens de obra:
${itens.map((i) => `- ${i.d || "Item"}: ${i.q} ${i.u}, HH Prof=${i.hp}, HH Aju=${i.ha}`).join("\n")}

Gere exatamente 2 cenários de histograma (RÁPIDO e ECONÔMICO) em JSON:
{
  "cenarios": [
    {
      "nome": "Equipe Rápida",
      "descricao": "Descrição curta do cenário",
      "equipes": [
        {
          "grupo": "CIVIL",
          "linhas": [
            { "funcao": "Encarregado", "diaria": 235, "pessoas": 1, "dias": 30 },
            { "funcao": "Profissional", "diaria": 185, "pessoas": 3, "dias": 30 },
            { "funcao": "Ajudante", "diaria": 165, "pessoas": 3, "dias": 30 }
          ]
        }
      ],
      "total": 99999,
      "prazo_dias": 30,
      "vantagens": ["vantagem 1", "vantagem 2"],
      "desvantagens": ["desvantagem 1"]
    },
    {
      "nome": "Equipe Econômica",
      "descricao": "Descrição curta do cenário",
      "equipes": [...],
      "total": 88888,
      "prazo_dias": 60,
      "vantagens": [...],
      "desvantagens": [...]
    }
  ]
}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT_HISTOGRAMA,
    },
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
 * Chamada genérica ao Gemini para uso futuro (memorial, ABC, verificação, etc.)
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
