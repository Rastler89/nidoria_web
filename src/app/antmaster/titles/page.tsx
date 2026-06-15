"use client"

import { CrudGrid } from "@/components/admin/crud-grid"

export default function TitlesPage() {
  return (
    <CrudGrid
      title="Gestión de Títulos"
      endpoint="antmaster/api/titles"
      icon="🏅"
      accentColor="amber"
      columns={[
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
      ]}
      formFields={[
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
      ]}
    />
  )
}
