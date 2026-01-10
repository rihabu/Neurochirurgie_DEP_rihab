"use client"

import type React from "react"

import { usePatient } from "@/lib/patient-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Check, X, Save } from "lucide-react"
import { generateSyndromeSummary } from "@/lib/utils/patient-utils"
import type { RegroupementSyndromique } from "@/lib/types/patient"
import { useState, useEffect } from "react"

function SyndromeCard({
  title,
  present,
  onPresentChange,
  arguments: args,
  onArgumentChange,
  children,
  urgent,
}: {
  title: string
  present: boolean
  onPresentChange: (v: boolean) => void
  arguments: Record<string, boolean>
  onArgumentChange: (key: string, value: boolean) => void
  children?: React.ReactNode
  urgent?: boolean
}) {
  const argumentCount = Object.values(args).filter(Boolean).length
  const totalArguments = Object.keys(args).length

  return (
    <Card className={present ? (urgent ? "border-critical" : "border-primary") : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            {title}
            {urgent && present && <Badge variant="destructive">URGENCE</Badge>}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={present ? "default" : "outline"}
              size="sm"
              onClick={() => onPresentChange(true)}
              className={present ? "bg-primary" : ""}
            >
              <Check className="h-4 w-4 mr-1" />
              Présent
            </Button>
            <Button
              variant={!present ? "default" : "outline"}
              size="sm"
              onClick={() => onPresentChange(false)}
              className={!present ? "bg-muted" : ""}
            >
              <X className="h-4 w-4 mr-1" />
              Absent
            </Button>
          </div>
        </div>
        {present && (
          <CardDescription>
            {argumentCount}/{totalArguments} arguments cliniques
          </CardDescription>
        )}
      </CardHeader>
      {present && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(args).map(([key, value]) => (
              <label
                key={key}
                className="flex items-center gap-2 p-2 border border-border rounded hover:bg-muted/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => onArgumentChange(key, e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm">{formatArgumentLabel(key)}</span>
              </label>
            ))}
          </div>
          {children}
        </CardContent>
      )}
    </Card>
  )
}

function formatArgumentLabel(key: string): string {
  const labels: Record<string, string> = {
    cephalees: "Céphalées",
    vomissements: "Vomissements",
    troublesVisuels: "Troubles visuels",
    oedePapillaire: "Oedème papillaire",
    troublesVigilance: "Troubles vigilance",
    deficitMoteur: "Déficit moteur",
    hypertonieSpastique: "Hypertonie spastique",
    hyperreflexie: "Hyperréflexie",
    babinski: "Babinski",
    syncinésies: "Syncinésies",
    niveauSensitif: "Niveau sensitif",
    syndromesSousLesionnels: "Syndromes sous-lésionnels",
    troublesSphinctériens: "Troubles sphinctériens",
    douleurSciatique: "Douleur sciatique",
    troublesSensitifsSelle: "Troubles sensitifs en selle",
    abolitionReflexes: "Abolition des réflexes",
    ataxie: "Ataxie",
    dysmétrie: "Dysmétrie",
    adiadococinésie: "Adiadococinésie",
    hypotonie: "Hypotonie",
    dysarthrie: "Dysarthrie",
    nystagmus: "Nystagmus",
    raideurNuque: "Raideur de nuque",
    signeKernig: "Signe de Kernig",
    signeBrudzinski: "Signe de Brudzinski",
    photophobie: "Photophobie",
    fievre: "Fièvre",
  }
  return labels[key] || key
}

export function SyndromesSection() {
  const { dossier, updateDossier } = usePatient()

  const defaultRegroupement: RegroupementSyndromique = {
    dateHeure: new Date().toISOString(),
    auteur: "",
    htic: {
      present: false,
      arguments: {
        cephalees: false,
        vomissements: false,
        troublesVisuels: false,
        oedePapillaire: false,
        troublesVigilance: false,
      },
      gravite: "Légère",
    },
    pyramidal: {
      present: false,
      topographie: "Absent",
      arguments: {
        deficitMoteur: false,
        hypertonieSpastique: false,
        hyperreflexie: false,
        babinski: false,
        syncinésies: false,
      },
    },
    medullaire: {
      present: false,
      typeAtteinte: "Absent",
      arguments: {
        niveauSensitif: false,
        syndromesSousLesionnels: false,
        troublesSphinctériens: false,
      },
    },
    queueCheval: {
      present: false,
      complet: false,
      arguments: {
        douleurSciatique: false,
        troublesSensitifsSelle: false,
        troublesSphinctériens: false,
        abolitionReflexes: false,
      },
      urgenceChirurgicale: false,
    },
    cerebelleux: {
      present: false,
      type: "Absent",
      arguments: {
        ataxie: false,
        dysmétrie: false,
        adiadococinésie: false,
        hypotonie: false,
        dysarthrie: false,
        nystagmus: false,
      },
    },
    meninge: {
      present: false,
      arguments: {
        cephalees: false,
        raideurNuque: false,
        signeKernig: false,
        signeBrudzinski: false,
        photophobie: false,
        fievre: false,
      },
    },
    syntheseNeurologique: "",
  }

  const [regroupement, setRegroupement] = useState<RegroupementSyndromique>(
    dossier?.regroupementSyndromique || defaultRegroupement,
  )

  useEffect(() => {
    // Auto-generate synthesis
    const synthesis = generateSyndromeSummary(regroupement)
    if (synthesis !== regroupement.syntheseNeurologique) {
      setRegroupement((prev) => ({ ...prev, syntheseNeurologique: synthesis }))
    }
  }, [regroupement])

  if (!dossier) return null

  const saveRegroupement = () => {
    updateDossier({ regroupementSyndromique: regroupement })
  }

  const hasSyndromes =
    regroupement.htic.present ||
    regroupement.pyramidal.present ||
    regroupement.medullaire.present ||
    regroupement.queueCheval.present ||
    regroupement.cerebelleux.present ||
    regroupement.meninge.present

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Regroupement Syndromique</h2>
          <p className="text-muted-foreground">Raisonnement clinique et synthèse neurologique</p>
        </div>
      </div>

      {/* Métadonnées */}
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Date et heure"
              name="dateHeure"
              type="datetime-local"
              value={regroupement.dateHeure.slice(0, 16)}
              onChange={(v) => setRegroupement((prev) => ({ ...prev, dateHeure: new Date(v).toISOString() }))}
              required
            />
            <FormField
              label="Auteur"
              name="auteur"
              value={regroupement.auteur}
              onChange={(v) => setRegroupement((prev) => ({ ...prev, auteur: v }))}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Synthèse automatique */}
      {hasSyndromes && (
        <Card className="border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Synthèse Neurologique
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{regroupement.syntheseNeurologique}</p>
          </CardContent>
        </Card>
      )}

      {/* HTIC */}
      <SyndromeCard
        title="Hypertension Intracrânienne (HTIC)"
        present={regroupement.htic.present}
        onPresentChange={(v) =>
          setRegroupement((prev) => ({
            ...prev,
            htic: { ...prev.htic, present: v },
          }))
        }
        arguments={regroupement.htic.arguments}
        onArgumentChange={(key, value) =>
          setRegroupement((prev) => ({
            ...prev,
            htic: { ...prev.htic, arguments: { ...prev.htic.arguments, [key]: value } },
          }))
        }
      >
        <FormField
          label="Gravité"
          name="graviteHTIC"
          type="select"
          value={regroupement.htic.gravite}
          onChange={(v) =>
            setRegroupement((prev) => ({
              ...prev,
              htic: { ...prev.htic, gravite: v as "Légère" | "Modérée" | "Sévère" },
            }))
          }
          options={[
            { value: "Légère", label: "Légère" },
            { value: "Modérée", label: "Modérée" },
            { value: "Sévère", label: "Sévère" },
          ]}
        />
      </SyndromeCard>

      {/* Syndrome Pyramidal */}
      <SyndromeCard
        title="Syndrome Pyramidal"
        present={regroupement.pyramidal.present}
        onPresentChange={(v) =>
          setRegroupement((prev) => ({
            ...prev,
            pyramidal: { ...prev.pyramidal, present: v },
          }))
        }
        arguments={regroupement.pyramidal.arguments}
        onArgumentChange={(key, value) =>
          setRegroupement((prev) => ({
            ...prev,
            pyramidal: { ...prev.pyramidal, arguments: { ...prev.pyramidal.arguments, [key]: value } },
          }))
        }
      >
        <FormField
          label="Topographie"
          name="topographiePyramidal"
          type="select"
          value={regroupement.pyramidal.topographie}
          onChange={(v) =>
            setRegroupement((prev) => ({
              ...prev,
              pyramidal: { ...prev.pyramidal, topographie: v as typeof prev.pyramidal.topographie },
            }))
          }
          options={[
            { value: "Absent", label: "Absent" },
            { value: "Hémicorporel droit", label: "Hémicorporel droit" },
            { value: "Hémicorporel gauche", label: "Hémicorporel gauche" },
            { value: "Parapyramidal", label: "Parapyramidal" },
            { value: "Tétrapyramidal", label: "Tétrapyramidal" },
          ]}
        />
      </SyndromeCard>

      {/* Syndrome Médullaire */}
      <SyndromeCard
        title="Syndrome Médullaire"
        present={regroupement.medullaire.present}
        onPresentChange={(v) =>
          setRegroupement((prev) => ({
            ...prev,
            medullaire: { ...prev.medullaire, present: v },
          }))
        }
        arguments={regroupement.medullaire.arguments}
        onArgumentChange={(key, value) =>
          setRegroupement((prev) => ({
            ...prev,
            medullaire: { ...prev.medullaire, arguments: { ...prev.medullaire.arguments, [key]: value } },
          }))
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Type d'atteinte"
            name="typeAtteinteMedullaire"
            type="select"
            value={regroupement.medullaire.typeAtteinte}
            onChange={(v) =>
              setRegroupement((prev) => ({
                ...prev,
                medullaire: { ...prev.medullaire, typeAtteinte: v as typeof prev.medullaire.typeAtteinte },
              }))
            }
            options={[
              { value: "Absent", label: "Absent" },
              { value: "Complet", label: "Complet" },
              { value: "Incomplet", label: "Incomplet" },
            ]}
          />
          <FormField
            label="Niveau"
            name="niveauMedullaire"
            value={regroupement.medullaire.niveau || ""}
            onChange={(v) =>
              setRegroupement((prev) => ({
                ...prev,
                medullaire: { ...prev.medullaire, niveau: v },
              }))
            }
            placeholder="Ex: T10"
          />
        </div>
      </SyndromeCard>

      {/* Syndrome Queue de Cheval */}
      <SyndromeCard
        title="Syndrome de la Queue de Cheval"
        present={regroupement.queueCheval.present}
        onPresentChange={(v) =>
          setRegroupement((prev) => ({
            ...prev,
            queueCheval: { ...prev.queueCheval, present: v },
          }))
        }
        arguments={regroupement.queueCheval.arguments}
        onArgumentChange={(key, value) =>
          setRegroupement((prev) => ({
            ...prev,
            queueCheval: { ...prev.queueCheval, arguments: { ...prev.queueCheval.arguments, [key]: value } },
          }))
        }
        urgent={regroupement.queueCheval.urgenceChirurgicale}
      >
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={regroupement.queueCheval.complet}
              onChange={(e) =>
                setRegroupement((prev) => ({
                  ...prev,
                  queueCheval: { ...prev.queueCheval, complet: e.target.checked },
                }))
              }
              className="h-4 w-4"
            />
            <span className="text-sm font-medium">Syndrome complet</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={regroupement.queueCheval.urgenceChirurgicale}
              onChange={(e) =>
                setRegroupement((prev) => ({
                  ...prev,
                  queueCheval: { ...prev.queueCheval, urgenceChirurgicale: e.target.checked },
                }))
              }
              className="h-4 w-4"
            />
            <span className="text-sm font-medium text-critical">URGENCE CHIRURGICALE</span>
          </label>
        </div>
      </SyndromeCard>

      {/* Syndrome Cérébelleux */}
      <SyndromeCard
        title="Syndrome Cérébelleux"
        present={regroupement.cerebelleux.present}
        onPresentChange={(v) =>
          setRegroupement((prev) => ({
            ...prev,
            cerebelleux: { ...prev.cerebelleux, present: v },
          }))
        }
        arguments={regroupement.cerebelleux.arguments}
        onArgumentChange={(key, value) =>
          setRegroupement((prev) => ({
            ...prev,
            cerebelleux: { ...prev.cerebelleux, arguments: { ...prev.cerebelleux.arguments, [key]: value } },
          }))
        }
      >
        <FormField
          label="Type"
          name="typeCerebelleux"
          type="select"
          value={regroupement.cerebelleux.type}
          onChange={(v) =>
            setRegroupement((prev) => ({
              ...prev,
              cerebelleux: { ...prev.cerebelleux, type: v as typeof prev.cerebelleux.type },
            }))
          }
          options={[
            { value: "Absent", label: "Absent" },
            { value: "Statique", label: "Statique (vermien)" },
            { value: "Cinétique", label: "Cinétique (hémisphérique)" },
            { value: "Mixte", label: "Mixte" },
          ]}
        />
      </SyndromeCard>

      {/* Syndrome Méningé */}
      <SyndromeCard
        title="Syndrome Méningé"
        present={regroupement.meninge.present}
        onPresentChange={(v) =>
          setRegroupement((prev) => ({
            ...prev,
            meninge: { ...prev.meninge, present: v },
          }))
        }
        arguments={regroupement.meninge.arguments}
        onArgumentChange={(key, value) =>
          setRegroupement((prev) => ({
            ...prev,
            meninge: { ...prev.meninge, arguments: { ...prev.meninge.arguments, [key]: value } },
          }))
        }
      />

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => setRegroupement(defaultRegroupement)}>
          Réinitialiser
        </Button>
        <Button onClick={saveRegroupement}>
          <Save className="h-4 w-4 mr-2" />
          Enregistrer le regroupement
        </Button>
      </div>
    </div>
  )
}
