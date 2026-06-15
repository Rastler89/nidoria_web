"use client"

import { CrudGrid } from "@/components/admin/crud-grid"

export default function RequirementsPage() {
  return (
    <CrudGrid
      title="Árbol de Requerimientos"
      endpoint="antmaster/api/requirements"
      icon="📋"
      accentColor="blue"
      columns={[
        { key: "id", label: "ID" },
        { key: "description", label: "Descripción" },
      ]}
      formFields={[
        { key: "description", label: "Descripción" },
      ]}
    />
  )
}
