// =============================================================================
// TYPES DE DONNÉES - DOSSIER ÉLECTRONIQUE PATIENT NEUROCHIRURGIE
// =============================================================================

// -----------------------------------------------------------------------------
// I. IDENTITÉ PATIENT (Master Patient Index)
// -----------------------------------------------------------------------------

export type Sexe = "M" | "F" | "Autre"
export type Lateralite = "Droitier" | "Gaucher" | "Ambidextre" | "Non déterminé"

export interface PersonneContact {
  nom: string
  prenom: string
  lienParente: string
  telephone: string
  telephoneSecondaire?: string
  email?: string
  estPersonneConfiance: boolean
}

export interface IdentitePatient {
  // Identité civile
  ipp: string // Identifiant Permanent Patient
  nom: string
  nomNaissance?: string
  prenom: string
  dateNaissance: string // ISO 8601
  sexe: Sexe
  numeroSecuriteSociale?: string

  // Données socio-démographiques
  adresse: {
    rue: string
    codePostal: string
    ville: string
    pays: string
  }
  telephone: string
  telephoneSecondaire?: string
  email?: string
  profession?: string

  // Données médicales permanentes
  lateralite: Lateralite
  groupeSanguin?: string
  allergiesConnues: string[]
  antecedentsFamiliaux?: string[]

  // Contacts
  contacts: PersonneContact[]
  medecinTraitant?: {
    nom: string
    telephone: string
    email?: string
  }
}

// -----------------------------------------------------------------------------
// II. ADMISSION / SÉJOUR
// -----------------------------------------------------------------------------

export type ModeEntree =
  | "Urgences"
  | "Consultation programmée"
  | "Transfert interne"
  | "Transfert externe"
  | "Hospitalisation programmée"

export type TypeUrgence = "Vitale" | "Fonctionnelle" | "Relative" | "Non urgente"

export interface Admission {
  numeroSejour: string
  dateHeureAdmission: string // ISO 8601
  modeEntree: ModeEntree
  serviceOrigine?: string
  etablissementOrigine?: string

  // Motif et contexte
  motifPrincipal: string
  motifDetaille?: string
  typeUrgence: TypeUrgence

  // Chronologie des symptômes
  chronologieSymptomes: {
    dateDebut: string
    description: string
    evolution: "Brutale" | "Progressive" | "Fluctuante"
    facteursDeclenchants?: string
    facteursAggravants?: string
    facteursSoulageants?: string
  }

  // Hypothèses initiales
  hypotheseDiagnostique: string
  hypothesesSecondaires?: string[]

  // Médecins impliqués
  medecinsImpliques: {
    role: string
    nom: string
    fonction: string
    dateHeure: string
  }[]

  // Traçabilité
  auteurAdmission: string
  fonctionAuteur: string
}

// -----------------------------------------------------------------------------
// III. EXAMEN CLINIQUE NEUROCHIRURGICAL
// -----------------------------------------------------------------------------

// A. EXAMEN CORE (obligatoire, urgence-compatible)

export interface ConstantesVitales {
  dateHeure: string
  tensionArterielle: {
    systolique: number
    diastolique: number
  }
  frequenceCardiaque: number
  frequenceRespiratoire: number
  temperature: number
  saturationO2: number
  glycemieCapillaire?: number
  auteur: string
}

export type ScoreGCSYeux = 1 | 2 | 3 | 4
export type ScoreGCSVerbal = 1 | 2 | 3 | 4 | 5
export type ScoreGCSMoteur = 1 | 2 | 3 | 4 | 5 | 6

export interface GlasgowComaScale {
  yeux: {
    score: ScoreGCSYeux
    description: string
  }
  verbal: {
    score: ScoreGCSVerbal
    description: string
    nonEvaluable?: boolean
    raison?: string // ex: intubé, aphasique
  }
  moteur: {
    score: ScoreGCSMoteur
    description: string
  }
  total: number
  interpretation: "Normal" | "Altération légère" | "Altération modérée" | "Coma" | "Coma profond"
}

export type ReactivitePupillaire = "Réactive" | "Paresseuse" | "Aréactive" | "Non évaluable"

export type TaillePupillaire = "Myosis" | "Intermédiaire" | "Mydriase"

export interface ExamenPupilles {
  oeilDroit: {
    taille: TaillePupillaire
    tailleMm?: number
    reactivite: ReactivitePupillaire
    forme: "Ronde" | "Ovalaire" | "Irrégulière"
  }
  oeilGauche: {
    taille: TaillePupillaire
    tailleMm?: number
    reactivite: ReactivitePupillaire
    forme: "Ronde" | "Ovalaire" | "Irrégulière"
  }
  anisocorie: boolean
  reflexePhotomoteurDirect: boolean
  reflexePhotomoteurConsensuel: boolean
}

export type DeficitMoteurGlobal =
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

export type SensibiliteGlobale = "Normale" | "Hypoesthésie" | "Anesthésie" | "Hyperesthésie" | "Dysesthésie"

export type FonctionSphincter =
  | "Normale"
  | "Rétention urinaire"
  | "Incontinence urinaire"
  | "Rétention fécale"
  | "Incontinence fécale"
  | "Trouble mixte"

export interface SignesGravite {
  engagementCerebral: boolean
  etatChoc: boolean
  detresseRespiratoire: boolean
  criseConvulsive: boolean
  deficitNeurologiqueProgressif: boolean
  troubleVigilance: boolean
  autresSignes?: string[]
}

export interface ExamenCore {
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

// B. EXAMEN EXTENDED (si état stable)

export type ScoreMRC = 0 | 1 | 2 | 3 | 4 | 5

export const MRC_DESCRIPTIONS: Record<ScoreMRC, string> = {
  0: "Aucune contraction",
  1: "Contraction visible sans mouvement",
  2: "Mouvement possible sans pesanteur",
  3: "Mouvement contre pesanteur",
  4: "Mouvement contre résistance",
  5: "Force normale",
}

export interface ExamenMoteurMRC {
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

export type ReflexeOsteoTendineux = "Aboli" | "Diminué" | "Normal" | "Vif" | "Polycinétique" | "Diffusé"

export interface ReflexesOT {
  bicipital: { droit: ReflexeOsteoTendineux; gauche: ReflexeOsteoTendineux }
  tricipital: { droit: ReflexeOsteoTendineux; gauche: ReflexeOsteoTendineux }
  styloRadial: { droit: ReflexeOsteoTendineux; gauche: ReflexeOsteoTendineux }
  rotulien: { droit: ReflexeOsteoTendineux; gauche: ReflexeOsteoTendineux }
  achilleen: { droit: ReflexeOsteoTendineux; gauche: ReflexeOsteoTendineux }
}

export type Tonus = "Normal" | "Hypotonie" | "Hypertonie spastique" | "Hypertonie plastique" | "Roue dentée"

export interface ReflexesCutanes {
  babinski: { droit: "Flexion" | "Extension" | "Indifférent"; gauche: "Flexion" | "Extension" | "Indifférent" }
  cutanesAbdominaux: { present: boolean; symetrique: boolean }
  reflexesCremasterien?: { droit: boolean; gauche: boolean }
  reflexeAnalCutane?: boolean
}

export type TypeSensibilite = "Superficielle" | "Profonde" | "Mixte"
export type TopographieSensibilite =
  | "Métamérique"
  | "Radiculaire"
  | "Tronculaire"
  | "Hémicorporelle"
  | "Distale"
  | "En gants et chaussettes"

export interface SensibiliteDetaillee {
  typeAtteinte: TypeSensibilite
  topographie: TopographieSensibilite
  niveauSensitif?: string // ex: T10
  tactFin: { normale: boolean; commentaire?: string }
  douleur: { normale: boolean; commentaire?: string }
  temperature: { normale: boolean; commentaire?: string }
  sensibiliteProfonde: {
    pallesthesie: boolean
    arthesthesie: boolean
    stereognosie?: boolean
  }
}

export type PaireCranienne = "I" | "II" | "III" | "IV" | "V" | "VI" | "VII" | "VIII" | "IX" | "X" | "XI" | "XII"

export interface ExamenPairesCraniennes {
  I_olfactif: { normal: boolean; commentaire?: string }
  II_optique: {
    acuiteVisuelle?: { droit: string; gauche: string }
    champVisuel: "Normal" | "HLH droite" | "HLH gauche" | "Quadranopsie" | "Autre"
    fondOeil?: string
    normal: boolean
    commentaire?: string
  }
  III_IV_VI_oculomoteurs: {
    motiliteOculaire: "Normale" | "Paralysie III" | "Paralysie IV" | "Paralysie VI" | "Ophtalmoplégie"
    ptosis: boolean
    normal: boolean
    commentaire?: string
  }
  V_trijumeau: {
    sensibiliteFace: "Normale" | "Hypoesthésie V1" | "Hypoesthésie V2" | "Hypoesthésie V3" | "Autre"
    reflexeCorneen: boolean
    mastication: "Normale" | "Déficitaire"
    normal: boolean
    commentaire?: string
  }
  VII_facial: {
    motiliteFaciale:
      | "Normale"
      | "PF centrale droite"
      | "PF centrale gauche"
      | "PF périphérique droite"
      | "PF périphérique gauche"
    normal: boolean
    commentaire?: string
  }
  VIII_vestibulocochleaire: {
    audition: "Normale" | "Hypoacousie droite" | "Hypoacousie gauche" | "Surdité"
    nystagmus: boolean
    typeNystagmus?: string
    normal: boolean
    commentaire?: string
  }
  IX_X_glossopharyngien_vague: {
    deglutition: "Normale" | "Dysphagie" | "Fausses routes"
    voix: "Normale" | "Dysphonie" | "Voix nasonnée"
    reflexeNauseux: boolean
    normal: boolean
    commentaire?: string
  }
  XI_spinal: {
    sternoCleidoMastoidien: { droit: "Normal" | "Déficitaire"; gauche: "Normal" | "Déficitaire" }
    trapeze: { droit: "Normal" | "Déficitaire"; gauche: "Normal" | "Déficitaire" }
    normal: boolean
    commentaire?: string
  }
  XII_hypoglosse: {
    motiliteLangue: "Normale" | "Déviation droite" | "Déviation gauche" | "Fasciculations"
    normal: boolean
    commentaire?: string
  }
}

export interface FonctionsCognitives {
  orientation: {
    temporelle: boolean
    spatiale: boolean
    personnelle: boolean
  }
  attention: "Normale" | "Altérée"
  memoire: {
    immediate: "Normale" | "Altérée"
    recente: "Normale" | "Altérée"
    ancienne: "Normale" | "Altérée"
  }
  langage: {
    expression: "Normal" | "Aphasie de Broca" | "Aphasie de Wernicke" | "Aphasie mixte" | "Dysarthrie"
    comprehension: "Normale" | "Altérée"
    denomination: "Normale" | "Altérée"
    repetition: "Normale" | "Altérée"
  }
  praxies: "Normales" | "Apraxie idéomotrice" | "Apraxie idéatoire" | "Apraxie constructive"
  gnosies: "Normales" | "Agnosie visuelle" | "Agnosie tactile" | "Anosognosie" | "Héminégligence"
  fonctionsExecutives: "Normales" | "Altérées"
  scoreMMSE?: number
}

export interface Cephalees {
  presentes: boolean
  intensiteEVA?: number // 0-10
  localisation?: string
  type?: "Pulsatile" | "En casque" | "En étau" | "Lancinante" | "Autre"
  facteursDeclenchants?: string
  signesAccompagnants?: {
    photophobie: boolean
    phonophobie: boolean
    nausees: boolean
    vomissements: boolean
  }
}

export interface Coordination {
  epreuveDDoigNez: { droit: "Normale" | "Dysmétrie" | "Hypermétrie"; gauche: "Normale" | "Dysmétrie" | "Hypermétrie" }
  epreuveDoigtDoigt: { normale: boolean; commentaire?: string }
  epreuvetalontGenouTibia: { droit: "Normale" | "Dysmétrie"; gauche: "Normale" | "Dysmétrie" }
  adiadococinesie: boolean
  tremblement: {
    present: boolean
    type?: "Repos" | "Action" | "Intentionnel" | "Postural"
  }
}

export interface MarcheStation {
  stationDebout: "Stable" | "Instable" | "Impossible"
  romberg: "Négatif" | "Positif" | "Non réalisable"
  marche: "Normale" | "Ataxique" | "Spastique" | "Steppage" | "Fauchage" | "Festinante" | "Impossible"
  marcheTalon: "Possible" | "Impossible"
  marchePointes: "Possible" | "Impossible"
  marcheAveugle: "Normale" | "Déviation" | "Impossible"
  perimetre?: string
}

export interface ExamenPerineal {
  indique: boolean
  sensibilitePerineale?: "Normale" | "Hypoesthésie" | "Anesthésie en selle"
  tonusAnalVolontaire?: "Normal" | "Diminué" | "Absent"
  reflexeBulbocaverneux?: boolean
  reflexeAnalCutane?: boolean
}

export interface ExamenExtended {
  dateHeure: string
  auteur: string
  fonction: string

  fonctionsCognitives: FonctionsCognitives
  cephalees: Cephalees
  pairesCraniennes: ExamenPairesCraniennes
  examenMoteurMRC: ExamenMoteurMRC
  tonus: { membreSupDroit: Tonus; membreSupGauche: Tonus; membreInfDroit: Tonus; membreInfGauche: Tonus }
  reflexesOT: ReflexesOT
  reflexesCutanes: ReflexesCutanes
  sensibiliteDetaillee: SensibiliteDetaillee
  coordination: Coordination
  marcheStation: MarcheStation
  examenPerineal: ExamenPerineal

  commentaireLibre?: string
}

// -----------------------------------------------------------------------------
// IV. REGROUPEMENT SYNDROMIQUE
// -----------------------------------------------------------------------------

export interface SyndromeHTIC {
  present: boolean
  arguments: {
    cephalees: boolean
    vomissements: boolean
    troublesVisuels: boolean
    oedePapillaire: boolean
    troublesVigilance: boolean
  }
  gravite: "Légère" | "Modérée" | "Sévère"
  justification?: string
}

export interface SyndromePyramidal {
  present: boolean
  topographie: "Hémicorporel droit" | "Hémicorporel gauche" | "Parapyramidal" | "Tétrapyramidal" | "Absent"
  arguments: {
    deficitMoteur: boolean
    hypertonieSpastique: boolean
    hyperreflexie: boolean
    babinski: boolean
    syncinésies: boolean
  }
  justification?: string
}

export interface SyndromeMedullaire {
  present: boolean
  niveau?: string
  typeAtteinte: "Complet" | "Incomplet" | "Absent"
  arguments: {
    niveauSensitif: boolean
    syndromesSousLesionnels: boolean
    troublesSphinctériens: boolean
  }
  justification?: string
}

export interface SyndromeQueueCheval {
  present: boolean
  complet: boolean
  arguments: {
    douleurSciatique: boolean
    troublesSensitifsSelle: boolean
    troublesSphinctériens: boolean
    abolitionReflexes: boolean
  }
  urgenceChirurgicale: boolean
  justification?: string
}

export interface SyndromeCerebelleux {
  present: boolean
  type: "Statique" | "Cinétique" | "Mixte" | "Absent"
  arguments: {
    ataxie: boolean
    dysmétrie: boolean
    adiadococinésie: boolean
    hypotonie: boolean
    dysarthrie: boolean
    nystagmus: boolean
  }
  justification?: string
}

export interface SyndromeMeninge {
  present: boolean
  arguments: {
    cephalees: boolean
    raideurNuque: boolean
    signeKernig: boolean
    signeBrudzinski: boolean
    photophobie: boolean
    fievre: boolean
  }
  justification?: string
}

export interface RegroupementSyndromique {
  dateHeure: string
  auteur: string

  htic: SyndromeHTIC
  pyramidal: SyndromePyramidal
  medullaire: SyndromeMedullaire
  queueCheval: SyndromeQueueCheval
  cerebelleux: SyndromeCerebelleux
  meninge: SyndromeMeninge

  autresSyndromes?: string[]
  syntheseNeurologique: string
}

// -----------------------------------------------------------------------------
// V. EXAMENS COMPLÉMENTAIRES
// -----------------------------------------------------------------------------

export type TypeImagerie = "TDM" | "IRM" | "Angiographie" | "Radiographie" | "Échographie"

export interface ExamenImagerie {
  id: string
  type: TypeImagerie
  region: string
  dateRealisation: string
  injection: boolean
  resultats: string
  conclusion: string
  urgence: boolean
  radiologue?: string
}

export interface ExamenBiologique {
  id: string
  datePrelevement: string
  typeAnalyse: string
  resultats: {
    parametre: string
    valeur: string
    unite: string
    normes: string
    anomalie: boolean
  }[]
  commentaire?: string
}

export interface ScoreValide {
  nom: string
  valeur: number | string
  interpretation: string
  dateCalcul: string
}

export interface ExamensComplementaires {
  imagerie: ExamenImagerie[]
  biologie: ExamenBiologique[]
  scores: ScoreValide[]
  autresExamens?: {
    type: string
    date: string
    resultat: string
  }[]
}

// -----------------------------------------------------------------------------
// VI. DÉCISION THÉRAPEUTIQUE
// -----------------------------------------------------------------------------

export type TypeDecision =
  | "Chirurgie urgente"
  | "Chirurgie différée"
  | "Traitement médical"
  | "Surveillance"
  | "Transfert"
  | "Abstention thérapeutique"

export interface DecisionTherapeutique {
  dateHeure: string
  auteur: string
  fonction: string

  typeDecision: TypeDecision
  indicationOperatoire: boolean

  argumentaireMedical: string
  beneficesAttendus: string[]
  risquesIdentifies: string[]

  consentementPatient: {
    obtenu: boolean
    dateSignature?: string
    personne?: string // si patient incapable
  }

  planificationChirurgie?: {
    datePrevisionnelle: string
    typeIntervention: string
    chirurgien: string
    anesthesiste?: string
  }
}

// -----------------------------------------------------------------------------
// VII. COMPTE RENDU OPÉRATOIRE
// -----------------------------------------------------------------------------

export interface CompteRenduOperatoire {
  id: string
  dateHeure: string

  // Équipe
  chirurgienPrincipal: string
  aidesOperatoires: string[]
  anesthesiste: string
  ibode?: string
  iade?: string

  // Diagnostic
  diagnosticPreOperatoire: string
  diagnosticPerOperatoire?: string

  // Intervention
  intituleIntervention: string
  voieAbord: string
  descriptionGeste: string
  constatationsPerOperatoires: string

  // Matériel
  materielImplante?: string[]
  materielRetire?: string[]

  // Incidents
  incidents: boolean
  descriptionIncidents?: string
  perteSanguine?: number // mL

  // Conclusion
  conclusion: string
  consignesPostOperatoires: string[]

  // Prélèvements
  prelevementsAnatomopathologiques?: {
    nature: string
    nombre: number
    destination: string
  }[]
}

// -----------------------------------------------------------------------------
// VIII. ÉVOLUTION POST-OPÉRATOIRE
// -----------------------------------------------------------------------------

export interface EvaluationPostOp {
  jour: string // J0, J1, J2...
  dateHeure: string
  auteur: string
  fonction: string

  constantes: ConstantesVitales
  gcs: GlasgowComaScale

  examenNeurologique: {
    amelioration: boolean
    stagnation: boolean
    aggravation: boolean
    details: string
  }

  douleur: {
    eva: number
    localisation: string
    traitement: string
  }

  cicatrice?: {
    aspect: "Propre" | "Inflammatoire" | "Infectée" | "Désunie"
    ecoulement: boolean
    typeEcoulement?: string
  }

  complications?: {
    type: string
    gravite: "Mineure" | "Majeure"
    prisEnCharge: string
  }[]

  traitements: {
    medicament: string
    posologie: string
    voie: string
  }[]

  examensRealises?: string[]

  planJourSuivant: string
}

export interface EvolutionPostOperatoire {
  evaluations: EvaluationPostOp[]
  complications: {
    date: string
    type: string
    description: string
    gravite: "Mineure" | "Majeure" | "Vitale"
    prisEnCharge: string
    evolution: string
  }[]
}

// -----------------------------------------------------------------------------
// IX. SORTIE
// -----------------------------------------------------------------------------

export type ModeSortie = "Domicile" | "SSR" | "Transfert" | "HAD" | "EHPAD" | "Décès"

export interface Sortie {
  dateHeure: string
  auteur: string
  fonction: string

  modeSortie: ModeSortie
  etablissementDestination?: string

  diagnosticFinal: {
    principal: string
    associes: string[]
    codesCIM10?: string[]
  }

  etatNeurologiqueSortie: {
    gcs: number
    deficits: string[]
    ameliorationParRapportEntree: boolean
    scoreRankinModifie?: number
  }

  ordonnanceSortie: {
    medicament: string
    posologie: string
    duree: string
    instructions?: string
  }[]

  consignesSortie: string[]
  signesAlerte: string[]

  suiviPrevu: {
    type: "Consultation" | "Imagerie" | "Rééducation" | "Autre"
    delai: string
    praticien?: string
    lieu?: string
  }[]

  documentsRemis: string[]
}

// -----------------------------------------------------------------------------
// DOSSIER COMPLET
// -----------------------------------------------------------------------------

export interface DossierPatientNeurochirurgie {
  id: string
  dateCreation: string
  derniereMiseAJour: string
  statut: "En cours" | "Clôturé" | "Archivé"

  identite: IdentitePatient
  admission: Admission
  examensCore: ExamenCore[]
  examensExtended: ExamenExtended[]
  regroupementSyndromique?: RegroupementSyndromique
  examensComplementaires: ExamensComplementaires
  decisionTherapeutique?: DecisionTherapeutique
  comptesRendusOperatoires: CompteRenduOperatoire[]
  evolutionPostOperatoire?: EvolutionPostOperatoire
  sortie?: Sortie
}
