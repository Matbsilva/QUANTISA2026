"use client";
import { useState } from "react";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/calculos";
import { NumericInput, TextInput } from "./Inputs";
import { parseMultipleCompositions } from "@/lib/parser";

export default function TabImportar({
    compText, setCompText, parsed, editP, setEditP,
    doParse, confirmImport, impHist,
    setParsed, setTab,
}) {
    // Batch import state
    const [batchMode, setBatchMode] = useState(false);
    const [batchResults, setBatchResults] = useState(null);
    const [batchImported, setBatchImported] = useState([]);

    const handleBatchParse = () => {
        const result = parseMultipleCompositions(compText);
        if (result.count > 0) {
            setBatchResults(result);
        } else {
            alert("Nenhuma composição identificada no texto. Verifique se as seções estão marcadas corretamente.");
        }
    };

    const handleBatchImportAll = (onImport) => {
        if (!batchResults) return;
        const imported = [];
        batchResults.compositions.forEach((comp) => {
            if (comp.parsed) {
                const item = {
                    id: Date.now().toString() + "_" + Math.random().toString(36).substr(2, 4),
                    n: comp.codigo || "",
                    d: comp.titulo || "Composição importada",
                    u: comp.unidade || "m²",
                    q: comp.q !== undefined ? comp.q : 1,
                    m: comp.mat,
                    mo: comp.mo,
                    e: comp.eq,
                    hp: comp.hhp,
                    ha: comp.hha,
                    composicao_raw: comp.raw,
                };
                imported.push(item);
            }
        });
        if (imported.length > 0 && onImport) {
            onImport(imported);
            setBatchImported(imported);
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <h2 style={{ fontSize: 19, fontWeight: 700, margin: 0, fontFamily: FONTS.mono }}>
                    Importar Composição
                </h2>
                {/* Toggle batch mode */}
                <button
                    onClick={() => { setBatchMode(!batchMode); setBatchResults(null); setBatchImported([]); }}
                    style={{
                        padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                        border: `1px solid ${batchMode ? COLORS.purple : COLORS.border}`,
                        background: batchMode ? COLORS.purple + "20" : "transparent",
                        color: batchMode ? COLORS.purple : COLORS.textDim,
                        cursor: "pointer", transition: "all 0.2s",
                    }}
                >
                    {batchMode ? "◉ Modo Lote" : "○ Modo Lote"}
                </button>
            </div>

            <p style={{ fontSize: 14, color: COLORS.textDim, margin: "0 0 10px" }}>
                {batchMode
                    ? "Cole múltiplas composições de uma vez. O parser detecta automaticamente onde cada composição começa (SEÇÃO 1 / **CÓDIGO:**)."
                    : "Cole o markdown da composição V4 (Seções 1-7). O parser extrai valores da Seção 5 automaticamente."}
            </p>

            <textarea
                value={compText}
                onChange={(e) => setCompText(e.target.value)}
                placeholder={batchMode
                    ? `Cole aqui múltiplas composições de uma vez...\n\nO parser detecta automaticamente onde cada composição começa.\nBasta colar o texto completo com todas as composições sequenciais.`
                    : `Cole aqui o texto completo da composição...\n\nO parser identifica automaticamente:\n• Código, Título, Unidade, Grupo, Turno\n• Mat/un, MO/un, Equip/un (Seção 5)\n• HH Profissional e HH Ajudante (Seção 3/5)\n• Lista de insumos (Seção 2)\n• Quantidade de referência da composição`}
                style={{
                    width: "100%", height: batchMode ? 220 : 180, padding: 10,
                    background: COLORS.bg, border: `1px solid ${batchMode ? COLORS.purple + "60" : COLORS.border}`,
                    borderRadius: 6, color: COLORS.text, fontSize: 14,
                    fontFamily: FONTS.mono, outline: "none", resize: "vertical", lineHeight: 1.5,
                    boxSizing: "border-box",
                }}
            />

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {batchMode ? (
                    <button
                        onClick={handleBatchParse}
                        disabled={compText.length < 50}
                        style={{
                            padding: "7px 18px", borderRadius: 5, border: "none",
                            background: COLORS.purple, color: "#fff", fontSize: 15,
                            fontWeight: 700, cursor: compText.length < 50 ? "not-allowed" : "pointer",
                            opacity: compText.length < 50 ? 0.4 : 1,
                        }}
                    >
                        🔍 Detectar Composições
                    </button>
                ) : (
                    <button
                        onClick={doParse}
                        disabled={compText.length < 50}
                        style={{
                            padding: "7px 18px", borderRadius: 5, border: "none",
                            background: COLORS.accent, color: COLORS.bg, fontSize: 15,
                            fontWeight: 700, cursor: compText.length < 50 ? "not-allowed" : "pointer",
                            opacity: compText.length < 50 ? 0.4 : 1,
                        }}
                    >
                        Analisar
                    </button>
                )}
                {compText.length > 0 && (
                    <button
                        onClick={() => { setCompText(""); setParsed(null); setEditP(null); setBatchResults(null); }}
                        style={{
                            padding: "7px 14px", borderRadius: 5, border: `1px solid ${COLORS.border}`,
                            background: "transparent", color: COLORS.textDim, fontSize: 14, cursor: "pointer",
                        }}
                    >
                        Limpar
                    </button>
                )}
            </div>

            {/* ═══════════════════════════════════════════════ */}
            {/* BATCH RESULTS                                   */}
            {/* ═══════════════════════════════════════════════ */}
            {batchMode && batchResults && (
                <div style={{
                    marginTop: 14, background: COLORS.surface,
                    border: `1px solid ${COLORS.purple}40`, borderRadius: 8, padding: 14,
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: COLORS.purple }}>
                            🔍 {batchResults.count} composição(ões) detectada(s)
                        </span>
                        <span style={{
                            fontSize: 12, padding: "2px 10px", borderRadius: 12,
                            background: COLORS.purple + "20", color: COLORS.purple,
                        }}>
                            {batchResults.compositions.filter(c => c.parsed).length} válida(s)
                        </span>
                    </div>

                    {/* List of detected compositions */}
                    <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 12 }}>
                        {batchResults.compositions.map((comp, i) => (
                            <div key={i} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "8px 10px", marginBottom: 4,
                                background: comp.parsed ? COLORS.bg : "#1a0a0a",
                                border: `1px solid ${comp.parsed ? COLORS.border : COLORS.red + "40"}`,
                                borderRadius: 6,
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{
                                            fontSize: 11, fontWeight: 700,
                                            color: comp.parsed ? COLORS.green : COLORS.red,
                                            background: comp.parsed ? COLORS.green + "15" : COLORS.red + "15",
                                            padding: "1px 8px", borderRadius: 10,
                                        }}>
                                            {comp.parsed ? "✓" : "✕"} #{i + 1}
                                        </span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.accent, fontFamily: FONTS.mono }}>
                                            {comp.codigo || "—"}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: 13, color: COLORS.text, marginTop: 2 }}>
                                        {comp.titulo ? comp.titulo.substring(0, 80) : "Título não detectado"}
                                    </div>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                                    {comp.parsed ? (
                                        <>
                                            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent, fontFamily: FONTS.mono }}>
                                                {formatCurrency(comp.mat + comp.mo + comp.eq)}
                                            </div>
                                            <div style={{ fontSize: 10, color: COLORS.textMuted }}>
                                                /{comp.unidade || "un"} · {formatNumber(comp.hhp + comp.hha)} HH
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{ fontSize: 12, color: COLORS.red }}>Erro no parse</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Batch import buttons */}
                    {batchImported.length > 0 ? (
                        <div style={{
                            padding: 10, background: COLORS.green + "15", borderRadius: 6,
                            border: `1px solid ${COLORS.green}40`, textAlign: "center",
                        }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.green }}>
                                ✅ {batchImported.length} composição(ões) importada(s) com sucesso!
                            </div>
                            <button
                                onClick={() => setTab("custo")}
                                style={{
                                    marginTop: 8, padding: "7px 20px", borderRadius: 5,
                                    border: "none", background: COLORS.accent, color: COLORS.bg,
                                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                                }}
                            >
                                Ir para Tab Custo →
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", gap: 8 }}>
                            <button
                                onClick={() => handleBatchImportAll((items) => {
                                    // Use confirmImport per item — we need parent to handle batch
                                    if (window.__quantisaBatchImport) {
                                        window.__quantisaBatchImport(items);
                                    }
                                })}
                                disabled={batchResults.compositions.filter(c => c.parsed).length === 0}
                                style={{
                                    padding: "8px 22px", borderRadius: 5, border: "none",
                                    background: COLORS.green, color: "#fff", fontSize: 15,
                                    fontWeight: 700, cursor: "pointer",
                                }}
                            >
                                ✓ Importar Todas ({batchResults.compositions.filter(c => c.parsed).length})
                            </button>
                            <button
                                onClick={() => setBatchResults(null)}
                                style={{
                                    padding: "8px 14px", borderRadius: 5,
                                    border: `1px solid ${COLORS.border}`, background: "transparent",
                                    color: COLORS.textDim, fontSize: 14, cursor: "pointer",
                                }}
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════ */}
            {/* SINGLE IMPORT PREVIEW (original)               */}
            {/* ═══════════════════════════════════════════════ */}
            {!batchMode && parsed && editP && (
                <div style={{
                    marginTop: 14, background: COLORS.surface,
                    border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 14,
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>✓ COMPOSIÇÃO IDENTIFICADA</span>
                        <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 3, background: "rgba(34,197,94,0.15)", color: COLORS.green }}>VALORES EXTRAÍDOS</span>
                    </div>

                    {/* Header info */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10, padding: 8, background: COLORS.bg, borderRadius: 5 }}>
                        {[["Código", parsed.codigo], ["Grupo", parsed.grupo], ["Turno", parsed.turno], ["Equipe", parsed.equipe]].map(([l, v], i) => (
                            <div key={i}>
                                <span style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase" }}>{l}</span>
                                <div style={{ fontSize: 14, color: v ? COLORS.text : COLORS.red }}>{v || "Não encontrado"}</div>
                            </div>
                        ))}
                    </div>

                    {/* Title & Unit */}
                    <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 6, marginBottom: 10 }}>
                        <div>
                            <label style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase" }}>Título</label>
                            <TextInput value={editP.titulo} onChange={(v) => setEditP((p) => ({ ...p, titulo: v }))} />
                        </div>
                        <div>
                            <label style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase" }}>Unidade</label>
                            <TextInput value={editP.unidade} onChange={(v) => setEditP((p) => ({ ...p, unidade: v }))} />
                        </div>
                    </div>

                    {/* Quantity field */}
                    <div style={{ marginBottom: 12, padding: 10, background: "#101A10", border: `1px solid ${COLORS.green}40`, borderRadius: 6 }}>
                        <div style={{ fontSize: 11, color: COLORS.green, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>
                            📏 Quantidade do Projeto
                        </div>
                        <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 8 }}>
                            Pré-preenchida com a quantidade de referência da composição. Ajuste para a quantidade real do projeto.
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <div style={{ minWidth: 100 }}>
                                <NumericInput
                                    value={editP.q !== undefined ? editP.q : 1}
                                    onChange={(v) => setEditP((p) => ({ ...p, q: v }))}
                                />
                            </div>
                            <span style={{ fontSize: 14, color: COLORS.text }}>{editP.unidade || "un"}</span>
                            <span style={{ fontSize: 13, color: COLORS.textDim, marginLeft: "auto" }}>
                                Total: <b style={{ color: COLORS.accent, fontFamily: FONTS.mono }}>
                                    {formatCurrency((editP.mat + editP.mo + editP.eq) * (editP.q || 1))}
                                </b>
                            </span>
                        </div>
                    </div>

                    {/* Editable values */}
                    <div style={{ fontSize: 12, color: COLORS.accent, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Valores unitários (editáveis)</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginBottom: 10 }}>
                        {[["Mat/un", "mat", COLORS.accent], ["MO/un", "mo", COLORS.blue], ["Equip/un", "eq", COLORS.purple], ["HH Prof", "hhp", COLORS.green], ["HH Aju", "hha", COLORS.green]].map(([l, k, c]) => (
                            <div key={k} style={{ padding: 6, background: COLORS.bg, borderRadius: 4, border: `1px solid ${COLORS.border}` }}>
                                <div style={{ fontSize: 9, color: COLORS.textMuted, textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
                                <NumericInput value={editP[k]} onChange={(v) => setEditP((p) => ({ ...p, [k]: v }))} />
                                <div style={{ fontSize: 12, color: editP[k] > 0 ? c : COLORS.red, marginTop: 2, fontFamily: FONTS.mono }}>
                                    {editP[k] > 0 ? (k.startsWith("hh") ? formatNumber(editP[k]) + " HH" : formatCurrency(editP[k])) : "—"}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div style={{ padding: 8, background: "#1A1710", borderRadius: 5, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 700 }}>Custo Direto Unitário</span>
                        <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.accent, fontFamily: FONTS.mono }}>{formatCurrency(editP.mat + editP.mo + editP.eq)}</span>
                    </div>

                    {/* Insumos */}
                    {parsed.insumos.length > 0 && (
                        <div style={{ marginBottom: 10 }}>
                            <div style={{ fontSize: 12, color: COLORS.blue, fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>Insumos ({parsed.insumos.length})</div>
                            <div style={{ maxHeight: 100, overflowY: "auto", border: `1px solid ${COLORS.border}`, borderRadius: 4 }}>
                                {parsed.insumos.map((ins, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 6px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 13 }}>
                                        <span>{ins.desc}</span>
                                        <span style={{ color: COLORS.accent2, fontFamily: FONTS.mono }}>{ins.qtd} {ins.unid} = {formatCurrency(ins.total)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                        <button
                            onClick={() => confirmImport(false)}
                            style={{ padding: "8px 20px", borderRadius: 5, border: "none", background: COLORS.green, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
                        >
                            ✓ Confirmar e Adicionar
                        </button>
                        <button
                            onClick={() => confirmImport(true)}
                            style={{ padding: "8px 16px", borderRadius: 5, border: `2px solid ${COLORS.accent}`, background: "transparent", color: COLORS.accent, fontSize: 14, fontWeight: 700, cursor: "pointer" }}
                        >
                            ✓ Confirmar e ir ao Custo →
                        </button>
                        <button
                            onClick={() => { setParsed(null); setEditP(null); }}
                            style={{ padding: "8px 14px", borderRadius: 5, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textDim, fontSize: 14, cursor: "pointer" }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* History */}
            {impHist.length > 0 && (
                <div style={{ marginTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase" }}>
                            Importadas nesta sessão ({impHist.length})
                        </div>
                        <button
                            onClick={() => setTab("custo")}
                            style={{ padding: "5px 14px", borderRadius: 5, border: "none", background: COLORS.accent, color: COLORS.bg, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                        >
                            Avançar para Custo →
                        </button>
                    </div>
                    {impHist.map((h, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", background: COLORS.surface, borderRadius: 4, marginBottom: 3, border: `1px solid ${COLORS.border}` }}>
                            <div>
                                <span style={{ fontSize: 13, color: COLORS.accent, fontFamily: FONTS.mono, marginRight: 6 }}>#{i + 1} {h.codigo}</span>
                                <span style={{ fontSize: 13 }}>{h.titulo && h.titulo.substring(0, 60)}</span>
                            </div>
                            <span style={{ fontSize: 13, color: COLORS.textMuted, fontFamily: FONTS.mono }}>{formatCurrency(h.mat + h.mo + h.eq)}/un</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
