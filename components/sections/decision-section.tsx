"use client"

import { usePatient } from "@/lib/patient-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Badge } from "@/components/ui/badge"
import { FileCheck, AlertTriangle } from "lucide-react"
import type { DecisionTherapeutique, TypeDecision } from "@/lib/types/patient"
import { useState } from "react"

export function DecisionSection() {
  const { dossier, updateDossier } = usePatient()
  
  const defaultDecision: DecisionTherapeutique = {
    dateHeure: new Date().toISOString(),
    auteur: '',
    fonction: '',
    typeDecision: 'Surveillance',
    indicationOperatoire: false,
    argumentaireMedical: '',
    beneficesAttendus: [],
    risquesIdentifies: [],
    consentementPatient: {
      obtenu: false
    }
  }

  const [decision, setDecision] = useState<DecisionTherapeutique>(
    dossier?.decisionTherapeutique || defaultDecision
  )
  const [newBenefice, setNewBenefice] = useState('')
  const [newRisque, setNewRisque] = useState('')

  if (!dossier) return null

  const addBenefice = () => {
    if (newBenefice.trim()) {
      setDecision(prev => ({
        ...prev,
        beneficesAttendus: [...prev.beneficesAttendus, newBenefice.trim()]
      }))
      setNewBenefice('')
    }
  }

  const addRisque = () => {
    if (newRisque.trim()) {
      setDecision(prev => ({
        ...prev,
        risquesIdentifies: [...prev.risquesIdentifies, newRisque.trim()]
      }))
      setNewRisque('')
    }
  }

  const saveDecision = () => {
    updateDossier({ decisionTherapeutique: decision })
  }

  const isUrgentSurgery = decision.typeDecision === 'Chirurgie urgente'

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Décision Thérapeutique</h2>
        <p className="text-muted-foreground">Indication opératoire et argumentaire médical</p>
      </div>

      {/* Métadonnées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Informations de la décision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Date et heure"
              name="dateHeure"
              type="datetime-local"
              value={decision.dateHeure.slice(0, 16)}
              onChange={(v) => setDecision(prev => ({ ...prev, dateHeure: new Date(v).toISOString() }))}
              required
            />
            <FormField
              label="Auteur"
              name="auteur"
              value={decision.auteur}
              onChange={(v) => setDecision(prev => ({ ...prev, auteur: v }))}
              required
              placeholder="Médecin décideur"
            />
            <FormField
              label="Fonction"
              name="fonction"
              value={decision.fonction}
              onChange={(v) => setDecision(prev => ({ ...prev, fonction: v }))}
              required
              placeholder="Ex: PU-PH, PH..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Type de décision */}
      <Card className={isUrgentSurgery ? 'border-critical' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Type de décision
            {isUrgentSurgery && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                URGENCE
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { value: 'Chirurgie urgente', label: 'Chirurgie urgente', urgent: true },
              { value: 'Chirurgie différée', label: 'Chirurgie différée', urgent: false },
              { value: 'Traitement médical', label: 'Traitement médical', urgent: false },
              { value: 'Surveillance', label: 'Surveillance', urgent: false },
              { value: 'Transfert', label: 'Transfert', urgent: false },
              { value: 'Abstention thérapeutique', label: 'Abstention', urgent: false }
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDecision(prev => ({
                  ...prev,
                  typeDecision: opt.value as TypeDecision,
                  indicationOperatoire: opt.value.includes('Chirurgie')
                }))}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  decision.typeDecision === opt.value
                    ? opt.urgent 
                      ? 'border-critical bg-critical/10 text-critical'
                      : 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <span className="text-sm font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      { /* Argumentaire */
