# Macher Mihály — fotós portfólió

Weboldal az osztálytársamnak: Macher Mihály koncert- és portréfotós egyoldalas portfóliója.
Sima statikus oldal (HTML + CSS + egy kis JavaScript), nincs build lépés és nincs függőség.

## Felépítés

```
index.html              az oldal (minden szöveg itt van)
assets/css/style.css    stílusok, animációk
assets/js/main.js       görgetésre megjelenés, parallax, menü, képnézegető, szűrő
assets/fonts/           saját tárhelyről betöltött betűk (Bodoni Moda, Archivo — OFL licenc)
images/                 az eredeti képek (.jpg + .webp), ezekhez nem nyúltunk
images/sizes/           kisebb változatok (640 / 1200 / 1800 px) a gyorsabb betöltéshez
scripts/make-sizes.py   ez generálja az images/sizes/ tartalmát
```

## Helyi futtatás

Bármilyen statikus szerver jó, például:

```bash
python3 -m http.server 8000
```

Utána: <http://localhost:8000>

## Közzététel GitHub Pages-en

1. A repó oldalán: **Settings → Pages**.
2. **Source:** *Deploy from a branch*, **Branch:** `main`, mappa: `/ (root)` → **Save**.
3. Pár perc múlva elérhető itt: `https://gaalp03.github.io/osztalytars-weboldal/`

Minden hivatkozás relatív, így az oldal a `/osztalytars-weboldal/` alútvonalon is működik.
A `.nojekyll` fájl kikapcsolja a Jekyll-feldolgozást.

> Privát repóból a GitHub Pages csak fizetős (Pro / Team) fióknál érhető el.
> Ingyenes fióknál a repót nyilvánossá kell tenni, vagy egy nyilvános repóba átmásolni.

Ha más címen fut az oldal (pl. saját domain), az `index.html` elején az `og:url` és `og:image`
címét át kell írni, hogy a megosztási előnézet (Facebook, Messenger stb.) jó képet mutasson.

## Teendők (TODO)

- **Elérhetőségek:** az `index.html` Kapcsolat részében a `TODO: email cím` és `TODO: Instagram`
  helyére kerüljön a valódi e-mail cím és Instagram-profil (linkként, pl. `<a href="mailto:...">`).
- **Portrék:** ha lesznek portréképek, másolj le egy `<figure class="g-item">` blokkot a galériában,
  cseréld ki a képet, és állítsd `data-category="portre"`-ra. Amint két kategória van,
  az `Összes / Koncert / Portré` szűrő magától megjelenik.

## Új kép hozzáadása

1. Tedd a képet (`.jpg` és `.webp`) az `images/` mappába, pl. `concert-10.jpg`.
2. Generáld le a kisebb méreteket (Pillow kell hozzá: `pip install Pillow`):

   ```bash
   python3 scripts/make-sizes.py
   ```

3. Másolj le egy galériaelemet az `index.html`-ben, és írd át a fájlneveket, az `alt` szöveget
   és a feliratot. A `style` attribútumban állítható a kivágás:
   - `--c` — hány oszlopot foglal asztali nézetben (12 oszlopos rács, pl. `1 / 9`)
   - `--r` / `--mr` — képarány asztalon / mobilon (pl. `16 / 9`, `4 / 5`)
   - `--pos` — a kivágás fókuszpontja (pl. `60% 50%`)
   - `--mt` — függőleges eltolás asztali nézetben

## Mozgás és akadálymentesség

- Görgetésre megjelenő szekciók és képek, enyhe parallax a nyitóképen és a bemutatkozó képen,
  a képnézegető a galériabeli kivágásból „nyílik ki”, lapozáskor áttűnéssel vált.
- Mindez csak `transform` / `opacity` / `clip-path` animáció, IntersectionObserverrel — nincs külső könyvtár.
- Ha a rendszerben be van kapcsolva a *mozgás csökkentése* (`prefers-reduced-motion`),
  az animációk kikapcsolnak.
- Képnézegető: Esc bezár, ←/→ lapoz, fókusz a nézegetőben marad, mobilon húzással lapozható.
- JavaScript nélkül is minden tartalom látszik; a galériaképek ilyenkor sima linkként nyílnak meg.
