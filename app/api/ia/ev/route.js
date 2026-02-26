import { gerarTextoIA } from "@/lib/geminiService";

export async function POST(request) {
    try {
        const body = await request.json();
        const { itens } = body;

        if (!itens || itens.length === 0) {
            return Response.json(
                { error: "Nenhum item para analisar" },
                { status: 400 }
            );
        }

        const systemPrompt = `Você é Marcus, engenheiro civil sênior com 15+ anos de experiência em orçamentação.
Analise cada item fornecido e sugira 3 alternativas técnicas:
1. PADRÃO (recomendado) – melhor custo-benefício
2. ECONÔMICO – reduz custo mas com trade-offs claros
3. PREMIUM – máxima qualidade/durabilidade

Para cada alternativa inclua: especificação técnica, custo estimado, variação percentual, vantagens e desvantagens.

Responda APENAS com JSON válido, sem markdown, sem backticks:
{
  "alternativas": [
    {
      "item": "1.1",
      "descricao": "Nome do item",
      "alternativas": [
        {
          "tipo": "PADRÃO",
          "especificacao": "Descrição técnica",
          "custo": 37610,
          "variacao": 0,
          "vantagens": ["vantagem 1"],
          "desvantagens": ["desvantagem 1"]
        },
        { "tipo": "ECONÔMICO", ... },
        { "tipo": "PREMIUM", ... }
      ]
    }
  ]
}`;

        const userPrompt = `Itens Classe A para análise de Engenharia de Valor:
${itens.map((it) => `- Item ${it.n}: ${it.d} (${it.q} ${it.u}) — Custo: R$ ${it.tot.toFixed(2)} (Mat: R$ ${it.m.toFixed(2)}/un, MO: R$ ${it.mo.toFixed(2)}/un, Eq: R$ ${it.e.toFixed(2)}/un)`).join("\n")}

Gere alternativas para cada item.`;

        const text = await gerarTextoIA(systemPrompt, userPrompt);
        const cleaned = text.trim();

        let jsonStr = cleaned;
        const jsonMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) jsonStr = jsonMatch[1].trim();

        const parsed = JSON.parse(jsonStr);
        return Response.json(parsed);
    } catch (err) {
        console.error("Erro na API EV:", err);
        return Response.json(
            { error: err.message || "Erro ao gerar análise" },
            { status: 500 }
        );
    }
}
