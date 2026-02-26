"use client";
import { COLORS, FONTS } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/calculos";
import { NumericInput, TextInput } from "./Inputs";

export default function TabImportar({
    compText, setCompText, parsed, editP, setEditP,
    doParse, confirmImport, impHist,
    setParsed,
}) {
    return (
        <div>
            <h2 style={{ fontSize: 19, fontWeight: 700, margin: "0 0 4px", fontFamily: FONTS.mono }}>
                Importar Composição
            </h2>
            <p style={{ fontSize: 14, color: COLORS.textDim, margin: "0 0 10px" }}>
                Cole o markdown da composição V4 (Seções 1-7). O parser extrai valores da Seção 5 automaticamente.
            </p>
            <textarea
                value={compText}
                onChange={(e) => setCompText(e.target.value)}
                placeholder={`Cole aqui o texto completo da composição...\n\nO parser identifica automaticamente:\n• Código, Título, Unidade, Grupo, Turno\n• Mat/un, MO/un, Equip/un (Seção 5)\n• HH Profissional e HH Ajudante (Seção 3/5)\n• Lista de insumos (Seção 2)`}
                style={{
                    width: "100%", height: 180, padding: 10,
                    background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                    borderRadius: 6, color: COLORS.text, fontSize: 14,
                    fontFamily: FONTS.mono, outline: "none", resize: "vertical", lineHeight: 1.5,
                }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
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
                {compText.length > 0 && (
                    <button
                        onClick={() => { setCompText(""); setParsed(null); setEditP(null); }}
                        style={{
                            padding: "7px 14px", borderRadius: 5, border: `1px solid ${COLORS.border}`,
                            background: "transparent", color: COLORS.textDim, fontSize: 14, cursor: "pointer",
                        }}
                    >
                        Limpar
                    </button>
                )}
            </div>

            {/* Preview */}
            {parsed && editP && (
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
                    <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={confirmImport} style={{ padding: "8px 20px", borderRadius: 5, border: "none", background: COLORS.green, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>✓ Confirmar e Adicionar</button>
                        <button onClick={() => { setParsed(null); setEditP(null); }} style={{ padding: "8px 14px", borderRadius: 5, border: `1px solid ${COLORS.border}`, background: "transparent", color: COLORS.textDim, fontSize: 14, cursor: "pointer" }}>Cancelar</button>
                    </div>
                </div>
            )}

            {/* History */}
            {impHist.length > 0 && (
                <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>Importadas ({impHist.length})</div>
                    {impHist.map((h, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", background: COLORS.surface, borderRadius: 4, marginBottom: 3, border: `1px solid ${COLORS.border}` }}>
                            <div>
                                <span style={{ fontSize: 13, color: COLORS.accent, fontFamily: FONTS.mono, marginRight: 6 }}>{h.codigo}</span>
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
