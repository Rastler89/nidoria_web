"use client"

import { CrudGrid } from "@/components/admin/crud-grid"

export default function ResourcesPage() {
  return (
    <CrudGrid
      title="Recursos Naturales"
      endpoint="antmaster/api/resources"
      icon="📦"
      accentColor="green"
      columns={[
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "baseProduction", label: "Producción Base" },
      ]}
      formFields={[
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "baseProduction", label: "Producción Base", type: "number" },
      ]}
    />
  )
}
