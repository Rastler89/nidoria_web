"use client"

import { CrudGrid } from "@/components/admin/crud-grid"

export default function InvestigationsPage() {
  return (
    <CrudGrid
      title="Laboratorio de Investigaciones"
      endpoint="antmaster/api/investigations"
      icon="🔬"
      accentColor="purple"
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
