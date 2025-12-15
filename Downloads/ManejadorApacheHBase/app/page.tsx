"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Plus, Search, Edit, Trash2, Clock, Layers } from "lucide-react"

export default function HBaseDemoPage() {
  const [userId, setUserId] = useState("")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [searchId, setSearchId] = useState("")
  const [updateId, setUpdateId] = useState("")
  const [deleteId, setDeleteId] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    setLoading(true)
    setResult("")
    try {
      const response = await fetch("/api/hbase/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: userName,
          email: userEmail,
        }),
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    }
    setLoading(false)
  }

  const handleRead = async () => {
    setLoading(true)
    setResult("")
    try {
      const response = await fetch(`/api/hbase/users/${searchId}`)
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    }
    setLoading(false)
  }

  const handleReadAll = async () => {
    setLoading(true)
    setResult("")
    try {
      const response = await fetch("/api/hbase/users")
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    }
    setLoading(false)
  }

  const handleUpdate = async () => {
    setLoading(true)
    setResult("")
    try {
      const response = await fetch("/api/hbase/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: updateId,
          name: userName,
          email: userEmail,
        }),
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    setLoading(true)
    setResult("")
    try {
      const response = await fetch(`/api/hbase/users/${deleteId}`, {
        method: "DELETE",
      })
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    }
    setLoading(false)
  }

  const handleBatchOperations = async () => {
    setLoading(true)
    setResult("")
    try {
      const response = await fetch("/api/hbase/batch")
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    }
    setLoading(false)
  }

  const handleTimeSeries = async () => {
    setLoading(true)
    setResult("")
    try {
      const response = await fetch("/api/hbase/timeseries")
      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error}`)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Database className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold">Apache HBase Demo</h1>
            <p className="text-muted-foreground">Demostración práctica con operaciones CRUD y funciones avanzadas</p>
          </div>
        </div>

        <Tabs defaultValue="create" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="create">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </TabsTrigger>
            <TabsTrigger value="read">
              <Search className="w-4 h-4 mr-2" />
              Read
            </TabsTrigger>
            <TabsTrigger value="update">
              <Edit className="w-4 h-4 mr-2" />
              Update
            </TabsTrigger>
            <TabsTrigger value="delete">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </TabsTrigger>
            <TabsTrigger value="batch">
              <Layers className="w-4 h-4 mr-2" />
              Batch
            </TabsTrigger>
            <TabsTrigger value="timeseries">
              <Clock className="w-4 h-4 mr-2" />
              Time Series
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>CREATE - Insertar Datos</CardTitle>
                <CardDescription>Inserta un nuevo usuario en la tabla HBase con column families</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userId">User ID (Row Key)</Label>
                    <Input
                      id="userId"
                      placeholder="user001"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userName">Nombre</Label>
                    <Input
                      id="userName"
                      placeholder="Juan Pérez"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      placeholder="juan@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreate} disabled={loading}>
                    {loading ? "Insertando..." : "Insertar Usuario"}
                  </Button>
                </div>
                {result && (
                  <div className="mt-4">
                    <Label>Resultado:</Label>
                    <pre className="bg-muted p-4 rounded-lg mt-2 overflow-auto text-sm">{result}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="read">
            <Card>
              <CardHeader>
                <CardTitle>READ - Consultar Datos</CardTitle>
                <CardDescription>Consulta un usuario específico o todos los usuarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="searchId">User ID (opcional)</Label>
                    <Input
                      id="searchId"
                      placeholder="user001"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleRead} disabled={loading || !searchId}>
                      {loading ? "Consultando..." : "Buscar Usuario"}
                    </Button>
                    <Button onClick={handleReadAll} disabled={loading} variant="outline">
                      {loading ? "Consultando..." : "Listar Todos"}
                    </Button>
                  </div>
                </div>
                {result && (
                  <div className="mt-4">
                    <Label>Resultado:</Label>
                    <pre className="bg-muted p-4 rounded-lg mt-2 overflow-auto text-sm max-h-96">{result}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="update">
            <Card>
              <CardHeader>
                <CardTitle>UPDATE - Actualizar Datos</CardTitle>
                <CardDescription>Actualiza la información de un usuario existente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="updateId">User ID</Label>
                    <Input
                      id="updateId"
                      placeholder="user001"
                      value={updateId}
                      onChange={(e) => setUpdateId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="updateName">Nuevo Nombre</Label>
                    <Input
                      id="updateName"
                      placeholder="Juan Carlos Pérez"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="updateEmail">Nuevo Email</Label>
                    <Input
                      id="updateEmail"
                      type="email"
                      placeholder="juancarlos@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleUpdate} disabled={loading}>
                    {loading ? "Actualizando..." : "Actualizar Usuario"}
                  </Button>
                </div>
                {result && (
                  <div className="mt-4">
                    <Label>Resultado:</Label>
                    <pre className="bg-muted p-4 rounded-lg mt-2 overflow-auto text-sm">{result}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delete">
            <Card>
              <CardHeader>
                <CardTitle>DELETE - Eliminar Datos</CardTitle>
                <CardDescription>Elimina un usuario de la base de datos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deleteId">User ID</Label>
                    <Input
                      id="deleteId"
                      placeholder="user001"
                      value={deleteId}
                      onChange={(e) => setDeleteId(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleDelete} disabled={loading} variant="destructive">
                    {loading ? "Eliminando..." : "Eliminar Usuario"}
                  </Button>
                </div>
                {result && (
                  <div className="mt-4">
                    <Label>Resultado:</Label>
                    <pre className="bg-muted p-4 rounded-lg mt-2 overflow-auto text-sm">{result}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="batch">
            <Card>
              <CardHeader>
                <CardTitle>Operación Avanzada: Batch Operations</CardTitle>
                <CardDescription>Inserta múltiples registros en una sola operación batch</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm mb-2">
                    Esta operación insertará 5 usuarios de prueba utilizando batch operations para mejorar el
                    rendimiento.
                  </p>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    <li>Usa column families (info, contact)</li>
                    <li>Optimiza múltiples escrituras</li>
                    <li>Mantiene consistencia ACID</li>
                  </ul>
                </div>
                <Button onClick={handleBatchOperations} disabled={loading}>
                  {loading ? "Ejecutando..." : "Ejecutar Batch Operations"}
                </Button>
                {result && (
                  <div className="mt-4">
                    <Label>Resultado:</Label>
                    <pre className="bg-muted p-4 rounded-lg mt-2 overflow-auto text-sm max-h-96">{result}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeseries">
            <Card>
              <CardHeader>
                <CardTitle>Operación Avanzada: Time-Series Data</CardTitle>
                <CardDescription>Consulta datos con versiones de tiempo (time-series)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm mb-2">HBase almacena múltiples versiones de cada celda con timestamps.</p>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    <li>Consulta versiones históricas de datos</li>
                    <li>Útil para auditoría y análisis temporal</li>
                    <li>Configuración de MAX_VERSIONS en column families</li>
                  </ul>
                </div>
                <Button onClick={handleTimeSeries} disabled={loading}>
                  {loading ? "Consultando..." : "Ver Time-Series Data"}
                </Button>
                {result && (
                  <div className="mt-4">
                    <Label>Resultado:</Label>
                    <pre className="bg-muted p-4 rounded-lg mt-2 overflow-auto text-sm max-h-96">{result}</pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
            <CardDescription>Detalles técnicos de la implementación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Column Families:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    <strong>info:</strong> name, age, created_at
                  </li>
                  <li>
                    <strong>contact:</strong> email, phone
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Operaciones Implementadas:</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>CREATE: Put operation</li>
                  <li>READ: Get y Scan operations</li>
                  <li>UPDATE: Put con row key existente</li>
                  <li>DELETE: Delete operation</li>
                  <li>Batch: Multiple Puts</li>
                  <li>Time-Series: Multi-version queries</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
