# Todo App with Next.js, NestJS, PostgreSQL, and Hasura

A full-stack todo application built with Next.js 14, NestJS, PostgreSQL, Hasura, and Tailwind CSS.

## Features

- Create, read, update, and delete todos
- Add descriptions to todos
- Mark todos as complete/incomplete
- Responsive design with Tailwind CSS
- Modern UI components with shadcn/ui
- GraphQL API with Hasura
- Google OAuth authentication
- Docker support for easy deployment

## Prerequisites

- Node.js 20 or later
- Docker and Docker Compose
- PostgreSQL (if running locally)
- Hasura CLI (optional, for local development)
- Google Cloud Platform account (for OAuth)

## Installation

### Option 1: Docker Setup (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Set up environment variables:

Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_HASURA_ENDPOINT=http://localhost:8080/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=myadminsecretkey

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret # Generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

3. Start the application using Docker Compose:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Hasura Console: http://localhost:8080
- PostgreSQL: localhost:5432

To stop the application:
```bash
docker-compose down
```

To stop and remove all data (including PostgreSQL volume):
```bash
docker-compose down -v
```

### Option 2: Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-name>
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up environment variables:

Backend (.env):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/todo-app
HASURA_GRAPHQL_ENDPOINT=http://localhost:8080/v1/graphql
HASURA_GRAPHQL_ADMIN_SECRET=myadminsecretkey
```

Frontend (.env.local):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_HASURA_ENDPOINT=http://localhost:8080/v1/graphql
NEXT_PUBLIC_HASURA_ADMIN_SECRET=myadminsecretkey

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret # Generate with: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

5. Start PostgreSQL:
```bash
docker-compose up postgres -d
```

6. Start Hasura:
```bash
docker-compose up hasura -d
```

7. Initialize the database and Hasura:
```bash
cd backend
npm run init-db
npm run init-hasura
```

8. Start the backend server:
```bash
npm run start:dev
```

9. Start the frontend development server:
```bash
cd ../frontend
npm run dev
```

## Application Flow

1. **Authentication and Routing:**
   - Root path ("/") automatically redirects to "/home"
   - Unauthenticated users are redirected to "/login"
   - After successful Google login, users are redirected to "/home"
   - Protected routes require authentication

2. **Main Application:**
   - The main todo application is at "/home"
   - Users can manage their todos here
   - All todo operations require authentication

## Hasura Setup

### 1. Access Hasura Console
- Open http://localhost:8080 in your browser
- Log in with the admin secret (default: `myadminsecretkey`)

### 2. Database Setup
The initialization scripts will:
- Create the `todo` table
- Set up necessary columns and relationships
- Track the table in Hasura
- Configure permissions

### 3. Authentication Setup

#### JWT Configuration
1. Go to Hasura Console > Settings > Auth
2. Add a new JWT secret:
```json
{
  "type": "HS256",
  "key": "your-jwt-secret"
}
```

#### Claims Mapping
Configure the claims mapping in Hasura Console:
```json
{
  "sub": "https://www.googleapis.com/userinfo/v2/me",
  "email": "https://www.googleapis.com/userinfo/v2/me",
  "name": "https://www.googleapis.com/userinfo/v2/me"
}
```

#### Permissions
1. Go to Data > todo > Permissions
2. Configure permissions for different roles:
   - `user`: Can perform CRUD operations on their own todos
   - `admin`: Can perform CRUD operations on all todos

### 4. GraphQL API
Hasura automatically generates a GraphQL API with:
- Queries for fetching todos
- Mutations for creating, updating, and deleting todos
- Real-time subscriptions
- Role-based access control

## Development

### Database Initialization

The project includes scripts to initialize the database and Hasura:

```bash
# Initialize database
npm run init-db

# Initialize Hasura
npm run init-hasura
```

### API Endpoints

#### REST API (NestJS)
- `GET /api/v1/todos` - Get all todos
- `GET /api/v1/todos/:id` - Get a specific todo
- `POST /api/v1/todos` - Create a new todo
- `PUT /api/v1/todos/:id` - Update a todo
- `DELETE /api/v1/todos/:id` - Delete a todo

#### GraphQL API (Hasura)
- Query todos
- Create todo
- Update todo
- Delete todo

## Project Structure

```
.
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── todo/           # Todo module
│   │   ├── scripts/        # Database and Hasura scripts
│   │   └── main.ts         # Application entry
│   └── Dockerfile
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   │   ├── home/      # Main todo application
│   │   │   └── login/     # Login page
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   └── lib/          # Utility functions
│   └── Dockerfile
├── docker-compose.yml     # Docker configuration
└── README.md
```

## Troubleshooting

### Common Issues

1. **Port 3000 already in use:**
   ```bash
   # Find the process using port 3000
   lsof -i :3000
   # Kill the process
   kill <PID>
   ```

2. **Hasura not tracking tables:**
   - Check Hasura Console at http://localhost:8080
   - Run the Hasura initialization script:
     ```bash
     docker exec -it todo-backend npm run init-hasura
     ```

3. **Database connection issues:**
   - Ensure PostgreSQL is running:
     ```bash
     docker ps | grep postgres
     ```
   - Check database logs:
     ```bash
     docker logs todo-postgres
     ```

4. **Authentication issues:**
   - Verify Google OAuth credentials
   - Check JWT configuration in Hasura
   - Ensure environment variables are set correctly
   - Check browser console for redirect errors

