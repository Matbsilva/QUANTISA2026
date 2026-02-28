# 📚 BIBLIOTECA CENTRAL DE INSUMOS - V7

*Concentrado de todos os insumos (Materiais, Equipamentos e Mão de Obra) referenciados pelas Composições Modelo.*
*Última atualização: Fevereiro/2026*

> **📌 CHANGELOG v7 (26/02/2026):**
> - ✅ **ATUALIZADO** Rodapé Poliestireno Santa Luzia: R$ 37,00 → **R$ 28,00**/ml (correção de preço)
> - ✅ **ADICIONADO** 47 novos insumos em 9 grupos (versão completa do mercado SP Fev/2026)
> - ✅ **GR. 1** Cerâmica/Porcelanato: Cerâmica 30×30, Porcelanato 60×60, AC-II, AC-III, Rejuntes
> - ✅ **GR. 2** Pinturas: Tintas corrigidas (PVA R$160, Premium Acrílica R$460), Selador, Massas, Tinta Epóxi, consumoíveis
> - ✅ **GR. 3** Drywall/Gesso: Placas ST/RU, Perfis, Massa Junta, Fita Papel
> - ✅ **GR. 4** Argamassas: Reboco, Contrapiso, Cal CH-III, Concreto R$390/m³, Brita 0
> - ✅ **GR. 5** Impermeabilização: Cristalizante, Primer Asfáltico, Manta 3mm (R$380,00 real)
> - ✅ **GR. 6** Demolição: Caçamba, Big Bag, Lona, Disco Diamantado
> - ✅ **GR. 7** Conduites/Fixação: Conduinte Tigreflex, Parafusos, Fita Silver, Spray Silicone
> - ✅ **GR. 8** M.O.: Azulejista, Gesseiro, Pintor, Encarregado, Eletricista
> - ✅ **GR. 9** Equipamentos: Cavalete, Compactador Sapo, Lixadeira, Aspirador
> - ✅ **MANTIDOS** todos os insumos da v6 sem alterações (exceto Rodapé)

---

## ⚠️ INSTRUÇÃO DE USO DA COLUNA "DATA FONTE" (mantida desde v4.1)

> **Para a IA (instrução obrigatória ao carregar esta biblioteca):**
> Ao utilizar qualquer insumo desta biblioteca, verificar a coluna `Data Fonte`.
> - Se `Data Fonte` for **≤90 dias** da data atual → usar o preço normalmente
> - Se `Data Fonte` for **>90 dias** da data atual → emitir o seguinte alerta antes de usar:
>
> ```
> ⚠️ ALERTA DE PREÇO DESATUALIZADO
> Insumo: [Nome do Insumo]
> Preço na biblioteca: R$ [X]
> Data de referência: [Data Fonte]
> Defasagem estimada: ~[N] meses
> Índice de correção sugerido: INCC-M ou IPC-FIPE (inflação SP ~6-8%/ano)
> Recomendação: Consultar cotação de mercado atual antes de usar este preço.
> ```

---

| Categoria | Descrição do Insumo | Unid | Preço Unitário | Data Fonte | Origens/Ocorrências em Composições |
|---|---|---|---|---|---|
| **Equip** | Andaime Tubular (Locação + Montagem) | diária | **R$ 60,00** | Fev/2026 | insumos-base.json (Cliente) |
| **Equip** | Andaime Tubular (Locação) | m²/mês | **R$ 15,00** | Fev/2026 | Encontrado em: REV-PAR-EMB.md |
| **Equip** | Andaime Tubular/Fachadeiro (Locação) | m²/mês | **R$ 15,00** | Fev/2026 | Encontrado em: DEM-DW-350.md, DEM-FORRO-350.md |
| **Equip** | Betoneira 400L | diária | **R$ 120,00** | Fev/2026 | Encontrado em: MUR-CNT-14-01.md |
| **Equip** | Betoneira 400L (Locação rateio) | diária | **R$ 120,00** | Fev/2026 | Encontrado em: REG-PISO-4CM.md, REV-PAR-EMB.md, SOC-MAC-EPS.md, SOC-VAZ-TIJ.md |
| **Equip** | Betoneira 400L (Locação) | diária | **R$ 120,00** | Fev/2026 | Encontrado em: CONTR-ARM-5CM-01.md, PIS-ENCH-ARG-20.md, PIS-ENCH-ARG-25.md |
| **Equip** | Carrinho Plataforma 600kg | diária | **R$ 30,00** | Fev/2026 | Encontrado em: LOG-ENT-ENSAC-100.md, LOG-MAT-TRANSP-100.md |
| **Equip** | Cortador Porcelanato Grande | diária | **R$ 90,00** | Fev/2026 | insumos-base.json (Manual) |
| **Equip** | Ferramentas Manuais (desgaste) | vb | **R$ 10,00** | Fev/2026 | Encontrado em: CONTR-ARM-5CM-01.md, DEM-DW-350.md, DEM-FORRO-350.md, INF-CRT-PAR-15X15.md, INF-CRT-PIS-20X15.md, MUR-BLC-14-01.md, MUR-CNT-14-01.md, REG-PISO-4CM.md, REV-PAR-EMB.md, SOC-MAC-EPS.md, SOC-VAZ-TIJ.md |
| **Equip** | Ferramentas Manuais (Desgaste/Pás) | vb | **R$ 10,00** | Fev/2026 | Encontrado em: DEM-CONTRAPISO.md |
| **Equip** | Ferramentas Manuais (Desgaste/Ponteiras) | vb | **R$ 10,00** | Fev/2026 | Encontrado em: DEM-CER-PAR.md |
| **Equip** | Ferramentas Manuais (Gabarito + esponja) | vb | **R$ 13,60** | Fev/2026 | Encontrado em: IMP-PREP-MEIACANA-01.md |
| **Equip** | Ferramentas Manuais (Ponteiras/Pás) | vb | **R$ 10,00** | Fev/2026 | Encontrado em: DEM-PISO-CER.md |
| **Equip** | Ferramentas Manuais (Rateio desgaste) | vb | **R$ 10,00** | Fev/2026 | Encontrado em: PIS-ENCH-ARG-20.md, PIS-ENCH-ARG-25.md |
| **Equip** | Furadeira + Hélice Misturadora | vb | **R$ 50,75** | Fev/2026 | Encontrado em: IMP-VIAP-7000-01.md |
| **Equip** | Iluminação LED Portátil (Rateio diária) | diária | **R$ 20,00** | Fev/2026 | Encontrado em: DEM-FORRO-350.md |
| **Equip** | Iluminação LED Portátil (Rateio) | diária | **R$ 20,00** | Fev/2026 | Encontrado em: DEM-CER-PAR.md, DEM-CONTRAPISO.md, DEM-DW-350.md, DEM-PISO-CER.md |
| **Equip** | Maçarico de alta potência | diária | **R$ 80,00** | Fev/2026 | insumos-base.json (Manual) |
| **Equip** | Martelete Rompedor 10/15kg | diária | **R$ 120,00** | Fev/2026 | Encontrado em: INF-CRT-PAR-15X15.md, INF-CRT-PIS-20X15.md |
| **Equip** | Martelete Rompedor 10/15kg (Locação) | diária | **R$ 120,00** | Fev/2026 | Encontrado em: DEM-CONTRAPISO.md |
| **Equip** | Martelete Rompedor 10kg | diária | **R$ 120,00** | Fev/2026 | Encontrado em: MUR-CNT-14-01.md |
| **Equip** | Martelete Rompedor 10kg (Locação) | diária | **R$ 120,00** | Fev/2026 | Encontrado em: DEM-PISO-CER.md |
| **Equip** | Martelete Rompedor Leve (Locação) | diária | **R$ 120,00** | Fev/2026 | Encontrado em: DEM-CER-PAR.md |
| **Equip** | Nível Laser (Locação) | diária | **R$ 80,00** | Fev/2026 | Encontrado em: CONTR-ARM-5CM-01.md |
| **Equip** | Pás / Ferramentas de Carga | vb | **R$ 10,00** | Fev/2026 | Encontrado em: LOG-ENT-ENSAC-100.md |
| **Equip** | Serra Mármore + Disco Diamantado | diária | **R$ 60,00** | Fev/2026 | Encontrado em: INF-CRT-PAR-15X15.md, INF-CRT-PIS-20X15.md |
| **Mat** | Adesivo Epóxi (Sikadur 31 - lata 1kg) | lata | **R$ 100,00** | Fev/2026 | Encontrado em: MUR-CNT-14-01.md |
| **Mat** | Adesivo Estrutural Epóxi (Kit) | kit | **R$ 103,50** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | Aditivo Adesivo (Bianco) | L | **R$ 25,00** | Fev/2026 | Encontrado em: CONTR-ARM-5CM-01.md |
| **Mat** | Aditivo Adesivo (Tipo Bianco) | L | **R$ 25,00** | Fev/2026 | Encontrado em: IMP-PREP-MEIACANA-01.md, PIS-ENCH-ARG-20.md, PIS-ENCH-ARG-25.md |
| **Mat** | Areia Fina (20kg) | saco | **R$ 6,00** | Fev/2026 | insumos-base.json (Modelo / Manual) |
| **Mat** | Areia Média Lavada | kg | **R$ 0,28** | Fev/2026 | Encontrado em: IMP-PREP-MEIACANA-01.md |
| **Mat** | Areia Média Lavada (20kg saco) | saco | **R$ 5,50** | Fev/2026 | Encontrado em: CONTR-ARM-5CM-01.md, PIS-ENCH-ARG-20.md, PIS-ENCH-ARG-25.md |
| **Mat** | Areia Média Lavada (20kg) | saco | **R$ 5,50** | Fev/2026 | Encontrado em: MUR-BLC-14-01.md |
| **Mat** | Areia Média Lavada (Saco 20kg) | saco | **R$ 5,50** | Fev/2026 | Encontrado em: INF-CRT-PAR-15X15.md, INF-CRT-PIS-20X15.md, MUR-CNT-14-01.md, REG-PISO-4CM.md, REV-PAR-EMB.md, SOC-MAC-EPS.md, SOC-VAZ-TIJ.md |
| **Mat** | Argamassa Autonivelante (20kg) | saco | **R$ 95,00** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | Argamassa Colante AC-III | kg | **R$ 1,90** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | Argamassa Pronta Matrix 4201 (40kg) | saco | **R$ 28,00** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | Bloco Canaleta Concreto 14×19×39cm | un | **R$ 5,50** | Fev/2026 | Encontrado em: MUR-CNT-14-01.md |
| **Mat** | Bloco Canaleta de Concreto (14x19x39cm) | un | **R$ 5,50** | Fev/2026 | insumos-base.json (Cliente) |
| **Mat** | Bloco Concreto Celular (60x30x10cm) | un | **R$ 16,90** | Fev/2026 | Obramax / Leroy Merlin (Enchimento Leve Siporex) |
| **Mat** | Bloco Concreto Celular (60x30x7,5cm) | un | **R$ 13,50** | Fev/2026 | Obramax / Sodimac (Ajuste de altura Siporex) |
| **Mat** | Bloco Concreto Vazado 14×19×39cm | un | **R$ 4,50** | Fev/2026 | Encontrado em: MUR-BLC-14-01.md |
| **Mat** | Bloco de Concreto (14x19x39cm) | un | **R$ 4,50** | Fev/2026 | Encontrado em: SOC-MAC-EPS.md |
| **Mat** | Bloco de Concreto Vazado (14x19x39cm) | un | **R$ 4,50** | Fev/2026 | insumos-base.json (Cliente) |
| **Mat** | Cimento Portland CP-II (50kg) | saco | **R$ 34,00** | Fev/2026 | Encontrado em: CONTR-ARM-5CM-01.md, INF-CRT-PAR-15X15.md, INF-CRT-PIS-20X15.md, MUR-BLC-14-01.md, MUR-CNT-14-01.md, PIS-ENCH-ARG-20.md, PIS-ENCH-ARG-25.md, REG-PISO-4CM.md, REV-PAR-EMB.md, SOC-MAC-EPS.md, SOC-VAZ-TIJ.md |
| **Mat** | Cimento Portland CP-II (50kg) | kg | **R$ 0,68** | Fev/2026 | Encontrado em: IMP-PREP-MEIACANA-01.md |
| **Mat** | EPS Isolamento Térmico T1F | m² | **R$ 39,00** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | EPS Reciclado (100mm) | m² | **R$ 24,00** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | EPS T2 Alta Densidade (100mm equiv.) | m² | **R$ 45,00** | Fev/2026 | Encontrado em: PIS-ENCH-ARG-20.md, PIS-ENCH-ARG-25.md |
| **Mat** | EPS T2 Alta Densidade (15cm) | m² | **R$ 67,50** | Fev/2026 | Encontrado em: SOC-MAC-EPS.md |
| **Mat** | EPS T2 Alta Densidade 5cm (Placa 1x1m) | un | **R$ 22,50** | Fev/2026 | Cotação Anexo (Fev/2026) |
| **Mat** | EPS T2 Alta Densidade 7cm (Placa 1x1m) | un | **R$ 31,50** | Fev/2026 | Cotação Anexo (Fev/2026) |
| **Mat** | EPS T2 Alta Densidade 10cm (Placa 1x1m) | un | **R$ 45,00** | Fev/2026 | Cotação Anexo (Fev/2026) |
| **Mat** | EPS T2 Alta Densidade 11cm (Placa 1x1m) | un | **R$ 49,50** | Fev/2026 | Cotação Anexo (Fev/2026) |
| **Mat** | EPS T2 Alta Densidade 12cm (Placa 1x1m) | un | **R$ 54,00** | Fev/2026 | Cotação Anexo (Fev/2026) |
| **Mat** | EPS T2 Alta Densidade 20cm (Placa 1x1m) | un | **R$ 90,00** | Fev/2026 | Cotação Anexo (Fev/2026) |
| **Mat** | EPS T3 Alta Densidade 8cm (Placa 1x1m) | un | **R$ 44,00** | Fev/2026 | Cotação MOPE EPS (Fev/2026) |
| **Mat** | EPS T3 Alta Densidade 10cm (Placa 1x1m) | un | **R$ 55,00** | Fev/2026 | Cotação MOPE EPS (Fev/2026) |
| **Mat** | EPS T3 Alta Densidade 13cm (Placa 1x1m) | un | **R$ 71,50** | Fev/2026 | Cotação MOPE EPS (Fev/2026) |
| **Mat** | Espuma Expansiva Corta Fogo (750ml/CF) | un | **R$ 89,00** | Fev/2026 | Wurth / Mercado Livre (Item E007 Fire Stop) |
| **Mat** | Etiqueta de Identificação (Firestop) | un | **R$ 2,50** | Fev/2026 | Encontrado em: PROT-FIRE-ELD-003 |
| **Mat** | Fita Intumescente 2,5mm x 15mm x 2m | un | **R$ 87,90** | Fev/2026 | Cotação Firetherm (Fev/2026) |
| **Mat** | Fita Intumescente 2,5mm x 60mm x 2m | un | **R$ 119,90** | Fev/2026 | Cotação Firetherm (Fev/2026) |
| **Mat** | Impermeabilizante Viaplus 7000 (18kg) | cx | **R$ 250,00** | Fev/2026 | insumos-base.json (Modelo Referência) |
| **Mat** | Lã de Rocha (144 kg/m³) | m² | **R$ 130,00** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | Manta Asfáltica 4mm Tipo II | m² | **R$ 35,67** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | MASTERPOX Primer 900 (Caixa 7,2kg) | cx | **R$ 630,32** | Fev/2026 | Cotação Masterpol (Fev/2026) |
| **Mat** | MASTERPUR VD Cinza (Caixa 12,6kg) | cx | **R$ 502,74** | Fev/2026 | Cotação Masterpol (Fev/2026) |
| **Mat** | Pedrisco / Pedra 0 (Saco 20kg) | saco | **R$ 6,00** | Fev/2026 | Encontrado em: MUR-CNT-14-01.md, SOC-MAC-EPS.md |
| **Mat** | Placa Drywall RU (Umidade) | un | **R$ 42,67** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | Placa Lã de Rocha Firestop 144 kg/m³ (1,20x0,60x0,20m) | un | **R$ 110,00** | Fev/2026 | Cotação Firetherm (Fev/2026) |
| **Mat** | Placa Lã Rocha Ablativa (1,20x0,60m) | un | **R$ 149,90** | Fev/2026 | Encontrado em: PROT-FIRE-ELD-003 |
| **Mat** | Poxpur Areia de Quartzo (Saco 30kg) | saco | **R$ 103,15** | Fev/2026 | Cotação POXPUR (Fev/2026) |
| **Mat** | Poxpur Impermeabilizante PU 200 (Caixa 12,6kg) | cx | **R$ 492,73** | Fev/2026 | Cotação POXPUR (Fev/2026) |
| **Mat** | Primer Asfáltico | L | **R$ 20,67** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | Rodapé Poliestireno Santa Luzia | ml | **R$ 28,00** | Fev/2026 | insumos-base.json (Manual) — atualizado v7 |
| **Mat** | Saco de Ráfia para Entulho (60×90cm) | un | **R$ 2,50** | Fev/2026 | Encontrado em: LOG-ENT-ENSAC-100.md |
| **Mat** | Saco de Ráfia para Entulho (60x90cm) | un | **R$ 2,50** | Fev/2026 | insumos-base.json (Cliente) |
| **Mat** | Selante Intumescente (300ml) | un | **R$ 45,00** | Fev/2026 | Encontrado em: PROT-FIRE-ELD-003 |
| **Mat** | Selante PU 40 (Tubo 400g - Cinza) | un | **R$ 24,90** | Fev/2026 | Loja do Mecânico / Obramax (Juntas Cozinha) |
| **Mat** | Super Adesivo Santa Luzia | tubo | **R$ 48,00** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | Tela de Aço 4,2mm 15×15cm (painel 2×3m) | painel | **R$ 100,00** | Fev/2026 | Encontrado em: CONTR-ARM-5CM-01.md |
| **Mat** | Tela de Poliéster (Reforço) | m | **R$ 4,00** | Fev/2026 | Encontrado em: IMP-VIAP-7000-01.md |
| **Mat** | Tela de Poliéster (Rolo 50m) | rolo | **R$ 190,00** | Fev/2026 | insumos-base.json (Modelo Referência) |
| **Mat** | Tela Soldada Q61 | painel | **R$ 88,33** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | Tela Soldada Q61 (3,4mm - 15×15cm) | m² | **R$ 18,50** | Fev/2026 | Encontrado em: PIS-ENCH-ARG-20.md, PIS-ENCH-ARG-25.md |
| **Mat** | Tela Soldada Q92 | m² | **R$ 25,00** | Fev/2026 | insumos-base.json (Manual) |
| **Mat** | Tijolo Maciço Comum | un | **R$ 2,20** | Fev/2026 | insumos-base.json (Padronizado) |
| **Mat** | Tijolo Maciço Comum (~5x9x19cm) | un | **R$ 1,69** | Fev/2026 | Encontrado em: SOC-VAZ-TIJ.md |
| **Mat** | Tinta Ablativa Fischer (L) | litro | **R$ 116,00** | Fev/2026 | Encontrado em: PROT-FIRE-ELD-003 |
| **Mat** | Trincha/Brocha Profissional | un | **R$ 15,00** | Fev/2026 | Encontrado em: IMP-VIAP-7000-01.md |
| **Mat** | Vergalhão CA-50 8.0mm (Barra 12m) | barra | **R$ 38,00** | Fev/2026 | Encontrado em: MUR-CNT-14-01.md |
| **Mat** | Viaplus 7000 (Caixa 18kg) | cx | **R$ 250,00** | Fev/2026 | Encontrado em: IMP-VIAP-7000-01.md |
| **MO** | Ajudante (Servente) | HH | **R$ 22,50** | Fev/2026 | insumos-base.json (Padronizado) |
| **MO** | Ajudante de Obras (Noturno) | HH | **R$ 28,50** | Fev/2026 | Encontrado em: PROT-FIRE-ELD-003 |
| **MO** | Impermeabilizador (Oficial) | HH | **R$ 40,00** | Fev/2026 | insumos-base.json (Padronizado) |
| **MO** | Oficial Especializado (Noturno) | HH | **R$ 42,00** | Fev/2026 | Encontrado em: PROT-FIRE-ELD-003 |
| **MO** | Profissional (Pedreiro/Oficial/Carpinteiro) | HH | **R$ 40,00** | Fev/2026 | insumos-base.json (Padronizado) |
| **MO** | Técnico / Engenheiro para Teste | HH | **R$ 90,00** | Fev/2026 | insumos-base.json (Padronizado) |

---

## 🧱 GRUPO 1 — CERÂMICA, PORCELANATO E REVESTIMENTOS

| Categoria | Descrição do Insumo | Unid | Preço Unitário | Data Fonte | Origens/Ocorrências |
|---|---|---|---|---|---|
| **Mat** | Cerâmica Esmaltada Padrão 30×30cm | cx (~1,5m²) | **R$ 45,00** | Fev/2026 | Leroy Merlin / Telhanorte |
| **Mat** | Porcelanato Polido 60×60cm | cx (1,44m²) | **R$ 95,00** | Fev/2026 | Obramax / Mercado Livre |
| **Mat** | Argamassa Colante AC-II (20kg) | saco | **R$ 26,90** | Fev/2026 | Quartzolit/Votoran — Obramax / Sodimac |
| **Mat** | Argamassa Colante AC-III (20kg) | saco | **R$ 36,90** | Fev/2026 | Quartzolit — Leroy Merlin / Telhanorte |
| **Mat** | Rejunte Flexível Cinza (5kg) | saco | **R$ 32,00** | Fev/2026 | Leroy Merlin |
| **Mat** | Rejunte Flexível Branco (5kg) | saco | **R$ 35,00** | Fev/2026 | Leroy Merlin |

---

## 🎨 GRUPO 2 — PINTURAS E PREPARAÇÃO DE SUPERFÍCIE

> ⚠️ **Préços corrigidos na auditoria Fev/2026.** PVA e Acrílica Premium estavam subestimados em 2-3×. Usar valores abaixo para evitar furo de orçamento.

| Categoria | Descrição do Insumo | Unid | Preço Unitário | Data Fonte | Origens/Ocorrências |
|---|---|---|---|---|---|
| **Mat** | Tinta Látex PVA Branca (18L) | lata | **R$ 160,00** | Fev/2026 | Coral Coralar / Linhas Econômicas — Leroy Merlin |
| **Mat** | Tinta Acrílica Premium Branca (18L) | lata | **R$ 460,00** | Fev/2026 | Suvinil Premium Fosco / Coral Decora — Telhanorte |
| **Mat** | Selador Acrílico (18L) | lata | **R$ 95,00** | Fev/2026 | Suvinil / Coral — Leroy Merlin |
| **Mat** | Massa Corrida PVA (25kg) | balde | **R$ 75,00** | Fev/2026 | Quartzolit / Suvinil — Telhanorte |
| **Mat** | Massa Acrílica Paredes Externas (20kg) | balde | **R$ 130,00** | Fev/2026 | Suvinil / Coral — Obramax |
| **Mat** | Tinta Epóxi Piso Cinza (3,6L) | lata | **R$ 185,00** | Fev/2026 | Sherwin-Williams — Leroy Merlin |
| **Mat** | Lixa para Parede nº 120 (Folha) | folha | **R$ 1,80** | Fev/2026 | Bosch / 3M — Leroy Merlin |
| **Mat** | Rolo de Pintura 23cm + cabinho (kit) | un | **R$ 25,00** | Fev/2026 | Tigre / Atlas — Leroy Merlin |

---

## 🧱 GRUPO 3 — DRYWALL / GESSO

| Categoria | Descrição do Insumo | Unid | Preço Unitário | Data Fonte | Origens/Ocorrências |
|---|---|---|---|---|---|
| **Mat** | Placa Drywall Padrão ST (1,20×1,80m) | un | **R$ 39,90** | Fev/2026 | Placo / Gypsum — Obramax / Drystore |
| **Mat** | Placa Drywall RU Anti-umidade (1,20×1,80m) | un | **R$ 52,00** | Fev/2026 | Placo — Telhanorte / Leroy Merlin |
| **Mat** | Perfil Guia Drywall 70mm (3m) | un | **R$ 14,50** | Fev/2026 | Obramax |
| **Mat** | Perfil Montante Drywall 70mm (3m) | un | **R$ 16,00** | Fev/2026 | Obramax |
| **Mat** | Massa para Junta Drywall (25kg) | balde | **R$ 55,00** | Fev/2026 | Placo / Quartzolit — Obramax |
| **Mat** | Fita Papel para Junta Drywall (90m) | rolo | **R$ 12,00** | Fev/2026 | Placo — Leroy Merlin |

---

## 🧱 GRUPO 4 — ARGAMASSAS E CONCRETO

| Categoria | Descrição do Insumo | Unid | Preço Unitário | Data Fonte | Origens/Ocorrências |
|---|---|---|---|---|---|
| **Mat** | Argamassa Industrializada para Reboco (40kg) | saco | **R$ 25,00** | Fev/2026 | Leroy Merlin / Obramax |
| **Mat** | Argamassa Industrializada para Contrapiso (40kg) | saco | **R$ 22,00** | Fev/2026 | Votoran / Weber — Obramax |
| **Mat** | Cal Hidratada CH-III (20kg) | saco | **R$ 18,50** | Fev/2026 | Votoran — Obramax |
| **Mat** | Concreto Magro Usinado (m³) | m³ | **R$ 390,00** | Fev/2026 | Concreteiras SP / Supermix (atualizado 2026) |
| **Mat** | Brita 0 – Pedrisco (saco 20kg) | saco | **R$ 6,50** | Fev/2026 | Sarkis / R&F — Obramax / Leroy Merlin |

---

## 💧 GRUPO 5 — IMPERMEABILIZAÇÃO COMPLEMENTAR

> ⚠️ **Manta Asfáltica 3mm corrigida:** preço real é R$380/rolo (Fev/2026). Usar R$185 geraria furo grave de orçamento.

| Categoria | Descrição do Insumo | Unid | Preço Unitário | Data Fonte | Origens/Ocorrências |
|---|---|---|---|---|---|
| **Mat** | Impermeabilizante Cristalizante (20kg) | saco | **R$ 110,00** | Fev/2026 | Viapol / Vedacit — Obramax |
| **Mat** | Primer Asfáltico (18L) | lata | **R$ 115,00** | Fev/2026 | Viapol / Vedacit — Leroy Merlin |
| **Mat** | Manta Asfáltica Elastomérica 3mm (rolo 10m²) | rolo | **R$ 380,00** | Fev/2026 | Viapol / Dryko — Mercado Livre / Obramax |
| **Mat** | Selador de Trincas PU (Tubo 600ml) | un | **R$ 42,00** | Fev/2026 | Vedacit / Tekflex — Leroy Merlin |

---

## 🗼 GRUPO 6 — DEMOLIÇÃO E ENTULHO

| Categoria | Descrição do Insumo | Unid | Preço Unitário | Data Fonte | Origens/Ocorrências |
|---|---|---|---|---|---|
| **Equip** | Caçamba de Entulho (5m³) | un | **R$ 420,00** | Fev/2026 | Locadoras SP (média R$350-550) |
| **Mat** | Saco Big Bag para Entulho (1m³) | un | **R$ 18,00** | Fev/2026 | Mercado Livre / Obramax |
| **Mat** | Lona de Proteção Preta (rolo 100m²) | rolo | **R$ 85,00** | Fev/2026 | Leroy Merlin |
| **Equip** | Disco de Corte Diamantado 110mm | un | **R$ 45,00** | Fev/2026 | Bosch / Cortag — Leroy Merlin |

---

## 🔧 GRUPO 7 — TUBULAÇÕES, CONDUÍTES E FIXAÇÃO

| Categoria | Descrição do Insumo | Unid | Preço Unitário | Data Fonte | Origens/Ocorrências |
|---|---|---|---|---|---|
| **Mat** | Conduíte Flexível Corrugado 3/4" Tigreflex (50m) | rolo | **R$ 105,00** | Fev/2026 | Tigre — Leroy Merlin / Telhanorte |
| **Mat** | Parafuso Gesso c/ Bucha 6mm (caixa 50un) | cx | **R$ 14,00** | Fev/2026 | Fischer — Leroy Merlin |
| **Mat** | Parafuso Chipboard 3,5×35mm (cento 100un) | cento | **R$ 12,00** | Fev/2026 | Jomarca / Stein — Loja do Mecânico |
| **Mat** | Fita Silver Tape 3M (rolo 45mm×50m) | rolo | **R$ 22,00** | Fev/2026 | 3M / Adelbras — Leroy Merlin |
| **Mat** | Spray Silicone Anticorrosivo WD-40 (440ml) | un | **R$ 24,00** | Fev/2026 | WD-40 — Loja do Mecânico |

---

## 👷 GRUPO 8 — MÃO DE OBRA ESPECIALIZADA

| Categoria | Descrição do Insumo | Unid | Preço Unitário | Data Fonte | Origens/Ocorrências |
|---|---|---|---|---|---|
| **MO** | Azulejista / Ceramista (Oficial) | HH | **R$ 40,00** | Fev/2026 | Mercado SP / Expertise Quantisa |
| **MO** | Gesseiro / Drywall (Oficial) | HH | **R$ 40,00** | Fev/2026 | Mercado SP / Expertise Quantisa |
| **MO** | Pintor (Oficial) | HH | **R$ 38,00** | Fev/2026 | SINAPI Cód. 88316 / Mercado SP |
| **MO** | Encarregado de Obras | HH | **R$ 55,00** | Fev/2026 | Expertise Quantisa |
| **MO** | Eletricista (Oficial) | HH | **R$ 45,00** | Fev/2026 | SINAPI Cód. 88262 / Mercado SP |

---

## 🛠️ GRUPO 9 — EQUIPAMENTOS COMPLEMENTARES

| Categoria | Descrição do Insumo | Unid | Preço Unitário | Data Fonte | Origens/Ocorrências |
|---|---|---|---|---|---|
| **Equip** | Andaime Cavalete (par) (Locação) | diária | **R$ 25,00** | Fev/2026 | Locadoras locais SP |
| **Equip** | Compactador de Solo (Sapo 70kg) (Locação) | diária | **R$ 160,00** | Fev/2026 | Casa do Construtor / Loxam SP |
| **Equip** | Lixadeira de Piso (Locação) | diária | **R$ 150,00** | Fev/2026 | Engemaq / Locafrio SP |
| **Equip** | Aspirador de Pó Industrial (Locação) | diária | **R$ 80,00** | Fev/2026 | Casa do Construtor / Nilfisk SP |

---

> **📌 NOTA PARA MANUTENÇÃO:** Ao adicionar novos insumos, sempre preencher a coluna `Data Fonte` com o mês/ano de referência (ex: "SINAPI Nov/2025", "Cotação SP Mar/2026"). Não deixar em branco — use "Fev/2026" como fallback mínimo se a data exata não for conhecida.
