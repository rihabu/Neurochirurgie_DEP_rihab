# Dictionnaire de Données - DEP Neurochirurgie

Ce document décrit exhaustivement tous les types de données utilisés dans l'application.

---

## Types énumérés

### Sexe
\`\`\`typescript
type Sexe = "M" | "F" | "Autre"
\`\`\`

### Latéralité
\`\`\`typescript
type Lateralite = "Droitier" | "Gaucher" | "Ambidextre" | "Non déterminé"
\`\`\`

### Mode d'entrée
\`\`\`typescript
type ModeEntree = 
  | "Urgences"
  | "Consultation programmée"
  | "Transfert interne"
  | "Transfert externe"
  | "Hospitalisation programmée"
\`\`\`

### Type d'urgence
\`\`\`typescript
type TypeUrgence = "Vitale" | "Fonctionnelle" | "Relative" | "Non urgente"
\`\`\`

### Score de Glasgow - Yeux
\`\`\`typescript
type ScoreGCSYeux = 1 | 2 | 3 | 4

// Correspondances:
// 4 = Ouverture spontanée
// 3 = À la demande
// 2 = À la douleur
// 1 = Aucune
\`\`\`

### Score de Glasgow - Verbal
\`\`\`typescript
type ScoreGCSVerbal = 1 | 2 | 3 | 4 | 5

// Correspondances:
// 5 = Orienté
// 4 = Confus
// 3 = Mots inappropriés
// 2 = Sons incompréhensibles
// 1 = Aucune réponse
\`\`\`

### Score de Glasgow - Moteur
\`\`\`typescript
type ScoreGCSMoteur = 1 | 2 | 3 | 4 | 5 | 6

// Correspondances:
// 6 = Obéit aux ordres
// 5 = Localise la douleur
// 4 = Retrait à la douleur
// 3 = Flexion anormale (décortication)
// 2 = Extension (décérébration)
// 1 = Aucune réponse
\`\`\`

### Taille pupillaire
\`\`\`typescript
type TaillePupillaire = "Myosis" | "Intermédiaire" | "Mydriase"
\`\`\`

### Réactivité pupillaire
\`\`\`typescript
type ReactivitePupillaire = "Réactive" | "Paresseuse" | "Aréactive" | "Non évaluable"
\`\`\`

### Déficit moteur global
\`\`\`typescript
type DeficitMoteurGlobal =
  | "Absent"
  | "Hémiparésie droite"
  | "Hémiparésie gauche"
  | "Hémiplégie droite"
  | "Hémiplégie gauche"
  | "Paraparésie"
  | "Paraplégie"
  | "Tétraparésie"
  | "Tétraplégie"
  | "Monoparésie"
  | "Monoplégie"
\`\`\`

### Sensibilité globale
\`\`\`typescript
type SensibiliteGlobale = 
  | "Normale" 
  | "Hypoesthésie" 
  | "Anesthésie" 
  | "Hyperesthésie" 
  | "Dysesthésie"
\`\`\`

### Fonction sphinctérienne
\`\`\`typescript
type FonctionSphincter =
  | "Normale"
  | "Rétention urinaire"
  | "Incontinence urinaire"
  | "Rétention fécale"
  | "Incontinence fécale"
  | "Trouble mixte"
\`\`\`

### Score MRC (Testing musculaire)
\`\`\`typescript
type ScoreMRC = 0 | 1 | 2 | 3 | 4 | 5

// Descriptions:
// 0 = Aucune contraction
// 1 = Contraction visible sans mouvement
// 2 = Mouvement possible sans pesanteur
// 3 = Mouvement contre pesanteur
// 4 = Mouvement contre résistance
// 5 = Force normale
\`\`\`

### Réflexe ostéo-tendineux
\`\`\`typescript
type ReflexeOsteoTendineux = 
  | "Aboli" 
  | "Diminué" 
  | "Normal" 
  | "Vif" 
  | "Polycinétique" 
  | "Diffusé"
\`\`\`

### Tonus musculaire
\`\`\`typescript
type Tonus = 
  | "Normal" 
  | "Hypotonie" 
  | "Hypertonie spastique" 
  | "Hypertonie plastique" 
  | "Roue dentée"
\`\`\`

### Mode de sortie
\`\`\`typescript
type ModeSortie = 
  | "Domicile" 
  | "SSR" 
  | "Transfert" 
  | "HAD" 
  | "EHPAD" 
  | "Décès"
\`\`\`

---

## Interfaces principales

### IdentitePatient

\`\`\`typescript
interface IdentitePatient {
  // Identité civile
  ipp: string                          // Identifiant Permanent Patient (obligatoire)
  nom: string                          // Nom de famille (obligatoire)
  nomNaissance?: string                // Nom de naissance si différent
  prenom: string                       // Prénom (obligatoire)
  dateNaissance: string                // Format ISO 8601 (obligatoire)
  sexe: Sexe                           // M/F/Autre (obligatoire)
  numeroSecuriteSociale?: string       // 15 chiffres

  // Coordonnées
  adresse: {
    rue: string
    codePostal: string
    ville: string
    pays: string
  }
  telephone: string                    // Format: +33...
  telephoneSecondaire?: string
  email?: string
  profession?: string

  // Données médicales permanentes
  lateralite: Lateralite               // Important en neurochirurgie
  groupeSanguin?: string               // Ex: A+, O-, AB+...
  allergiesConnues: string[]           // Liste des allergies
  antecedentsFamiliaux?: string[]

  // Contacts d'urgence
  contacts: PersonneContact[]
  medecinTraitant?: {
    nom: string
    telephone: string
    email?: string
  }
}
\`\`\`

### PersonneContact

\`\`\`typescript
interface PersonneContact {
  nom: string
  prenom: string
  lienParente: string                  // Ex: Conjoint, Parent, Enfant...
  telephone: string
  telephoneSecondaire?: string
  email?: string
  estPersonneConfiance: boolean        // Désignée comme personne de confiance
}
\`\`\`

### ConstantesVitales

\`\`\`typescript
interface ConstantesVitales {
  dateHeure: string                    // ISO 8601
  tensionArterielle: {
    systolique: number                 // mmHg (normal: 90-140)
    diastolique: number                // mmHg (normal: 60-90)
  }
  frequenceCardiaque: number           // bpm (normal: 60-100)
  frequenceRespiratoire: number        // /min (normal: 12-20)
  temperature: number                  // °C (normal: 36.5-37.5)
  saturationO2: number                 // % (normal: ≥95)
  glycemieCapillaire?: number          // g/L
  auteur: string
}
\`\`\`

### ExamenCore

\`\`\`typescript
interface ExamenCore {
  dateHeure: string
  auteur: string
  fonction: string
  contexte: "Urgence" | "Consultation" | "Post-opératoire" | "Surveillance"

  constantes: ConstantesVitales
  gcs: GlasgowComaScale
  pupilles: ExamenPupilles
  deficitMoteurGlobal: DeficitMoteurGlobal
  sensibiliteGlobale: SensibiliteGlobale
  fonctionsSphinteriennes: FonctionSphincter[]
  signesGravite: SignesGravite

  commentaireLibre?: string
}
\`\`\`

### SignesGravite

\`\`\`typescript
interface SignesGravite {
  engagementCerebral: boolean          // URGENCE VITALE
  etatChoc: boolean                    // URGENCE VITALE
  detresseRespiratoire: boolean        // URGENCE VITALE
  criseConvulsive: boolean
  deficitNeurologiqueProgressif: boolean
  troubleVigilance: boolean
  autresSignes?: string[]
}
\`\`\`

### ExamenMoteurMRC

\`\`\`typescript
interface ExamenMoteurMRC {
  // Membre supérieur
  deltoide: { droit: ScoreMRC; gauche: ScoreMRC }
  biceps: { droit: ScoreMRC; gauche: ScoreMRC }
  triceps: { droit: ScoreMRC; gauche: ScoreMRC }
  extenseurPoignet: { droit: ScoreMRC; gauche: ScoreMRC }
  flechisseurDoigts: { droit: ScoreMRC; gauche: ScoreMRC }
  intrinsèquesMain: { droit: ScoreMRC; gauche: ScoreMRC }

  // Membre inférieur
  psoas: { droit: ScoreMRC; gauche: ScoreMRC }
  quadriceps: { droit: ScoreMRC; gauche: ScoreMRC }
  ischiojambiers: { droit: ScoreMRC; gauche: ScoreMRC }
  tibialAnterieur: { droit: ScoreMRC; gauche: ScoreMRC }
  tricepsSural: { droit: ScoreMRC; gauche: ScoreMRC }
  extenseurGrosOrteil: { droit: ScoreMRC; gauche: ScoreMRC }
}
\`\`\`

### RegroupementSyndromique

\`\`\`typescript
interface RegroupementSyndromique {
  dateHeure: string
  auteur: string

  htic: SyndromeHTIC
  pyramidal: SyndromePyramidal
  medullaire: SyndromeMedullaire
  queueCheval: SyndromeQueueCheval
  cerebelleux: SyndromeCerebelleux
  meninge: SyndromeMeninge

  autresSyndromes?: string[]
  syntheseNeurologique: string         // Généré automatiquement
}
\`\`\`

---

## Validation des données

### Règles de validation

| Champ | Règle | Message d'erreur |
|-------|-------|------------------|
| ipp | Non vide, unique | "IPP obligatoire" |
| dateNaissance | Date valide, < aujourd'hui | "Date invalide" |
| telephone | Format international | "Format téléphone invalide" |
| email | Format email valide | "Email invalide" |
| gcs.total | 3-15 | "Score GCS hors limites" |
| constantes.saturationO2 | 0-100 | "SpO2 hors limites" |
| mrc.* | 0-5 | "Score MRC invalide" |

### Contraintes d'intégrité

1. Un dossier ne peut être clôturé sans `sortie` renseignée
2. Un examen post-op nécessite au moins un CRO
3. Les dates doivent être cohérentes (admission < examens < sortie)

---

## Format d'export

### JSON Schema simplifié

\`\`\`json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "identite", "admission"],
  "properties": {
    "id": { "type": "string", "format": "uuid" },
    "statut": { "enum": ["En cours", "Clôturé", "Archivé"] },
    "identite": { "$ref": "#/definitions/IdentitePatient" },
    "admission": { "$ref": "#/definitions/Admission" }
  }
}
\`\`\`

---

*Document généré le 13/12/2025*
