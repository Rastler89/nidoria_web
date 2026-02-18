"use client"

import * as React from "react"
import { Eye, Moon, Sun, Monitor, Settings } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

const colorBlindnessModes = [
  { value: "none", label: "Ninguno" },
  { value: "protanopia", label: "Protanopia (Rojo-Verde)" },
  { value: "deuteranopia", label: "Deuteranopia (Verde-Rojo)" },
  { value: "tritanopia", label: "Tritanopia (Azul-Amarillo)" },
  { value: "achromatopsia", label: "Acromatopsia (Monocromo)" },
]

const applyColorBlindness = (mode: string) => {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  // Remove all previous modes
  colorBlindnessModes.forEach((m) => {
      if (m.value !== "none") root.classList.remove(m.value)
  })

  if (mode !== "none") {
    root.classList.add(mode)
  }
}

export function AccessibilityMenu() {
  const { setTheme, theme } = useTheme()
  const [colorBlindness, setColorBlindness] = React.useState("none")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("color-blindness-mode")
    if (saved) {
      setColorBlindness(saved)
      applyColorBlindness(saved)
    }
  }, [])

  const handleColorBlindnessChange = (mode: string) => {
    setColorBlindness(mode)
    localStorage.setItem("color-blindness-mode", mode)
    applyColorBlindness(mode)
  }

  if (!mounted) {
     return (
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Configuración de Accesibilidad</span>
        </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Configuración de Accesibilidad</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>Accesibilidad y Tema</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="mr-2 flex items-center justify-center w-4">
                {theme === 'dark' ? <Moon className="h-4 w-4" /> : theme === 'light' ? <Sun className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
            </div>
            <span>Tema ({theme === 'system' ? 'Sistema' : theme === 'dark' ? 'Oscuro' : 'Claro'})</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light">
                    <Sun className="mr-2 h-4 w-4" /> Claro
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                    <Moon className="mr-2 h-4 w-4" /> Oscuro
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                    <Monitor className="mr-2 h-4 w-4" /> Sistema
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Eye className="mr-2 h-4 w-4" />
            <span>Daltonismo</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={colorBlindness} onValueChange={handleColorBlindnessChange}>
                {colorBlindnessModes.map((mode) => (
                  <DropdownMenuRadioItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
