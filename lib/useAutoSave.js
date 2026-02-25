"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Hook de auto-save com debounce.
 * Salva dados no Supabase após 1.5s de inatividade.
 * 
 * @param {Function} saveFn - Async function que executa o save
 * @param {any} data - Dados a serem salvos (useEffect tracked)
 * @param {boolean} enabled - Se true, o auto-save está ativo
 * @returns {{ saving: boolean, lastSaved: Date|null, error: string|null }}
 */
export function useAutoSave(saveFn, data, enabled = true) {
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [error, setError] = useState(null);
    const isFirstRender = useRef(true);
    const timerRef = useRef(null);

    useEffect(() => {
        // Skip first render (loading data from DB)
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (!enabled) return;

        // Clear previous timer
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // Set new timer
        timerRef.current = setTimeout(async () => {
            try {
                setSaving(true);
                setError(null);
                await saveFn();
                setLastSaved(new Date());
            } catch (err) {
                console.error("Auto-save error:", err);
                setError(err.message || "Erro ao salvar");
            } finally {
                setSaving(false);
            }
        }, 1500);

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [JSON.stringify(data), enabled]);

    return { saving, lastSaved, error };
}
