"use client"

import { cn } from "@/lib/utils"
import { usePatient } from "@/lib/patient-context"
import {
  User,
  ClipboardList,
  Stethoscope,
  Brain,
  FileImage,
  FileCheck,
  Scissors,
  TrendingUp,
  LogOut,
  Activity,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"

const sections = [
  { id: "identite", label: "Identité Patient", icon: User },
  { id: "admission", label: "Admission / Séjour", icon: ClipboardList },
  { id: "examen-core", label: "Examen CORE", icon: Activity },
  { id: "examen-extended", label: "Examen EXTENDED", icon: Stethoscope },
  { id: "syndromes", label: "Regroupement Syndromique", icon: Brain },
  { id: "examens-comp", label: "Examens Complémentaires", icon: FileImage },
  { id: "decision", label: "Décision Thérapeutique", icon: FileCheck },
  { id: "operation", label: "Compte Rendu Opératoire", icon: Scissors },
  { id: "evolution", label: "Évolution Post-op", icon: TrendingUp },
  { id: "sortie", label: "Sortie", icon: LogOut },
]

export function Sidebar() {
  const { currentSection, setCurrentSection, dossier } = usePatient()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="font-semibold text-sm text-sidebar-foreground">DEP Neurochirurgie</h1>
            <p className="text-xs text-sidebar-foreground/60">v1.0</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Patient Info */}
      {dossier && !collapsed && (
        <div className="p-4 border-b border-sidebar-border bg-sidebar-accent/30">
          <p className="text-sm font-medium text-sidebar-foreground">
            {dossier.identite.nom} {dossier.identite.prenom}
          </p>
          <p className="text-xs text-sidebar-foreground/60">IPP: {dossier.identite.ipp}</p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={cn(
                "px-2 py-0.5 text-xs rounded-full",
                dossier.statut === "En cours"
                  ? "bg-success/20 text-success"
                  : dossier.statut === "Clôturé"
                    ? "bg-warning/20 text-warning"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {dossier.statut}
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = currentSection === section.id

            return (
              <li key={section.id}>
                <button
                  onClick={() => setCurrentSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                  title={collapsed ? section.label : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>{section.label}</span>}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <p className="text-xs text-sidebar-foreground/50 text-center">Traçabilité médico-légale activée</p>
        )}
      </div>
    </aside>
  )
}
