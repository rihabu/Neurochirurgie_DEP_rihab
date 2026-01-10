"use client"

import { usePatient } from "@/lib/patient-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, User, Phone, MapPin, Heart } from "lucide-react"
import type { PersonneContact, Sexe, Lateralite } from "@/lib/types/patient"
import { useState } from "react"
import { Input } from "@/components/ui/input"

export function IdentiteSection() {
  const { dossier, updateDossier } = usePatient()
  const [newAllergie, setNewAllergie] = useState("")

  if (!dossier) return null

  const { identite } = dossier

  const updateIdentite = (field: string, value: unknown) => {
    updateDossier({
      identite: {
        ...identite,
        [field]: value,
      },
    })
  }

  const updateAdresse = (field: string, value: string) => {
    updateDossier({
      identite: {
        ...identite,
        adresse: {
          ...identite.adresse,
          [field]: value,
        },
      },
    })
  }

  const addAllergie = () => {
    if (newAllergie.trim()) {
      updateIdentite("allergiesConnues", [...identite.allergiesConnues, newAllergie.trim()])
      setNewAllergie("")
    }
  }

  const removeAllergie = (index: number) => {
    updateIdentite(
      "allergiesConnues",
      identite.allergiesConnues.filter((_, i) => i !== index),
    )
  }

  const addContact = () => {
    const newContact: PersonneContact = {
      nom: "",
      prenom: "",
      lienParente: "",
      telephone: "",
      estPersonneConfiance: false,
    }
    updateIdentite("contacts", [...identite.contacts, newContact])
  }

  const updateContact = (index: number, field: string, value: unknown) => {
    const updatedContacts = [...identite.contacts]
    updatedContacts[index] = { ...updatedContacts[index], [field]: value }
    updateIdentite("contacts", updatedContacts)
  }

  const removeContact = (index: number) => {
    updateIdentite(
      "contacts",
      identite.contacts.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Identité Patient</h2>
        <p className="text-muted-foreground">Master Patient Index - Données administratives et médicales permanentes</p>
      </div>

      {/* Identité Civile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Identité Civile
          </CardTitle>
          <CardDescription>IPP: {identite.ipp}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Nom"
              name="nom"
              value={identite.nom}
              onChange={(v) => updateIdentite("nom", v)}
              required
              placeholder="NOM"
            />
            <FormField
              label="Nom de naissance"
              name="nomNaissance"
              value={identite.nomNaissance || ""}
              onChange={(v) => updateIdentite("nomNaissance", v)}
              placeholder="Si différent"
            />
            <FormField
              label="Prénom"
              name="prenom"
              value={identite.prenom}
              onChange={(v) => updateIdentite("prenom", v)}
              required
              placeholder="Prénom"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Date de naissance"
              name="dateNaissance"
              type="date"
              value={identite.dateNaissance}
              onChange={(v) => updateIdentite("dateNaissance", v)}
              required
            />
            <FormField
              label="Sexe"
              name="sexe"
              type="select"
              value={identite.sexe}
              onChange={(v) => updateIdentite("sexe", v as Sexe)}
              options={[
                { value: "M", label: "Masculin" },
                { value: "F", label: "Féminin" },
                { value: "Autre", label: "Autre" },
              ]}
              required
            />
            <FormField
              label="N° Sécurité Sociale"
              name="numeroSecuriteSociale"
              value={identite.numeroSecuriteSociale || ""}
              onChange={(v) => updateIdentite("numeroSecuriteSociale", v)}
              placeholder="1 XX XX XX XXX XXX XX"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Latéralité"
              name="lateralite"
              type="select"
              value={identite.lateralite}
              onChange={(v) => updateIdentite("lateralite", v as Lateralite)}
              options={[
                { value: "Droitier", label: "Droitier" },
                { value: "Gaucher", label: "Gaucher" },
                { value: "Ambidextre", label: "Ambidextre" },
                { value: "Non déterminé", label: "Non déterminé" },
              ]}
              required
              hint="Important pour la planification neurochirurgicale"
            />
            <FormField
              label="Groupe sanguin"
              name="groupeSanguin"
              type="select"
              value={identite.groupeSanguin || "non_renseigne"}
              onChange={(v) => updateIdentite("groupeSanguin", v)}
              options={[
                { value: "non_renseigne", label: "Non renseigné" },
                { value: "A+", label: "A+" },
                { value: "A-", label: "A-" },
                { value: "B+", label: "B+" },
                { value: "B-", label: "B-" },
                { value: "AB+", label: "AB+" },
                { value: "AB-", label: "AB-" },
                { value: "O+", label: "O+" },
                { value: "O-", label: "O-" },
              ]}
              placeholder="Sélectionner le groupe sanguin"
            />
          </div>
        </CardContent>
      </Card>

      {/* Coordonnées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Coordonnées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Adresse"
            name="rue"
            value={identite.adresse.rue}
            onChange={(v) => updateAdresse("rue", v)}
            placeholder="Numéro et nom de rue"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Code postal"
              name="codePostal"
              value={identite.adresse.codePostal}
              onChange={(v) => updateAdresse("codePostal", v)}
              placeholder="XXXXX"
            />
            <FormField
              label="Ville"
              name="ville"
              value={identite.adresse.ville}
              onChange={(v) => updateAdresse("ville", v)}
              placeholder="Ville"
            />
            <FormField
              label="Pays"
              name="pays"
              value={identite.adresse.pays}
              onChange={(v) => updateAdresse("pays", v)}
              placeholder="France"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="Téléphone"
              name="telephone"
              type="tel"
              value={identite.telephone}
              onChange={(v) => updateIdentite("telephone", v)}
              required
              placeholder="06 XX XX XX XX"
            />
            <FormField
              label="Téléphone secondaire"
              name="telephoneSecondaire"
              type="tel"
              value={identite.telephoneSecondaire || ""}
              onChange={(v) => updateIdentite("telephoneSecondaire", v)}
              placeholder="Optionnel"
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={identite.email || ""}
              onChange={(v) => updateIdentite("email", v)}
              placeholder="email@exemple.fr"
            />
          </div>
          <FormField
            label="Profession"
            name="profession"
            value={identite.profession || ""}
            onChange={(v) => updateIdentite("profession", v)}
            placeholder="Profession actuelle"
          />
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Allergies Connues
          </CardTitle>
          <CardDescription>Informations critiques pour la sécurité patient</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {identite.allergiesConnues.length === 0 ? (
              <span className="text-muted-foreground text-sm">Aucune allergie renseignée</span>
            ) : (
              identite.allergiesConnues.map((allergie, index) => (
                <Badge key={index} variant="destructive" className="flex items-center gap-1">
                  {allergie}
                  <button onClick={() => removeAllergie(index)} className="ml-1 hover:bg-destructive/80 rounded">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={newAllergie}
              onChange={(e) => setNewAllergie(e.target.value)}
              placeholder="Ajouter une allergie..."
              onKeyDown={(e) => e.key === "Enter" && addAllergie()}
            />
            <Button onClick={addAllergie} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Personnes à contacter
          </CardTitle>
          <CardDescription>Incluant la personne de confiance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {identite.contacts.map((contact, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-4 bg-muted/30">
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium">Contact {index + 1}</span>
                <Button variant="ghost" size="icon" onClick={() => removeContact(index)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Nom"
                  name={`contact-${index}-nom`}
                  value={contact.nom}
                  onChange={(v) => updateContact(index, "nom", v)}
                  required
                />
                <FormField
                  label="Prénom"
                  name={`contact-${index}-prenom`}
                  value={contact.prenom}
                  onChange={(v) => updateContact(index, "prenom", v)}
                  required
                />
                <FormField
                  label="Lien de parenté"
                  name={`contact-${index}-lien`}
                  value={contact.lienParente}
                  onChange={(v) => updateContact(index, "lienParente", v)}
                  placeholder="Ex: Conjoint, Parent..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Téléphone"
                  name={`contact-${index}-tel`}
                  type="tel"
                  value={contact.telephone}
                  onChange={(v) => updateContact(index, "telephone", v)}
                  required
                />
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id={`contact-${index}-confiance`}
                    checked={contact.estPersonneConfiance}
                    onChange={(e) => updateContact(index, "estPersonneConfiance", e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor={`contact-${index}-confiance`} className="text-sm">
                    Personne de confiance
                  </label>
                </div>
              </div>
            </div>
          ))}
          <Button onClick={addContact} variant="outline" className="w-full bg-transparent">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un contact
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
