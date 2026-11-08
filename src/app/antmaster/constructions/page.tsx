"use client"

import { CrudGrid } from "@/components/admin/crud-grid"

export default function ConstructionsPage() {
  return (
    <CrudGrid
      title="Catálogo de Edificaciones"
      endpoint="antmaster/api/constructions"
      icon="🔨"
      accentColor="amber"
      columns={[
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "level", label: "Nivel" },
        { key: "cost", label: "Costo", render: (v) => v ? JSON.stringify(v) : "—" },
      ]}
      formFields={[
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "level", label: "Nivel", type: "number" },
        { key: "cost", label: "Costo (JSON)" },
      ]}
    />
  )
}
