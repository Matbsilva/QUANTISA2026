import { sugerirEquipes } from "@/lib/geminiService";

export async function POST(request) {
    try {
        const body = await request.json();
        const { totalHHP, totalHHA, itens } = body;

        if (totalHHP === undefined || totalHHA === undefined) {
            return Response.json(
                { error: "totalHHP e totalHHA são obrigatórios" },
                { status: 400 }
            );
        }

        const resultado = await sugerirEquipes({
            totalHHP: Number(totalHHP),
            totalHHA: Number(totalHHA),
            itens: itens || [],
        });

        return Response.json(resultado);
    } catch (err) {
        console.error("Erro na API de histograma:", err);
        return Response.json(
            { error: err.message || "Erro interno ao gerar sugestão" },
            { status: 500 }
        );
    }
}
