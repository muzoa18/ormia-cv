# Ormia Abdullah — Digital CV

A fast, dependency-free digital CV (SV/EN toggle, dark/light theme, animated).
Pure HTML + CSS + JS — no build step, no framework. Cool indigo/violet "quant"
theme, tailored for the analytics / finance / engineering sector.

```
ormia-cv/
├── index.html   # page structure
├── styles.css   # styling + animations (indigo/violet theme)
├── data.js      # ALL content (SV + EN) — edit here to update the CV
├── app.js       # rendering, language/theme toggle, scroll reveals
├── vercel.json  # static hosting config + security headers
└── README.md
```

## Edit the content
Everything (roles, dates, skills, languages, both languages) lives in **`data.js`**.

> Note: the LinkedIn URL in `data.js` (`contact.linkedin.href`) is a placeholder —
> replace it with Ormia's real profile URL.

## Run locally
```bash
python3 -m http.server 5173    # then open http://localhost:5173
```

## Deploy to Vercel
- **Drag & drop:** https://vercel.com/new → drag the `ormia-cv` folder.
- **CLI:** `npm i -g vercel && cd ormia-cv && vercel --prod`
- **Git:** push to a repo, import in Vercel (Framework preset **Other**, build command empty, output dir `.`).

No environment variables or build settings required — it's a static site.
