import { NextResponse } from "next/server"
import { HBaseClient } from "@/lib/hbase-client"

// GET - Consulta de datos time-series con versiones
export async function GET() {
  try {
    const client = HBaseClient.getInstance()

    // Crear un usuario de prueba con múltiples versiones
    const testUserId = "timeseries_user001"

    // Insertar datos con diferentes timestamps (simulando cambios en el tiempo)
    await client.putUser({
      rowKey: testUserId,
      columnFamily: {
        info: {
          name: "Usuario TimeTest V1",
          created_at: new Date(Date.now() - 3000).toISOString(),
        },
        contact: {
          email: "test1@example.com",
        },
      },
    })

    // Simular un delay para crear versiones con diferentes timestamps
    await new Promise((resolve) => setTimeout(resolve, 100))

    await client.putUser({
      rowKey: testUserId,
      columnFamily: {
        info: {
          name: "Usuario TimeTest V2",
          updated_at: new Date(Date.now() - 2000).toISOString(),
        },
        contact: {
          email: "test2@example.com",
        },
      },
    })

    await new Promise((resolve) => setTimeout(resolve, 100))

    await client.putUser({
      rowKey: testUserId,
      columnFamily: {
        info: {
          name: "Usuario TimeTest V3 (Actual)",
          updated_at: new Date().toISOString(),
        },
        contact: {
          email: "test3@example.com",
        },
      },
    })

    // Obtener todas las versiones (requiere configurar MAX_VERSIONS en HBase)
    const versions = await client.getUserVersions(testUserId)

    return NextResponse.json({
      success: true,
      operation: "TIME-SERIES QUERY",
      userId: testUserId,
      totalVersions: versions.length,
      data: versions,
      message: "HBase almacena múltiples versiones de cada celda con timestamps",
      note: "En producción, configurar MAX_VERSIONS en la definición de column family",
      hbaseConfig: {
        "column-family": "info",
        MAX_VERSIONS: "5",
        description: "Permite mantener hasta 5 versiones históricas de cada valor",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
