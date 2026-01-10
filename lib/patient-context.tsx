"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { DossierPatientNeurochirurgie } from "./types/patient"

interface PatientContextType {
  dossier: DossierPatientNeurochirurgie | null
  setDossier: (dossier: DossierPatientNeurochirurgie | null) => void
  updateDossier: (updates: Partial<DossierPatientNeurochirurgie>) => void
  currentSection: string
  setCurrentSection: (section: string) => void
}

const PatientContext = createContext<PatientContextType | undefined>(undefined)

export function PatientProvider({ children }: { children: ReactNode }) {
  const [dossier, setDossier] = useState<DossierPatientNeurochirurgie | null>(null)
  const [currentSection, setCurrentSection] = useState("identite")

  const updateDossier = (updates: Partial<DossierPatientNeurochirurgie>) => {
    if (dossier) {
      setDossier({
        ...dossier,
        ...updates,
        derniereMiseAJour: new Date().toISOString(),
      })
    }
  }

  return (
    <PatientContext.Provider value={{ dossier, setDossier, updateDossier, currentSection, setCurrentSection }}>
      {children}
    </PatientContext.Provider>
  )
}

export function usePatient() {
  const context = useContext(PatientContext)
  if (!context) {
    throw new Error("usePatient must be used within a PatientProvider")
  }
  return context
}
