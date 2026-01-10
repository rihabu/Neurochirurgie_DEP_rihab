# Documentation Technique - Dossier Électronique Patient Neurochirurgie

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Modèle de données](#modèle-de-données)
4. [Composants](#composants)
5. [Flux de données](#flux-de-données)
6. [Guide de reproductibilité](#guide-de-reproductibilité)
7. [API et intégrations](#api-et-intégrations)
8. [Sécurité et conformité](#sécurité-et-conformité)

---

## Vue d'ensemble

### Description du projet

Application web de Dossier Électronique Patient (DEP) spécialisée pour les services de Neurochirurgie. Elle couvre l'intégralité du parcours patient depuis l'admission jusqu'à la sortie, avec un focus particulier sur l'examen neurologique clinique.

### Stack technique

| Composant | Technologie |
|-----------|-------------|
| Framework | Next.js 15 (App Router) |
| Langage | TypeScript 5.x |
| UI Components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS v4 |
| State Management | React Context API |
| Icons | Lucide React |

### Fonctionnalités principales

- **Gestion d'identité patient** avec données démographiques et contacts
- **Module admission** avec chronologie des symptômes
- **Examen clinique CORE** (urgence-compatible)
- **Examen clinique EXTENDED** (patient stable)
- **Regroupement syndromique** avec synthèse automatique
- **Examens complémentaires** (imagerie, biologie, scores)
- **Décision thérapeutique** et consentement
- **Compte-rendu opératoire**
- **Évolution post-opératoire** (J0, J1, J2...)
- **Sortie** avec ordonnances et suivi

---

## Architecture

### Structure des dossiers

\`\`\`
/
├── app/
│   ├── layout.tsx          # Layout principal avec providers
│   ├── page.tsx            # Page d'accueil avec routing des sections
│   └── globals.css         # Styles globaux et thème
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx     # Navigation latérale
│   │   └── header.tsx      # En-tête avec infos patient
│   ├── sections/
│   │   ├── identite-section.tsx
│   │   ├── admission-section.tsx
│   │   ├── examen-core-section.tsx
│   │   ├── examen-extended-section.tsx
│   │   ├── syndromes-section.tsx
│   │   ├── examens-comp-section.tsx
│   │   ├── decision-section.tsx
│   │   ├── operation-section.tsx
│   │   ├── evolution-section.tsx
│   │   └── sortie-section.tsx
│   ├── ui/                 # Composants UI réutilisables
│   └── welcome-screen.tsx  # Écran d'accueil
├── lib/
│   ├── types/
│   │   └── patient.ts      # Définitions TypeScript complètes
│   ├── patient-context.tsx # Context provider pour state global
│   └── utils/
│       └── patient-utils.ts # Fonctions utilitaires
└── docs/
    └── TECHNICAL_DOCUMENTATION.md
\`\`\`

### Diagramme d'architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────────────────────────┐    │
│  │   Layout    │    │         Page Router             │    │
│  │  (Sidebar)  │───▶│  (Section-based navigation)    │    │
│  └─────────────┘    └─────────────────────────────────┘    │
│         │                          │                        │
│         ▼                          ▼                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PatientContext (State)                 │   │
│  │  - dossier: DossierPatientNeurochirurgie           │   │
│  │  - currentSection: string                           │   │
│  │  - updateDossier: (updates) => void                │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│         ┌───────────────┼───────────────┐                  │
│         ▼               ▼               ▼                  │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐            │
│  │  Section  │   │  Section  │   │  Section  │   ...      │
│  │ Components│   │ Components│   │ Components│            │
│  └───────────┘   └───────────┘   └───────────┘            │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼ (Future integration)
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  API Routes │    │   Database  │    │    Auth     │     │
│  │  (Next.js)  │───▶│  (Supabase/ │───▶│  (Supabase  │     │
│  │             │    │   Neon)     │    │   Auth)     │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## Modèle de données

### Schéma principal: DossierPatientNeurochirurgie

\`\`\`typescript
interface DossierPatientNeurochirurgie {
  id: string                              // UUID unique du dossier
  dateCreation: string                    // ISO 8601
  derniereMiseAJour: string              // ISO 8601
  statut: "En cours" | "Clôturé" | "Archivé"
  
  identite: IdentitePatient              // Données patient
  admission: Admission                    // Informations d'admission
  examensCore: ExamenCore[]              // Examens urgence (multiples)
  examensExtended: ExamenExtended[]      // Examens détaillés (multiples)
  regroupementSyndromique?: RegroupementSyndromique
  examensComplementaires: ExamensComplementaires
  decisionTherapeutique?: DecisionTherapeutique
  comptesRendusOperatoires: CompteRenduOperatoire[]
  evolutionPostOperatoire?: EvolutionPostOperatoire
  sortie?: Sortie
}
\`\`\`

### Détail des types de données

#### I. Identité Patient

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| ipp | string | Oui | Identifiant Permanent Patient |
| nom | string | Oui | Nom de famille |
| prenom | string | Oui | Prénom |
| dateNaissance | string (ISO 8601) | Oui | Date de naissance |
| sexe | "M" \| "F" \| "Autre" | Oui | Genre |
| lateralite | "Droitier" \| "Gaucher" \| "Ambidextre" \| "Non déterminé" | Oui | Latéralité manuelle |
| adresse | object | Oui | Adresse complète |
| telephone | string | Oui | Téléphone principal |
| allergiesConnues | string[] | Oui | Liste des allergies |
| contacts | PersonneContact[] | Oui | Personnes à contacter |
| medecinTraitant | object | Non | Médecin référent |

#### II. Admission

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| numeroSejour | string | Oui | Identifiant du séjour |
| dateHeureAdmission | string (ISO 8601) | Oui | Date/heure d'entrée |
| modeEntree | ModeEntree | Oui | Urgences, Consultation programmée, Transfert... |
| motifPrincipal | string | Oui | Motif d'hospitalisation |
| typeUrgence | TypeUrgence | Oui | Vitale, Fonctionnelle, Relative, Non urgente |
| chronologieSymptomes | object | Oui | Histoire de la maladie |
| hypotheseDiagnostique | string | Oui | Diagnostic suspecté |
| medecinsImpliques | array | Oui | Équipe médicale |

#### III. Examen Core (Urgence)

| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| dateHeure | string (ISO 8601) | Oui | Moment de l'examen |
| auteur | string | Oui | Examinateur |
| contexte | "Urgence" \| "Consultation" \| "Post-opératoire" \| "Surveillance" | Oui | Contexte clinique |
| constantes | ConstantesVitales | Oui | TA, FC, FR, T°, SpO2 |
| gcs | GlasgowComaScale | Oui | Score de Glasgow détaillé |
| pupilles | ExamenPupilles | Oui | Examen pupillaire bilatéral |
| deficitMoteurGlobal | DeficitMoteurGlobal | Oui | Évaluation motrice rapide |
| sensibiliteGlobale | SensibiliteGlobale | Oui | Évaluation sensitive |
| fonctionsSphinteriennes | FonctionSphincter[] | Oui | Troubles sphinctériens |
| signesGravite | SignesGravite | Oui | Alertes (engagement, choc...) |

**Score de Glasgow (GCS) - Détail:**

\`\`\`typescript
interface GlasgowComaScale {
  yeux: {
    score: 1 | 2 | 3 | 4
    description: string
  }
  verbal: {
    score: 1 | 2 | 3 | 4 | 5
    description: string
    nonEvaluable?: boolean  // Si patient intubé/aphasique
  }
  moteur: {
    score: 1 | 2 | 3 | 4 | 5 | 6
    description: string
  }
  total: number             // 3-15
  interpretation: string    // Calculé automatiquement
}
\`\`\`

#### IV. Examen Extended (Patient stable)

| Champ | Type | Description |
|-------|------|-------------|
| fonctionsCognitives | FonctionsCognitives | Orientation, attention, mémoire, langage, praxies, gnosies |
| cephalees | Cephalees | Présence, EVA, localisation, type |
| pairesCraniennes | ExamenPairesCraniennes | I à XII détaillées |
| examenMoteurMRC | ExamenMoteurMRC | Testing musculaire 0-5 par groupe |
| tonus | object | Évaluation du tonus par membre |
| reflexesOT | ReflexesOT | ROT bicipital, tricipital, rotulien, achilléen |
| reflexesCutanes | ReflexesCutanes | Babinski, cutanés abdominaux |
| sensibiliteDetaillee | SensibiliteDetaillee | Superficielle, profonde, topographie |
| coordination | Coordination | Doigt-nez, talon-genou, adiadococinésie |
| marcheStation | MarcheStation | Station, Romberg, type de marche |
| examenPerineal | ExamenPerineal | Si indiqué (syndrome queue de cheval) |

**Testing Musculaire MRC:**

| Score | Description |
|-------|-------------|
| 0 | Aucune contraction |
| 1 | Contraction visible sans mouvement |
| 2 | Mouvement possible sans pesanteur |
| 3 | Mouvement contre pesanteur |
| 4 | Mouvement contre résistance |
| 5 | Force normale |

#### V. Regroupement Syndromique

| Syndrome | Arguments cliniques | Champs spécifiques |
|----------|---------------------|-------------------|
| HTIC | Céphalées, vomissements, troubles visuels, œdème papillaire, troubles vigilance | Gravité (Légère/Modérée/Sévère) |
| Pyramidal | Déficit moteur, hypertonie spastique, hyperréflexie, Babinski, syncinésies | Topographie |
| Médullaire | Niveau sensitif, syndromes sous-lésionnels, troubles sphinctériens | Niveau, type (Complet/Incomplet) |
| Queue de Cheval | Douleur sciatique, troubles sensitifs en selle, sphinctériens, abolition réflexes | Urgence chirurgicale (boolean) |
| Cérébelleux | Ataxie, dysmétrie, adiadococinésie, hypotonie, dysarthrie, nystagmus | Type (Statique/Cinétique/Mixte) |
| Méningé | Céphalées, raideur nuque, Kernig, Brudzinski, photophobie, fièvre | - |

#### VI. Sortie

| Champ | Type | Description |
|-------|------|-------------|
| modeSortie | ModeSortie | Domicile, SSR, Transfert, HAD, EHPAD, Décès |
| diagnosticFinal | object | Principal + associés + codes CIM10 |
| etatNeurologiqueSortie | object | GCS, déficits, amélioration, score Rankin |
| ordonnanceSortie | array | Médicaments, posologie, durée |
| signesAlerte | string[] | À surveiller par le patient |
| suiviPrevu | array | RDV de contrôle programmés |

---

## Composants

### Composants de formulaire

#### FormField

Composant générique pour tous les champs de formulaire.

\`\`\`typescript
interface FormFieldProps {
  label: string
  name: string
  type?: "text" | "number" | "email" | "tel" | "date" | 
         "datetime-local" | "select" | "textarea" | "checkbox"
  value: string | number | boolean
  onChange: (value: string) => void
  required?: boolean
  placeholder?: string
  hint?: string
  options?: Array<{ value: string; label: string }>
  disabled?: boolean
  error?: string
}
\`\`\`

#### Sélecteur MRC

Composant spécialisé pour le testing musculaire.

\`\`\`typescript
interface MRCSelectorProps {
  label: string           // Nom du muscle
  valueDroit: ScoreMRC    // Score côté droit
  valueGauche: ScoreMRC   // Score côté gauche
  onChangeDroit: (v: ScoreMRC) => void
  onChangeGauche: (v: ScoreMRC) => void
}
\`\`\`

### Composants de section

Chaque section suit le même pattern:

\`\`\`typescript
export function SectionComponent() {
  const { dossier, updateDossier } = usePatient()
  const [localState, setLocalState] = useState(defaultValues)
  
  if (!dossier) return null
  
  const handleSave = () => {
    updateDossier({ fieldName: localState })
  }
  
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      {/* Cards avec formulaires */}
      {/* Actions (Réinitialiser / Enregistrer) */}
    </div>
  )
}
\`\`\`

---

## Flux de données

### Création d'un nouveau dossier

\`\`\`
1. Utilisateur clique "Nouveau Dossier"
2. WelcomeScreen génère un ID unique et crée un dossier vierge
3. PatientContext.setDossier(nouveauDossier)
4. Navigation automatique vers section "identite"
5. Remplissage progressif des sections
\`\`\`

### Mise à jour des données

\`\`\`
1. Utilisateur modifie un formulaire
2. État local du composant mis à jour (useState)
3. Clic sur "Enregistrer"
4. updateDossier({ champ: valeur })
5. PatientContext met à jour le dossier global
6. Horodatage automatique (derniereMiseAJour)
\`\`\`

### Calculs automatiques

- **Score GCS Total**: `yeux.score + verbal.score + moteur.score`
- **Interprétation GCS**: Basée sur le total (15=Normal, 13-14=Altération légère, 9-12=Modérée, <9=Coma)
- **Synthèse syndromique**: Générée automatiquement à partir des syndromes présents

---

## Guide de reproductibilité

### Prérequis

\`\`\`bash
Node.js >= 18.x
npm >= 9.x ou pnpm >= 8.x
\`\`\`

### Installation

\`\`\`bash
# Cloner le projet
git clone [repository-url]
cd neurochirurgie-dep

# Installer les dépendances
npm install
# ou
pnpm install

# Lancer en développement
npm run dev
\`\`\`

### Variables d'environnement

Pour une intégration avec base de données (optionnel):

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Ou Neon
DATABASE_URL=postgresql://user:pass@xxx.neon.tech/dbname
\`\`\`

### Scripts SQL pour base de données

\`\`\`sql
-- Table principale des dossiers
CREATE TABLE dossiers_patient (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date_creation TIMESTAMPTZ DEFAULT NOW(),
  derniere_mise_a_jour TIMESTAMPTZ DEFAULT NOW(),
  statut TEXT CHECK (statut IN ('En cours', 'Clôturé', 'Archivé')),
  
  -- Données JSON pour flexibilité
  identite JSONB NOT NULL,
  admission JSONB NOT NULL,
  examens_core JSONB DEFAULT '[]',
  examens_extended JSONB DEFAULT '[]',
  regroupement_syndromique JSONB,
  examens_complementaires JSONB DEFAULT '{"imagerie":[],"biologie":[],"scores":[]}',
  decision_therapeutique JSONB,
  comptes_rendus_operatoires JSONB DEFAULT '[]',
  evolution_post_operatoire JSONB,
  sortie JSONB,
  
  -- Métadonnées
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Index pour recherche rapide
CREATE INDEX idx_dossiers_ipp ON dossiers_patient ((identite->>'ipp'));
CREATE INDEX idx_dossiers_statut ON dossiers_patient (statut);
CREATE INDEX idx_dossiers_date ON dossiers_patient (date_creation);

-- RLS Policies (si Supabase)
ALTER TABLE dossiers_patient ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all dossiers" ON dossiers_patient
  FOR SELECT USING (true);

CREATE POLICY "Users can insert dossiers" ON dossiers_patient
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own dossiers" ON dossiers_patient
  FOR UPDATE USING (auth.uid() = updated_by);
\`\`\`

### Tests

\`\`\`bash
# Tests unitaires
npm run test

# Tests E2E (à configurer avec Playwright)
npm run test:e2e
\`\`\`

---

## API et intégrations

### Routes API suggérées (Next.js)

\`\`\`typescript
// app/api/dossiers/route.ts
export async function GET(request: Request) {
  // Liste des dossiers avec filtres
}

export async function POST(request: Request) {
  // Création d'un nouveau dossier
}

// app/api/dossiers/[id]/route.ts
export async function GET(request: Request, { params }) {
  // Récupération d'un dossier par ID
}

export async function PATCH(request: Request, { params }) {
  // Mise à jour partielle
}

// app/api/dossiers/[id]/export/route.ts
export async function GET(request: Request, { params }) {
  // Export PDF du dossier
}
\`\`\`

### Intégrations possibles

| Service | Usage | SDK |
|---------|-------|-----|
| Supabase | Base de données + Auth | @supabase/ssr |
| Neon | Base de données | @neondatabase/serverless |
| Vercel Blob | Stockage d'imagerie | @vercel/blob |
| Auth.js | Authentification | next-auth |

---

## Sécurité et conformité

### Considérations RGPD / HDS

1. **Données de santé**: Hébergement sur infrastructure certifiée HDS obligatoire
2. **Chiffrement**: TLS en transit, chiffrement au repos
3. **Accès**: Authentification forte, traçabilité des accès
4. **Consentement**: Recueil du consentement patient documenté
5. **Droit d'accès**: Export des données au format standard

### Checklist sécurité

- [ ] Authentification multi-facteurs
- [ ] Logs d'audit sur toutes les opérations
- [ ] Chiffrement des données sensibles
- [ ] Politique de mots de passe forte
- [ ] Session timeout automatique
- [ ] Backup quotidien des données
- [ ] Tests de pénétration réguliers

### Recommandations d'hébergement

Pour la production, utiliser un hébergeur certifié HDS:
- OVH Healthcare
- Scaleway SecNumCloud
- Azure Healthcare APIs
- AWS HealthLake

---

## Annexes

### A. Codes couleur de l'interface

\`\`\`css
:root {
  --medical-primary: #0ea5e9;     /* Actions principales */
  --medical-success: #22c55e;     /* Confirmations */
  --medical-warning: #f59e0b;     /* Alertes modérées */
  --medical-critical: #ef4444;    /* Urgences */
  --medical-muted: #64748b;       /* Texte secondaire */
}
\`\`\`

### B. Constantes médicales de référence

| Paramètre | Valeurs normales adulte |
|-----------|------------------------|
| TA systolique | 90-140 mmHg |
| TA diastolique | 60-90 mmHg |
| FC | 60-100 bpm |
| FR | 12-20/min |
| Température | 36.5-37.5°C |
| SpO2 | ≥95% |
| GCS | 15/15 |

### C. Versions et changelog

| Version | Date | Modifications |
|---------|------|---------------|
| 1.0.0 | 2024-01 | Version initiale |

---

*Document généré le 13/12/2025 - v1.0.0*
