# Z1 – Moja online vizitka

**Autor:** Ivan Laushkin  
**Štúdium:** Aplikovaná informatika, 3. ročník  
**Cvičenie:** pondelok o 13:00  
**Web:** [https://webte1.fei.stuba.sk/~xlaushkin/Z1_laushkin/index.html](https://webte1.fei.stuba.sk/~xlaushkin/Z1_laushkin/index.html)

## Obsah webu

Moja osobná webová vizitka obsahuje profil, životopis, interaktívnu fotografiu pracovného prostredia, rozvrh a mapu Bratislavy. Rozvrh zobrazuje aktuálnu alebo najbližšiu hodinu a priebeh semestra; mapa umožňuje pridávať pomenované body, ukladať ich v prehliadači a vypočítať vzdialenosť k FEI STU alebo fiktívnemu domovu. Web som vytvoril pomocou HTML5, CSS a JavaScriptu; knižnicu Leaflet používam iba na stránke mapy.

## Zdroje a licencie

- Fotografie: moje vlastné fotografie [portrétu](img/me.jpg) a [pracovného prostredia](img/workspace.jpg).
- Mapové podklady: [OpenStreetMap a jeho prispievatelia](https://www.openstreetmap.org/copyright), údaje pod licenciou Open Database License (ODbL); dlaždice sa načítavajú z `tile.openstreetmap.org`.
- Mapová knižnica: [Leaflet 1.9.4](https://leafletjs.com/), [licencia BSD 2-Clause](https://github.com/Leaflet/Leaflet/blob/v1.9.4/LICENSE); knižnica sa načítava z `unpkg.com`.
- Písmo: Fira Sans, licencia **SIL Open Font License, verzia 1.1**. Úplný text licencie vrátane oznámenia o autorských právach je v súbore [fonts/Fira_Sans/OFL.txt](fonts/Fira_Sans/OFL.txt). Copyright (c) 2012–2015, The Mozilla Foundation and Telefonica S.A. Písmo je priložené lokálne v priečinku `fonts/`.
- Favicon a označenie v hlavičke: monogram IL.

## Použitie AI

OpenAI Codex som použil na generovanie a preklad textov, výber farebnej palety, prípravu základného HTML, CSS a JavaScriptu, kontrolu a overovanie kódu, vysvetlenie jednotlivých HTML značiek, funkcií a syntaxe a na doplnenie atribútov ARIA (napríklad `aria-label`) na zlepšenie prístupnosti webu pre používateľov so zdravotným znevýhodnením.
