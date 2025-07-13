// Data Access Layer - Database Connection (unchanged)
import sql from "mssql"

const config = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "*#Phuc123",
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "ACCI10",
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
}

export async function createConnection(): Promise<sql.ConnectionPool> {
  const pool = new sql.ConnectionPool(config);
  await pool.connect();
  return pool;
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
