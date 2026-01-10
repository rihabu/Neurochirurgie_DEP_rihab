"use client"

import { usePatient } from "@/lib/patient-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, FileImage, TestTube, Calculator } from "lucide-react"
import { generateId } from "@/lib/utils/patient-utils"
import type { ExamenImagerie, ScoreValide, TypeImagerie } from "@/lib/types/patient"
import { useState } from "react"

export function ExamensCompSection() {
  const { dossier, updateDossier } = usePatient()
  const [activeTab, setActiveTab] = useState<"imagerie" | "biologie" | "scores">("imagerie")

  if (!dossier) return null

  const { examensComplementaires } = dossier

  // Imagerie
  const addImagerie = () => {
    const newExam: ExamenImagerie = {
      id: generateId(),
      type: "TDM",
      region: "",
      dateRealisation: new Date().toISOString(),
      injection: false,
      resultats: "",
      conclusion: "",
      urgence: false,
    }
    updateDossier({
      examensComplementaires: {
        ...examensComplementaires,
        imagerie: [...examensComplementaires.imagerie, newExam],
      },
    })
  }

  const updateImagerie = (id: string, field: string, value: unknown) => {
    updateDossier({
      examensComplementaires: {
        ...examensComplementaires,
        imagerie: examensComplementaires.imagerie.map((img) => (img.id === id ? { ...img, [field]: value } : img)),
      },
    })
  }

  const removeImagerie = (id: string) => {
    updateDossier({
      examensComplementaires: {
        ...examensComplementaires,
        imagerie: examensComplementaires.imagerie.filter((img) => img.id !== id),
      },
    })
  }

  // Scores
  const addScore = () => {
    const newScore: ScoreValide = {
      nom: "",
      valeur: 0,
      interpretation: "",
      dateCalcul: new Date().toISOString(),
    }
    updateDossier({
      examensComplementaires: {
        ...examensComplementaires,
        scores: [...examensComplementaires.scores, newScore],
      },
    })
  }

  const updateScore = (index: number, field: string, value: unknown) => {
    const updated = [...examensComplementaires.scores]
    updated[index] = { ...updated[index], [field]: value }
    updateDossier({
      examensComplementaires: {
        ...examensComplementaires,
        scores: updated,
      },
    })
  }

  const removeScore = (index: number) => {
    updateDossier({
      examensComplementaires: {
        ...examensComplementaires,
        scores: examensComplementaires.scores.filter((_, i) => i !== index),
      },
    })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Examens Complémentaires</h2>
        <p className="text-muted-foreground">Imagerie, biologie et scores validés</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("imagerie")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "imagerie"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileImage className="h-4 w-4 inline mr-2" />
          Imagerie ({examensComplementaires.imagerie.length})
        </button>
        <button
          onClick={() => setActiveTab("biologie")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "biologie"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <TestTube className="h-4 w-4 inline mr-2" />
          Biologie ({examensComplementaires.biologie.length})
        </button>
        <button
          onClick={() => setActiveTab("scores")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "scores"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calculator className="h-4 w-4 inline mr-2" />
          Scores ({examensComplementaires.scores.length})
        </button>
      </div>

      {/* Imagerie Tab */}
      {activeTab === "imagerie" && (
        <div className="space-y-4">
          {examensComplementaires.imagerie.map((exam) => (
            <Card key={exam.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Badge>{exam.type}</Badge>
                    {exam.urgence && <Badge variant="destructive">Urgent</Badge>}
                    {exam.injection && <Badge variant="secondary">+ Injection</Badge>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeImagerie(exam.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <FormField
                    label="Type"
                    name={`img-${exam.id}-type`}
                    type="select"
                    value={exam.type}
                    onChange={(v) => updateImagerie(exam.id, "type", v as TypeImagerie)}
                    options={[
                      { value: "TDM", label: "TDM" },
                      { value: "IRM", label: "IRM" },
                      { value: "Angiographie", label: "Angiographie" },
                      { value: "Radiographie", label: "Radiographie" },
                      { value: "Échographie", label: "Échographie" },
                    ]}
                  />
                  <FormField
                    label="Région"
                    name={`img-${exam.id}-region`}
                    value={exam.region}
                    onChange={(v) => updateImagerie(exam.id, "region", v)}
                    placeholder="Ex: Cérébrale, Rachis..."
                  />
                  <FormField
                    label="Date"
                    name={`img-${exam.id}-date`}
                    type="datetime-local"
                    value={exam.dateRealisation.slice(0, 16)}
                    onChange={(v) => updateImagerie(exam.id, "dateRealisation", new Date(v).toISOString())}
                  />
                  <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exam.injection}
                        onChange={(e) => updateImagerie(exam.id, "injection", e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Injection</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={exam.urgence}
                        onChange={(e) => updateImagerie(exam.id, "urgence", e.target.checked)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">Urgent</span>
                    </label>
                  </div>
                </div>
                <FormField
                  label="Résultats"
                  name={`img-${exam.id}-resultats`}
                  type="textarea"
                  value={exam.resultats}
                  onChange={(v) => updateImagerie(exam.id, "resultats", v)}
                  placeholder="Description des résultats..."
                />
                <FormField
                  label="Conclusion"
                  name={`img-${exam.id}-conclusion`}
                  type="textarea"
                  value={exam.conclusion}
                  onChange={(v) => updateImagerie(exam.id, "conclusion", v)}
                  placeholder="Conclusion du radiologue..."
                />
              </CardContent>
            </Card>
          ))}
          <Button onClick={addImagerie} variant="outline" className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un examen d'imagerie
          </Button>
        </div>
      )}

      {/* Biologie Tab */}
      {activeTab === "biologie" && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                Module de biologie en cours de développement.
                <br />
                Intégration prévue avec le système de laboratoire.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Scores Tab */}
      {activeTab === "scores" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scores Neurochirurgicaux Validés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["GCS", "ASIA", "Hunt-Hess", "WFNS", "Fisher", "Rankin", "NIHSS", "Karnofsky"].map((scoreName) => (
                  <Button
                    key={scoreName}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newScore: ScoreValide = {
                        nom: scoreName,
                        valeur: 0,
                        interpretation: "",
                        dateCalcul: new Date().toISOString(),
                      }
                      updateDossier({
                        examensComplementaires: {
                          ...examensComplementaires,
                          scores: [...examensComplementaires.scores, newScore],
                        },
                      })
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {scoreName}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {examensComplementaires.scores.map((score, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{score.nom || "Nouveau score"}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => removeScore(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="Score"
                    name={`score-${index}-nom`}
                    value={score.nom}
                    onChange={(v) => updateScore(index, "nom", v)}
                    placeholder="Nom du score"
                  />
                  <FormField
                    label="Valeur"
                    name={`score-${index}-valeur`}
                    type="number"
                    value={score.valeur}
                    onChange={(v) => updateScore(index, "valeur", Number.parseInt(v) || 0)}
                  />
                  <FormField
                    label="Date"
                    name={`score-${index}-date`}
                    type="datetime-local"
                    value={score.dateCalcul.slice(0, 16)}
                    onChange={(v) => updateScore(index, "dateCalcul", new Date(v).toISOString())}
                  />
                </div>
                <FormField
                  label="Interprétation"
                  name={`score-${index}-interpretation`}
                  value={score.interpretation}
                  onChange={(v) => updateScore(index, "interpretation", v)}
                  placeholder="Interprétation du score..."
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
