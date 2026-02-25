"use client";
import { useState, useMemo, useCallback } from "react";
import { COLORS, DEFAULT_HEADER, DEFAULT_MAT_FIX, DEFAULT_EQUIPES, DEFAULT_OUTROS_CUSTOS, DEFAULT_RESUMO_FIX } from "@/lib/constants";
import { parseComposition } from "@/lib/parser";
import Sidebar from "@/components/Sidebar";
import TabImportar from "@/components/TabImportar";
import TabCusto from "@/components/TabCusto";
import TabMateriais from "@/components/TabMateriais";
import TabHistograma from "@/components/TabHistograma";
import TabSimulacoes from "@/components/TabSimulacoes";
import TabResumo from "@/components/TabResumo";

export default function Home() {
  // --- State ---
  const [tab, setTab] = useState("custo");
  const [header, setHeader] = useState({ ...DEFAULT_HEADER });
  const [itens, setItens] = useState([]);
  const [compText, setCompText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [editP, setEditP] = useState(null);
  const [impHist, setImpHist] = useState([]);
  const [matFix, setMatFix] = useState([...DEFAULT_MAT_FIX]);
  const [equipes, setEquipes] = useState(DEFAULT_EQUIPES.map((g) => ({ ...g, l: g.l.map((f) => ({ ...f })) })));
  const [oc, setOc] = useState([...DEFAULT_OUTROS_CUSTOS]);
  const [resumoFix, setResumoFix] = useState([...DEFAULT_RESUMO_FIX]);

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
    };
    setItens((p) => [...p, newItem]);
    setImpHist((p) => [...p, { ...editP }]);
    setParsed(null);
    setEditP(null);
    setCompText("");
    setTab("custo");
  }, [editP, itens.length]);

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

  // --- Render ---
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
      }}
    >
      <Sidebar
        tab={tab}
        setTab={setTab}
        itensCount={itens.length}
        tc={tc}
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
  );
}
