import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Todo } from '../todo/todo.entity';

// Load environment variables
config();

async function initializeDatabase() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgrespassword',
    database: process.env.DB_DATABASE || 'todo-app',
    entities: [Todo],
    synchronize: true,
    logging: true,
  });

  try {
    // Try to connect with retries
    let retries = 5;
    while (retries > 0) {
      try {
        await dataSource.initialize();
        console.log('Connected to PostgreSQL');
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        console.log(`Failed to connect to PostgreSQL. Retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
      }
    }

    // Create the table manually if it doesn't exist
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    // Check if the table exists
    const tableExists = await queryRunner.hasTable('todos');
    console.log('Table exists:', tableExists);

    if (!tableExists) {
      console.log('Creating todos table...');
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS todos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR NOT NULL,
          description VARCHAR,
          completed BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now()
        );
      `);
      console.log('Todos table created successfully');
    }

    // Clear existing data
    await dataSource.getRepository(Todo).clear();
    console.log('Cleared existing todos');

    // Insert sample data
    const sampleTodos = [
      {
        title: 'Complete Project Setup',
        description: 'Set up the development environment and install necessary dependencies',
        completed: false,
        createdAt: new Date()
      },
      {
        title: 'Implement Todo Features',
        description: 'Add CRUD operations and implement the todo list functionality',
        completed: false,
        createdAt: new Date()
      },
      {
        title: 'Add Description Field',
        description: 'Update the database schema and UI to support todo descriptions',
        completed: true,
        createdAt: new Date()
      },
      {
        title: 'Style the Application',
        description: 'Apply Tailwind CSS and shadcn/ui components for a better user experience',
        completed: false,
        createdAt: new Date()
      }
    ];

    await dataSource.getRepository(Todo).save(sampleTodos);
    console.log('Inserted sample todos');

    // Verify the data
    const todos = await dataSource.getRepository(Todo).find();
    console.log('Current todos in database:', todos);

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    await dataSource.destroy();
    console.log('Disconnected from PostgreSQL');
  }
}

// Run the initialization
initializeDatabase().catch(console.error); 