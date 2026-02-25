import "./globals.css";

export const metadata = {
  title: "QUANTISA Orçamento",
  description: "Sistema de orçamentação para engenharia civil — Quantisa v4",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
