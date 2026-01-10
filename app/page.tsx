"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { usePatient } from "@/lib/patient-context"
import { IdentiteSection } from "@/components/sections/identite-section"
import { AdmissionSection } from "@/components/sections/admission-section"
import { ExamenCoreSection } from "@/components/sections/examen-core-section"
import { ExamenExtendedSection } from "@/components/sections/examen-extended-section"
import { SyndromesSection } from "@/components/sections/syndromes-section"
import { ExamensCompSection } from "@/components/sections/examens-comp-section"
import { DecisionSection } from "@/components/sections/decision-section"
import { OperationSection } from "@/components/sections/operation-section"
import { EvolutionSection } from "@/components/sections/evolution-section"
import { SortieSection } from "@/components/sections/sortie-section"
import { WelcomeScreen } from "@/components/welcome-screen"

export default function HomePage() {
  const { dossier, currentSection } = usePatient()

  const renderSection = () => {
    if (!dossier) return <WelcomeScreen />

    switch (currentSection) {
      case "identite":
        return <IdentiteSection />
      case "admission":
        return <AdmissionSection />
      case "examen-core":
        return <ExamenCoreSection />
      case "examen-extended":
        return <ExamenExtendedSection />
      case "syndromes":
        return <SyndromesSection />
      case "examens-comp":
        return <ExamensCompSection />
      case "decision":
        return <DecisionSection />
      case "operation":
        return <OperationSection />
      case "evolution":
        return <EvolutionSection />
      case "sortie":
        return <SortieSection />
      default:
        return <IdentiteSection />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6">{renderSection()}</main>
      </div>
    </div>
  )
}
