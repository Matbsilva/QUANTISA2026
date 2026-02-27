"use client";
import { useState } from "react";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/calculos";
import ReactMarkdown from "react-markdown";
import { useStore } from "@/lib/store";

export default function TabConsolidacao({ tc, tmf }) {
    const { header, itens, matFix, equipes, oc } = useStore();
    const [loadingAI, setLoadingAI] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [aiError, setAiError] = useState(null);

    // Compute derived weights logic (simplified for UI)
    const pesoTotal = matFix.reduce((acc, curr) => acc + (curr.q * 10), 0) + (tc.m * 0.05); // rough mockup

    const handleGenerate = async () => {
        try {
            setLoadingAI(true);
            setAiError(null);

            const reqData = {
                header,
                itens: itens.map(i => ({ d: i.d, q: i.q, u: i.u, m: i.m, mo: i.mo, e: i.e, hp: i.hp, ha: i.ha })),
                tc: { t: tc.t },
                matFix,
                tmf,
                equipes,
                oc
            };

            const res = await fetch("/api/ia/consolidacao", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(reqData)
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Erro na API de consolidação");
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
                        Consolidação Padrão Geforce
                    </h2>
                    <p style={{ margin: "5px 0 0", color: COLORS.textMuted, fontSize: 14 }}>
                        Metodologia em 4 Etapas: Custo, Suprimentos, Histograma e Resumo Comercial.
                    </p>
                </div>
            </div>

            {/* FASE 1: A CAIXA PRETA */}
            <div style={{
                background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                borderRadius: 8, padding: 20, marginBottom: 20
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                    <h3 style={{ margin: 0, fontSize: 18, color: COLORS.blue, fontFamily: FONTS.mono }}>
                        1️⃣ Imagem 1: Consolidação Técnica (Caixa Preta)
                    </h3>
                    <span style={{ fontSize: 12, background: COLORS.blue + "20", color: COLORS.blue, padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>
                        {itens.length} ITENS ANALISADOS
                    </span>
                </div>

                <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 15 }}>
                    Esta é a fase técnica onde o sistema tritura o escopo para encontrar a eficiência de <b>Mão de Obra e Homem-Hora (HH)</b> total da obra. As multiplicações de quantitativos são fechadas rigorosamente.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                    <div style={{ background: COLORS.bg, padding: 15, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 5 }}>HH Profissional Total</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.green, fontFamily: FONTS.mono }}>{formatNumber(tc.hp)} h</div>
                    </div>
                    <div style={{ background: COLORS.bg, padding: 15, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 5 }}>HH Ajudante Total</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.green, fontFamily: FONTS.mono }}>{formatNumber(tc.ha)} h</div>
                    </div>
                    <div style={{ background: COLORS.bg, padding: 15, borderRadius: 6, border: `1px solid ${COLORS.border}` }}>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 5 }}>Custo Direto (Sem BDI)</div>
                        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.accent, fontFamily: FONTS.mono }}>{formatCurrency(tc.t)}</div>
                    </div>
                </div>
            </div>

            {/* FASE 2: SUPRIMENTOS E PESOS */}
            <div style={{
                background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                borderRadius: 8, padding: 20, marginBottom: 20
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                    <h3 style={{ margin: 0, fontSize: 18, color: COLORS.purple, fontFamily: FONTS.mono }}>
                        2️⃣ Imagem 2: Curva de Suprimentos e Pesos
                    </h3>
                </div>

                <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 15 }}>
                    Aqui o foco sai dos serviços e vai para a logística. Classificamos os materiais e determinamos os <b>Pesos Totais (kg)</b> para dimensionar a quantidade de fretes e tempo de elevação.
                </p>

                <div style={{ background: COLORS.bg, padding: "15px", borderRadius: 6, border: `1px solid ${COLORS.purple}40`, display: "flex", alignItems: "center", gap: 15 }}>
                    <div style={{ fontSize: 32 }}>⚖️</div>
                    <div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 2 }}>Peso Bruto Estimado p/ Logística</div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.purple, fontFamily: FONTS.mono }}>~ {formatNumber(pesoTotal)} kg</div>
                        <div style={{ fontSize: 12, color: COLORS.textDim, marginTop: 4 }}>*Estimativa baseada em métricas pré-cadastradas na base.</div>
                    </div>
                </div>
            </div>

            {/* FASE 3: HISTOGRAMA */}
            <div style={{
                background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                borderRadius: 8, padding: 20, marginBottom: 20
            }}>
                <h3 style={{ margin: "0 0 15px", fontSize: 18, color: COLORS.accent2, fontFamily: FONTS.mono }}>
                    3️⃣ Imagem 3: Estratégia Operacional (Histograma)
                </h3>

                <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 15 }}>
                    Transformamos o HH em <b>pessoas x dias</b> para traçar a duração real e os custos diários indiretos da mão de obra.
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {equipes.map((g, idx) => (
                        <div key={idx} style={{
                            flex: "1 1 200px", padding: 12, background: COLORS.bg,
                            border: `1px solid ${COLORS.border}`, borderRadius: 6
                        }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.accent2, marginBottom: 8, textTransform: "uppercase" }}>{g.g}</div>
                            {g.l.map((func, i) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.textDim, marginBottom: 4 }}>
                                    <span>{func.p}x {func.f}</span>
                                    <span style={{ fontFamily: FONTS.mono }}>{func.di}d</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* FASE 4: RESUMO COMERCIAL */}
            <div style={{
                background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                borderRadius: 8, padding: 20, marginBottom: 20
            }}>
                <h3 style={{ margin: "0 0 15px", fontSize: 18, color: COLORS.green, fontFamily: FONTS.mono }}>
                    4️⃣ Imagem 4: Resumo Comercial e Textos Base
                </h3>

                <p style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.5, marginBottom: 15 }}>
                    Geração do documento espelho para o cliente, contendo divisões limpas, premissas técnicas rigorosas e a argumentação dos Custos Indiretos (Limitações Doca/Noite).
                </p>

                <button
                    onClick={handleGenerate}
                    disabled={loadingAI}
                    style={{
                        width: "100%", padding: 15, borderRadius: 8, border: "none",
                        background: loadingAI ? COLORS.border : COLORS.green,
                        color: loadingAI ? COLORS.textMuted : COLORS.bg,
                        fontSize: 16, fontWeight: 800, cursor: loadingAI ? "wait" : "pointer",
                        fontFamily: FONTS.sans, transition: "background 0.2s"
                    }}
                >
                    {loadingAI ? "⏳ Gerando Proposta Comercial e Resumos com IA..." : "🤖 Gerar Proposta Comercial & Textos (Prompt 6 e 3)"}
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
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.accent, borderBottom: `2px solid ${COLORS.border}`, paddingBottom: 10, marginBottom: 20 }}>
                        ✨ Resultados da Inteligência
                    </h2>

                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 20 }}>
                            <h3 style={{ color: COLORS.blue, margin: "0 0 10px" }}>FASE 1 - Caixa Preta</h3>
                            <div style={{ fontSize: 13, color: COLORS.text, opacity: 0.9 }}>
                                <ReactMarkdown>{aiResult.fase1_caixa_preta || ""}</ReactMarkdown>
                            </div>
                        </div>

                        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 20 }}>
                            <h3 style={{ color: COLORS.purple, margin: "0 0 10px" }}>FASE 2 - Suprimentos</h3>
                            <div style={{ fontSize: 13, color: COLORS.text, opacity: 0.9 }}>
                                <ReactMarkdown>{aiResult.fase2_suprimentos || ""}</ReactMarkdown>
                            </div>
                        </div>

                        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 20 }}>
                            <h3 style={{ color: COLORS.accent2, margin: "0 0 10px" }}>FASE 3 - Histograma</h3>
                            <div style={{ fontSize: 13, color: COLORS.text, opacity: 0.9 }}>
                                <ReactMarkdown>{aiResult.fase3_histograma || ""}</ReactMarkdown>
                            </div>
                        </div>

                        <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 20 }}>
                            <h3 style={{ color: COLORS.green, margin: "0 0 10px" }}>FASE 4 - Resumo Cliente</h3>
                            <div style={{ fontSize: 13, color: COLORS.text, opacity: 0.9 }}>
                                <ReactMarkdown>{aiResult.fase4_resumo_cliente || ""}</ReactMarkdown>
                            </div>
                        </div>

                        <div style={{ background: COLORS.surface, border: `2px solid ${COLORS.accent}`, borderRadius: 8, padding: 20 }}>
                            <h3 style={{ color: COLORS.accent, margin: "0 0 10px" }}>📧 Textos Comerciais</h3>
                            <div style={{ fontSize: 14, color: COLORS.text }}>
                                <ReactMarkdown>{aiResult.textos_comerciais || ""}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
