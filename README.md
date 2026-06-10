# Super Carros Alphaville — Site (Rebranding Premium Diamond)

Landing page premium, cinematográfica e responsiva para o **Super Carros Alphaville (SCA)**, o ecossistema privado que une a paixão por supercarros ao networking de alto nível. Construída em **Astro 5**, sem frameworks de UI, com motor de animação próprio em JS puro.

Inspiração de direção de arte: Rimac Nevera, Bugatti e Zenvo — adaptadas para uma identidade **"diamante"** própria do SCA.

## Identidade visual

| Token | Valor | Uso |
| :-- | :-- | :-- |
| Canvas | `#060e0b` | Obsidiana com toque esmeralda (cor de marca do SCA) |
| Acento | `#c6a15b` → `#e7cf95` | Ouro champanhe (a "joia diamante") — CTAs, números, fios |
| Esmeralda | `#1b5e48` / `#2b7c5e` | Brilhos e profundidade |
| Texto | `#ece9e1` | Off-white quente (branco puro reservado a hover) |

**Tipografia (auto-hospedada, uso comercial livre — Fontshare):**
- **Clash Display** — títulos monumentais
- **Satoshi** — corpo e rótulos (uppercase tracked)
- **Zodiak** — serifa de acento "diamante" (citações, palavras destacadas)

## Estrutura

```
src/
├── data/site.ts            # TODA a copy/conteúdo (PT-BR) — fonte única de verdade
├── styles/                 # tokens.css · global.css · fonts.css
├── lib/motion.ts           # reveals, contadores, parallax, nav, menu, preloader, cursor
├── layouts/Base.astro      # head/SEO, preloader, failsafes, schema.org
├── components/             # Nav, Footer, Hero, TrustStrip, Ecossistema, Essencia,
│                           # Experiencias, Alcance, Fundador, Parcerias, Membership,
│                           # Wordmark (logo SVG), Monogram (diamante)
└── pages/index.astro       # monta a página
public/
├── fonts/                  # woff2 auto-hospedados
├── favicon.svg · og.jpg · robots.txt
```

**Imagens reais** (de `src/assets/images/`, otimizadas para `webp` no build): frota Lamborghini em pista (hero), Corvette Z06, drone do mega-encontro de São Roque, fila de Porsches, evento "4 Anos", networking e o retrato do fundador.

## Comandos

```bash
npm install
npm run dev       # desenvolvimento → http://localhost:4321
npm run build     # gera /dist (estático)
npm run preview   # serve /dist
```

## Editando o conteúdo

Praticamente todo o texto, números e CTAs vivem em **`src/data/site.ts`** (marca, contato, redes, hero, valores, alcance, experiências, fundador, parcerias, planos). Trocar copy ou estatísticas não exige mexer nos componentes.

Para trocar o WhatsApp: `contact.whatsappDigits` em `src/data/site.ts`.

## Acessibilidade & robustez

- Reveals/preloader só ficam ocultos quando o JS está ativo (`html.js`); há *failsafe* caso o bundle não carregue, além de `<noscript>`.
- `prefers-reduced-motion` desativa parallax/contadores/curtain.
- Foco de teclado visível (anel dourado); cursor custom só com `pointer: fine`.
- SEO: meta tags, Open Graph, JSON-LD (Organization), sitemap, `robots.txt`.

## Deploy

Saída 100% estática em `/dist` — publique em qualquer host estático (Netlify, Vercel, Cloudflare Pages, S3). Ajuste `site` em `astro.config.mjs` se o domínio mudar.
