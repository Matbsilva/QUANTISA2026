import "./globals.css";
import Providers from "./Providers";

export const metadata = {
  title: "QUANTISA Orçamento",
  description: "Sistema de orçamentação para engenharia civil — Quantisa v4",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
