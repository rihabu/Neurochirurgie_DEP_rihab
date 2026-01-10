"use client"

import { usePatient } from "@/lib/patient-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, ClipboardList, Clock, Users } from "lucide-react"
import type { ModeEntree, TypeUrgence } from "@/lib/types/patient"

export function AdmissionSection() {
  const { dossier, updateDossier } = usePatient()

  if (!dossier) return null

  const { admission } = dossier

  const updateAdmission = (field: string, value: unknown) => {
    updateDossier({
      admission: {
        ...admission,
        [field]: value,
      },
    })
  }

  const updateChronologie = (field: string, value: string) => {
    updateDossier({
      admission: {
        ...admission,
        chronologieSymptomes: {
          ...admission.chronologieSymptomes,
          [field]: value,
        },
      },
    })
  }

  const addMedecin = () => {
    updateAdmission("medecinsImpliques", [
      ...admission.medecinsImpliques,
      { role: "", nom: "", fonction: "", dateHeure: new Date().toISOString() },
    ])
  }

  const updateMedecin = (index: number, field: string, value: string) => {
    const updated = [...admission.medecinsImpliques]
    updated[index] = { ...updated[index], [field]: value }
    updateAdmission("medecinsImpliques", updated)
  }

  const removeMedecin = (index: number) => {
    updateAdmission(
      "medecinsImpliques",
      admission.medecinsImpliques.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Admission / Séjour</h2>
        <p className="text-muted-foreground">N° Séjour: {admission.numeroSejour}</p>
      </div>

      {/* Mode d'entrée */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Mode d'entrée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date et heure d'admission"
              name="dateHeureAdmission"
              type="datetime-local"
              value={admission.dateHeureAdmission.slice(0, 16)}
              onChange={(v) => updateAdmission("dateHeureAdmission", new Date(v).toISOString())}
              required
            />
            <FormField
              label="Mode d'entrée"
              name="modeEntree"
              type="select"
              value={admission.modeEntree}
              onChange={(v) => updateAdmission("modeEntree", v as ModeEntree)}
              options={[
                { value: "Urgences", label: "Urgences" },
                { value: "Consultation programmée", label: "Consultation programmée" },
                { value: "Transfert interne", label: "Transfert interne" },
                { value: "Transfert externe", label: "Transfert externe" },
                { value: "Hospitalisation programmée", label: "Hospitalisation programmée" },
              ]}
              required
            />
          </div>

          {(admission.modeEntree === "Transfert interne" || admission.modeEntree === "Transfert externe") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Service d'origine"
                name="serviceOrigine"
                value={admission.serviceOrigine || ""}
                onChange={(v) => updateAdmission("serviceOrigine", v)}
                placeholder="Ex: Réanimation, Neurologie..."
              />
              <FormField
                label="Établissement d'origine"
                name="etablissementOrigine"
                value={admission.etablissementOrigine || ""}
                onChange={(v) => updateAdmission("etablissementOrigine", v)}
                placeholder="Nom de l'établissement"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Type d'urgence"
              name="typeUrgence"
              type="select"
              value={admission.typeUrgence}
              onChange={(v) => updateAdmission("typeUrgence", v as TypeUrgence)}
              options={[
                { value: "Vitale", label: "Vitale - Pronostic vital engagé" },
                { value: "Fonctionnelle", label: "Fonctionnelle - Risque de séquelles" },
                { value: "Relative", label: "Relative - Prise en charge rapide" },
                { value: "Non urgente", label: "Non urgente - Programmée" },
              ]}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Motif */}
      <Card>
        <CardHeader>
          <CardTitle>Motif d'hospitalisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Motif principal"
            name="motifPrincipal"
            value={admission.motifPrincipal}
            onChange={(v) => updateAdmission("motifPrincipal", v)}
            required
            placeholder="Ex: Céphalées brutales, Déficit moteur..."
          />
          <FormField
            label="Motif détaillé"
            name="motifDetaille"
            type="textarea"
            value={admission.motifDetaille || ""}
            onChange={(v) => updateAdmission("motifDetaille", v)}
            placeholder="Description détaillée du motif d'hospitalisation..."
          />
        </CardContent>
      </Card>

      {/* Chronologie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Chronologie des symptômes
          </CardTitle>
          <CardDescription>Préciser l'évolution temporelle des symptômes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date de début des symptômes"
              name="dateDebut"
              type="datetime-local"
              value={admission.chronologieSymptomes.dateDebut}
              onChange={(v) => updateChronologie("dateDebut", v)}
              required
            />
            <FormField
              label="Mode d'installation"
              name="evolution"
              type="select"
              value={admission.chronologieSymptomes.evolution}
              onChange={(v) => updateChronologie("evolution", v)}
              options={[
                { value: "Brutale", label: "Brutale (secondes à minutes)" },
                { value: "Progressive", label: "Progressive (heures à jours)" },
                { value: "Fluctuante", label: "Fluctuante" },
              ]}
              required
            />
          </div>
          <FormField
            label="Description de l'évolution"
            name="description"
            type="textarea"
            value={admission.chronologieSymptomes.description}
            onChange={(v) => updateChronologie("description", v)}
            required
            placeholder="Décrire l'évolution chronologique des symptômes..."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Facteurs déclenchants"
              name="facteursDeclenchants"
              value={admission.chronologieSymptomes.facteursDeclenchants || ""}
              onChange={(v) => updateChronologie("facteursDeclenchants", v)}
              placeholder="Ex: Effort, Valsalva..."
            />
            <FormField
              label="Facteurs aggravants"
              name="facteursAggravants"
              value={admission.chronologieSymptomes.facteursAggravants || ""}
              onChange={(v) => updateChronologie("facteursAggravants", v)}
              placeholder="Ex: Position, Lumière..."
            />
            <FormField
              label="Facteurs soulageants"
              name="facteursSoulageants"
              value={admission.chronologieSymptomes.facteursSoulageants || ""}
              onChange={(v) => updateChronologie("facteursSoulageants", v)}
              placeholder="Ex: Repos, Obscurité..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Hypothèses */}
      <Card>
        <CardHeader>
          <CardTitle>Hypothèses diagnostiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Hypothèse diagnostique principale"
            name="hypotheseDiagnostique"
            type="textarea"
            value={admission.hypotheseDiagnostique}
            onChange={(v) => updateAdmission("hypotheseDiagnostique", v)}
            required
            placeholder="Ex: Hémorragie sous-arachnoïdienne sur rupture d'anévrisme..."
          />
        </CardContent>
      </Card>

      {/* Médecins */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Médecins impliqués
          </CardTitle>
          <CardDescription>Traçabilité des intervenants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {admission.medecinsImpliques.map((medecin, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-4 bg-muted/30">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium">Intervenant {index + 1}</span>
                <Button variant="ghost" size="icon" onClick={() => removeMedecin(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField
                  label="Rôle"
                  name={`medecin-${index}-role`}
                  type="select"
                  value={medecin.role}
                  onChange={(v) => updateMedecin(index, "role", v)}
                  options={[
                    { value: "Admetteur", label: "Admetteur" },
                    { value: "Référent", label: "Médecin référent" },
                    { value: "Senior", label: "Senior de garde" },
                    { value: "Consultant", label: "Consultant" },
                  ]}
                />
                <FormField
                  label="Nom"
                  name={`medecin-${index}-nom`}
                  value={medecin.nom}
                  onChange={(v) => updateMedecin(index, "nom", v)}
                  placeholder="Dr. Nom"
                />
                <FormField
                  label="Fonction"
                  name={`medecin-${index}-fonction`}
                  value={medecin.fonction}
                  onChange={(v) => updateMedecin(index, "fonction", v)}
                  placeholder="Ex: PH, Interne..."
                />
                <FormField
                  label="Date/Heure"
                  name={`medecin-${index}-date`}
                  type="datetime-local"
                  value={medecin.dateHeure.slice(0, 16)}
                  onChange={(v) => updateMedecin(index, "dateHeure", new Date(v).toISOString())}
                />
              </div>
            </div>
          ))}
          <Button onClick={addMedecin} variant="outline" className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un intervenant
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <FormField
              label="Auteur de l'admission"
              name="auteurAdmission"
              value={admission.auteurAdmission}
              onChange={(v) => updateAdmission("auteurAdmission", v)}
              required
              placeholder="Nom du médecin"
            />
            <FormField
              label="Fonction"
              name="fonctionAuteur"
              value={admission.fonctionAuteur}
              onChange={(v) => updateAdmission("fonctionAuteur", v)}
              required
              placeholder="Ex: Interne, Chef de clinique..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
