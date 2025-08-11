// 🗄️ Setup do banco de dados para testes

import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import * as schema from '@shared/schema';

// URL do banco de teste (separado do desenvolvimento)
const TEST_DATABASE_URL = process.env.DATABASE_URL?.replace('/verticaliza_ai', '/verticaliza_ai_test') 
  || 'postgresql://test:test@localhost:5432/verticaliza_ai_test';

let testDb: ReturnType<typeof drizzle>;
let testPool: Pool;

export async function setupTestDatabase() {
  try {
    // Conectar ao banco de teste
    testPool = new Pool({ connectionString: TEST_DATABASE_URL });
    testDb = drizzle({ client: testPool, schema });

    // Executar migrações de teste (simplificadas)
    await testDb.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    await testDb.execute(sql`
      CREATE TABLE IF NOT EXISTS editals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        file_name VARCHAR(255) NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        file_size INTEGER NOT NULL,
        raw_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `);

    await testDb.execute(sql`
      CREATE TABLE IF NOT EXISTS verticalized_contents (
        id SERIAL PRIMARY KEY,
        edital_id INTEGER UNIQUE NOT NULL,
        structured_json JSONB NOT NULL,
        csv_export TEXT,
        processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        accuracy_score REAL
      );
    `);

    console.log('✅ Banco de dados de teste configurado');
  } catch (error) {
    console.error('❌ Erro ao configurar banco de teste:', error);
    throw error;
  }
}

export async function cleanupTestDatabase() {
  try {
    if (testDb) {
      // Limpar todas as tabelas
      await testDb.execute(sql`TRUNCATE TABLE verticalized_contents CASCADE`);
      await testDb.execute(sql`TRUNCATE TABLE editals CASCADE`);
      await testDb.execute(sql`TRUNCATE TABLE users CASCADE`);
    }

    if (testPool) {
      await testPool.end();
    }

    console.log('✅ Banco de dados de teste limpo');
  } catch (error) {
    console.error('❌ Erro ao limpar banco de teste:', error);
  }
}

export async function clearTestTables() {
  if (!testDb) return;
  
  try {
    await testDb.execute(sql`TRUNCATE TABLE verticalized_contents CASCADE`);
    await testDb.execute(sql`TRUNCATE TABLE editals CASCADE`);
    await testDb.execute(sql`TRUNCATE TABLE users CASCADE`);
  } catch (error) {
    console.error('Erro ao limpar tabelas de teste:', error);
  }
}

export { testDb };