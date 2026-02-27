import { create } from 'zustand';
import { DEFAULT_HEADER, DEFAULT_MAT_FIX, DEFAULT_EQUIPES, DEFAULT_OUTROS_CUSTOS, DEFAULT_RESUMO_FIX } from './constants';

export const useStore = create((set) => ({
    header: { ...DEFAULT_HEADER },
    setHeader: (newHeader) => set((state) => ({
        header: typeof newHeader === 'function' ? newHeader(state.header) : newHeader
    })),

    itens: [],
    setItens: (newItens) => set((state) => ({
        itens: typeof newItens === 'function' ? newItens(state.itens) : newItens
    })),

    matFix: [...DEFAULT_MAT_FIX],
    setMatFix: (newMatFix) => set((state) => ({
        matFix: typeof newMatFix === 'function' ? newMatFix(state.matFix) : newMatFix
    })),

    equipes: DEFAULT_EQUIPES.map((g) => ({ ...g, l: g.l.map((f) => ({ ...f })) })),
    setEquipes: (newEquipes) => set((state) => ({
        equipes: typeof newEquipes === 'function' ? newEquipes(state.equipes) : newEquipes
    })),

    oc: [...DEFAULT_OUTROS_CUSTOS],
    setOc: (newOc) => set((state) => ({
        oc: typeof newOc === 'function' ? newOc(state.oc) : newOc
    })),

    resumoFix: [...DEFAULT_RESUMO_FIX],
    setResumoFix: (newResumoFix) => set((state) => ({
        resumoFix: typeof newResumoFix === 'function' ? newResumoFix(state.resumoFix) : newResumoFix
    })),

    // --- Actions for Itens ---
    addI: () => set((state) => ({
        itens: [
            ...state.itens,
            { id: Date.now().toString(), n: "", d: "", u: "m²", q: 0, m: 0, mo: 0, e: 0, hp: 0, ha: 0 }
        ]
    })),
    uI: (id, key, val) => set((state) => ({
        itens: state.itens.map((it) => (it.id === id ? { ...it, [key]: val } : it))
    })),
    dI: (id) => set((state) => ({
        itens: state.itens.filter((it) => it.id !== id)
    })),
    batchImport: (newItems) => set((state) => ({
        itens: [...state.itens, ...newItems]
    })),

    // --- Actions for Materiais Fixos ---
    addMF: () => set((state) => ({
        matFix: [...state.matFix, { id: "f" + Date.now(), n: "", i: "", u: "un", q: 1, p: 0 }]
    })),
    dMF: (id) => set((state) => ({
        matFix: state.matFix.filter((x) => x.id !== id)
    })),

    // --- Actions for Outros Custos ---
    addOC: () => set((state) => ({
        oc: [...state.oc, { id: "o" + Date.now(), d: "", u: "un", q: 0, v: 0 }]
    })),
    dOC: (id) => set((state) => ({
        oc: state.oc.filter((x) => x.id !== id)
    }))
}));
