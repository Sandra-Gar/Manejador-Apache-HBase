import { type NextRequest, NextResponse } from "next/server"
import { HBaseClient } from "@/lib/hbase-client"

// GET - Obtener usuario específico (Get operation)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = HBaseClient.getInstance()

    // Get operation en HBase usando row key
    const user = await client.getUser(id)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: `Usuario ${id} no encontrado`,
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      operation: "GET",
      data: user,
      message: `Usuario ${id} obtenido exitosamente`,
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

// DELETE - Eliminar usuario (Delete operation)
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const client = HBaseClient.getInstance()

    // Verificar si el usuario existe
    const existingUser = await client.getUser(id)
    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: `Usuario ${id} no encontrado`,
        },
        { status: 404 },
      )
    }

    // Delete operation en HBase
    await client.deleteUser(id)

    return NextResponse.json({
      success: true,
      operation: "DELETE",
      message: `Usuario ${id} eliminado exitosamente`,
      deletedUser: existingUser,
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
