"use client"
import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/ui/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Mail, Send, Inbox, Archive, Trash2, Reply } from "lucide-react"

// Mock data
const mockEmails = [
  {
    id: 1,
    from: "Reina Madre",
    subject: "Bienvenido a la colonia",
    date: "Hace 2 días",
    preview: "Has sido elegido para liderar esta nueva expansión...",
    read: true,
    content: "Has sido elegido para liderar esta nueva expansión. Tu misión es asegurar la supervivencia de nuestra especie en este territorio hostil. Confío en tu liderazgo.",
  },
  {
    id: 2,
    from: "Explorador 77",
    subject: "Reporte de recursos",
    date: "Hace 5 horas",
    preview: "Hemos encontrado una fuente abundante de comida al norte...",
    read: false,
    content: "Hemos encontrado una fuente abundante de comida al norte. Se requieren refuerzos para asegurar la zona ante la presencia de termitas.",
  },
  {
    id: 3,
    from: "Sistema",
    subject: "Investigación Completada",
    date: "Hace 1 hora",
    preview: "La investigación 'Eficiencia de Recolección' ha finalizado.",
    read: false,
    content: "La investigación 'Eficiencia de Recolección' ha finalizado con éxito. Tus obreras ahora recolectan recursos un 15% más rápido.",
  },
]

export default function CorreosPage() {
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null)
  const [view, setView] = useState<"inbox" | "compose">("inbox")

  const currentEmail = mockEmails.find((e) => e.id === selectedEmail)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6 flex justify-between items-center">
             <div>
                <h1 className="text-4xl font-bold gradient-text mb-2 flex items-center gap-3">
                  <Mail className="h-8 w-8" /> Centro de Mensajes
                </h1>
                <p className="text-xl text-muted-foreground">
                  Comunicaciones internas y externas de la colonia
                </p>
             </div>
             <Button onClick={() => { setView("compose"); setSelectedEmail(null); }}>
                <Send className="mr-2 h-4 w-4" /> Redactar Mensaje
             </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
            {/* Sidebar / Lista de correos */}
            <Card className="md:col-span-1 game-panel flex flex-col h-full overflow-hidden">
               <div className="p-4 border-b border-border space-y-2">
                  <Button variant={view === 'inbox' ? "secondary" : "ghost"} className="w-full justify-start" onClick={() => setView('inbox')}>
                     <Inbox className="mr-2 h-4 w-4" /> Bandeja de Entrada
                     <Badge className="ml-auto" variant="secondary">2</Badge>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                     <Archive className="mr-2 h-4 w-4" /> Archivados
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                     <Trash2 className="mr-2 h-4 w-4" /> Papelera
                  </Button>
               </div>
               <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {view === 'inbox' && mockEmails.map((email) => (
                    <div
                      key={email.id}
                      onClick={() => { setSelectedEmail(email.id); setView("inbox"); }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors border ${selectedEmail === email.id ? "bg-primary/10 border-primary/30" : "bg-card hover:bg-accent/5 border-border"}`}
                    >
                       <div className="flex justify-between items-start mb-1">
                          <span className={`font-medium ${!email.read ? "text-primary" : "text-foreground"}`}>{email.from}</span>
                          <span className="text-xs text-muted-foreground">{email.date}</span>
                       </div>
                       <h4 className={`text-sm mb-1 ${!email.read ? "font-bold" : "font-normal"}`}>{email.subject}</h4>
                       <p className="text-xs text-muted-foreground line-clamp-2">{email.preview}</p>
                    </div>
                  ))}
               </div>
            </Card>

            {/* Contenido del correo o Componer */}
            <Card className="md:col-span-2 game-panel flex flex-col h-full overflow-hidden">
               {view === "compose" ? (
                  <div className="p-6 h-full flex flex-col space-y-4">
                     <h2 className="text-2xl font-bold mb-4">Nuevo Mensaje</h2>
                     <div className="space-y-4 flex-1">
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Para:</label>
                           <Input placeholder="Nombre de usuario o alianza..." />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium">Asunto:</label>
                           <Input placeholder="Asunto del mensaje..." />
                        </div>
                        <div className="space-y-2 h-full flex flex-col">
                           <label className="text-sm font-medium">Mensaje:</label>
                           <Textarea className="flex-1 resize-none" placeholder="Escribe tu mensaje aquí..." />
                        </div>
                     </div>
                     <div className="flex justify-end pt-4">
                        <Button variant="ghost" className="mr-2" onClick={() => setView("inbox")}>Cancelar</Button>
                        <Button onClick={() => { /* Lógica de envío */ setView("inbox"); }}>Enviar Mensaje</Button>
                     </div>
                  </div>
               ) : selectedEmail ? (
                  <div className="flex flex-col h-full">
                     <CardHeader className="border-b border-border bg-card/50">
                        <div className="flex justify-between items-start">
                           <div>
                              <CardTitle className="text-xl mb-1">{currentEmail?.subject}</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                 De: <span className="font-medium text-foreground">{currentEmail?.from}</span>
                                 <span className="text-muted-foreground">•</span>
                                 <span>{currentEmail?.date}</span>
                              </CardDescription>
                           </div>
                           <div className="flex gap-2">
                              <Button variant="outline" size="sm"><Reply className="h-4 w-4" /></Button>
                              <Button variant="outline" size="sm"><Archive className="h-4 w-4" /></Button>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                           </div>
                        </div>
                     </CardHeader>
                     <CardContent className="flex-1 p-6 overflow-y-auto">
                        <div className="prose dark:prose-invert max-w-none">
                           <p>{currentEmail?.content}</p>
                        </div>
                     </CardContent>
                     <div className="p-4 border-t border-border bg-card/30">
                        <Button className="w-full sm:w-auto" variant="secondary">
                           <Reply className="mr-2 h-4 w-4" /> Responder
                        </Button>
                     </div>
                  </div>
               ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                     <Mail className="h-16 w-16 mb-4 opacity-20" />
                     <h3 className="text-lg font-medium mb-2">No has seleccionado ningún mensaje</h3>
                     <p>Selecciona un correo de la lista para leerlo o redacta uno nuevo.</p>
                  </div>
               )}
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
