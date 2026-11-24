# mulkisuyadi.github.io

Personal academic and professional website for **Malikul Mulki Anas Suyadi** —
chemical engineer, process/project practitioner, and prospective PhD candidate.

Static site, no build step, no framework, no external requests. It can be
previewed by opening `index.html` directly and published as-is on GitHub Pages.

---

## Preview locally

```bash
cd ~/Projects/mulkisuyadi.github.io
python3 -m http.server 8000
# open http://localhost:8000
```

A local server is recommended over opening the file directly, because the
embedded CV viewer behaves more consistently over `http://`.

## Publish to https://mulkisuyadi.github.io

The repository name must be exactly `mulkisuyadi.github.io` (a GitHub *user*
site, served from the root domain).

```bash
cd ~/Projects/mulkisuyadi.github.io
git init -b main
git add .
git commit -m "Academic website with publication record"
git remote add origin https://github.com/mulkisuyadi/mulkisuyadi.github.io.git
git push -u origin main
```

Then in the repository: **Settings → Pages → Build and deployment**,
Source = *Deploy from a branch*, Branch = `main`, Folder = `/ (root)`.

No Jekyll processing is used (`.nojekyll` is present), so files are served
verbatim. A custom domain can be added later via Settings → Pages.

---

## Structure

```
mulkisuyadi.github.io/
├── index.html                    Section 1 — landing page, publication feature
├── research.html                 Section 2 — statement, publication, experience,
│                                 methods, interests, outputs, background
├── publication-polyglycerol.html Article record: abstract, method, results,
│                                 figures, citation and licence
├── portfolio.html                Section 3 — engineering, research, software projects
├── learning.html                 Section 4 — education, assessment, competencies
├── cv.html                       Section 5 — embedded CV + download
├── 404.html                      Custom not-found page
├── .nojekyll                     Serve files verbatim on GitHub Pages
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/main.css              Design system: tokens, layout, components, print
│   ├── js/main.js                Mobile nav, reveal-on-scroll, active link, year
│   ├── img/
│   │   ├── portrait.jpg          760×950, from the CV (cropped to 4:5)
│   │   ├── portrait@2x.jpg       1520×1900 for high-density screens
│   │   ├── portrait-380.jpg      mobile variant
│   │   ├── og-image.jpg          1200×630 social sharing card
│   │   ├── favicon.svg           Monogram
│   │   └── publication/          Figures from the 2024 article (see below)
│   └── files/
│       └── Malik-CV-2026.pdf     Original CV — unmodified copy
└── README.md
```

The original CV at `~/Downloads/cv-new-october-2026/Malik-CV-2026.pdf` was not
modified. `assets/files/Malik-CV-2026.pdf` is a byte-identical copy
(sha256 `cc43693c…730fdc`).

---

## The publication and its figures

> Suyadi, M. M. A., Halim, G. A., Soerawidjaja, T. H., & Rizkiana, J. (2024).
> Synthesis of polyglycerol under superbasic conditions to reduce the severity of
> the reaction conditions. *ASEAN Journal of Chemical Engineering*, 24(3),
> 353–364. <https://doi.org/10.22146/ajche.15164>

| File in `assets/img/publication/` | Source | Size |
|---|---|---|
| `publication-suyadi-2024-fig1-glycerol-condensation-polymerisation.png` | Fig. 1 of the article (after Babayan & Lehman, 1972) | 811×801 |
| `publication-suyadi-2024-fig2-reaction-apparatus.png` | Fig. 2 of the article | 603×802 |
| `publication-suyadi-2024-fig4-hplc-commercial-polyglycerol.png` | Fig. 4 of the article | 623×311 |
| `publication-suyadi-2024-fig6-hplc-after-maintenance.png` | Fig. 6 of the article | 624×207 |
| `publication-suyadi-2024-fig12-conversion-vs-time.png` | Fig. 12, cropped at 400 dpi from the published PDF | 1100×1003 |

Figures are reproduced unaltered (except Fig. 12, cropped from the page to
remove the printed caption, which is rewritten in HTML), with figure numbers,
source lines and the journal's CC BY-NC 4.0 licence retained. The article is
© ASEAN Journal of Chemical Engineering and distributed under
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — attribution
required, commercial reuse not permitted. The PDF is **linked**, not mirrored;
the version of record stays at the publisher.

The source documents in `~/Projects/publication/` were read only and not
modified.

---

## Before publishing — content to replace

These are deliberate placeholders. Search the project for each item.

| Item | Where | Note |
|---|---|---|
| LinkedIn / Google Scholar / ORCID | footer, all pages | Add if the profiles exist |
| Coursework, additional certifications | `learning.html` | Only externally issued credentials |
| PhD target / research statement length | `research.html` §00 | Optional: a longer version for specific applications |

Both theses are now recorded in `research.html` §05 with titles, supervisors,
methods and key findings, each linking to its ITB Digital Library record. The
master's thesis entry in that library carries **no attached file** — link the
record, never imply a downloadable PDF.

## Design tokens

Edit `assets/css/main.css`, `:root` block:

- `--paper` `#fbfaf7` warm off-white page
- `--ink` `#14161a` near-black headings and CTA band
- `--accent` `#8a3a2e` oxblood, used only for links, rules and active states
- `--serif` display face (Iowan / Palatino / Georgia system stack)
- `--sans` UI and body face (system stack)
- `--mono` metadata labels

To change the accent colour, update `--accent`, `--accent-dark` and
`--accent-wash` together; every other colour is neutral.

## Asset versioning — bump this when CSS or JS changes

GitHub Pages serves every file with `Cache-Control: max-age=600` and does not
fingerprint asset URLs, so a browser or the Fastly edge can keep an old
stylesheet for up to ten minutes after a deploy. That is how a page can look
correct locally while the deployed copy renders unstyled.

The stylesheet and script are therefore requested with a version token, as
root-relative URLs (the site is a user site at the domain root, and root-relative
paths also keep `404.html` styled when it is served from a nested path):

```html
<link rel="stylesheet" href="/assets/css/main.css?v=20261123">
<script src="/assets/js/main.js?v=20261123" defer></script>
```

**After editing `assets/css/main.css` or `assets/js/main.js`, change the token
in all seven HTML files** — today's date (`YYYYMMDD`) is enough:

```bash
cd ~/Projects/mulkisuyadi.github.io
sed -i 's/main\.css?v=[0-9]*/main.css?v=20261124/; s/main\.js?v=[0-9]*/main.js?v=20261124/' *.html
grep -o 'main\.\(css\|js\)?v=[0-9]*' *.html | sort -u
```

Leaving the token unchanged means returning visitors keep the old stylesheet
until their cache expires.

## Accessibility and performance

- Semantic landmarks, one `h1` per page, skip link, visible focus rings
- `prefers-reduced-motion` respected; no animation under that setting
- Contrast checked for body, muted and metadata text (all ≥ 4.5:1)
- No web fonts, no JavaScript libraries, no third-party requests
- Data table scrolls inside its own container on small screens (never the page)
- Total page weight: ~0.85 MB, dominated by the CV PDF and publication figures

## Licence

Content and photographs © Malikul Mulki Anas Suyadi. Code may be reused freely.
Figures from the 2024 article remain © ASEAN Journal of Chemical Engineering,
reproduced under CC BY-NC 4.0.
