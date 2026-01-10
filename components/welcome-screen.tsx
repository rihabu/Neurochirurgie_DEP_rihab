"use client"

import { usePatient } from "@/lib/patient-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, FileText, Shield, Clock } from "lucide-react"

export function WelcomeScreen() {
  const { setDossier } = usePatient()

  const handleNewPatient = () => {
    const newDossier = {
      id: `DOS-${Date.now()}`,
      dateCreation: new Date().toISOString(),
      derniereMiseAJour: new Date().toISOString(),
      statut: "En cours" as const,
      identite: {
        ipp: `IPP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        nom: "",
        prenom: "",
        dateNaissance: "",
        sexe: "M" as const,
        adresse: { rue: "", codePostal: "", ville: "", pays: "France" },
        telephone: "",
        lateralite: "Non déterminé" as const,
        allergiesConnues: [],
        contacts: [],
      },
      admission: {
        numeroSejour: `SEJ-${Date.now()}`,
        dateHeureAdmission: new Date().toISOString(),
        modeEntree: "Urgences" as const,
        motifPrincipal: "",
        typeUrgence: "Relative" as const,
        chronologieSymptomes: {
          dateDebut: "",
          description: "",
          evolution: "Progressive" as const,
        },
        hypotheseDiagnostique: "",
        medecinsImpliques: [],
        auteurAdmission: "",
        fonctionAuteur: "",
      },
      examensCore: [],
      examensExtended: [],
      examensComplementaires: {
        imagerie: [],
        biologie: [],
        scores: [],
      },
      comptesRendusOperatoires: [],
    }
    setDossier(newDossier)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">DEP Neurochirurgie</h1>
        </div>
        <p className="text-lg text-muted-foreground">Dossier Électronique Patient - Service de Neurochirurgie</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 w-full">
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <FileText className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2 text-card-foreground">Exhaustif</h3>
            <p className="text-sm text-muted-foreground">
              Couverture complète du parcours patient de l'admission à la sortie
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <Shield className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2 text-card-foreground">Traçabilité</h3>
            <p className="text-sm text-muted-foreground">
              Chaque action horodatée avec auteur et contexte médico-légal
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <Clock className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2 text-card-foreground">Workflow réel</h3>
            <p className="text-sm text-muted-foreground">
              Respect de l'ordre clinique : Urgence, Stabilisation, Examen, Décision
            </p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleNewPatient} size="lg" className="px-8">
        Créer un nouveau dossier patient
      </Button>
    </div>
  )
}
