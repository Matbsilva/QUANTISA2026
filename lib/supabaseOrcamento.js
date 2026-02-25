import { supabase } from "./supabase";

// ============================================
// QUANTISA — Supabase CRUD Operations
// ============================================

// --- Orçamentos ---

export async function listarOrcamentos() {
    const { data, error } = await supabase
        .from("orcamentos")
        .select("*")
        .order("updated_at", { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function criarOrcamento({ nome, cliente }) {
    const { data, error } = await supabase
        .from("orcamentos")
        .insert({ nome, cliente })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function carregarOrcamento(id) {
    const { data: orc, error: orcErr } = await supabase
        .from("orcamentos")
        .select("*")
        .eq("id", id)
        .single();
    if (orcErr) throw orcErr;

    const [itens, materiais, equipes, outrosCustos, simulacoes, resumoFixos] =
        await Promise.all([
            supabase.from("orcamento_itens").select("*").eq("orcamento_id", id).order("ordem"),
            supabase.from("orcamento_materiais").select("*").eq("orcamento_id", id).order("ordem"),
            supabase.from("orcamento_equipes").select("*, orcamento_equipe_linhas(*)").eq("orcamento_id", id).order("ordem"),
            supabase.from("orcamento_outros_custos").select("*").eq("orcamento_id", id),
            supabase.from("orcamento_simulacoes").select("*").eq("orcamento_id", id),
            supabase.from("orcamento_resumo_fixos").select("*").eq("orcamento_id", id).order("ordem"),
        ]);

    return {
        orcamento: orc,
        itens: itens.data || [],
        materiais: materiais.data || [],
        equipes: (equipes.data || []).map((eq) => ({
            ...eq,
            linhas: eq.orcamento_equipe_linhas || [],
        })),
        outrosCustos: outrosCustos.data || [],
        simulacoes: simulacoes.data || [],
        resumoFixos: resumoFixos.data || [],
    };
}

export async function excluirOrcamento(id) {
    const { error } = await supabase.from("orcamentos").delete().eq("id", id);
    if (error) throw error;
}

export async function salvarOrcamentoHeader(id, header) {
    const { error } = await supabase
        .from("orcamentos")
        .update({
            nome: header.nome,
            cliente: header.cliente,
            proponente: header.prop,
            data: header.data,
            revisao: header.rev,
            updated_at: new Date().toISOString(),
        })
        .eq("id", id);
    if (error) throw error;
}

// --- Itens de Custo ---

export async function salvarItens(orcamentoId, itens) {
    // Delete existing items and re-insert (simpler than upsert for reorder)
    await supabase.from("orcamento_itens").delete().eq("orcamento_id", orcamentoId);

    if (itens.length === 0) return;

    const rows = itens.map((it, idx) => ({
        orcamento_id: orcamentoId,
        numero: it.n,
        descricao: it.d,
        unidade: it.u,
        quantidade: it.q || 0,
        mat_unitario: it.m || 0,
        mo_unitario: it.mo || 0,
        equip_unitario: it.e || 0,
        hh_prof: it.hp || 0,
        hh_aju: it.ha || 0,
        composicao_raw: it.composicao_raw || null,
        ordem: idx,
    }));

    const { error } = await supabase.from("orcamento_itens").insert(rows);
    if (error) throw error;
}

// --- Materiais ---

export async function salvarMateriais(orcamentoId, materiais) {
    await supabase.from("orcamento_materiais").delete().eq("orcamento_id", orcamentoId);

    if (materiais.length === 0) return;

    const rows = materiais.map((m, idx) => ({
        orcamento_id: orcamentoId,
        numero: m.n,
        insumo: m.i,
        unidade: m.u,
        quantidade: m.q || 0,
        preco_unitario: m.p || 0,
        tipo: m.tipo || "fixo",
        justificativa: m.justificativa || null,
        peso_unitario: m.peso || 0,
        ordem: idx,
    }));

    const { error } = await supabase.from("orcamento_materiais").insert(rows);
    if (error) throw error;
}

// --- Equipes ---

export async function salvarEquipes(orcamentoId, equipes) {
    // Get existing equipe IDs to cascade delete their lines
    const { data: existing } = await supabase
        .from("orcamento_equipes")
        .select("id")
        .eq("orcamento_id", orcamentoId);

    if (existing && existing.length > 0) {
        await supabase
            .from("orcamento_equipes")
            .delete()
            .eq("orcamento_id", orcamentoId);
    }

    if (equipes.length === 0) return;

    for (let idx = 0; idx < equipes.length; idx++) {
        const eq = equipes[idx];
        const { data: eqRow, error: eqErr } = await supabase
            .from("orcamento_equipes")
            .insert({
                orcamento_id: orcamentoId,
                grupo: eq.g,
                ordem: idx,
            })
            .select()
            .single();

        if (eqErr) throw eqErr;

        if (eq.l && eq.l.length > 0) {
            const linhas = eq.l.map((l, lIdx) => ({
                equipe_id: eqRow.id,
                funcao: l.f,
                diaria: l.d || 0,
                pessoas: l.p || 1,
                dias: l.di || 0,
                ordem: lIdx,
            }));

            const { error: lErr } = await supabase
                .from("orcamento_equipe_linhas")
                .insert(linhas);
            if (lErr) throw lErr;
        }
    }
}

// --- Outros Custos ---

export async function salvarOutrosCustos(orcamentoId, custos) {
    await supabase.from("orcamento_outros_custos").delete().eq("orcamento_id", orcamentoId);

    if (custos.length === 0) return;

    const rows = custos.map((c) => ({
        orcamento_id: orcamentoId,
        descricao: c.d,
        unidade: c.u,
        quantidade: c.q || 0,
        valor_unitario: c.v || 0,
    }));

    const { error } = await supabase.from("orcamento_outros_custos").insert(rows);
    if (error) throw error;
}

// --- Simulações ---

export async function salvarSimulacoes(orcamentoId, bdiMo, bdiMat, mixPercentual) {
    await supabase.from("orcamento_simulacoes").delete().eq("orcamento_id", orcamentoId);

    const rows = [
        {
            orcamento_id: orcamentoId,
            tipo: "mo",
            ac: bdiMo.ac || 0,
            cf: bdiMo.cf || 0,
            mi: bdiMo.mi || 0,
            tm: bdiMo.tm || 27,
            te: bdiMo.te || 0,
            tf: bdiMo.tf || 0,
            lucro: bdiMo.lc || 32,
            mix_percentual: mixPercentual || 50,
        },
        {
            orcamento_id: orcamentoId,
            tipo: "material",
            ac: bdiMat.ac || 0,
            cf: bdiMat.cf || 0,
            mi: bdiMat.mi || 0,
            tm: bdiMat.tm || 13,
            te: bdiMat.te || 0,
            tf: bdiMat.tf || 0,
            lucro: bdiMat.lc || 32,
            mix_percentual: 0,
        },
    ];

    const { error } = await supabase.from("orcamento_simulacoes").insert(rows);
    if (error) throw error;
}

// --- Resumo Fixos ---

export async function salvarResumoFixos(orcamentoId, fixos) {
    await supabase.from("orcamento_resumo_fixos").delete().eq("orcamento_id", orcamentoId);

    if (fixos.length === 0) return;

    const rows = fixos.map((f, idx) => ({
        orcamento_id: orcamentoId,
        numero: f.n,
        descricao: f.d,
        unidade: f.u,
        quantidade: f.q || 0,
        valor_unitario: f.v || 0,
        ordem: idx,
    }));

    const { error } = await supabase.from("orcamento_resumo_fixos").insert(rows);
    if (error) throw error;
}

// --- Helpers for loading data back into app state ---

export function itensFromDb(rows) {
    return rows.map((r) => ({
        id: r.id,
        n: r.numero || "",
        d: r.descricao || "",
        u: r.unidade || "m²",
        q: Number(r.quantidade) || 0,
        m: Number(r.mat_unitario) || 0,
        mo: Number(r.mo_unitario) || 0,
        e: Number(r.equip_unitario) || 0,
        hp: Number(r.hh_prof) || 0,
        ha: Number(r.hh_aju) || 0,
        composicao_raw: r.composicao_raw || null,
    }));
}

export function materiaisFromDb(rows) {
    return rows.map((r) => ({
        id: r.id,
        n: r.numero || "",
        i: r.insumo || "",
        u: r.unidade || "un",
        q: Number(r.quantidade) || 0,
        p: Number(r.preco_unitario) || 0,
        tipo: r.tipo || "fixo",
        justificativa: r.justificativa || "",
        peso: Number(r.peso_unitario) || 0,
    }));
}

export function equipesFromDb(rows) {
    return rows.map((r) => ({
        id: r.id,
        g: r.grupo,
        l: (r.linhas || []).map((l) => ({
            f: l.funcao || "",
            d: Number(l.diaria) || 0,
            p: Number(l.pessoas) || 1,
            di: Number(l.dias) || 0,
        })),
    }));
}

export function outrosCustosFromDb(rows) {
    return rows.map((r) => ({
        id: r.id,
        d: r.descricao || "",
        u: r.unidade || "un",
        q: Number(r.quantidade) || 0,
        v: Number(r.valor_unitario) || 0,
    }));
}

export function simulacoesFromDb(rows) {
    const mo = rows.find((r) => r.tipo === "mo") || {};
    const mat = rows.find((r) => r.tipo === "material") || {};
    return {
        bdiMo: {
            ac: Number(mo.ac) || 0,
            cf: Number(mo.cf) || 0,
            mi: Number(mo.mi) || 0,
            tm: Number(mo.tm) || 27,
            te: Number(mo.te) || 0,
            tf: Number(mo.tf) || 0,
            lc: Number(mo.lucro) || 32,
        },
        bdiMat: {
            ac: Number(mat.ac) || 0,
            cf: Number(mat.cf) || 0,
            mi: Number(mat.mi) || 0,
            tm: Number(mat.tm) || 13,
            te: Number(mat.te) || 0,
            tf: Number(mat.tf) || 0,
            lc: Number(mat.lucro) || 32,
        },
        mixPercentual: Number(mo.mix_percentual) || 50,
    };
}

export function resumoFixosFromDb(rows) {
    return rows.map((r) => ({
        id: r.id,
        n: r.numero || "",
        d: r.descricao || "",
        u: r.unidade || "un",
        q: Number(r.quantidade) || 0,
        v: Number(r.valor_unitario) || 0,
    }));
}
