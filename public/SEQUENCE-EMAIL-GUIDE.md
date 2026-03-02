# Séquence Email Post-Achat — KAM AI-First Toolkit
## Guide d'installation Systeme.io (audité)

---

## Vue d'ensemble

| Email | Fichier | Déclencheur | Objet |
|-------|---------|-------------|-------|
| J+0 | `email-j0-livraison.html` | New sale (immédiat) | Votre KAM AI-First Toolkit est prêt 🎯 |
| J+1 | `email-j1-onboarding.html` | J+1 à 10h | Votre premier résultat KAM en 5 minutes ⚡ |
| J+7 | `email-j7-suivi.html` | J+7 à 10h | Comment s'est passée votre première semaine ? |

---

## Comment Systeme.io livre les fichiers numériques

**3 méthodes officielles (auditées) :**

| Méthode | Comment | Avantage |
|---------|---------|---------|
| **A — Page de remerciement** | Bouton "Download file" → File Manager Systeme.io | Accès immédiat, friction zéro |
| **B — Email automatique** | Règle "New sale" → Send email + joindre fichier → converti en lien | Backup si page fermée |
| **C — Lien externe** | Google Drive / Dropbox dans le corps de l'email | Pour fichiers > 5MB |

**Notre fichier : 858KB < 5MB → Méthodes A + B disponibles (double livraison)**

---

## ÉTAPE 1 — Uploader le fichier dans le File Manager

1. Systeme.io → menu latéral → **Fichiers** (ou File Manager)
2. Cliquer **Uploader un fichier**
3. Sélectionner `dist-local/local.html` → **renommer en `kam-ai-first-toolkit.html`**
4. Une URL permanente est générée automatiquement (ex: `https://assets.systeme.io/xxx/kam-ai-first-toolkit.html`)
5. **Copier cette URL** → elle servira pour les étapes suivantes

---

## ÉTAPE 2 — Page de remerciement (livraison immédiate)

La page `merci-systemeio.html` contient déjà un bouton avec `href="#LIEN_FICHIER_SYSTEMEIO"`.

**À faire :**
1. Ouvrir `merci-systemeio.html`
2. Remplacer `#LIEN_FICHIER_SYSTEMEIO` par l'URL générée à l'étape 1
3. Réinjecter dans Systeme.io (bloc Code personnalisé de la page de remerciement)

**Alternative native Systeme.io :**
- Dans l'éditeur de la page de remerciement → ajouter un élément **Bouton**
- Action : **Download file** → sélectionner le fichier dans le File Manager
- Systeme.io gère le lien automatiquement (pas besoin de coder)

---

## ÉTAPE 3 — Email J+0 (livraison par email)

**Configuration dans Systeme.io :**

1. Aller sur la **page de paiement** du tunnel
2. Onglet **Automation Rules** (Règles d'automatisation)
3. Cliquer **Ajouter une règle**
4. Déclencheur : **New sale** (Nouvelle vente)
5. Action : **Send email**
6. Dans l'éditeur d'email :
   - Coller le contenu de `email-j0-livraison.html`
   - Cliquer sur l'**icône cloud/téléchargement** dans la barre d'outils
   - Sélectionner `kam-ai-first-toolkit.html` depuis le File Manager
   - Systeme.io place automatiquement un **lien de téléchargement en bas de l'email**
7. Sauvegarder

> ⚠️ Note : Systeme.io ne joint pas le fichier comme PJ email classique.
> Il génère un lien cliquable placé en bas du message (meilleure délivrabilité).

---

## ÉTAPE 4 — Séquence J+1 et J+7 (automatisation)

1. Systeme.io → **Automatisations** → **Créer une automatisation**
2. Nom : `Onboarding KAM Toolkit`
3. Déclencheur : **Achat du produit** "KAM Ai-First Toolkit"
4. Ajouter les étapes :

```
Trigger: Achat produit
  → Délai : 1 jour
  → Action : Send email (coller email-j1-onboarding.html)
  → Délai : 6 jours
  → Action : Send email (coller email-j7-suivi.html)
```

---

## ÉTAPE 5 — Test complet du tunnel

- [ ] Uploader `kam-ai-first-toolkit.html` dans le File Manager Systeme.io
- [ ] Remplacer `#LIEN_FICHIER_SYSTEMEIO` dans `merci-systemeio.html`
- [ ] Réinjecter la page de remerciement dans Systeme.io
- [ ] Configurer la règle "New sale" → email J+0 avec fichier joint
- [ ] Configurer l'automatisation J+1 + J+7
- [ ] Faire un achat test (code promo 100% dans Systeme.io)
- [ ] Vérifier : page de remerciement → bouton download fonctionne
- [ ] Vérifier : email J+0 reçu avec lien de téléchargement
- [ ] Vérifier : fichier s'ouvre correctement dans le navigateur
- [ ] Vérifier : planification J+1 et J+7 dans l'automatisation

---

## Expéditeur

- **Nom :** Growth Actions
- **Email :** contact@growthactionsai.com

---

## Sources officielles Systeme.io

- [Comment ajouter un fichier téléchargeable](https://aide.systeme.io/article/94-comment-ajouter-un-fichier-telechargeable)
- [Comment envoyer un email automatique contenant un fichier après la vente](https://aide.systeme.io/article/209-comment-envoyer-un-email-automatique-contenant-un-fichier-apres-la-vente)
- [Comment vendre son ebook](https://aide.systeme.io/article/200-comment-vendre-son-ebook)
- [How to host and share a file](https://help.systeme.io/article/2506-how-to-host-and-share-a-file-on-systeme-io)
