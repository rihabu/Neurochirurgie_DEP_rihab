"use client"

import { usePatient } from "@/lib/patient-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scissors, Plus, Trash2, Save } from "lucide-react"
import { generateId } from "@/lib/utils/patient-utils"
import type { CompteRenduOperatoire } from "@/lib/types/patient"
import { useState } from "react"

const defaultCRO = (): CompteRenduOperatoire => ({
  id: generateId(),
  dateHeure: new Date().toISOString(),
  chirurgienPrincipal: "",
  aidesOperatoires: [],
  anesthesiste: "",
  diagnosticPreOperatoire: "",
  intituleIntervention: "",
  voieAbord: "",
  descriptionGeste: "",
  constatationsPerOperatoires: "",
  incidents: false,
  conclusion: "",
  consignesPostOperatoires: [],
})

export function OperationSection() {
  const { dossier, updateDossier } = usePatient()
  const [currentCRO, setCurrentCRO] = useState<CompteRenduOperatoire>(defaultCRO())
  const [newConsigne, setNewConsigne] = useState("")
  const [newAide, setNewAide] = useState("")

  if (!dossier) return null

  const updateCRO = (field: keyof CompteRenduOperatoire, value: unknown) => {
    setCurrentCRO((prev) => ({ ...prev, [field]: value }))
  }

  const addConsigne = () => {
    if (newConsigne.trim()) {
      setCurrentCRO((prev) => ({
        ...prev,
        consignesPostOperatoires: [...prev.consignesPostOperatoires, newConsigne.trim()],
      }))
      setNewConsigne("")
    }
  }

  const removeConsigne = (index: number) => {
    setCurrentCRO((prev) => ({
      ...prev,
      consignesPostOperatoires: prev.consignesPostOperatoires.filter((_, i) => i !== index),
    }))
  }

  const addAide = () => {
    if (newAide.trim()) {
      setCurrentCRO((prev) => ({
        ...prev,
        aidesOperatoires: [...prev.aidesOperatoires, newAide.trim()],
      }))
      setNewAide("")
    }
  }

  const saveCRO = () => {
    updateDossier({
      comptesRendusOperatoires: [...dossier.comptesRendusOperatoires, currentCRO],
    })
    setCurrentCRO(defaultCRO())
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Compte Rendu Opératoire</h2>
          <p className="text-muted-foreground">Documentation de l'intervention chirurgicale</p>
        </div>
        {dossier.comptesRendusOperatoires.length > 0 && (
          <Badge variant="secondary">{dossier.comptesRendusOperatoires.length} CRO enregistré(s)</Badge>
        )}
      </div>

      {/* Liste des CRO existants */}
      {dossier.comptesRendusOperatoires.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Interventions précédentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dossier.comptesRendusOperatoires.map((cro, index) => (
                <div key={cro.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{cro.intituleIntervention || `Intervention ${index + 1}`}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(cro.dateHeure).toLocaleDateString("fr-FR")} - Dr {cro.chirurgienPrincipal}
                    </p>
                  </div>
                  <Badge variant={cro.incidents ? "destructive" : "secondary"}>
                    {cro.incidents ? "Incidents" : "Sans incident"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nouveau CRO */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Nouvelle Intervention
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date et heure"
              name="dateHeure"
              type="datetime-local"
              value={currentCRO.dateHeure.slice(0, 16)}
              onChange={(v) => updateCRO("dateHeure", new Date(v).toISOString())}
              required
            />
            <FormField
              label="Chirurgien principal"
              name="chirurgienPrincipal"
              value={currentCRO.chirurgienPrincipal}
              onChange={(v) => updateCRO("chirurgienPrincipal", v)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Aides opératoires</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newAide}
                onChange={(e) => setNewAide(e.target.value)}
                placeholder="Nom de l'aide"
                className="flex-1 h-10 px-3 border border-input rounded-md bg-background"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAide())}
              />
              <Button type="button" onClick={addAide} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {currentCRO.aidesOperatoires.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {currentCRO.aidesOperatoires.map((aide, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {aide}
                    <button
                      onClick={() =>
                        setCurrentCRO((prev) => ({
                          ...prev,
                          aidesOperatoires: prev.aidesOperatoires.filter((_, idx) => idx !== i),
                        }))
                      }
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <FormField
            label="Anesthésiste"
            name="anesthesiste"
            value={currentCRO.anesthesiste}
            onChange={(v) => updateCRO("anesthesiste", v)}
            required
          />
        </CardContent>
      </Card>

      {/* Diagnostic et Intervention */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic et Intervention</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Diagnostic pré-opératoire"
            name="diagnosticPreOperatoire"
            type="textarea"
            value={currentCRO.diagnosticPreOperatoire}
            onChange={(v) => updateCRO("diagnosticPreOperatoire", v)}
            required
          />
          <FormField
            label="Diagnostic per-opératoire"
            name="diagnosticPerOperatoire"
            type="textarea"
            value={currentCRO.diagnosticPerOperatoire || ""}
            onChange={(v) => updateCRO("diagnosticPerOperatoire", v)}
          />
          <FormField
            label="Intitulé de l'intervention"
            name="intituleIntervention"
            value={currentCRO.intituleIntervention}
            onChange={(v) => updateCRO("intituleIntervention", v)}
            required
            placeholder="Ex: Craniectomie décompressive, Exérèse tumorale..."
          />
          <FormField
            label="Voie d'abord"
            name="voieAbord"
            value={currentCRO.voieAbord}
            onChange={(v) => updateCRO("voieAbord", v)}
            required
          />
        </CardContent>
      </Card>

      {/* Description du geste */}
      <Card>
        <CardHeader>
          <CardTitle>Description du Geste Opératoire</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Description détaillée"
            name="descriptionGeste"
            type="textarea"
            value={currentCRO.descriptionGeste}
            onChange={(v) => updateCRO("descriptionGeste", v)}
            required
            hint="Description chronologique et détaillée du geste chirurgical"
          />
          <FormField
            label="Constatations per-opératoires"
            name="constatationsPerOperatoires"
            type="textarea"
            value={currentCRO.constatationsPerOperatoires}
            onChange={(v) => updateCRO("constatationsPerOperatoires", v)}
          />
        </CardContent>
      </Card>

      {/* Incidents et Conclusion */}
      <Card>
        <CardHeader>
          <CardTitle>Incidents et Conclusion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={currentCRO.incidents}
                onChange={(e) => updateCRO("incidents", e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-medium">Incidents per-opératoires</span>
            </label>
          </div>

          {currentCRO.incidents && (
            <FormField
              label="Description des incidents"
              name="descriptionIncidents"
              type="textarea"
              value={currentCRO.descriptionIncidents || ""}
              onChange={(v) => updateCRO("descriptionIncidents", v)}
              required
            />
          )}

          <FormField
            label="Perte sanguine estimée (mL)"
            name="perteSanguine"
            type="number"
            value={currentCRO.perteSanguine || ""}
            onChange={(v) => updateCRO("perteSanguine", v ? Number.parseInt(v) : undefined)}
          />

          <FormField
            label="Conclusion"
            name="conclusion"
            type="textarea"
            value={currentCRO.conclusion}
            onChange={(v) => updateCRO("conclusion", v)}
            required
          />
        </CardContent>
      </Card>

      {/* Consignes post-opératoires */}
      <Card>
        <CardHeader>
          <CardTitle>Consignes Post-opératoires</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newConsigne}
              onChange={(e) => setNewConsigne(e.target.value)}
              placeholder="Ajouter une consigne..."
              className="flex-1 h-10 px-3 border border-input rounded-md bg-background"
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addConsigne())}
            />
            <Button type="button" onClick={addConsigne}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>

          {currentCRO.consignesPostOperatoires.length > 0 && (
            <ul className="space-y-2">
              {currentCRO.consignesPostOperatoires.map((consigne, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">{consigne}</span>
                  <Button variant="ghost" size="icon" onClick={() => removeConsigne(index)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => setCurrentCRO(defaultCRO())}>
          Réinitialiser
        </Button>
        <Button onClick={saveCRO}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer le CRO
        </Button>
      </div>
    </div>
  )
}
