import type {
  GlasgowComaScale,
  ScoreGCSYeux,
  ScoreGCSVerbal,
  ScoreGCSMoteur,
  ExamenCore,
  RegroupementSyndromique,
  ScoreMRC,
} from "../types/patient"

// GCS Descriptions
export const GCS_YEUX: Record<ScoreGCSYeux, string> = {
  4: "Ouverture spontanée",
  3: "Ouverture à la demande",
  2: "Ouverture à la douleur",
  1: "Aucune ouverture",
}

export const GCS_VERBAL: Record<ScoreGCSVerbal, string> = {
  5: "Orienté",
  4: "Confus",
  3: "Mots inappropriés",
  2: "Sons incompréhensibles",
  1: "Aucune réponse",
}

export const GCS_MOTEUR: Record<ScoreGCSMoteur, string> = {
  6: "Obéit aux ordres",
  5: "Localise la douleur",
  4: "Retrait à la douleur",
  3: "Flexion anormale (décortication)",
  2: "Extension anormale (décérébration)",
  1: "Aucune réponse",
}

// MRC Descriptions
export const MRC_DESCRIPTIONS: Record<ScoreMRC, string> = {
  0: "Aucune contraction",
  1: "Contraction visible sans mouvement",
  2: "Mouvement possible sans pesanteur",
  3: "Mouvement contre pesanteur",
  4: "Mouvement contre résistance",
  5: "Force normale",
}

export function calculateGCSTotal(yeux: ScoreGCSYeux, verbal: ScoreGCSVerbal, moteur: ScoreGCSMoteur): number {
  return yeux + verbal + moteur
}

export function interpretGCS(total: number): GlasgowComaScale["interpretation"] {
  if (total >= 14) return "Normal"
  if (total >= 12) return "Altération légère"
  if (total >= 9) return "Altération modérée"
  if (total >= 6) return "Coma"
  return "Coma profond"
}

// Génération ID unique
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Formatage date
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Calcul de l'âge
export function calculateAge(dateNaissance: string): number {
  const today = new Date()
  const birthDate = new Date(dateNaissance)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Génération du résumé syndromique automatique
export function generateSyndromeSummary(regroupement: RegroupementSyndromique): string {
  const syndromes: string[] = []

  if (regroupement.htic.present) {
    syndromes.push(`HTIC ${regroupement.htic.gravite.toLowerCase()}`)
  }
  if (regroupement.pyramidal.present) {
    syndromes.push(`Syndrome pyramidal (${regroupement.pyramidal.topographie})`)
  }
  if (regroupement.medullaire.present) {
    syndromes.push(
      `Syndrome médullaire ${regroupement.medullaire.typeAtteinte.toLowerCase()} niveau ${regroupement.medullaire.niveau || "indéterminé"}`,
    )
  }
  if (regroupement.queueCheval.present) {
    syndromes.push(
      `Syndrome de la queue de cheval ${regroupement.queueCheval.complet ? "complet" : "incomplet"}${regroupement.queueCheval.urgenceChirurgicale ? " - URGENCE CHIRURGICALE" : ""}`,
    )
  }
  if (regroupement.cerebelleux.present) {
    syndromes.push(`Syndrome cérébelleux ${regroupement.cerebelleux.type.toLowerCase()}`)
  }
  if (regroupement.meninge.present) {
    syndromes.push("Syndrome méningé")
  }

  if (syndromes.length === 0) {
    return "Pas de syndrome neurologique identifié"
  }

  return syndromes.join(" + ")
}

// Calcul du score ASIA (simplifié)
export function calculateASIAScore(examenCore: ExamenCore): string {
  if (examenCore.deficitMoteurGlobal === "Absent") {
    return "E - Normal"
  }
  if (examenCore.deficitMoteurGlobal.includes("plégie")) {
    if (examenCore.sensibiliteGlobale === "Anesthésie") {
      return "A - Complet"
    }
    return "B - Sensitif incomplet"
  }
  if (examenCore.deficitMoteurGlobal.includes("parésie")) {
    return "C/D - Moteur incomplet"
  }
  return "Non déterminé"
}

// Validation des données obligatoires
export function validateExamenCore(examen: Partial<ExamenCore>): string[] {
  const errors: string[] = []

  if (!examen.dateHeure) errors.push("Date et heure obligatoires")
  if (!examen.auteur) errors.push("Auteur obligatoire")
  if (!examen.gcs) errors.push("GCS obligatoire")
  if (!examen.pupilles) errors.push("Examen pupillaire obligatoire")
  if (!examen.constantes) errors.push("Constantes vitales obligatoires")

  return errors
}
