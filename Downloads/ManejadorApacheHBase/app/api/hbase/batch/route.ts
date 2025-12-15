import { NextResponse } from "next/server"
import { HBaseClient } from "@/lib/hbase-client"

// POST - Operación Batch (insertar múltiples usuarios)
export async function GET() {
  try {
    const client = HBaseClient.getInstance()

    // Datos de prueba para batch operation
    const batchUsers = [
      {
        rowKey: "batch_user001",
        columnFamily: {
          info: {
            name: "María García",
            age: "28",
            created_at: new Date().toISOString(),
          },
          contact: {
            email: "maria@example.com",
            phone: "+52-555-1234",
          },
        },
      },
      {
        rowKey: "batch_user002",
        columnFamily: {
          info: {
            name: "Carlos López",
            age: "35",
            created_at: new Date().toISOString(),
          },
          contact: {
            email: "carlos@example.com",
            phone: "+52-555-5678",
          },
        },
      },
      {
        rowKey: "batch_user003",
        columnFamily: {
          info: {
            name: "Ana Martínez",
            age: "42",
            created_at: new Date().toISOString(),
          },
          contact: {
            email: "ana@example.com",
            phone: "+52-555-9012",
          },
        },
      },
      {
        rowKey: "batch_user004",
        columnFamily: {
          info: {
            name: "Luis Rodríguez",
            age: "31",
            created_at: new Date().toISOString(),
          },
          contact: {
            email: "luis@example.com",
            phone: "+52-555-3456",
          },
        },
      },
      {
        rowKey: "batch_user005",
        columnFamily: {
          info: {
            name: "Carmen Fernández",
            age: "29",
            created_at: new Date().toISOString(),
          },
          contact: {
            email: "carmen@example.com",
            phone: "+52-555-7890",
          },
        },
      },
    ]

    // Batch Put operation
    const results = await client.batchPutUsers(batchUsers)

    return NextResponse.json({
      success: true,
      operation: "BATCH PUT",
      count: results.length,
      data: results,
      message: `${results.length} usuarios insertados exitosamente usando batch operation`,
      performance: "Batch operations son más eficientes que múltiples Puts individuales",
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
