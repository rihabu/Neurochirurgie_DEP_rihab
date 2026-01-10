"use client"

import { usePatient } from "@/lib/patient-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Activity, Eye, Brain, AlertTriangle, Save } from "lucide-react"
import {
  GCS_YEUX,
  GCS_VERBAL,
  GCS_MOTEUR,
  calculateGCSTotal,
  interpretGCS,
  generateId,
} from "@/lib/utils/patient-utils"
import type {
  ExamenCore,
  ScoreGCSYeux,
  ScoreGCSVerbal,
  ScoreGCSMoteur,
  DeficitMoteurGlobal,
  SensibiliteGlobale,
  FonctionSphincter,
  TaillePupillaire,
  ReactivitePupillaire,
} from "@/lib/types/patient"
import { useState } from "react"

const defaultExamenCore = (): ExamenCore => ({
  dateHeure: new Date().toISOString(),
  auteur: "",
  fonction: "",
  contexte: "Urgence",
  constantes: {
    dateHeure: new Date().toISOString(),
    tensionArterielle: { systolique: 120, diastolique: 80 },
    frequenceCardiaque: 70,
    frequenceRespiratoire: 16,
    temperature: 37,
    saturationO2: 98,
    auteur: "",
  },
  gcs: {
    yeux: { score: 4, description: GCS_YEUX[4] },
    verbal: { score: 5, description: GCS_VERBAL[5] },
    moteur: { score: 6, description: GCS_MOTEUR[6] },
    total: 15,
    interpretation: "Normal",
  },
  pupilles: {
    oeilDroit: { taille: "Intermédiaire", reactivite: "Réactive", forme: "Ronde" },
    oeilGauche: { taille: "Intermédiaire", reactivite: "Réactive", forme: "Ronde" },
    anisocorie: false,
    reflexePhotomoteurDirect: true,
    reflexePhotomoteurConsensuel: true,
  },
  deficitMoteurGlobal: "Absent",
  sensibiliteGlobale: "Normale",
  fonctionsSphinteriennes: ["Normale"],
  signesGravite: {
    engagementCerebral: false,
    etatChoc: false,
    detresseRespiratoire: false,
    criseConvulsive: false,
    deficitNeurologiqueProgressif: false,
    troubleVigilance: false,
  },
})

export function ExamenCoreSection() {
  const { dossier, updateDossier } = usePatient()
  const [currentExamen, setCurrentExamen] = useState<ExamenCore>(defaultExamenCore())

  if (!dossier) return null

  const updateExamen = (field: keyof ExamenCore, value: unknown) => {
    setCurrentExamen((prev) => ({ ...prev, [field]: value }))
  }

  const updateConstantes = (field: string, value: unknown) => {
    setCurrentExamen((prev) => ({
      ...prev,
      constantes: { ...prev.constantes, [field]: value },
    }))
  }

  const updateGCS = (type: "yeux" | "verbal" | "moteur", score: number) => {
    const newGCS = { ...currentExamen.gcs }
    if (type === "yeux") {
      const s = score as ScoreGCSYeux
      newGCS.yeux = { score: s, description: GCS_YEUX[s] }
    } else if (type === "verbal") {
      const s = score as ScoreGCSVerbal
      newGCS.verbal = { score: s, description: GCS_VERBAL[s] }
    } else {
      const s = score as ScoreGCSMoteur
      newGCS.moteur = { score: s, description: GCS_MOTEUR[s] }
    }
    const total = calculateGCSTotal(newGCS.yeux.score, newGCS.verbal.score, newGCS.moteur.score)
    newGCS.total = total
    newGCS.interpretation = interpretGCS(total)
    setCurrentExamen((prev) => ({ ...prev, gcs: newGCS }))
  }

  const updatePupille = (oeil: "oeilDroit" | "oeilGauche", field: string, value: unknown) => {
    setCurrentExamen((prev) => ({
      ...prev,
      pupilles: {
        ...prev.pupilles,
        [oeil]: { ...prev.pupilles[oeil], [field]: value },
      },
    }))
  }

  const updateSigneGravite = (field: string, value: boolean) => {
    setCurrentExamen((prev) => ({
      ...prev,
      signesGravite: { ...prev.signesGravite, [field]: value },
    }))
  }

  const saveExamen = () => {
    const examWithId = { ...currentExamen, id: generateId() }
    updateDossier({
      examensCore: [...dossier.examensCore, examWithId],
    })
    setCurrentExamen(defaultExamenCore())
  }

  const hasGravitySigns = Object.values(currentExamen.signesGravite).some((v) => v === true)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Examen CORE</h2>
          <p className="text-muted-foreground">Examen obligatoire, urgence-compatible</p>
        </div>
        {dossier.examensCore.length > 0 && (
          <Badge variant="secondary">{dossier.examensCore.length} examen(s) enregistré(s)</Badge>
        )}
      </div>

      {/* Métadonnées */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'examen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              label="Date et heure"
              name="dateHeure"
              type="datetime-local"
              value={currentExamen.dateHeure.slice(0, 16)}
              onChange={(v) => updateExamen("dateHeure", new Date(v).toISOString())}
              required
            />
            <FormField
              label="Auteur"
              name="auteur"
              value={currentExamen.auteur}
              onChange={(v) => updateExamen("auteur", v)}
              required
              placeholder="Nom de l'examinateur"
            />
            <FormField
              label="Fonction"
              name="fonction"
              value={currentExamen.fonction}
              onChange={(v) => updateExamen("fonction", v)}
              required
              placeholder="Ex: Interne, CCA..."
            />
            <FormField
              label="Contexte"
              name="contexte"
              type="select"
              value={currentExamen.contexte}
              onChange={(v) => updateExamen("contexte", v)}
              options={[
                { value: "Urgence", label: "Urgence" },
                { value: "Consultation", label: "Consultation" },
                { value: "Post-opératoire", label: "Post-opératoire" },
                { value: "Surveillance", label: "Surveillance" },
              ]}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Constantes Vitales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Constantes Vitales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <FormField
              label="TA Systolique"
              name="systolique"
              type="number"
              value={currentExamen.constantes.tensionArterielle.systolique}
              onChange={(v) =>
                updateConstantes("tensionArterielle", {
                  ...currentExamen.constantes.tensionArterielle,
                  systolique: Number.parseInt(v),
                })
              }
              hint="mmHg"
            />
            <FormField
              label="TA Diastolique"
              name="diastolique"
              type="number"
              value={currentExamen.constantes.tensionArterielle.diastolique}
              onChange={(v) =>
                updateConstantes("tensionArterielle", {
                  ...currentExamen.constantes.tensionArterielle,
                  diastolique: Number.parseInt(v),
                })
              }
              hint="mmHg"
            />
            <FormField
              label="FC"
              name="frequenceCardiaque"
              type="number"
              value={currentExamen.constantes.frequenceCardiaque}
              onChange={(v) => updateConstantes("frequenceCardiaque", Number.parseInt(v))}
              hint="bpm"
            />
            <FormField
              label="FR"
              name="frequenceRespiratoire"
              type="number"
              value={currentExamen.constantes.frequenceRespiratoire}
              onChange={(v) => updateConstantes("frequenceRespiratoire", Number.parseInt(v))}
              hint="/min"
            />
            <FormField
              label="Température"
              name="temperature"
              type="number"
              value={currentExamen.constantes.temperature}
              onChange={(v) => updateConstantes("temperature", Number.parseFloat(v))}
              hint="°C"
            />
            <FormField
              label="SpO2"
              name="saturationO2"
              type="number"
              value={currentExamen.constantes.saturationO2}
              onChange={(v) => updateConstantes("saturationO2", Number.parseInt(v))}
              hint="%"
            />
          </div>
        </CardContent>
      </Card>

      {/* GCS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Score de Glasgow (GCS)
          </CardTitle>
          <CardDescription>
            <span className="text-2xl font-bold text-primary">{currentExamen.gcs.total}/15</span>
            <span className="ml-2 text-muted-foreground">- {currentExamen.gcs.interpretation}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Yeux */}
          <div>
            <label className="text-sm font-medium mb-2 block">Ouverture des yeux (E)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {([4, 3, 2, 1] as ScoreGCSYeux[]).map((score) => (
                <button
                  key={score}
                  onClick={() => updateGCS("yeux", score)}
                  className={`p-3 text-left rounded-lg border transition-colors ${
                    currentExamen.gcs.yeux.score === score
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-bold">{score}</div>
                  <div className="text-xs text-muted-foreground">{GCS_YEUX[score]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Verbal */}
          <div>
            <label className="text-sm font-medium mb-2 block">Réponse verbale (V)</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {([5, 4, 3, 2, 1] as ScoreGCSVerbal[]).map((score) => (
                <button
                  key={score}
                  onClick={() => updateGCS("verbal", score)}
                  className={`p-3 text-left rounded-lg border transition-colors ${
                    currentExamen.gcs.verbal.score === score
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-bold">{score}</div>
                  <div className="text-xs text-muted-foreground">{GCS_VERBAL[score]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Moteur */}
          <div>
            <label className="text-sm font-medium mb-2 block">Réponse motrice (M)</label>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              {([6, 5, 4, 3, 2, 1] as ScoreGCSMoteur[]).map((score) => (
                <button
                  key={score}
                  onClick={() => updateGCS("moteur", score)}
                  className={`p-3 text-left rounded-lg border transition-colors ${
                    currentExamen.gcs.moteur.score === score
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="font-bold">{score}</div>
                  <div className="text-xs text-muted-foreground">{GCS_MOTEUR[score]}</div>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pupilles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Examen Pupillaire
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Oeil Droit */}
            <div className="space-y-4 p-4 border border-border rounded-lg">
              <h4 className="font-medium">Oeil Droit</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Taille"
                  name="tailleDroit"
                  type="select"
                  value={currentExamen.pupilles.oeilDroit.taille}
                  onChange={(v) => updatePupille("oeilDroit", "taille", v as TaillePupillaire)}
                  options={[
                    { value: "Myosis", label: "Myosis" },
                    { value: "Intermédiaire", label: "Intermédiaire" },
                    { value: "Mydriase", label: "Mydriase" },
                  ]}
                />
                <FormField
                  label="Réactivité"
                  name="reactiviteDroit"
                  type="select"
                  value={currentExamen.pupilles.oeilDroit.reactivite}
                  onChange={(v) => updatePupille("oeilDroit", "reactivite", v as ReactivitePupillaire)}
                  options={[
                    { value: "Réactive", label: "Réactive" },
                    { value: "Paresseuse", label: "Paresseuse" },
                    { value: "Aréactive", label: "Aréactive" },
                    { value: "Non évaluable", label: "Non évaluable" },
                  ]}
                />
              </div>
            </div>

            {/* Oeil Gauche */}
            <div className="space-y-4 p-4 border border-border rounded-lg">
              <h4 className="font-medium">Oeil Gauche</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Taille"
                  name="tailleGauche"
                  type="select"
                  value={currentExamen.pupilles.oeilGauche.taille}
                  onChange={(v) => updatePupille("oeilGauche", "taille", v as TaillePupillaire)}
                  options={[
                    { value: "Myosis", label: "Myosis" },
                    { value: "Intermédiaire", label: "Intermédiaire" },
                    { value: "Mydriase", label: "Mydriase" },
                  ]}
                />
                <FormField
                  label="Réactivité"
                  name="reactiviteGauche"
                  type="select"
                  value={currentExamen.pupilles.oeilGauche.reactivite}
                  onChange={(v) => updatePupille("oeilGauche", "reactivite", v as ReactivitePupillaire)}
                  options={[
                    { value: "Réactive", label: "Réactive" },
                    { value: "Paresseuse", label: "Paresseuse" },
                    { value: "Aréactive", label: "Aréactive" },
                    { value: "Non évaluable", label: "Non évaluable" },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentExamen.pupilles.anisocorie}
                onChange={(e) =>
                  setCurrentExamen((prev) => ({
                    ...prev,
                    pupilles: { ...prev.pupilles, anisocorie: e.target.checked },
                  }))
                }
                className="h-4 w-4"
              />
              <span className="text-sm">Anisocorie</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentExamen.pupilles.reflexePhotomoteurDirect}
                onChange={(e) =>
                  setCurrentExamen((prev) => ({
                    ...prev,
                    pupilles: { ...prev.pupilles, reflexePhotomoteurDirect: e.target.checked },
                  }))
                }
                className="h-4 w-4"
              />
              <span className="text-sm">RPM Direct</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentExamen.pupilles.reflexePhotomoteurConsensuel}
                onChange={(e) =>
                  setCurrentExamen((prev) => ({
                    ...prev,
                    pupilles: { ...prev.pupilles, reflexePhotomoteurConsensuel: e.target.checked },
                  }))
                }
                className="h-4 w-4"
              />
              <span className="text-sm">RPM Consensuel</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Déficit Moteur et Sensibilité */}
      <Card>
        <CardHeader>
          <CardTitle>Évaluation Globale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Déficit moteur global"
              name="deficitMoteurGlobal"
              type="select"
              value={currentExamen.deficitMoteurGlobal}
              onChange={(v) => updateExamen("deficitMoteurGlobal", v as DeficitMoteurGlobal)}
              options={[
                { value: "Absent", label: "Absent" },
                { value: "Hémiparésie droite", label: "Hémiparésie droite" },
                { value: "Hémiparésie gauche", label: "Hémiparésie gauche" },
                { value: "Hémiplégie droite", label: "Hémiplégie droite" },
                { value: "Hémiplégie gauche", label: "Hémiplégie gauche" },
                { value: "Paraparésie", label: "Paraparésie" },
                { value: "Paraplégie", label: "Paraplégie" },
                { value: "Tétraparésie", label: "Tétraparésie" },
                { value: "Tétraplégie", label: "Tétraplégie" },
                { value: "Monoparésie", label: "Monoparésie" },
                { value: "Monoplégie", label: "Monoplégie" },
              ]}
            />
            <FormField
              label="Sensibilité globale"
              name="sensibiliteGlobale"
              type="select"
              value={currentExamen.sensibiliteGlobale}
              onChange={(v) => updateExamen("sensibiliteGlobale", v as SensibiliteGlobale)}
              options={[
                { value: "Normale", label: "Normale" },
                { value: "Hypoesthésie", label: "Hypoesthésie" },
                { value: "Anesthésie", label: "Anesthésie" },
                { value: "Hyperesthésie", label: "Hyperesthésie" },
                { value: "Dysesthésie", label: "Dysesthésie" },
              ]}
            />
          </div>
          <FormField
            label="Fonctions sphinctériennes"
            name="fonctionsSphinteriennes"
            type="select"
            value={currentExamen.fonctionsSphinteriennes[0]}
            onChange={(v) => updateExamen("fonctionsSphinteriennes", [v as FonctionSphincter])}
            options={[
              { value: "Normale", label: "Normale" },
              { value: "Rétention urinaire", label: "Rétention urinaire" },
              { value: "Incontinence urinaire", label: "Incontinence urinaire" },
              { value: "Rétention fécale", label: "Rétention fécale" },
              { value: "Incontinence fécale", label: "Incontinence fécale" },
              { value: "Trouble mixte", label: "Trouble mixte" },
            ]}
          />
        </CardContent>
      </Card>

      {/* Signes de Gravité */}
      <Card className={hasGravitySigns ? "border-critical" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className={`h-5 w-5 ${hasGravitySigns ? "text-critical" : ""}`} />
            Signes de Gravité
            {hasGravitySigns && <Badge variant="destructive">ALERTE</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: "engagementCerebral", label: "Engagement cérébral" },
              { key: "etatChoc", label: "État de choc" },
              { key: "detresseRespiratoire", label: "Détresse respiratoire" },
              { key: "criseConvulsive", label: "Crise convulsive" },
              { key: "deficitNeurologiqueProgressif", label: "Déficit neurologique progressif" },
              { key: "troubleVigilance", label: "Trouble de la vigilance" },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={currentExamen.signesGravite[key as keyof typeof currentExamen.signesGravite] as boolean}
                  onChange={(e) => updateSigneGravite(key, e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commentaire */}
      <Card>
        <CardHeader>
          <CardTitle>Commentaire libre</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            label=""
            name="commentaireLibre"
            type="textarea"
            value={currentExamen.commentaireLibre || ""}
            onChange={(v) => updateExamen("commentaireLibre", v)}
            placeholder="Observations complémentaires..."
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => setCurrentExamen(defaultExamenCore())}>
          Réinitialiser
        </Button>
        <Button onClick={saveExamen}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer l'examen CORE
        </Button>
      </div>
    </div>
  )
}
