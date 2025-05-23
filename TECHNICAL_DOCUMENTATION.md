# Threads Backend - Technical Documentation

## Project Overview

Threads Backend is a GraphQL-based API server built with TypeScript, Express, Apollo Server, and Prisma ORM. It serves as the backend for a social media application similar to "Threads" where users can create accounts, post content, and interact with other users.

## Technology Stack

### Core Technologies
- **TypeScript**: Strongly-typed programming language that builds on JavaScript
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for Node.js
- **Apollo Server**: GraphQL server that works with any GraphQL schema
- **Prisma ORM**: Next-generation ORM for Node.js and TypeScript
- **PostgreSQL**: Relational database management system
- **Docker**: Containerization platform

### Development Dependencies
- **TypeScript**: ^5.8.3
- **tsc-watch**: ^6.2.1
- **tsx**: ^4.19.4
- **Prisma CLI**: ^6.7.0
- **@types/node**: ^22.15.17

### Runtime Dependencies
- **Express**: ^4.18.2
- **@apollo/server**: ^4.12.0
- **GraphQL**: ^16.11.0
- **@prisma/client**: ^5.22.0

## Architecture Overview

The Threads Backend follows a modern GraphQL API architecture with the following components:

1. **API Layer**: Apollo Server with Express middleware
2. **Data Access Layer**: Prisma ORM for database operations
3. **Database**: PostgreSQL database
4. **Authentication & Authorization**: (Planned implementation)
5. **Type Definitions & Resolvers**: GraphQL schema and resolvers

## Directory Structure

```
threads-backend/
├── src/                      # Source code
│   ├── index.ts              # Main application entry point
│   └── lib/                  # Library code
│       └── db.ts             # Database connection
├── prisma/                   # Prisma ORM configuration
│   ├── schema.prisma         # Database schema definition
│   └── migrations/           # Database migrations
├── generated/                # Generated Prisma client
├── build/                    # Compiled JavaScript output
├── docker-compose.yml        # Docker configuration
├── package.json              # Project dependencies
└── tsconfig.json             # TypeScript configuration
```

## Data Models

### Current Models

#### User Model
```prisma
model User {
  id String @id @default(uuid())
  firstName String @map("first_name")
  lastName String @map("last_name")
  profileImageURL String? @map("profile_image_url")
  email String @unique
  password String 
  salt String

  @@map("users")
}
```

### Proposed Additional Models

#### Thread (Post) Model
```prisma
model Thread {
  id String @id @default(uuid())
  content String
  authorId String
  author User @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  likes Int @default(0)
  comments Comment[]
  
  @@map("threads")
}
```

#### Comment Model
```prisma
model Comment {
  id String @id @default(uuid())
  content String
  authorId String
  author User @relation(fields: [authorId], references: [id])
  threadId String
  thread Thread @relation(fields: [threadId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  
  @@map("comments")
}
```

## GraphQL API

### Current Schema
```graphql
type Query {
  hello: String
}

type Mutation {
  createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
}
```

### Proposed Extended Schema
```graphql
type User {
  id: ID!
  firstName: String!
  lastName: String!
  fullName: String!
  email: String!
  profileImageURL: String
  threads: [Thread!]!
}

type Thread {
  id: ID!
  content: String!
  author: User!
  createdAt: String!
  updatedAt: String!
  likes: Int!
  comments: [Comment!]!
}

type Comment {
  id: ID!
  content: String!
  author: User!
  thread: Thread!
  createdAt: String!
}

type AuthPayload {
  token: String!
  user: User!
}

type Query {
  hello: String
  me: User
  user(id: ID!): User
  users: [User!]!
  thread(id: ID!): Thread
  threads: [Thread!]!
  threadsByUser(userId: ID!): [Thread!]!
}

type Mutation {
  createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
  login(email: String!, password: String!): AuthPayload!
  createThread(content: String!): Thread!
  updateThread(id: ID!, content: String!): Thread!
  deleteThread(id: ID!): Boolean!
  likeThread(id: ID!): Thread!
  createComment(threadId: ID!, content: String!): Comment!
}
```

## Authentication Flow

1. **User Registration**:
   - Client sends mutation `createUser` with required fields
   - Server hashes password with the salt
   - Server creates a new user record
   - Returns success/failure

2. **User Login**:
   - Client sends mutation `login` with email and password
   - Server verifies credentials
   - On success, generates JWT token
   - Returns token and user info

3. **Authentication Middleware**:
   - Extract JWT from Authorization header
   - Verify token and decode user information
   - Attach user context to GraphQL context

## Deployment Architecture

The application is containerized using Docker for consistent development and production environments:

```
┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │
│  Apollo Server  │◄────►│  Express App    │
│  (GraphQL API)  │      │                 │
│                 │      │                 │
└────────┬────────┘      └─────────────────┘
         │
         │
┌────────▼────────┐      ┌─────────────────┐
│                 │      │                 │
│  Prisma ORM     │◄────►│  PostgreSQL DB  │
│                 │      │                 │
│                 │      │                 │
└─────────────────┘      └─────────────────┘
```

## Security Considerations

1. **Password Security**:
   - Implement proper password hashing using bcrypt
   - Store salt with each user record
   - Never store plaintext passwords

2. **Authentication**:
   - Use JWT for stateless authentication
   - Set appropriate token expiry
   - Implement token refresh mechanism

3. **Data Validation**:
   - Validate all input data
   - Implement rate limiting for API endpoints
   - Use GraphQL validation directives

## Future Enhancements

1. **Follower/Following System**:
   - Implement user relationships
   - Add follow/unfollow functionality

2. **Notifications**:
   - Real-time notifications for likes, comments, etc.
   - Email notifications for important events

3. **Media Support**:
   - Allow image uploads for threads and profiles
   - Support video content

4. **Search Functionality**:
   - Full-text search for threads and users
   - Hashtag support and trending topics

## Development Setup

### Prerequisites
- Node.js (v16+)
- Docker and Docker Compose
- PostgreSQL (or use the Docker container)

### Local Development
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/threads"
   JWT_SECRET="your-secret-key"
   ```
4. Start the database:
   ```
   docker-compose up -d db
   ```
5. Run database migrations:
   ```
   npx prisma migrate dev
   ```
6. Start the development server:
   ```
   npm run dev
   ```

### Production Deployment
1. Build the TypeScript code:
   ```
   npm run build
   ```
2. Set up production environment variables
3. Start all services:
   ```
   docker-compose up -d
   ```

## API Testing

The GraphQL API can be tested using the Apollo Explorer available at http://localhost:8000/graphql when the server is running.

Example queries and mutations:

```graphql
# Create a new user
mutation {
  createUser(
    firstName: "John"
    lastName: "Doe"
    email: "john@example.com"
    password: "securepassword"
  )
}

# Query hello world
query {
  hello
}
```
