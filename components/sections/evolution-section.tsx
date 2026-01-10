"use client"

import { usePatient } from "@/lib/patient-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus, Plus, Save, Calendar } from "lucide-react"
import { GCS_YEUX, GCS_VERBAL, GCS_MOTEUR, calculateGCSTotal, interpretGCS } from "@/lib/utils/patient-utils"
import type { EvaluationPostOp, ScoreGCSYeux, ScoreGCSVerbal, ScoreGCSMoteur } from "@/lib/types/patient"
import { useState } from "react"

const defaultEvaluation = (jour: string): EvaluationPostOp => ({
  jour,
  dateHeure: new Date().toISOString(),
  auteur: "",
  fonction: "",
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
  examenNeurologique: {
    amelioration: false,
    stagnation: true,
    aggravation: false,
    details: "",
  },
  douleur: {
    eva: 0,
    localisation: "",
    traitement: "",
  },
  traitements: [],
  planJourSuivant: "",
})

export function EvolutionSection() {
  const { dossier, updateDossier } = usePatient()
  const existingDays = dossier?.evolutionPostOperatoire?.evaluations.map((e) => e.jour) || []
  const nextDay = `J${existingDays.length}`

  const [currentEval, setCurrentEval] = useState<EvaluationPostOp>(defaultEvaluation(nextDay))
  const [newTraitement, setNewTraitement] = useState({ medicament: "", posologie: "", voie: "" })

  if (!dossier) return null

  const updateGCS = (type: "yeux" | "verbal" | "moteur", score: number) => {
    const newGCS = { ...currentEval.gcs }
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
    setCurrentEval((prev) => ({ ...prev, gcs: newGCS }))
  }

  const addTraitement = () => {
    if (newTraitement.medicament && newTraitement.posologie) {
      setCurrentEval((prev) => ({
        ...prev,
        traitements: [...prev.traitements, newTraitement],
      }))
      setNewTraitement({ medicament: "", posologie: "", voie: "" })
    }
  }

  const saveEvaluation = () => {
    const newEvaluations = [...(dossier.evolutionPostOperatoire?.evaluations || []), currentEval]
    updateDossier({
      evolutionPostOperatoire: {
        evaluations: newEvaluations,
        complications: dossier.evolutionPostOperatoire?.complications || [],
      },
    })
    const nextDayNum = newEvaluations.length
    setCurrentEval(defaultEvaluation(`J${nextDayNum}`))
  }

  const getEvolutionIcon = () => {
    if (currentEval.examenNeurologique.amelioration) return <TrendingUp className="h-5 w-5 text-green-500" />
    if (currentEval.examenNeurologique.aggravation) return <TrendingDown className="h-5 w-5 text-red-500" />
    return <Minus className="h-5 w-5 text-yellow-500" />
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Évolution Post-opératoire</h2>
          <p className="text-muted-foreground">Suivi journalier du patient</p>
        </div>
      </div>

      {/* Timeline des évaluations */}
      {dossier.evolutionPostOperatoire && dossier.evolutionPostOperatoire.evaluations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique des évaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {dossier.evolutionPostOperatoire.evaluations.map((eval_) => (
                <div
                  key={eval_.jour}
                  className="flex flex-col items-center p-3 border border-border rounded-lg min-w-[80px]"
                >
                  <Badge
                    variant={
                      eval_.examenNeurologique.amelioration
                        ? "default"
                        : eval_.examenNeurologique.aggravation
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {eval_.jour}
                  </Badge>
                  <span className="text-xs text-muted-foreground mt-1">GCS: {eval_.gcs.total}</span>
                  <span className="text-xs text-muted-foreground">EVA: {eval_.douleur.eva}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nouvelle évaluation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Évaluation {currentEval.jour}
            {getEvolutionIcon()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              label="Jour"
              name="jour"
              value={currentEval.jour}
              onChange={(v) => setCurrentEval((prev) => ({ ...prev, jour: v }))}
              required
            />
            <FormField
              label="Date et heure"
              name="dateHeure"
              type="datetime-local"
              value={currentEval.dateHeure.slice(0, 16)}
              onChange={(v) => setCurrentEval((prev) => ({ ...prev, dateHeure: new Date(v).toISOString() }))}
              required
            />
            <FormField
              label="Auteur"
              name="auteur"
              value={currentEval.auteur}
              onChange={(v) => setCurrentEval((prev) => ({ ...prev, auteur: v }))}
              required
            />
            <FormField
              label="Fonction"
              name="fonction"
              value={currentEval.fonction}
              onChange={(v) => setCurrentEval((prev) => ({ ...prev, fonction: v }))}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Constantes */}
      <Card>
        <CardHeader>
          <CardTitle>Constantes Vitales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <FormField
              label="TA Sys"
              name="taSys"
              type="number"
              value={currentEval.constantes.tensionArterielle.systolique}
              onChange={(v) =>
                setCurrentEval((prev) => ({
                  ...prev,
                  constantes: {
                    ...prev.constantes,
                    tensionArterielle: { ...prev.constantes.tensionArterielle, systolique: Number.parseInt(v) },
                  },
                }))
              }
              hint="mmHg"
            />
            <FormField
              label="TA Dia"
              name="taDia"
              type="number"
              value={currentEval.constantes.tensionArterielle.diastolique}
              onChange={(v) =>
                setCurrentEval((prev) => ({
                  ...prev,
                  constantes: {
                    ...prev.constantes,
                    tensionArterielle: { ...prev.constantes.tensionArterielle, diastolique: Number.parseInt(v) },
                  },
                }))
              }
              hint="mmHg"
            />
            <FormField
              label="FC"
              name="fc"
              type="number"
              value={currentEval.constantes.frequenceCardiaque}
              onChange={(v) =>
                setCurrentEval((prev) => ({
                  ...prev,
                  constantes: { ...prev.constantes, frequenceCardiaque: Number.parseInt(v) },
                }))
              }
              hint="bpm"
            />
            <FormField
              label="FR"
              name="fr"
              type="number"
              value={currentEval.constantes.frequenceRespiratoire}
              onChange={(v) =>
                setCurrentEval((prev) => ({
                  ...prev,
                  constantes: { ...prev.constantes, frequenceRespiratoire: Number.parseInt(v) },
                }))
              }
              hint="/min"
            />
            <FormField
              label="T°"
              name="temp"
              type="number"
              value={currentEval.constantes.temperature}
              onChange={(v) =>
                setCurrentEval((prev) => ({
                  ...prev,
                  constantes: { ...prev.constantes, temperature: Number.parseFloat(v) },
                }))
              }
              hint="°C"
            />
            <FormField
              label="SpO2"
              name="spo2"
              type="number"
              value={currentEval.constantes.saturationO2}
              onChange={(v) =>
                setCurrentEval((prev) => ({
                  ...prev,
                  constantes: { ...prev.constantes, saturationO2: Number.parseInt(v) },
                }))
              }
              hint="%"
            />
          </div>
        </CardContent>
      </Card>

      {/* GCS rapide */}
      <Card>
        <CardHeader>
          <CardTitle>
            Score de Glasgow:{" "}
            <span className="text-primary">
              {currentEval.gcs.total}/15 - {currentEval.gcs.interpretation}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Yeux (E): {currentEval.gcs.yeux.score}</label>
              <div className="flex gap-1">
                {([4, 3, 2, 1] as ScoreGCSYeux[]).map((score) => (
                  <button
                    key={score}
                    onClick={() => updateGCS("yeux", score)}
                    className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                      currentEval.gcs.yeux.score === score
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Verbal (V): {currentEval.gcs.verbal.score}</label>
              <div className="flex gap-1">
                {([5, 4, 3, 2, 1] as ScoreGCSVerbal[]).map((score) => (
                  <button
                    key={score}
                    onClick={() => updateGCS("verbal", score)}
                    className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                      currentEval.gcs.verbal.score === score
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Moteur (M): {currentEval.gcs.moteur.score}</label>
              <div className="flex gap-1">
                {([6, 5, 4, 3, 2, 1] as ScoreGCSMoteur[]).map((score) => (
                  <button
                    key={score}
                    onClick={() => updateGCS("moteur", score)}
                    className={`flex-1 py-2 rounded text-sm font-medium transition-colors ${
                      currentEval.gcs.moteur.score === score
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {score}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Examen neurologique */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution Neurologique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            {[
              { key: "amelioration", label: "Amélioration", color: "text-green-600" },
              { key: "stagnation", label: "Stagnation", color: "text-yellow-600" },
              { key: "aggravation", label: "Aggravation", color: "text-red-600" },
            ].map(({ key, label, color }) => (
              <label key={key} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="evolution"
                  checked={
                    currentEval.examenNeurologique[key as keyof typeof currentEval.examenNeurologique] as boolean
                  }
                  onChange={() =>
                    setCurrentEval((prev) => ({
                      ...prev,
                      examenNeurologique: {
                        ...prev.examenNeurologique,
                        amelioration: key === "amelioration",
                        stagnation: key === "stagnation",
                        aggravation: key === "aggravation",
                      },
                    }))
                  }
                  className="h-4 w-4"
                />
                <span className={`text-sm font-medium ${color}`}>{label}</span>
              </label>
            ))}
          </div>
          <FormField
            label="Détails de l'examen neurologique"
            name="detailsNeuro"
            type="textarea"
            value={currentEval.examenNeurologique.details}
            onChange={(v) =>
              setCurrentEval((prev) => ({
                ...prev,
                examenNeurologique: { ...prev.examenNeurologique, details: v },
              }))
            }
          />
        </CardContent>
      </Card>

      {/* Douleur */}
      <Card>
        <CardHeader>
          <CardTitle>Évaluation de la Douleur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">EVA: {currentEval.douleur.eva}/10</label>
            <input
              type="range"
              min="0"
              max="10"
              value={currentEval.douleur.eva}
              onChange={(e) =>
                setCurrentEval((prev) => ({
                  ...prev,
                  douleur: { ...prev.douleur, eva: Number.parseInt(e.target.value) },
                }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Pas de douleur</span>
              <span>Douleur maximale</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Localisation"
              name="localisationDouleur"
              value={currentEval.douleur.localisation}
              onChange={(v) =>
                setCurrentEval((prev) => ({
                  ...prev,
                  douleur: { ...prev.douleur, localisation: v },
                }))
              }
            />
            <FormField
              label="Traitement antalgique"
              name="traitementDouleur"
              value={currentEval.douleur.traitement}
              onChange={(v) =>
                setCurrentEval((prev) => ({
                  ...prev,
                  douleur: { ...prev.douleur, traitement: v },
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Traitements */}
      <Card>
        <CardHeader>
          <CardTitle>Traitements en cours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <input
              type="text"
              value={newTraitement.medicament}
              onChange={(e) => setNewTraitement((prev) => ({ ...prev, medicament: e.target.value }))}
              placeholder="Médicament"
              className="h-10 px-3 border border-input rounded-md bg-background"
            />
            <input
              type="text"
              value={newTraitement.posologie}
              onChange={(e) => setNewTraitement((prev) => ({ ...prev, posologie: e.target.value }))}
              placeholder="Posologie"
              className="h-10 px-3 border border-input rounded-md bg-background"
            />
            <input
              type="text"
              value={newTraitement.voie}
              onChange={(e) => setNewTraitement((prev) => ({ ...prev, voie: e.target.value }))}
              placeholder="Voie (PO, IV...)"
              className="h-10 px-3 border border-input rounded-md bg-background"
            />
            <Button onClick={addTraitement}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>

          {currentEval.traitements.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2">Médicament</th>
                    <th className="text-left p-2">Posologie</th>
                    <th className="text-left p-2">Voie</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEval.traitements.map((t, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2">{t.medicament}</td>
                      <td className="p-2">{t.posologie}</td>
                      <td className="p-2">{t.voie}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Plan pour le jour suivant</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            label=""
            name="planJourSuivant"
            type="textarea"
            value={currentEval.planJourSuivant}
            onChange={(v) => setCurrentEval((prev) => ({ ...prev, planJourSuivant: v }))}
            placeholder="Objectifs et plan de soins pour demain..."
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => setCurrentEval(defaultEvaluation(nextDay))}>
          Réinitialiser
        </Button>
        <Button onClick={saveEvaluation}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer {currentEval.jour}
        </Button>
      </div>
    </div>
  )
}
