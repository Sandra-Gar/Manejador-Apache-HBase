/**
 * HBase Client - Simulación de cliente HBase para demostración
 *
 * En producción, este cliente se conectaría a un servidor HBase real usando:
 * - hbase-rpc-client (Node.js native client)
 * - REST API de HBase (Stargate)
 * - Thrift API
 *
 * Para este demo, simulamos las operaciones HBase en memoria
 */

interface ColumnFamily {
  [key: string]: {
    [column: string]: string
  }
}

interface HBaseRow {
  rowKey: string
  columnFamily: ColumnFamily
  timestamp?: number
}

interface UserData {
  userId: string
  name: string
  email: string
  age?: string
  phone?: string
  created_at?: string
  updated_at?: string
  timestamp?: number
}

export class HBaseClient {
  private static instance: HBaseClient
  private store: Map<string, HBaseRow[]> // Almacena múltiples versiones por row key

  private constructor() {
    this.store = new Map()
    console.log("[HBase Client] Initialized (Demo Mode)")
    console.log("[HBase Client] En producción, conectar a: hbase://localhost:9090")
  }

  public static getInstance(): HBaseClient {
    if (!HBaseClient.instance) {
      HBaseClient.instance = new HBaseClient()
    }
    return HBaseClient.instance
  }

  /**
   * PUT - Insertar o actualizar datos en HBase
   * Equivalente a: put 'users', 'rowKey', 'cf:column', 'value'
   */
  async putUser(row: HBaseRow): Promise<UserData> {
    const timestamp = Date.now()
    const rowWithTimestamp = { ...row, timestamp }

    // Obtener versiones existentes o crear array nuevo
    const existingVersions = this.store.get(row.rowKey) || []

    // Agregar nueva versión al principio
    existingVersions.unshift(rowWithTimestamp)

    // Mantener solo las últimas 5 versiones (MAX_VERSIONS)
    if (existingVersions.length > 5) {
      existingVersions.splice(5)
    }

    this.store.set(row.rowKey, existingVersions)

    console.log(`[HBase PUT] Row: ${row.rowKey}, Timestamp: ${timestamp}`)

    return this.formatUserData(rowWithTimestamp)
  }

  /**
   * GET - Obtener datos de una row específica
   * Equivalente a: get 'users', 'rowKey'
   * Por defecto retorna la versión más reciente
   */
  async getUser(rowKey: string): Promise<UserData | null> {
    const versions = this.store.get(rowKey)

    if (!versions || versions.length === 0) {
      console.log(`[HBase GET] Row: ${rowKey} - NOT FOUND`)
      return null
    }

    // Retornar la versión más reciente (índice 0)
    const latestVersion = versions[0]
    console.log(`[HBase GET] Row: ${rowKey}, Found: true`)

    return this.formatUserData(latestVersion)
  }

  /**
   * GET con versiones - Obtener múltiples versiones time-series
   * Equivalente a: get 'users', 'rowKey', {VERSIONS => 5}
   */
  async getUserVersions(rowKey: string): Promise<UserData[]> {
    const versions = this.store.get(rowKey)

    if (!versions || versions.length === 0) {
      return []
    }

    console.log(`[HBase GET VERSIONS] Row: ${rowKey}, Versions: ${versions.length}`)

    return versions.map((version) => this.formatUserData(version))
  }

  /**
   * SCAN - Escanear toda la tabla
   * Equivalente a: scan 'users'
   */
  async scanUsers(): Promise<UserData[]> {
    const allUsers: UserData[] = []

    // Iterar sobre todas las rows y obtener la versión más reciente de cada una
    for (const [rowKey, versions] of this.store.entries()) {
      if (versions.length > 0) {
        allUsers.push(this.formatUserData(versions[0]))
      }
    }

    console.log(`[HBase SCAN] Total rows: ${allUsers.length}`)

    return allUsers
  }

  /**
   * DELETE - Eliminar una row completa
   * Equivalente a: deleteall 'users', 'rowKey'
   */
  async deleteUser(rowKey: string): Promise<boolean> {
    const existed = this.store.has(rowKey)
    this.store.delete(rowKey)

    console.log(`[HBase DELETE] Row: ${rowKey}, Existed: ${existed}`)

    return existed
  }

  /**
   * BATCH PUT - Insertar múltiples rows en una operación
   * Mejora el rendimiento al reducir round-trips al servidor
   */
  async batchPutUsers(rows: HBaseRow[]): Promise<UserData[]> {
    console.log(`[HBase BATCH PUT] Starting batch insert of ${rows.length} rows`)

    const results: UserData[] = []

    for (const row of rows) {
      const result = await this.putUser(row)
      results.push(result)
    }

    console.log(`[HBase BATCH PUT] Completed: ${results.length} rows inserted`)

    return results
  }

  /**
   * Formatea los datos de HBase al formato de usuario
   */
  private formatUserData(row: HBaseRow): UserData {
    const info = row.columnFamily.info || {}
    const contact = row.columnFamily.contact || {}

    return {
      userId: row.rowKey,
      name: info.name || "",
      email: contact.email || "",
      age: info.age,
      phone: contact.phone,
      created_at: info.created_at,
      updated_at: info.updated_at,
      timestamp: row.timestamp,
    }
  }

  /**
   * Limpia todos los datos (útil para testing)
   */
  async clearAll(): Promise<void> {
    this.store.clear()
    console.log("[HBase] All data cleared")
  }
}
