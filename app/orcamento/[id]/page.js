"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { COLORS, FONTS, GOOGLE_FONTS_URL, DEFAULT_HEADER, DEFAULT_MAT_FIX, DEFAULT_EQUIPES, DEFAULT_OUTROS_CUSTOS, DEFAULT_RESUMO_FIX } from "@/lib/constants";
import { parseComposition } from "@/lib/parser";
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
    const [header, setHeader] = useState({ ...DEFAULT_HEADER });
    const [itens, setItens] = useState([]);
    const [compText, setCompText] = useState("");
    const [parsed, setParsed] = useState(null);
    const [editP, setEditP] = useState(null);
    const [impHist, setImpHist] = useState([]);
    const [matFix, setMatFix] = useState([...DEFAULT_MAT_FIX]);
    const [equipes, setEquipes] = useState(
        DEFAULT_EQUIPES.map((g) => ({ ...g, l: g.l.map((f) => ({ ...f })) }))
    );
    const [oc, setOc] = useState([...DEFAULT_OUTROS_CUSTOS]);
    const [resumoFix, setResumoFix] = useState([...DEFAULT_RESUMO_FIX]);

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

    // --- Actions ---
    const doParse = useCallback(() => {
        const result = parseComposition(compText);
        if (result && result.parsed) {
            setParsed(result);
            setEditP({ ...result });
        } else {
            setParsed(null);
            setEditP(null);
            alert("Não foi possível extrair dados. Verifique se o texto está no formato V4 completo.");
        }
    }, [compText]);

    const confirmImport = useCallback(() => {
        if (!editP) return;
        const newItem = {
            id: Date.now().toString(),
            n: editP.codigo || `C${itens.length + 1}`,
            d: editP.titulo || "Composição importada",
            u: editP.unidade || "m²",
            q: 1,
            m: editP.mat,
            mo: editP.mo,
            e: editP.eq,
            hp: editP.hhp,
            ha: editP.hha,
            composicao_raw: compText, // Salva composição completa (todas as 7 seções)
        };
        setItens((p) => [...p, newItem]);
        setImpHist((p) => [...p, { ...editP }]);
        setParsed(null);
        setEditP(null);
        setCompText("");
        setTab("custo");
    }, [editP, itens.length, compText]);

    const addI = useCallback(() => {
        setItens((p) => [
            ...p,
            {
                id: Date.now().toString(),
                n: "",
                d: "",
                u: "m²",
                q: 0,
                m: 0,
                mo: 0,
                e: 0,
                hp: 0,
                ha: 0,
            },
        ]);
    }, []);

    const uI = useCallback((id, key, val) => {
        setItens((p) => p.map((it) => (it.id === id ? { ...it, [key]: val } : it)));
    }, []);

    const dI = useCallback((id) => {
        setItens((p) => p.filter((it) => it.id !== id));
    }, []);

    const addMF = useCallback(() => {
        setMatFix((p) => [
            ...p,
            { id: "f" + Date.now(), n: "", i: "", u: "un", q: 1, p: 0 },
        ]);
    }, []);

    const dMF = useCallback((id) => {
        setMatFix((p) => p.filter((x) => x.id !== id));
    }, []);

    const addOC = useCallback(() => {
        setOc((p) => [...p, { id: "o" + Date.now(), d: "", u: "un", q: 0, v: 0 }]);
    }, []);

    const dOC = useCallback((id) => {
        setOc((p) => p.filter((x) => x.id !== id));
    }, []);

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
                    <div style={{ fontSize: 48 }}>⚠️</div>
                    <p style={{ fontSize: 16, fontWeight: 600 }}>Erro ao carregar orçamento</p>
                    <p style={{ fontSize: 13, color: COLORS.textDim, maxWidth: 400, textAlign: "center" }}>
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
                            compText={compText}
                            setCompText={setCompText}
                            parsed={parsed}
                            editP={editP}
                            setEditP={setEditP}
                            doParse={doParse}
                            confirmImport={confirmImport}
                            impHist={impHist}
                            setParsed={setParsed}
                        />
                    )}
                    {tab === "custo" && (
                        <TabCusto
                            header={header}
                            setHeader={setHeader}
                            ci={ci}
                            tc={tc}
                            itens={itens}
                            setTab={setTab}
                            addI={addI}
                            uI={uI}
                            dI={dI}
                        />
                    )}
                    {tab === "materiais" && (
                        <TabMateriais
                            matFix={matFix}
                            setMatFix={setMatFix}
                            tmf={tmf}
                            addMF={addMF}
                            dMF={dMF}
                        />
                    )}
                    {tab === "histograma" && (
                        <TabHistograma
                            equipes={equipes}
                            setEquipes={setEquipes}
                            tc={tc}
                            oc={oc}
                            setOc={setOc}
                            addOC={addOC}
                            dOC={dOC}
                            itens={itens}
                        />
                    )}
                    {tab === "simulacoes" && (
                        <TabSimulacoes
                            totalMatDireto={tc.m + tmf}
                            totalMODireto={tc.mo}
                        />
                    )}
                    {tab === "resumo" && (
                        <TabResumo
                            resumoFix={resumoFix}
                            setResumoFix={setResumoFix}
                            tc={tc}
                            tmf={tmf}
                            equipes={equipes}
                            oc={oc}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
