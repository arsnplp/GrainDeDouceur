# SEO_AUDIT — Grain de Douceur
**Date :** 2026-07-03  
**URL de production :** https://www.graindedouceur.fr  
**Serveur :** nginx/1.24.0 (Ubuntu)  
**Périmètre :** audit statique du code + requêtes HTTP prod

---

## INVENTAIRE DES PAGES

| Fichier | URL prod | Poids HTML |
|---|---|---|
| index.html | / | 23,6 Ko |
| a-propos.html | /a-propos.html | 5,8 Ko |
| soins-du-visage.html | /soins-du-visage.html | 6,4 Ko |
| epilations-cire-jetable…html | /epilations-cire-jetableepilation-definitive-lumiere-pulsee.html | 7,5 Ko |
| onglerie-manucure.html | /onglerie-manucure.html | 5,7 Ko |
| maquillage.html | /maquillage.html | 5,8 Ko |
| maquillage-permanent.html | /maquillage-permanent.html | 6,3 Ko |
| maquillage-evenement.html | /maquillage-evenement.html | 4,2 Ko |
| extensions-de-cils.html | /extensions-de-cils.html | 4,6 Ko |
| soins-homme.html | /soins-homme.html | 6,8 Ko |
| cgu.html | /cgu.html | 4,5 Ko |

**Blog :** absent — aucune page de blog existante.  
**Sections cachées en display:none :** aucune. Les sections accueil/prestations/avis/contact sont toutes dans index.html avec des ancres (#prestations, #avis, #contact) et non des pages séparées. Ce n'est pas optimal pour le SEO (une URL = une intention) mais fonctionnel.

---

## 🔴 CRITIQUE

### C-1 · Zéro meta description sur toutes les pages
**Impact :** Google génère lui-même les extraits → mauvais CTR dans les SERP, perte de contrôle du message.  
Vérification : `grep -r 'name="description"' *.html` → résultat vide sur les 11 pages.

### C-2 · Zéro balise canonical
**Impact :** sans canonical, Google voit `https://www.graindedouceur.fr/` et `https://graindedouceur.fr/` comme deux versions distinctes du même contenu (voir C-3).  
`grep -r 'canonical' *.html` → résultat vide.

### C-3 · www et non-www répondent tous les deux en 200
```
https://graindedouceur.fr/     → HTTP/2 200  ← version non-www
https://www.graindedouceur.fr/ → HTTP/2 200  ← version www
```
Il manque une redirection 301 d'une version vers l'autre côté serveur. Sans ça, Google peut indexer les deux variantes et diluer le PageRank.

### C-4 · Zéro schema.org (JSON-LD)
Aucun schema sur aucune page. Il manque au minimum :
- `LocalBusiness` sur l'accueil (nom, adresse, tel, horaires, url, image)
- `BreadcrumbList` sur toutes les pages internes
- `WebPage` / `Service` sur les pages de prestations

### C-5 · Zéro Open Graph / Twitter Card
`grep -r 'og:\|twitter:' *.html` → résultat vide.  
**Impact :** partage sur réseaux sociaux = lien brut sans titre ni image. Mauvaise première impression et image de marque dégradée.

### C-6 · Title index.html hors sujet
```
Actuel : "Esthéticienne - Page de présentation"  (38 chars)
```
- Mot-clé principal absent ("institut de beauté", "Saint-Zacharie")
- "Page de présentation" est du jargon développeur sans valeur pour l'utilisateur
- La marque "Grain de Douceur" est absente
- Aucune localisation géographique

### C-7 · a-propos.html : H1 absent
Le premier titre de contenu visible est `<h2>Un havre de paix</h2>`. Il n'y a pas de `<h1>` sur la page.  
La hiérarchie saute directement de l'absence de H1 aux H2 puis aux H4 du footer.

### C-8 · image/Presta/onglerie.webp = 1 625 Ko servie en production
Ce fichier est référencé dans index.html comme source WebP de la card prestations "Onglerie". Un WebP de 1,6 Mo est aussi lourd que le JPEG source : la conversion a échoué ou le fichier n'est pas le bon. C'est le **LCP candidat de l'accueil sur mobile** → score Performance Lighthouse ≈ 30-50.

### C-9 · Zéro compression serveur (gzip/Brotli)
```
curl -sI https://www.graindedouceur.fr/ | grep content-encoding
(vide)
```
Le HTML de 23,6 Ko est transféré non compressé. Avec gzip, il serait ~5 Ko. Même impact sur le CSS (taille non vérifiée mais probablement >30 Ko).

### C-10 · Zéro Cache-Control serveur
```
curl -sI https://www.graindedouceur.fr/ | grep cache-control
(vide)
```
Les assets statiques (images, CSS, JS) ne sont pas mis en cache par les navigateurs ni les CDN. Chaque visite retélécharge tout.

---

## 🟠 IMPORTANT

### I-1 · Sitemap.xml absent
`ls sitemap.xml` → ABSENT.  
Google doit découvrir les pages par crawl seul. Pour un site de 11 pages, l'impact est faible mais la soumission d'un sitemap dans Google Search Console est une bonne pratique obligatoire.

### I-2 · Robots.txt absent
`ls robots.txt` → ABSENT.  
Sans robots.txt, Google ne sait pas quelles zones bloquer et aucun sitemap n'est référencé.

### I-3 · URL de la page épilation trop longue et mal formée
```
epilations-cire-jetableepilation-definitive-lumiere-pulsee.html
```
- Deux mots collés sans tiret : `jetableepilation`
- 64 caractères → trop long pour une URL propre
- Recommandé : `epilation-cire-et-definitive.html`

### I-4 · Pages de prestations : sections de contenu non sémantiques
Les sous-sections des pages utilisent `<strong>` (ex : `<strong>Épilation définitive – Électrolyse</strong>`) au lieu de `<h2>` ou `<h3>`. Google ne peut pas parser la structure de la page. La hiérarchie effective est : H1 → H4 (footer uniquement), sans H2/H3 de contenu.

### I-5 · logo.png = 193 Ko servi sur chaque page
Le logo dans la topnav est un PNG de 193 Ko. Il devrait être en WebP (<15 Ko) ou SVG (vectoriel, ~2 Ko). Il est chargé sur chaque page, ce qui pénalise le LCP.

### I-6 · lieux2.jpg (566 Ko) et lieux3.jpg (615 Ko) non optimisés
Les fichiers JPG sources du carousel sont trop lourds. Les WebP correspondants (243 et 271 Ko) sont acceptables mais restent au-dessus de la cible <150 Ko pour des vignettes de carousel.

### I-7 · Pages de prestations : images hero sans `<picture>` + sans `loading="lazy"`
```html
<!-- actuel -->
<img src="image/Presta1/epilationbaniere.webp" alt="Épilations">
<!-- manque : picture + fallback + lazy -->
```
WebP est supporté par 97 %+ des navigateurs donc l'impact est minime, mais le `loading="lazy"` absent sur les images de contenu pénalise le LCP des pages de prestations.

### I-8 · Titles : mot-clé principal pas toujours en tête
| Page | Title actuel | Problème |
|---|---|---|
| index.html | Esthéticienne - Page de présentation | Mot-clé manquant, marque absente |
| a-propos.html | À propos – Grain de Douceur | "À propos" peu ciblé |
| cgu.html | CGU - Grain de Douceur | Acceptable (page légale) |
| extensions-de-cils.html | Extensions de cils - Grain de Douceur | OK |
| onglerie-manucure.html | Onglerie / Manucure - Grain de Douceur | Slash / peu propre |
| soins-du-visage.html | Soins du visage / Soins du corps - Grain de Douceur | 51 chars, slash / |
| epilations-…html | Épilation à la cire et définitive - Grain de Douceur | 55 chars, OK |

### I-9 · Incohérence maquillage.html vs son contenu
Le fichier `maquillage.html` contient la prestation "Beauté du regard" (extensions de cils, colorations…). Un fichier nommé `maquillage.html` qui parle d'extensions de cils est trompeur pour Google.  
De même, `extensions-de-cils.html` contient aussi des extensions de cils (structure similaire, contenu presque dupliqué avec `maquillage.html`).

---

## 🟡 MINEUR

### M-1 · Séparateur de title inconsistant (– vs - vs /)
Certaines pages utilisent `–` (tiret long), d'autres `-` (tiret court), d'autres `/`. À harmoniser.

### M-2 · H4 dans le footer sans H2/H3 parent sur les pages de prestations
Les `<h4>Horaires</h4>`, `<h4>Prestations</h4>`, `<h4>Informations</h4>` du footer n'ont pas de H2/H3 parent dans les pages prestation. Ce n'est pas grave pour le SEO (Google tolère les sauts dans le footer) mais c'est incorrect HTML.

### M-3 · Fichiers sources non utilisés dans le repo (non servis mais encombrants)
Plusieurs PNG source ~1-2 Mo par fichier dans `image/Presta1/`, `image/photocote/`, `image/produitfond/` et `image/photo coté/` restent dans le repo mais ne sont pas référencés par les pages HTML. Ils ne sont pas servis au navigateur, donc pas d'impact perf directe, mais alourdissent le repo et les déploiements.

### M-4 · image/logo graine.png = 2 186 Ko
Fichier source du favicon, non utilisé directement dans les pages. À déplacer hors du dossier servi ou supprimer.

### M-5 · `<html lang="fr">` présent sur toutes les pages ✓
OK, rien à faire.

### M-6 · a-propos.html : pas de bouton burger mobile
Le fichier a-propos.html n'a pas le `<button class="topnav-burger">` dans son header (toutes les autres pages l'ont). Le menu mobile est cassé sur cette page.

### M-7 · Liens footer vers `index.html#contact` absolus depuis les sous-pages
Les liens dans le footer pointent vers `index.html#contact` (relatif). Ça fonctionne, mais si le site migre vers une URL de base différente ou change de structure, tous les liens de footer se cassent. Pas critique SEO, mais à noter.

---

## RÉCAPITULATIF DES SCORES ESTIMÉS

Sans Lighthouse CLI disponible en production au moment de l'audit, voici les estimations basées sur l'analyse statique :

| Critère | Estimation |
|---|---|
| Performance mobile | **30-50 / 100** (onglerie.webp 1,6 Mo, pas de compression, pas de cache) |
| Performance desktop | **55-70 / 100** (même problèmes, connexion plus rapide) |
| Accessibilité | **75-85 / 100** (H1 manquant a-propos, pas de main sur a-propos) |
| SEO (Lighthouse) | **50-65 / 100** (pas de meta description, pas de canonical) |
| Best Practices | **70-80 / 100** (HTTPS OK, pas de mixed content visible) |

---

## ACTIONS REQUISES CÔTÉ SERVEUR (nginx)
*(non faisable depuis le repo — à appliquer manuellement)*

1. **Choisir www ou non-www** comme version canonique et rediriger l'autre en 301
2. **Activer gzip/Brotli** sur nginx (module `ngx_http_gzip_module` ou `ngx_brotli`)
3. **Ajouter Cache-Control** : `max-age=31536000, immutable` pour les assets, `max-age=3600` pour le HTML

---

## PLAN D'ACTION PHASE 2 (après validation)

| Priorité | Action |
|---|---|
| 🔴 1 | Corriger `image/Presta/onglerie.webp` (refaire la conversion WebP) |
| 🔴 2 | Ajouter `<meta name="description">` sur toutes les pages |
| 🔴 3 | Ajouter `<link rel="canonical">` sur toutes les pages |
| 🔴 4 | Ajouter schema.org `LocalBusiness` (accueil) + `BreadcrumbList` (toutes pages internes) |
| 🔴 5 | Ajouter Open Graph complet sur toutes les pages |
| 🔴 6 | Corriger title index.html |
| 🔴 7 | Ajouter H1 sur a-propos.html |
| 🟠 8 | Créer sitemap.xml + robots.txt |
| 🟠 9 | Renommer URL épilation |
| 🟠 10 | Transformer `<strong>` de sections en `<h2>` dans les pages prestations |
| 🟠 11 | Optimiser logo.png → WebP |
| 🟠 12 | Ajouter `loading="lazy"` sur images de contenu |
| 🟡 13 | Harmoniser séparateurs de title |
| 🟡 14 | Ajouter burger mobile sur a-propos.html |

**Note :** les titles et meta descriptions seront proposés dans `SEO_META_PROPOSAL.md` pour validation avant application.

---

*Audit réalisé le 2026-07-03. Stop — attente de validation avant Phase 2.*
