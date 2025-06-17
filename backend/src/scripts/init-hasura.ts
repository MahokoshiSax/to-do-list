import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const HASURA_ENDPOINT = process.env.HASURA_ENDPOINT || 'http://hasura:8080';
const HASURA_ADMIN_SECRET = process.env.HASURA_ADMIN_SECRET || 'myadminsecretkey';

async function waitForHasura(retries = 5, delay = 5000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(`${HASURA_ENDPOINT}/healthz`);
      if (response.status === 200) {
        console.log('Hasura is ready');
        return;
      }
    } catch (error) {
      console.log(`Waiting for Hasura to be ready... (attempt ${i + 1}/${retries})`);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

async function verifyTableExists(): Promise<boolean> {
  try {
    const response = await axios.post(
      `${HASURA_ENDPOINT}/v1/metadata`,
      {
        type: 'get_catalog_state',
        args: {}
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': HASURA_ADMIN_SECRET
        }
      }
    );
    console.log('Catalog state:', response.data);
    return true;
  } catch (error) {
    console.error('Failed to verify table:', error);
    return false;
  }
}

async function initializeHasura() {
  try {
    await waitForHasura();
    await verifyTableExists();

    // Drop existing metadata
    console.log('Dropping existing metadata...');
    await axios.post(
      `${HASURA_ENDPOINT}/v1/metadata`,
      {
        type: 'drop_inconsistent_metadata',
        args: {}
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': HASURA_ADMIN_SECRET
        }
      }
    );
    console.log('Existing metadata dropped successfully');

    // Untrack todos table if it exists
    console.log('Untracking todos table if it exists...');
    try {
      await axios.post(
        `${HASURA_ENDPOINT}/v1/metadata`,
        {
          type: 'untrack_table',
          args: {
            table: {
              schema: 'public',
              name: 'todos'
            }
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': HASURA_ADMIN_SECRET
          }
        }
      );
    } catch (error) {
      console.log('No todos table to untrack');
    }

    // Track todos table
    console.log('Tracking todos table...');
    await axios.post(
      `${HASURA_ENDPOINT}/v1/metadata`,
      {
        type: 'track_table',
        args: {
          table: {
            schema: 'public',
            name: 'todo'
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': HASURA_ADMIN_SECRET
        }
      }
    );
    console.log('Todos table tracked successfully');

    // Set up permissions
    const permissions = [
      {
        type: 'create_select_permission',
        args: {
          table: {
            schema: 'public',
            name: 'todo'
          },
          role: 'public',
          permission: {
            columns: ['id', 'title', 'description', 'completed', 'createdAt'],
            filter: {},
            allow_aggregations: true
          }
        }
      },
      {
        type: 'create_insert_permission',
        args: {
          table: {
            schema: 'public',
            name: 'todo'
          },
          role: 'public',
          permission: {
            columns: ['title', 'description', 'completed'],
            check: {},
            set: {}
          }
        }
      },
      {
        type: 'create_update_permission',
        args: {
          table: {
            schema: 'public',
            name: 'todo'
          },
          role: 'public',
          permission: {
            columns: ['title', 'description', 'completed'],
            filter: {},
            set: {}
          }
        }
      },
      {
        type: 'create_delete_permission',
        args: {
          table: {
            schema: 'public',
            name: 'todo'
          },
          role: 'public',
          permission: {
            filter: {}
          }
        }
      }
    ];

    for (const permission of permissions) {
      console.log(`Setting up ${permission.type}...`);
      await axios.post(
        `${HASURA_ENDPOINT}/v1/metadata`,
        permission,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-hasura-admin-secret': HASURA_ADMIN_SECRET
          }
        }
      );
    }

    // Reload metadata
    console.log('Reloading metadata...');
    await axios.post(
      `${HASURA_ENDPOINT}/v1/metadata`,
      {
        type: 'reload_metadata',
        args: {}
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': HASURA_ADMIN_SECRET
        }
      }
    );

    // Verify schema
    console.log('Verifying schema...');
    const schemaResponse = await axios.post(
      `${HASURA_ENDPOINT}/v1/graphql`,
      {
        query: `
          query {
            __schema {
              types {
                name
                kind
                fields {
                  name
                  type {
                    name
                    kind
                  }
                }
              }
            }
          }
        `
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': HASURA_ADMIN_SECRET
        }
      }
    );

    console.log('Schema verification response:', schemaResponse.data);
    console.log('Hasura initialization completed successfully');
  } catch (error) {
    console.error('Failed to initialize Hasura metadata:', error);
    throw error;
  }
}

initializeHasura().catch(console.error); 