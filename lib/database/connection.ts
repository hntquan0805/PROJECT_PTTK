// Data Access Layer - Database Connection (unchanged)
import sql from "mssql"

const config = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "password",
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "BillManagement",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}

export class DatabaseConnection {
  private static instance: DatabaseConnection
  private pool: sql.ConnectionPool | null = null

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection()
    }
    return DatabaseConnection.instance
  }

  public async connect(): Promise<sql.ConnectionPool> {
    if (!this.pool) {
      this.pool = new sql.ConnectionPool(config)
      await this.pool.connect()
    }
    return this.pool
  }

  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.close()
      this.pool = null
    }
  }

  public async executeQuery(query: string, params?: any[]): Promise<sql.IResult<any>> {
    const pool = await this.connect()
    const request = pool.request()

    if (params) {
      params.forEach((param, index) => {
        request.input(`param${index}`, param)
      })
    }

    return await request.query(query)
  }
}
