import { type NextRequest, NextResponse } from "next/server"
import { HBaseClient } from "@/lib/hbase-client"

// GET - Obtener todos los usuarios (Scan operation)
export async function GET() {
  try {
    const client = HBaseClient.getInstance()

    // Simular scan de tabla HBase
    // En producción, esto haría un scan real de la tabla
    const users = await client.scanUsers()

    return NextResponse.json({
      success: true,
      operation: "SCAN",
      count: users.length,
      data: users,
      message: "Usuarios obtenidos exitosamente usando Scan operation",
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

// POST - Crear nuevo usuario (Put operation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, email } = body

    if (!userId || !name || !email) {
      return NextResponse.json({ success: false, error: "userId, name y email son requeridos" }, { status: 400 })
    }

    const client = HBaseClient.getInstance()

    // Put operation en HBase con column families
    const result = await client.putUser({
      rowKey: userId,
      columnFamily: {
        info: {
          name,
          created_at: new Date().toISOString(),
        },
        contact: {
          email,
        },
      },
    })

    return NextResponse.json({
      success: true,
      operation: "PUT",
      data: result,
      message: `Usuario ${userId} creado exitosamente`,
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

// PUT - Actualizar usuario existente
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, email } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId es requerido" }, { status: 400 })
    }

    const client = HBaseClient.getInstance()

    // Verificar si el usuario existe
    const existingUser = await client.getUser(userId)
    if (!existingUser) {
      return NextResponse.json({ success: false, error: `Usuario ${userId} no encontrado` }, { status: 404 })
    }

    // Put operation para actualizar (HBase no tiene UPDATE separado)
    const result = await client.putUser({
      rowKey: userId,
      columnFamily: {
        info: {
          name: name || existingUser.name,
          updated_at: new Date().toISOString(),
        },
        contact: {
          email: email || existingUser.email,
        },
      },
    })

    return NextResponse.json({
      success: true,
      operation: "PUT (UPDATE)",
      data: result,
      message: `Usuario ${userId} actualizado exitosamente`,
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
