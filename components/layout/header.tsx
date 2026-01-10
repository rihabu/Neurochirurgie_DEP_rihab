"use client"

import { usePatient } from "@/lib/patient-context"
import { formatDateTime, calculateAge } from "@/lib/utils/patient-utils"
import { Clock, AlertTriangle, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const { dossier, setDossier } = usePatient()

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
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {dossier ? (
          <>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {dossier.identite.nom || "Nouveau patient"} {dossier.identite.prenom}
              </span>
              {dossier.identite.dateNaissance && (
                <span className="text-sm text-muted-foreground">
                  ({calculateAge(dossier.identite.dateNaissance)} ans)
                </span>
              )}
            </div>
            {dossier.admission.typeUrgence === "Vitale" && (
              <div className="flex items-center gap-1 px-2 py-1 bg-critical/20 text-critical rounded-md text-sm">
                <AlertTriangle className="h-3 w-3" />
                <span>Urgence Vitale</span>
              </div>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">Aucun dossier ouvert</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatDateTime(new Date().toISOString())}</span>
        </div>
        <Button onClick={handleNewPatient} size="sm">
          Nouveau Patient
        </Button>
      </div>
    </header>
  )
}
