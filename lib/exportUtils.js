/**
 * Shared export utilities for all tabs.
 * Provides CSV and XLSX export for any data table.
 */
import * as XLSX from "xlsx";

/**
 * Export data as CSV with BOM for Excel compatibility.
 * @param {string[][]} rows - Array of rows, each row is array of cell values
 * @param {string} filename - Name of the file (without extension)
 * @param {string} [separator=";"] - Column separator
 */
export function exportCSV(rows, filename, separator = ";") {
    const BOM = "\uFEFF";
    const csv = BOM + rows.map(r => r.map(c => `"${c}"`).join(separator)).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Export data as XLSX with multiple sheets.
 * @param {{ name: string, data: any[][], cols?: {wch: number}[] }[]} sheets - Array of sheet configs
 * @param {string} filename - Name of the file (without extension)
 */
export function exportXLSX(sheets, filename) {
    const wb = XLSX.utils.book_new();
    sheets.forEach(({ name, data, cols }) => {
        const ws = XLSX.utils.aoa_to_sheet(data);
        if (cols) ws["!cols"] = cols;
        XLSX.utils.book_append_sheet(wb, ws, name);
    });
    XLSX.writeFile(wb, `${filename}.xlsx`);
}
