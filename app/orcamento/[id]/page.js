"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { COLORS, FONTS, GOOGLE_FONTS_URL, DEFAULT_HEADER } from "@/lib/constants";
import { parseComposition } from "@/lib/parser";
import { useStore } from "@/lib/store";
import { useAutoSave } from "@/lib/useAutoSave";
import {
    carregarOrcamento,
    salvarOrcamentoHeader,
    salvarItens,
    salvarMateriais,
    salvarEquipes,
    salvarOutrosCustos,
    salvarResumoFixos,
    itensFromDb,
    materiaisFromDb,
    equipesFromDb,
    outrosCustosFromDb,
    resumoFixosFromDb,
} from "@/lib/supabaseOrcamento";
import Sidebar from "@/components/Sidebar";
import TabImportar from "@/components/TabImportar";
import TabCusto from "@/components/TabCusto";
import TabMateriais from "@/components/TabMateriais";
import TabHistograma from "@/components/TabHistograma";
import TabSimulacoes from "@/components/TabSimulacoes";
import TabResumo from "@/components/TabResumo";
import TabConsolidacao from "@/components/TabConsolidacao";
import TabMemorial from "@/components/TabMemorial";
import TabABC from "@/components/TabABC";
import TabEV from "@/components/TabEV";
import TabExportar from "@/components/TabExportar";

export default function OrcamentoPage() {
    const params = useParams();
    const router = useRouter();
    const orcamentoId = params.id;

    // --- Loading State ---
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false);

    // --- State ---
    const [tab, setTab] = useState("custo");
    const [compText, setCompText] = useState("");
    const [parsed, setParsed] = useState(null);
    const [editP, setEditP] = useState(null);
    const [impHist, setImpHist] = useState([]);

    // --- Global Store ---
    const {
        header, setHeader,
        itens, setItens,
        matFix, setMatFix,
        equipes, setEquipes,
        oc, setOc,
        resumoFix, setResumoFix
    } = useStore();

    // --- Load Data from Supabase ---
    useEffect(() => {
        if (!orcamentoId) return;

        async function load() {
            try {
                setLoading(true);
                setLoadError(null);
                const data = await carregarOrcamento(orcamentoId);

                // Populate header
                const orc = data.orcamento;
                setHeader({
                    nome: orc.nome || "",
                    cliente: orc.cliente || "",
                    prop: orc.proponente || "GeForce Engenharia",
                    data: orc.data || new Date().toISOString().split("T")[0],
                    rev: orc.revisao || "00",
                });

                // Populate itens
                if (data.itens.length > 0) {
                    setItens(itensFromDb(data.itens));
                }

                // Populate materiais
                if (data.materiais.length > 0) {
                    setMatFix(materiaisFromDb(data.materiais));
                }

                // Populate equipes
                if (data.equipes.length > 0) {
                    setEquipes(equipesFromDb(data.equipes));
                }

                // Populate outros custos
                if (data.outrosCustos.length > 0) {
                    setOc(outrosCustosFromDb(data.outrosCustos));
                }

                // Populate resumo fixos
                if (data.resumoFixos.length > 0) {
                    setResumoFix(resumoFixosFromDb(data.resumoFixos));
                }

                setDataLoaded(true);
            } catch (err) {
                console.error("Load error:", err);
                setLoadError(err.message || "Erro ao carregar orçamento");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [orcamentoId]);

    // --- Auto-Save ---
    const { saving: savingHeader } = useAutoSave(
        () => salvarOrcamentoHeader(orcamentoId, header),
        header,
        dataLoaded
    );

    const { saving: savingItens } = useAutoSave(
        () => salvarItens(orcamentoId, itens),
        itens,
        dataLoaded
    );

    const { saving: savingMat } = useAutoSave(
        () => salvarMateriais(orcamentoId, matFix),
        matFix,
        dataLoaded
    );

    const { saving: savingEquipes } = useAutoSave(
        () => salvarEquipes(orcamentoId, equipes),
        equipes,
        dataLoaded
    );

    const { saving: savingOc } = useAutoSave(
        () => salvarOutrosCustos(orcamentoId, oc),
        oc,
        dataLoaded
    );

    const { saving: savingResumo } = useAutoSave(
        () => salvarResumoFixos(orcamentoId, resumoFix),
        resumoFix,
        dataLoaded
    );

    const isSaving = savingHeader || savingItens || savingMat || savingEquipes || savingOc || savingResumo;

    // --- Computed Items (with totals per row) ---
    const ci = useMemo(
        () =>
            itens.map((it) => ({
                ...it,
                mT: it.m * it.q,
                moT: it.mo * it.q,
                eT: it.e * it.q,
                tot: (it.m + it.mo + it.e) * it.q,
            })),
        [itens]
    );

    // --- Totals ---
    const tc = useMemo(() => {
        const m = ci.reduce((s, it) => s + it.mT, 0);
        const mo = ci.reduce((s, it) => s + it.moT, 0);
        const e = ci.reduce((s, it) => s + it.eT, 0);
        const hp = ci.reduce((s, it) => s + it.hp * it.q, 0);
        const ha = ci.reduce((s, it) => s + it.ha * it.q, 0);
        return { m, mo, e, t: m + mo + e, hp, ha, ci };
    }, [ci]);

    // --- Total Materials Fix ---
    const tmf = useMemo(() => matFix.reduce((s, m) => s + m.q * m.p, 0), [matFix]);

    // --- Loading / Error States ---
    if (loading) {
        return (
            <>
                <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
                <div
                    style={{
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: COLORS.bg,
                        color: COLORS.textDim,
                        fontFamily: FONTS.sans,
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            border: `3px solid ${COLORS.border}`,
                            borderTopColor: COLORS.accent,
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                        }}
                    />
                    <span>Carregando orçamento...</span>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            </>
        );
    }

    if (loadError) {
        return (
            <>
                <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
                <div
                    style={{
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: COLORS.bg,
                        color: COLORS.red,
                        fontFamily: FONTS.sans,
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <div style={{ fontSize: 62 }}>⚠️</div>
                    <p style={{ fontSize: 20, fontWeight: 600 }}>Erro ao carregar orçamento</p>
                    <p style={{ fontSize: 17, color: COLORS.textDim, maxWidth: 400, textAlign: "center" }}>
                        {loadError}
                    </p>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            onClick={() => router.push("/")}
                            style={{
                                padding: "10px 20px",
                                background: COLORS.surface,
                                border: `1px solid ${COLORS.border}`,
                                borderRadius: 8,
                                color: COLORS.text,
                                cursor: "pointer",
                                fontFamily: FONTS.sans,
                            }}
                        >
                            ← Voltar
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: "10px 20px",
                                background: COLORS.accent,
                                border: "none",
                                borderRadius: 8,
                                color: COLORS.bg,
                                cursor: "pointer",
                                fontWeight: 700,
                                fontFamily: FONTS.sans,
                            }}
                        >
                            Tentar novamente
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // --- Render ---
    return (
        <>
            <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
            <div
                style={{
                    display: "flex",
                    height: "100vh",
                    background: COLORS.bg,
                    color: COLORS.text,
                    fontFamily: FONTS.sans,
                }}
            >
                <Sidebar
                    tab={tab}
                    setTab={setTab}
                    itensCount={itens.length}
                    tc={tc}
                    onBack={() => router.push("/")}
                    isSaving={isSaving}
                    orcamentoNome={header.nome}
                />

                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: 16,
                    }}
                >
                    {tab === "importar" && (
                        <TabImportar
                            setTab={setTab}
                        />
                    )}
                    {tab === "custo" && (
                        <TabCusto
                            ci={ci}
                            tc={tc}
                            setTab={setTab}
                        />
                    )}
                    {tab === "materiais" && (
                        <TabMateriais
                            tmf={tmf}
                        />
                    )}
                    {tab === "histograma" && (
                        <TabHistograma
                            tc={tc}
                            oc={oc}
                        />
                    )}
                    {tab === "simulacoes" && (
                        <TabSimulacoes
                            totalMatDireto={tc.m + tmf}
                            totalMODireto={tc.mo}
                        />
                    )}
                    {tab === "consolidacao" && (
                        <TabConsolidacao
                            tc={tc}
                            tmf={tmf}
                            oc={oc}
                        />
                    )}
                    {tab === "resumo" && (
                        <TabResumo
                            tc={tc}
                            tmf={tmf}
                            oc={oc}
                        />
                    )}
                    {tab === "memorial" && (
                        <TabMemorial
                            tc={tc}
                            tmf={tmf}
                            oc={oc}
                        />
                    )}
                    {tab === "abc" && (
                        <TabABC ci={ci} tc={tc} />
                    )}
                    {tab === "ev" && (
                        <TabEV ci={ci} tc={tc} />
                    )}
                    {tab === "exportar" && (
                        <TabExportar
                            ci={ci}
                            tc={tc}
                            tmf={tmf}
                            oc={oc}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
