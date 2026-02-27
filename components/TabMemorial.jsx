"use client";
import { useState, useMemo } from "react";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency } from "@/lib/calculos";
import ReactMarkdown from "react-markdown";
import { useStore } from "@/lib/store";

export default function TabMemorial({ tc, tmf }) {
    const { header, itens, matFix, equipes, oc } = useStore();
    const [loadingAI, setLoadingAI] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [aiError, setAiError] = useState(null);

    // Filter top ABC items to give user context on what goes to the memorial
    const ranked = useMemo(() => {
        if (!itens || itens.length === 0) return [];
        const sorted = [...itens].map((it) => ({
            ...it,
            tot: (it.m + it.mo + it.e) * it.q,
        })).sort((a, b) => b.tot - a.tot);

        const total = sorted.reduce((s, it) => s + it.tot, 0);
        let acc = 0;
        return sorted.map((it, idx) => {
            const pct = total > 0 ? (it.tot / total) * 100 : 0;
            acc += pct;
            return { ...it, rank: idx + 1, classe: acc <= 80 ? "A" : acc <= 95 ? "B" : "C" };
        });
    }, [itens]);

    const handleGenerate = async () => {
        try {
            setLoadingAI(true);
            setAiError(null);

            const reqData = {
                header,
                itens: ranked,
                tc: { t: tc.t, hp: tc.hp, ha: tc.ha },
                matFix,
                tmf,
                equipes,
                oc
            };

            const res = await fetch("/api/ia/memorial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqData)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erro na API de Memorial Descritivo");
            }

            const data = await res.json();
            setAiResult(data);
        } catch (error) {
            setAiError(error.message);
        } finally {
            setLoadingAI(false);
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "10px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                    <h2 style={{ fontSize: 24, fontWeight: 800, margin: 0, fontFamily: FONTS.mono, color: COLORS.accent }}>
                        📚 Memorial Descritivo
                    </h2>
                    <p style={{ margin: "5px 0 0", color: COLORS.textMuted, fontSize: 14 }}>
                        Geração do documento histórico de fechamento do orçamento (Prompt 7).
                    </p>
                </div>
            </div>

            <div style={{
                background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                borderRadius: 8, padding: 20, marginBottom: 20
            }}>
                <div style={{ display: "flex", gap: 15, marginBottom: 15 }}>
                    <div style={{ flex: 1, background: COLORS.bg, padding: 15, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 5 }}>Itens Orçados</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.blue, fontFamily: FONTS.mono }}>{itens.length} composições</div>
                    </div>
                    <div style={{ flex: 1, background: COLORS.bg, padding: 15, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 5 }}>Custo Direto Base</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.accent, fontFamily: FONTS.mono }}>{formatCurrency(tc.t + tmf)}</div>
                    </div>
                </div>

                <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 15 }}>
                    O Memorial compila todas as decisões técnicas, indicadores, prazos, premissas e materiais vinculados. Serve como referência da Obra. Recomenda-se gerar apenas ao final do orçamento.
                </p>

                <button
                    onClick={handleGenerate}
                    disabled={loadingAI}
                    style={{
                        width: "100%", padding: 15, borderRadius: 8, border: "none",
                        background: loadingAI ? COLORS.border : COLORS.purple,
                        color: loadingAI ? COLORS.textMuted : COLORS.bg,
                        fontSize: 16, fontWeight: 800, cursor: loadingAI ? "wait" : "pointer",
                        fontFamily: FONTS.sans, transition: "background 0.2s"
                    }}
                >
                    {loadingAI ? "⏳ Consolidando Memorial Histórico da Obra..." : "🤖 Gerar Memorial Descritivo (Prompt 7)"}
                </button>

                {aiError && (
                    <div style={{ marginTop: 15, padding: 15, background: COLORS.red + "15", border: `1px solid ${COLORS.red}40`, borderRadius: 6, color: COLORS.red }}>
                        ⚠️ Erro: {aiError}
                    </div>
                )}
            </div>

            {/* AI RESULTS */}
            {aiResult && (
                <div style={{ marginTop: 30 }}>
                    <div style={{ background: COLORS.surface, border: `2px solid ${COLORS.purple}`, borderRadius: 8, padding: 25 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 15, marginBottom: 20 }}>
                            <h3 style={{ color: COLORS.purple, margin: 0, fontSize: 20 }}>📄 Documento Gerado</h3>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(aiResult.memorial_descritivo || "");
                                    alert("Memorial copiado para a área de transferência!");
                                }}
                                style={{
                                    padding: "6px 12px", borderRadius: 4, border: `1px solid ${COLORS.purple}`,
                                    background: "transparent", color: COLORS.purple, cursor: "pointer", fontSize: 12, fontWeight: 700
                                }}
                            >
                                📋 Copiar Markdown
                            </button>
                        </div>
                        <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.6, overflowX: "auto" }}>
                            <ReactMarkdown>{aiResult.memorial_descritivo || ""}</ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
