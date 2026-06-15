"use client"

import { CrudGrid } from "@/components/admin/crud-grid"

export default function AntsPage() {
  return (
    <CrudGrid
      title="Casta de Hormigas"
      endpoint="antmaster/api/ants"
      icon="🐛"
      accentColor="red"
      columns={[
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "attack", label: "Ataque" },
        { key: "defense", label: "Defensa" },
      ]}
      formFields={[
        { key: "name", label: "Nombre" },
        { key: "description", label: "Descripción" },
        { key: "attack", label: "Ataque", type: "number" },
        { key: "defense", label: "Defensa", type: "number" },
      ]}
    />
  )
}
