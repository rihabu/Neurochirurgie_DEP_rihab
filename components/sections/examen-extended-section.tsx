"use client"

import { usePatient } from "@/lib/patient-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Hand, Footprints, Save } from "lucide-react"
import { MRC_DESCRIPTIONS, generateId } from "@/lib/utils/patient-utils"
import type { ExamenExtended, ScoreMRC } from "@/lib/types/patient"
import { useState } from "react"

function MRCSelector({
  label,
  valueDroit,
  valueGauche,
  onChangeDroit,
  onChangeGauche,
}: {
  label: string
  valueDroit: ScoreMRC
  valueGauche: ScoreMRC
  onChangeDroit: (v: ScoreMRC) => void
  onChangeGauche: (v: ScoreMRC) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-2 items-center py-2 border-b border-border/50">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex gap-1">
        {([0, 1, 2, 3, 4, 5] as ScoreMRC[]).map((score) => (
          <button
            key={`d-${score}`}
            onClick={() => onChangeDroit(score)}
            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
              valueDroit === score ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
            title={MRC_DESCRIPTIONS[score]}
          >
            {score}
          </button>
        ))}
      </div>
      <div className="flex gap-1">
        {([0, 1, 2, 3, 4, 5] as ScoreMRC[]).map((score) => (
          <button
            key={`g-${score}`}
            onClick={() => onChangeGauche(score)}
            className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
              valueGauche === score ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
            title={MRC_DESCRIPTIONS[score]}
          >
            {score}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ExamenExtendedSection() {
  const { dossier, updateDossier } = usePatient()
  const [showMRC, setShowMRC] = useState(true)

  const defaultExamen: ExamenExtended = {
    dateHeure: new Date().toISOString(),
    auteur: "",
    fonction: "",
    fonctionsCognitives: {
      orientation: { temporelle: true, spatiale: true, personnelle: true },
      attention: "Normale",
      memoire: { immediate: "Normale", recente: "Normale", ancienne: "Normale" },
      langage: { expression: "Normal", comprehension: "Normale", denomination: "Normale", repetition: "Normale" },
      praxies: "Normales",
      gnosies: "Normales",
      fonctionsExecutives: "Normales",
    },
    cephalees: { presentes: false },
    pairesCraniennes: {
      I_olfactif: { normal: true },
      II_optique: { champVisuel: "Normal", normal: true },
      III_IV_VI_oculomoteurs: { motiliteOculaire: "Normale", ptosis: false, normal: true },
      V_trijumeau: { sensibiliteFace: "Normale", reflexeCorneen: true, mastication: "Normale", normal: true },
      VII_facial: { motiliteFaciale: "Normale", normal: true },
      VIII_vestibulocochleaire: { audition: "Normale", nystagmus: false, normal: true },
      IX_X_glossopharyngien_vague: { deglutition: "Normale", voix: "Normale", reflexeNauseux: true, normal: true },
      XI_spinal: {
        sternoCleidoMastoidien: { droit: "Normal", gauche: "Normal" },
        trapeze: { droit: "Normal", gauche: "Normal" },
        normal: true,
      },
      XII_hypoglosse: { motiliteLangue: "Normale", normal: true },
    },
    examenMoteurMRC: {
      deltoide: { droit: 5, gauche: 5 },
      biceps: { droit: 5, gauche: 5 },
      triceps: { droit: 5, gauche: 5 },
      extenseurPoignet: { droit: 5, gauche: 5 },
      flechisseurDoigts: { droit: 5, gauche: 5 },
      intrinsèquesMain: { droit: 5, gauche: 5 },
      psoas: { droit: 5, gauche: 5 },
      quadriceps: { droit: 5, gauche: 5 },
      ischiojambiers: { droit: 5, gauche: 5 },
      tibialAnterieur: { droit: 5, gauche: 5 },
      tricepsSural: { droit: 5, gauche: 5 },
      extenseurGrosOrteil: { droit: 5, gauche: 5 },
    },
    tonus: { membreSupDroit: "Normal", membreSupGauche: "Normal", membreInfDroit: "Normal", membreInfGauche: "Normal" },
    reflexesOT: {
      bicipital: { droit: "Normal", gauche: "Normal" },
      tricipital: { droit: "Normal", gauche: "Normal" },
      styloRadial: { droit: "Normal", gauche: "Normal" },
      rotulien: { droit: "Normal", gauche: "Normal" },
      achilleen: { droit: "Normal", gauche: "Normal" },
    },
    reflexesCutanes: {
      babinski: { droit: "Flexion", gauche: "Flexion" },
      cutanesAbdominaux: { present: true, symetrique: true },
    },
    sensibiliteDetaillee: {
      typeAtteinte: "Superficielle",
      topographie: "Métamérique",
      tactFin: { normale: true },
      douleur: { normale: true },
      temperature: { normale: true },
      sensibiliteProfonde: { pallesthesie: true, arthesthesie: true },
    },
    coordination: {
      epreuveDDoigNez: { droit: "Normale", gauche: "Normale" },
      epreuveDoigtDoigt: { normale: true },
      epreuvetalontGenouTibia: { droit: "Normale", gauche: "Normale" },
      adiadococinesie: false,
      tremblement: { present: false },
    },
    marcheStation: {
      stationDebout: "Stable",
      romberg: "Négatif",
      marche: "Normale",
      marcheTalon: "Possible",
      marchePointes: "Possible",
      marcheAveugle: "Normale",
    },
    examenPerineal: { indique: false },
  }

  const [currentExamen, setCurrentExamen] = useState<ExamenExtended>(defaultExamen)

  if (!dossier) return null

  const updateMRC = (muscle: keyof typeof currentExamen.examenMoteurMRC, side: "droit" | "gauche", value: ScoreMRC) => {
    setCurrentExamen((prev) => ({
      ...prev,
      examenMoteurMRC: {
        ...prev.examenMoteurMRC,
        [muscle]: { ...prev.examenMoteurMRC[muscle], [side]: value },
      },
    }))
  }

  const saveExamen = () => {
    updateDossier({
      examensExtended: [...dossier.examensExtended, { ...currentExamen, id: generateId() }],
    })
    setCurrentExamen(defaultExamen)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Examen EXTENDED</h2>
          <p className="text-muted-foreground">Examen détaillé - Patient stable</p>
        </div>
        {dossier.examensExtended.length > 0 && (
          <Badge variant="secondary">{dossier.examensExtended.length} examen(s) enregistré(s)</Badge>
        )}
      </div>

      {/* Métadonnées */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de l'examen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Date et heure"
              name="dateHeure"
              type="datetime-local"
              value={currentExamen.dateHeure.slice(0, 16)}
              onChange={(v) => setCurrentExamen((prev) => ({ ...prev, dateHeure: new Date(v).toISOString() }))}
              required
            />
            <FormField
              label="Auteur"
              name="auteur"
              value={currentExamen.auteur}
              onChange={(v) => setCurrentExamen((prev) => ({ ...prev, auteur: v }))}
              required
            />
            <FormField
              label="Fonction"
              name="fonction"
              value={currentExamen.fonction}
              onChange={(v) => setCurrentExamen((prev) => ({ ...prev, fonction: v }))}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Fonctions Cognitives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Fonctions Cognitives
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Orientation</label>
              <div className="space-y-1">
                {["temporelle", "spatiale", "personnelle"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        currentExamen.fonctionsCognitives.orientation[
                          type as keyof typeof currentExamen.fonctionsCognitives.orientation
                        ]
                      }
                      onChange={(e) =>
                        setCurrentExamen((prev) => ({
                          ...prev,
                          fonctionsCognitives: {
                            ...prev.fonctionsCognitives,
                            orientation: { ...prev.fonctionsCognitives.orientation, [type]: e.target.checked },
                          },
                        }))
                      }
                      className="h-4 w-4"
                    />
                    <span className="text-sm capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            <FormField
              label="Attention"
              name="attention"
              type="select"
              value={currentExamen.fonctionsCognitives.attention}
              onChange={(v) =>
                setCurrentExamen((prev) => ({
                  ...prev,
                  fonctionsCognitives: { ...prev.fonctionsCognitives, attention: v as "Normale" | "Altérée" },
                }))
              }
              options={[
                { value: "Normale", label: "Normale" },
                { value: "Altérée", label: "Altérée" },
              ]}
            />
            <FormField
              label="Score MMSE"
              name="scoreMMSE"
              type="number"
              value={currentExamen.fonctionsCognitives.scoreMMSE || ""}
              onChange={(v) =>
                setCurrentExamen((prev) => ({
                  ...prev,
                  fonctionsCognitives: { ...prev.fonctionsCognitives, scoreMMSE: v ? Number.parseInt(v) : undefined },
                }))
              }
              hint="/30"
            />
          </div>
          <FormField
            label="Langage - Expression"
            name="langageExpression"
            type="select"
            value={currentExamen.fonctionsCognitives.langage.expression}
            onChange={(v) =>
              setCurrentExamen((prev) => ({
                ...prev,
                fonctionsCognitives: {
                  ...prev.fonctionsCognitives,
                  langage: {
                    ...prev.fonctionsCognitives.langage,
                    expression: v as typeof prev.fonctionsCognitives.langage.expression,
                  },
                },
              }))
            }
            options={[
              { value: "Normal", label: "Normal" },
              { value: "Aphasie de Broca", label: "Aphasie de Broca" },
              { value: "Aphasie de Wernicke", label: "Aphasie de Wernicke" },
              { value: "Aphasie mixte", label: "Aphasie mixte" },
              { value: "Dysarthrie", label: "Dysarthrie" },
            ]}
          />
        </CardContent>
      </Card>

      {/* Examen Moteur MRC */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hand className="h-5 w-5" />
            Examen Moteur MRC (0-5)
          </CardTitle>
          <CardDescription>
            <Button variant="ghost" size="sm" onClick={() => setShowMRC(!showMRC)}>
              {showMRC ? "Masquer" : "Afficher"} le tableau MRC
            </Button>
          </CardDescription>
        </CardHeader>
        {showMRC && (
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-2 text-sm font-medium text-muted-foreground">
              <span>Muscle</span>
              <span className="text-center">Droit</span>
              <span className="text-center">Gauche</span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground pt-2 pb-1">MEMBRE SUPÉRIEUR</p>
              <MRCSelector
                label="Deltoïde"
                valueDroit={currentExamen.examenMoteurMRC.deltoide.droit}
                valueGauche={currentExamen.examenMoteurMRC.deltoide.gauche}
                onChangeDroit={(v) => updateMRC("deltoide", "droit", v)}
                onChangeGauche={(v) => updateMRC("deltoide", "gauche", v)}
              />
              <MRCSelector
                label="Biceps"
                valueDroit={currentExamen.examenMoteurMRC.biceps.droit}
                valueGauche={currentExamen.examenMoteurMRC.biceps.gauche}
                onChangeDroit={(v) => updateMRC("biceps", "droit", v)}
                onChangeGauche={(v) => updateMRC("biceps", "gauche", v)}
              />
              <MRCSelector
                label="Triceps"
                valueDroit={currentExamen.examenMoteurMRC.triceps.droit}
                valueGauche={currentExamen.examenMoteurMRC.triceps.gauche}
                onChangeDroit={(v) => updateMRC("triceps", "droit", v)}
                onChangeGauche={(v) => updateMRC("triceps", "gauche", v)}
              />
              <MRCSelector
                label="Ext. Poignet"
                valueDroit={currentExamen.examenMoteurMRC.extenseurPoignet.droit}
                valueGauche={currentExamen.examenMoteurMRC.extenseurPoignet.gauche}
                onChangeDroit={(v) => updateMRC("extenseurPoignet", "droit", v)}
                onChangeGauche={(v) => updateMRC("extenseurPoignet", "gauche", v)}
              />
              <MRCSelector
                label="Fléch. Doigts"
                valueDroit={currentExamen.examenMoteurMRC.flechisseurDoigts.droit}
                valueGauche={currentExamen.examenMoteurMRC.flechisseurDoigts.gauche}
                onChangeDroit={(v) => updateMRC("flechisseurDoigts", "droit", v)}
                onChangeGauche={(v) => updateMRC("flechisseurDoigts", "gauche", v)}
              />
              <MRCSelector
                label="Intrinsèques"
                valueDroit={currentExamen.examenMoteurMRC.intrinsèquesMain.droit}
                valueGauche={currentExamen.examenMoteurMRC.intrinsèquesMain.gauche}
                onChangeDroit={(v) => updateMRC("intrinsèquesMain", "droit", v)}
                onChangeGauche={(v) => updateMRC("intrinsèquesMain", "gauche", v)}
              />

              <p className="text-xs font-semibold text-muted-foreground pt-4 pb-1">MEMBRE INFÉRIEUR</p>
              <MRCSelector
                label="Psoas"
                valueDroit={currentExamen.examenMoteurMRC.psoas.droit}
                valueGauche={currentExamen.examenMoteurMRC.psoas.gauche}
                onChangeDroit={(v) => updateMRC("psoas", "droit", v)}
                onChangeGauche={(v) => updateMRC("psoas", "gauche", v)}
              />
              <MRCSelector
                label="Quadriceps"
                valueDroit={currentExamen.examenMoteurMRC.quadriceps.droit}
                valueGauche={currentExamen.examenMoteurMRC.quadriceps.gauche}
                onChangeDroit={(v) => updateMRC("quadriceps", "droit", v)}
                onChangeGauche={(v) => updateMRC("quadriceps", "gauche", v)}
              />
              <MRCSelector
                label="Ischio-jambiers"
                valueDroit={currentExamen.examenMoteurMRC.ischiojambiers.droit}
                valueGauche={currentExamen.examenMoteurMRC.ischiojambiers.gauche}
                onChangeDroit={(v) => updateMRC("ischiojambiers", "droit", v)}
                onChangeGauche={(v) => updateMRC("ischiojambiers", "gauche", v)}
              />
              <MRCSelector
                label="Tibial Ant."
                valueDroit={currentExamen.examenMoteurMRC.tibialAnterieur.droit}
                valueGauche={currentExamen.examenMoteurMRC.tibialAnterieur.gauche}
                onChangeDroit={(v) => updateMRC("tibialAnterieur", "droit", v)}
                onChangeGauche={(v) => updateMRC("tibialAnterieur", "gauche", v)}
              />
              <MRCSelector
                label="Triceps Sural"
                valueDroit={currentExamen.examenMoteurMRC.tricepsSural.droit}
                valueGauche={currentExamen.examenMoteurMRC.tricepsSural.gauche}
                onChangeDroit={(v) => updateMRC("tricepsSural", "droit", v)}
                onChangeGauche={(v) => updateMRC("tricepsSural", "gauche", v)}
              />
              <MRCSelector
                label="Ext. Gros Orteil"
                valueDroit={currentExamen.examenMoteurMRC.extenseurGrosOrteil.droit}
                valueGauche={currentExamen.examenMoteurMRC.extenseurGrosOrteil.gauche}
                onChangeDroit={(v) => updateMRC("extenseurGrosOrteil", "droit", v)}
                onChangeGauche={(v) => updateMRC("extenseurGrosOrteil", "gauche", v)}
              />
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Légende MRC:</strong> 0 = Aucune contraction | 1 = Contraction visible | 2 = Mouvement sans
                pesanteur | 3 = Contre pesanteur | 4 = Contre résistance | 5 = Normal
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Marche et Station */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Footprints className="h-5 w-5" />
            Marche et Station
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Station debout"
              name="stationDebout"
              type="select"
              value={currentExamen.marcheStation.stationDebout}
              onChange={(v) =>
                setCurrentExamen((prev) => ({
                  ...prev,
                  marcheStation: { ...prev.marcheStation, stationDebout: v as typeof prev.marcheStation.stationDebout },
                }))
              }
              options={[
                { value: "Stable", label: "Stable" },
                { value: "Instable", label: "Instable" },
                { value: "Impossible", label: "Impossible" },
              ]}
            />
            <FormField
              label="Romberg"
              name="romberg"
              type="select"
              value={currentExamen.marcheStation.romberg}
              onChange={(v) =>
                setCurrentExamen((prev) => ({
                  ...prev,
                  marcheStation: { ...prev.marcheStation, romberg: v as typeof prev.marcheStation.romberg },
                }))
              }
              options={[
                { value: "Négatif", label: "Négatif" },
                { value: "Positif", label: "Positif" },
                { value: "Non réalisable", label: "Non réalisable" },
              ]}
            />
            <FormField
              label="Type de marche"
              name="marche"
              type="select"
              value={currentExamen.marcheStation.marche}
              onChange={(v) =>
                setCurrentExamen((prev) => ({
                  ...prev,
                  marcheStation: { ...prev.marcheStation, marche: v as typeof prev.marcheStation.marche },
                }))
              }
              options={[
                { value: "Normale", label: "Normale" },
                { value: "Ataxique", label: "Ataxique" },
                { value: "Spastique", label: "Spastique" },
                { value: "Steppage", label: "Steppage" },
                { value: "Fauchage", label: "Fauchage" },
                { value: "Festinante", label: "Festinante" },
                { value: "Impossible", label: "Impossible" },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => setCurrentExamen(defaultExamen)}>
          Réinitialiser
        </Button>
        <Button onClick={saveExamen}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer l'examen EXTENDED
        </Button>
      </div>
    </div>
  )
}
