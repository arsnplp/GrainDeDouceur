# RAPPORT_REFONTE SEO — Grain de Douceur
**Date :** 2026-07-03  
**Périmètre :** Phase 2 complète — 10 commits atomiques

---

## Avant / Après — Poids page accueil

| Ressource | Avant | Après | Gain |
|---|---|---|---|
| HTML index.html (transféré) | 23,6 Ko (non compressé) | ~5 Ko estimé avec gzip* | -79 % |
| image/Presta/onglerie.webp | **1 625 Ko** (PNG renommé) | **51 Ko** | **-97 %** |
| image/logo.webp | 193 Ko (PNG) | 31 Ko | -84 % |
| image/Lieux/lieux2.webp | 243 Ko | 166 Ko | -32 % |
| image/Lieux/lieux3.webp | 271 Ko | 173 Ko | -36 % |

*La compression gzip/Brotli est activée via `nginx.seo.conf` — à déployer manuellement côté serveur.

---

## Scores Lighthouse estimés

| Critère | Avant | Après (estimé) | Gain |
|---|---|---|---|
| Performance mobile | 30-50 | **70-85** | +35 pts |
| Performance desktop | 55-70 | **85-95** | +25 pts |
| SEO | 50-65 | **90-98** | +35 pts |
| Accessibilité | 75-85 | **85-92** | +8 pts |
| Best Practices | 70-80 | **85-92** | +12 pts |

*Estimations — les scores réels dépendent du déploiement nginx.seo.conf (compression + cache).

---

## URLs créées / modifiées / supprimées

### Créées
| URL | Description |
|---|---|
| `/sitemap.xml` | Sitemap XML des 11 pages |
| `/robots.txt` | Robots.txt avec référence au sitemap |
| `/nginx.seo.conf` | Config nginx (à appliquer manuellement) |

### Renommées
| Ancienne URL | Nouvelle URL | Redirection |
|---|---|---|
| `/epilations-cire-jetableepilation-definitive-lumiere-pulsee.html` | `/epilation-cire-et-definitive.html` | 301 dans nginx.seo.conf |

### Modifiées (toutes les 11 pages HTML)
Chaque page a reçu :
- `<link rel="canonical">` → `https://graindedouceur.fr/` (non-www)
- `<meta name="description">` avec texte ciblé + localisation
- `<title>` optimisé (mot-clé + Saint-Zacharie + marque)
- Open Graph complet (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`)
- `twitter:card` + `twitter:image`
- Schema.org JSON-LD (`LocalBusiness` sur index, `BreadcrumbList` sur toutes les pages internes)
- `loading="lazy"` sur les images de contenu

### Suppressions
- `epilations-cire-jetableepilation-definitive-lumiere-pulsee.html` supprimé du repo (la redirection nginx gère l'ancienne URL)

---

## Corrections structurelles

| Point | Avant | Après |
|---|---|---|
| H1 sur a-propos.html | Absent | `<h1>Michelle – Institut Grain de Douceur</h1>` |
| Burger mobile a-propos.html | Absent | Ajouté |
| Sous-titres de prestations | `<strong>` (non sémantique) | `<h2>` (accordéon JS/CSS mis à jour) |
| maquillage.html vs extensions-de-cils.html | Contenu dupliqué | Différenciés : maquillage/regard vs extensions seules |
| logo.png 193 Ko sur chaque page | PNG lourd | logo.webp 31 Ko |
| onglerie.webp = PNG mal encodé 1,6 Mo | LCP tueur | WebP réel 51 Ko |

---

## Actions manuelles restantes côté serveur

### PRIORITÉ HAUTE — À faire dès le prochain déploiement

**1. Appliquer `nginx.seo.conf`**
```bash
# Sur le serveur, copier le fichier
scp nginx.seo.conf user@graindedouceur.fr:/etc/nginx/conf.d/graindedouceur-seo.conf

# Ou inclure dans le vhost existant :
# include /path/to/nginx.seo.conf;

# Tester, puis recharger
nginx -t && systemctl reload nginx
```

**2. Vérifier la compression active**
```bash
curl -sI -H "Accept-Encoding: gzip" https://graindedouceur.fr/ | grep content-encoding
# Attendu : content-encoding: gzip
```

**3. Choisir définitivement www vs non-www**
- Actuellement : `https://graindedouceur.fr` ET `https://www.graindedouceur.fr` répondent tous les deux en 200
- Le canonical pointe vers `https://graindedouceur.fr` (sans www)
- `nginx.seo.conf` redirige www → non-www en 301
- **À activer pour éviter le contenu dupliqué**

---

## Actions dans Google Search Console (à faire manuellement)

1. **Propriété vérifiée ?** Si pas encore : ajouter le site dans [search.google.com/search-console](https://search.google.com/search-console)
2. **Soumettre le sitemap** : `https://graindedouceur.fr/sitemap.xml`
3. **Demander l'indexation** des pages modifiées (outil "Inspection d'URL") — notamment l'accueil et la nouvelle page épilation
4. **Vérifier les erreurs** dans l'onglet "Couverture" après quelques jours
5. **Valider le schema.org** via [Rich Results Test](https://search.google.com/test/rich-results) sur l'URL `https://graindedouceur.fr/`

---

## Récapitulatif des commits

| Hash | Description |
|---|---|
| `89faddb` | perf: recompresse images critiques + logo.png → logo.webp |
| `e3be420` | url: renomme page épilation → epilation-cire-et-definitive.html |
| `a825eb8` | html: a-propos — ajoute H1 manquant + burger mobile |
| `cad2398` | seo: strong → h2 dans les accordéons + différencie maquillage/extensions |
| `c8c56af` | seo: canonical non-www + Open Graph sur toutes les pages |
| `cd5f438` | seo: schema.org LocalBusiness + BreadcrumbList |
| `ccdb431` | perf: loading=lazy sur images de contenu |
| `d5942c9` | seo: sitemap.xml + robots.txt |
| `2179973` | nginx: nginx.seo.conf |
| `363ce52` | seo: SEO_META_PROPOSAL.md |
| `2798050` | seo: titles + meta descriptions validées sur les 11 pages |

---

*Rapport généré le 2026-07-03. Refonte SEO Phase 2 complète.*
