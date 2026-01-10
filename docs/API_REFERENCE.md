# Référence API - DEP Neurochirurgie

## Endpoints REST (Recommandés)

### Dossiers

#### Liste des dossiers

\`\`\`http
GET /api/dossiers
\`\`\`

**Query parameters:**
| Paramètre | Type | Description |
|-----------|------|-------------|
| statut | string | Filtrer par statut |
| search | string | Recherche par nom/IPP |
| page | number | Numéro de page |
| limit | number | Éléments par page |

**Response:**
\`\`\`json
{
  "data": [
    {
      "id": "uuid",
      "identite": { "nom": "...", "prenom": "...", "ipp": "..." },
      "statut": "En cours",
      "dateCreation": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150
  }
}
\`\`\`

#### Créer un dossier

\`\`\`http
POST /api/dossiers
Content-Type: application/json

{
  "identite": { ... },
  "admission": { ... }
}
\`\`\`

**Response:** `201 Created`
\`\`\`json
{
  "id": "uuid",
  "dateCreation": "2024-01-15T10:30:00Z"
}
\`\`\`

#### Récupérer un dossier

\`\`\`http
GET /api/dossiers/:id
\`\`\`

**Response:** `200 OK`
\`\`\`json
{
  "id": "uuid",
  "statut": "En cours",
  "identite": { ... },
  "admission": { ... },
  "examensCore": [ ... ],
  ...
}
\`\`\`

#### Mettre à jour un dossier

\`\`\`http
PATCH /api/dossiers/:id
Content-Type: application/json

{
  "examensCore": [ ... ]
}
\`\`\`

**Response:** `200 OK`

#### Supprimer un dossier

\`\`\`http
DELETE /api/dossiers/:id
\`\`\`

**Response:** `204 No Content`

---

### Examens

#### Ajouter un examen CORE

\`\`\`http
POST /api/dossiers/:id/examens-core
Content-Type: application/json

{
  "dateHeure": "2024-01-15T10:30:00Z",
  "auteur": "Dr Martin",
  "contexte": "Urgence",
  "constantes": { ... },
  "gcs": { ... },
  ...
}
\`\`\`

#### Ajouter un examen EXTENDED

\`\`\`http
POST /api/dossiers/:id/examens-extended
Content-Type: application/json

{
  "dateHeure": "2024-01-15T10:30:00Z",
  "auteur": "Dr Martin",
  "fonctionsCognitives": { ... },
  "examenMoteurMRC": { ... },
  ...
}
\`\`\`

---

### Export

#### Export PDF

\`\`\`http
GET /api/dossiers/:id/export/pdf
\`\`\`

**Response:** `200 OK`
\`\`\`
Content-Type: application/pdf
Content-Disposition: attachment; filename="dossier-{ipp}.pdf"
\`\`\`

#### Export JSON

\`\`\`http
GET /api/dossiers/:id/export/json
\`\`\`

**Response:** `200 OK`
\`\`\`json
{
  // Dossier complet
}
\`\`\`

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Données invalides |
| 401 | Non authentifié |
| 403 | Accès non autorisé |
| 404 | Dossier non trouvé |
| 409 | Conflit (IPP dupliqué) |
| 422 | Entité non traitable |
| 500 | Erreur serveur |

---

## Webhooks (Optionnel)

### Events disponibles

| Event | Description |
|-------|-------------|
| dossier.created | Nouveau dossier créé |
| dossier.updated | Dossier modifié |
| dossier.closed | Dossier clôturé |
| examen.added | Nouvel examen ajouté |
| alert.triggered | Signe de gravité détecté |

### Payload exemple

\`\`\`json
{
  "event": "alert.triggered",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "dossierId": "uuid",
    "patientIPP": "123456",
    "alertType": "engagementCerebral",
    "severity": "critical"
  }
}
\`\`\`

---

*Document généré le 13/12/2025*
