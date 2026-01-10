"use client"

import { usePatient } from "@/lib/patient-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LogOut, Plus, Trash2, Save, AlertTriangle, FileText } from "lucide-react"
import type { Sortie, ModeSortie } from "@/lib/types/patient"
import { useState } from "react"

const defaultSortie = (): Sortie => ({
  dateHeure: new Date().toISOString(),
  auteur: "",
  fonction: "",
  modeSortie: "Domicile",
  diagnosticFinal: {
    principal: "",
    associes: [],
  },
  etatNeurologiqueSortie: {
    gcs: 15,
    deficits: [],
    ameliorationParRapportEntree: true,
  },
  ordonnanceSortie: [],
  consignesSortie: [],
  signesAlerte: [],
  suiviPrevu: [],
  documentsRemis: [],
})

export function SortieSection() {
  const { dossier, updateDossier } = usePatient()
  const [sortie, setSortie] = useState<Sortie>(dossier?.sortie || defaultSortie())
  const [newDiagAssocie, setNewDiagAssocie] = useState("")
  const [newDeficit, setNewDeficit] = useState("")
  const [newConsigne, setNewConsigne] = useState("")
  const [newSigneAlerte, setNewSigneAlerte] = useState("")
  const [newDocument, setNewDocument] = useState("")
  const [newMedicament, setNewMedicament] = useState({ medicament: "", posologie: "", duree: "", instructions: "" })
  const [newSuivi, setNewSuivi] = useState({ type: "Consultation" as const, delai: "", praticien: "", lieu: "" })

  if (!dossier) return null

  const addToArray = (
    field:
      | "diagnosticFinal.associes"
      | "etatNeurologiqueSortie.deficits"
      | "consignesSortie"
      | "signesAlerte"
      | "documentsRemis",
    value: string,
    setter: (v: string) => void,
  ) => {
    if (value.trim()) {
      const parts = field.split(".")
      if (parts.length === 2) {
        const [parent, child] = parts
        setSortie((prev) => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof Sortie] as Record<string, unknown>),
            [child]: [...((prev[parent as keyof Sortie] as Record<string, string[]>)[child] || []), value.trim()],
          },
        }))
      } else {
        setSortie((prev) => ({
          ...prev,
          [field]: [...(prev[field as keyof Sortie] as string[]), value.trim()],
        }))
      }
      setter("")
    }
  }

  const addMedicament = () => {
    if (newMedicament.medicament && newMedicament.posologie) {
      setSortie((prev) => ({
        ...prev,
        ordonnanceSortie: [...prev.ordonnanceSortie, newMedicament],
      }))
      setNewMedicament({ medicament: "", posologie: "", duree: "", instructions: "" })
    }
  }

  const addSuivi = () => {
    if (newSuivi.delai) {
      setSortie((prev) => ({
        ...prev,
        suiviPrevu: [...prev.suiviPrevu, newSuivi],
      }))
      setNewSuivi({ type: "Consultation", delai: "", praticien: "", lieu: "" })
    }
  }

  const saveSortie = () => {
    updateDossier({ sortie, statut: "Clôturé" })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sortie du Patient</h2>
          <p className="text-muted-foreground">Clôture du dossier et organisation du suivi</p>
        </div>
        {dossier.sortie && <Badge variant="secondary">Sortie enregistrée</Badge>}
      </div>

      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Informations de sortie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormField
              label="Date et heure"
              name="dateHeure"
              type="datetime-local"
              value={sortie.dateHeure.slice(0, 16)}
              onChange={(v) => setSortie((prev) => ({ ...prev, dateHeure: new Date(v).toISOString() }))}
              required
            />
            <FormField
              label="Mode de sortie"
              name="modeSortie"
              type="select"
              value={sortie.modeSortie}
              onChange={(v) => setSortie((prev) => ({ ...prev, modeSortie: v as ModeSortie }))}
              options={[
                { value: "Domicile", label: "Domicile" },
                { value: "SSR", label: "SSR" },
                { value: "Transfert", label: "Transfert" },
                { value: "HAD", label: "HAD" },
                { value: "EHPAD", label: "EHPAD" },
                { value: "Décès", label: "Décès" },
              ]}
              required
            />
            <FormField
              label="Auteur"
              name="auteur"
              value={sortie.auteur}
              onChange={(v) => setSortie((prev) => ({ ...prev, auteur: v }))}
              required
            />
            <FormField
              label="Fonction"
              name="fonction"
              value={sortie.fonction}
              onChange={(v) => setSortie((prev) => ({ ...prev, fonction: v }))}
              required
            />
          </div>

          {(sortie.modeSortie === "SSR" || sortie.modeSortie === "Transfert" || sortie.modeSortie === "HAD") && (
            <FormField
              label="Établissement de destination"
              name="etablissementDestination"
              value={sortie.etablissementDestination || ""}
              onChange={(v) => setSortie((prev) => ({ ...prev, etablissementDestination: v }))}
              required
            />
          )}
        </CardContent>
      </Card>

      {/* Diagnostic final */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic Final</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Diagnostic principal"
            name="diagnosticPrincipal"
            type="textarea"
            value={sortie.diagnosticFinal.principal}
            onChange={(v) =>
              setSortie((prev) => ({
                ...prev,
                diagnosticFinal: { ...prev.diagnosticFinal, principal: v },
              }))
            }
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Diagnostics associés</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDiagAssocie}
                onChange={(e) => setNewDiagAssocie(e.target.value)}
                placeholder="Ajouter un diagnostic associé..."
                className="flex-1 h-10 px-3 border border-input rounded-md bg-background"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), addToArray("diagnosticFinal.associes", newDiagAssocie, setNewDiagAssocie))
                }
              />
              <Button
                type="button"
                onClick={() => addToArray("diagnosticFinal.associes", newDiagAssocie, setNewDiagAssocie)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {sortie.diagnosticFinal.associes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {sortie.diagnosticFinal.associes.map((diag, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {diag}
                    <button
                      onClick={() =>
                        setSortie((prev) => ({
                          ...prev,
                          diagnosticFinal: {
                            ...prev.diagnosticFinal,
                            associes: prev.diagnosticFinal.associes.filter((_, idx) => idx !== i),
                          },
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
        </CardContent>
      </Card>

      {/* État neurologique à la sortie */}
      <Card>
        <CardHeader>
          <CardTitle>État Neurologique à la Sortie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="GCS"
              name="gcsSortie"
              type="number"
              value={sortie.etatNeurologiqueSortie.gcs}
              onChange={(v) =>
                setSortie((prev) => ({
                  ...prev,
                  etatNeurologiqueSortie: { ...prev.etatNeurologiqueSortie, gcs: Number.parseInt(v) },
                }))
              }
              hint="/15"
            />
            <FormField
              label="Score de Rankin modifié"
              name="rankin"
              type="select"
              value={sortie.etatNeurologiqueSortie.scoreRankinModifie?.toString() || ""}
              onChange={(v) =>
                setSortie((prev) => ({
                  ...prev,
                  etatNeurologiqueSortie: {
                    ...prev.etatNeurologiqueSortie,
                    scoreRankinModifie: v ? Number.parseInt(v) : undefined,
                  },
                }))
              }
              options={[
                { value: "", label: "Non évalué" },
                { value: "0", label: "0 - Aucun symptôme" },
                { value: "1", label: "1 - Pas d'incapacité significative" },
                { value: "2", label: "2 - Incapacité légère" },
                { value: "3", label: "3 - Incapacité modérée" },
                { value: "4", label: "4 - Incapacité modérément sévère" },
                { value: "5", label: "5 - Incapacité sévère" },
                { value: "6", label: "6 - Décès" },
              ]}
            />
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sortie.etatNeurologiqueSortie.ameliorationParRapportEntree}
                  onChange={(e) =>
                    setSortie((prev) => ({
                      ...prev,
                      etatNeurologiqueSortie: {
                        ...prev.etatNeurologiqueSortie,
                        ameliorationParRapportEntree: e.target.checked,
                      },
                    }))
                  }
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">Amélioration par rapport à l'entrée</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Déficits résiduels</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newDeficit}
                onChange={(e) => setNewDeficit(e.target.value)}
                placeholder="Ajouter un déficit..."
                className="flex-1 h-10 px-3 border border-input rounded-md bg-background"
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), addToArray("etatNeurologiqueSortie.deficits", newDeficit, setNewDeficit))
                }
              />
              <Button
                type="button"
                onClick={() => addToArray("etatNeurologiqueSortie.deficits", newDeficit, setNewDeficit)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {sortie.etatNeurologiqueSortie.deficits.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {sortie.etatNeurologiqueSortie.deficits.map((deficit, i) => (
                  <Badge key={i} variant="outline" className="gap-1">
                    {deficit}
                    <button
                      onClick={() =>
                        setSortie((prev) => ({
                          ...prev,
                          etatNeurologiqueSortie: {
                            ...prev.etatNeurologiqueSortie,
                            deficits: prev.etatNeurologiqueSortie.deficits.filter((_, idx) => idx !== i),
                          },
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
        </CardContent>
      </Card>

      {/* Ordonnance de sortie */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ordonnance de Sortie
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <input
              type="text"
              value={newMedicament.medicament}
              onChange={(e) => setNewMedicament((prev) => ({ ...prev, medicament: e.target.value }))}
              placeholder="Médicament"
              className="h-10 px-3 border border-input rounded-md bg-background"
            />
            <input
              type="text"
              value={newMedicament.posologie}
              onChange={(e) => setNewMedicament((prev) => ({ ...prev, posologie: e.target.value }))}
              placeholder="Posologie"
              className="h-10 px-3 border border-input rounded-md bg-background"
            />
            <input
              type="text"
              value={newMedicament.duree}
              onChange={(e) => setNewMedicament((prev) => ({ ...prev, duree: e.target.value }))}
              placeholder="Durée"
              className="h-10 px-3 border border-input rounded-md bg-background"
            />
            <input
              type="text"
              value={newMedicament.instructions}
              onChange={(e) => setNewMedicament((prev) => ({ ...prev, instructions: e.target.value }))}
              placeholder="Instructions"
              className="h-10 px-3 border border-input rounded-md bg-background"
            />
            <Button onClick={addMedicament}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>

          {sortie.ordonnanceSortie.length > 0 && (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2">Médicament</th>
                    <th className="text-left p-2">Posologie</th>
                    <th className="text-left p-2">Durée</th>
                    <th className="text-left p-2">Instructions</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortie.ordonnanceSortie.map((med, i) => (
                    <tr key={i} className="border-t border-border">
                      <td className="p-2">{med.medicament}</td>
                      <td className="p-2">{med.posologie}</td>
                      <td className="p-2">{med.duree}</td>
                      <td className="p-2">{med.instructions}</td>
                      <td className="p-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setSortie((prev) => ({
                              ...prev,
                              ordonnanceSortie: prev.ordonnanceSortie.filter((_, idx) => idx !== i),
                            }))
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signes d'alerte */}
      <Card className="border-amber-500/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Signes d'Alerte à Surveiller
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSigneAlerte}
              onChange={(e) => setNewSigneAlerte(e.target.value)}
              placeholder="Ajouter un signe d'alerte..."
              className="flex-1 h-10 px-3 border border-input rounded-md bg-background"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addToArray("signesAlerte", newSigneAlerte, setNewSigneAlerte))
              }
            />
            <Button type="button" onClick={() => addToArray("signesAlerte", newSigneAlerte, setNewSigneAlerte)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {sortie.signesAlerte.length > 0 ? (
            <ul className="space-y-2">
              {sortie.signesAlerte.map((signe, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg"
                >
                  <span className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    {signe}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setSortie((prev) => ({
                        ...prev,
                        signesAlerte: prev.signesAlerte.filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Exemples: Céphalées inhabituelles, vomissements, trouble de la vigilance, déficit neurologique nouveau...
            </p>
          )}
        </CardContent>
      </Card>

      {/* Suivi prévu */}
      <Card>
        <CardHeader>
          <CardTitle>Suivi Prévu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            <FormField
              label=""
              name="typeSuivi"
              type="select"
              value={newSuivi.type}
              onChange={(v) => setNewSuivi((prev) => ({ ...prev, type: v as typeof prev.type }))}
              options={[
                { value: "Consultation", label: "Consultation" },
                { value: "Imagerie", label: "Imagerie" },
                { value: "Rééducation", label: "Rééducation" },
                { value: "Autre", label: "Autre" },
              ]}
            />
            <input
              type="text"
              value={newSuivi.delai}
              onChange={(e) => setNewSuivi((prev) => ({ ...prev, delai: e.target.value }))}
              placeholder="Délai (ex: 6 semaines)"
              className="h-10 px-3 border border-input rounded-md bg-background"
            />
            <input
              type="text"
              value={newSuivi.praticien}
              onChange={(e) => setNewSuivi((prev) => ({ ...prev, praticien: e.target.value }))}
              placeholder="Praticien"
              className="h-10 px-3 border border-input rounded-md bg-background"
            />
            <input
              type="text"
              value={newSuivi.lieu}
              onChange={(e) => setNewSuivi((prev) => ({ ...prev, lieu: e.target.value }))}
              placeholder="Lieu"
              className="h-10 px-3 border border-input rounded-md bg-background"
            />
            <Button onClick={addSuivi}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>

          {sortie.suiviPrevu.length > 0 && (
            <div className="space-y-2">
              {sortie.suiviPrevu.map((suivi, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <Badge variant="outline" className="mr-2">
                      {suivi.type}
                    </Badge>
                    <span className="font-medium">{suivi.delai}</span>
                    {suivi.praticien && <span className="text-muted-foreground"> - {suivi.praticien}</span>}
                    {suivi.lieu && <span className="text-muted-foreground"> ({suivi.lieu})</span>}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setSortie((prev) => ({
                        ...prev,
                        suiviPrevu: prev.suiviPrevu.filter((_, idx) => idx !== i),
                      }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consignes et Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consignes de Sortie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newConsigne}
                onChange={(e) => setNewConsigne(e.target.value)}
                placeholder="Ajouter une consigne..."
                className="flex-1 h-10 px-3 border border-input rounded-md bg-background"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addToArray("consignesSortie", newConsigne, setNewConsigne))
                }
              />
              <Button type="button" onClick={() => addToArray("consignesSortie", newConsigne, setNewConsigne)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {sortie.consignesSortie.length > 0 && (
              <ul className="space-y-1">
                {sortie.consignesSortie.map((c, i) => (
                  <li key={i} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                    <span>{c}</span>
                    <button
                      onClick={() =>
                        setSortie((prev) => ({
                          ...prev,
                          consignesSortie: prev.consignesSortie.filter((_, idx) => idx !== i),
                        }))
                      }
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents Remis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newDocument}
                onChange={(e) => setNewDocument(e.target.value)}
                placeholder="Ajouter un document..."
                className="flex-1 h-10 px-3 border border-input rounded-md bg-background"
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addToArray("documentsRemis", newDocument, setNewDocument))
                }
              />
              <Button type="button" onClick={() => addToArray("documentsRemis", newDocument, setNewDocument)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {sortie.documentsRemis.length > 0 && (
              <ul className="space-y-1">
                {sortie.documentsRemis.map((d, i) => (
                  <li key={i} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {d}
                    </span>
                    <button
                      onClick={() =>
                        setSortie((prev) => ({
                          ...prev,
                          documentsRemis: prev.documentsRemis.filter((_, idx) => idx !== i),
                        }))
                      }
                    >
                      <Trash2 className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => setSortie(defaultSortie())}>
          Réinitialiser
        </Button>
        <Button onClick={saveSortie} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Finaliser et Clôturer le Dossier
        </Button>
      </div>
    </div>
  )
}
