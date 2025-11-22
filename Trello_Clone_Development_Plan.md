# Comprehensive Development Plan: Trello Clone
## Expert-Guided Implementation for AI Agents in Claude Code

**Version:** 1.0  
**Date:** November 2025  
**Target:** Phase 1 MVP (Months 1-3)

---

## Table of Contents
1. [Technology Stack Decisions](#technology-stack-decisions)
2. [Development Environment Setup](#development-environment-setup)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Task Breakdown by Section](#task-breakdown-by-section)
6. [Agent Role Definitions](#agent-role-definitions)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Plan](#deployment-plan)

---

## 1. Technology Stack Decisions

### Frontend Stack

#### **Next.js 14+ (App Router)**
**Why:** 
- Built-in routing, API routes, and server components reduce complexity
- Excellent TypeScript support out of the box
- Great documentation that AI agents can reference
- Server-side rendering improves initial load performance
- Single framework for both frontend and API = simpler architecture
- Industry standard with huge community support

#### **TypeScript**
**Why:**
- Type safety catches errors before runtime
- Better IDE support and autocomplete for AI agents
- Self-documenting code through types
- Industry standard for serious applications
- Essential for maintainable codebases

#### **Tailwind CSS**
**Why:**
- Utility-first approach is easier for AI agents to work with
- No need to learn component library APIs
- Highly customizable and consistent
- Smaller bundle size than component libraries
- Faster development once you know the utilities
- Excellent documentation

#### **Zustand (State Management)**
**Why:**
- Much simpler than Redux (less boilerplate)
- Easy to learn and understand
- Perfect for AI agents - minimal abstractions
- Sufficient for MVP complexity
- Can migrate to Redux later if needed
- TypeScript support is excellent

#### **@dnd-kit (Drag and Drop)**
**Why:**
- Modern, actively maintained
- Better TypeScript support than react-beautiful-dnd
- More performant and flexible
- Works well with React 18+
- Accessibility built-in
- Great documentation

#### **React Hook Form + Zod**
**Why:**
- Best form handling library for React
- Zod provides runtime type validation
- Minimal re-renders = better performance
- TypeScript integration is seamless
- Reduces form code by 50%+

### Backend Stack

#### **Next.js API Routes (Initial) → Express.js (When Needed)**
**Why:**
- Start with Next.js API routes for simplicity
- Migrate to standalone Express when:
  - WebSocket server is needed (Phase 1 end)
  - API becomes complex
  - Need better separation of concerns
- Keeps everything in one codebase initially

#### **PostgreSQL**
**Why:**
- Industry standard for relational data
- Our data model is highly relational (boards → lists → cards)
- ACID compliance for data integrity
- Excellent performance and scalability
- Superior to MongoDB for this use case
- Great tooling and AI agent support

#### **Prisma ORM**
**Why:**
- Best TypeScript ORM available
- Auto-generated types from schema
- Excellent migration system
- Great for AI agents - clear, declarative syntax
- Built-in query builder prevents SQL injection
- Amazing documentation
- Prisma Studio for database visualization

#### **JWT + HTTP-only Cookies**
**Why:**
- Industry standard authentication
- HTTP-only cookies prevent XSS attacks
- Refresh token pattern for security
- Stateless and scalable
- Easy to implement with NextAuth.js or custom solution

#### **Socket.io (Phase 1 End)**
**Why:**
- Industry standard for real-time features
- Fallback mechanisms for older browsers
- Room-based architecture perfect for boards
- Easy to integrate with Express
- Excellent error handling

### Infrastructure

#### **Docker + Docker Compose**
**Why:**
- Consistent development environment
- Easy PostgreSQL setup
- All agents work with identical setup
- Production-like local environment
- Simple commands to start/stop services

#### **Git + GitHub**
**Why:**
- Industry standard version control
- Excellent for team collaboration
- GitHub Actions for CI/CD
- Perfect for AI agents working together

#### **Vercel (Deployment)**
**Why:**
- Built by Next.js creators - perfect integration
- Free tier sufficient for MVP
- Automatic deployments from Git
- Preview deployments for testing
- Global CDN included
- Zero configuration needed

---

## 2. Development Environment Setup

### Initial Setup Tasks

```bash
# Project structure
trello-clone/
├── .github/
│   └── workflows/          # CI/CD pipelines
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Database migrations
│   └── seed.ts             # Seed data
├── public/
│   └── assets/             # Static assets
├── src/
│   ├── app/                # Next.js app router
│   │   ├── (auth)/         # Auth routes
│   │   ├── (dashboard)/    # Dashboard routes
│   │   ├── api/            # API routes
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── boards/         # Board-specific components
│   │   ├── lists/          # List components
│   │   └── cards/          # Card components
│   ├── lib/                # Utility functions
│   │   ├── db.ts           # Prisma client
│   │   ├── auth.ts         # Auth utilities
│   │   ├── validations.ts  # Zod schemas
│   │   └── utils.ts        # Helper functions
│   ├── hooks/              # Custom React hooks
│   ├── store/              # Zustand stores
│   ├── types/              # TypeScript types
│   └── middleware.ts       # Next.js middleware
├── tests/
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── e2e/                # End-to-end tests
├── docker-compose.yml      # Docker services
├── .env.example            # Environment variables template
├── .env.local              # Local environment variables (gitignored)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

### Docker Configuration

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: trello_clone
      POSTGRES_USER: trello_user
      POSTGRES_PASSWORD: trello_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Environment Variables

```bash
# .env.example
DATABASE_URL="postgresql://trello_user:trello_password@localhost:5432/trello_clone"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string-here"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
```

---

## 3. Project Structure

### Architectural Decisions

**1. Feature-Based Organization**
- Components organized by feature (boards, lists, cards)
- Easier to locate and maintain code
- Clear boundaries for AI agents to work in

**2. Co-location of Related Files**
- Components with their tests in same directory
- Utilities with their types
- Reduces cognitive load for AI agents

**3. Separation of Concerns**
- UI components in `/components`
- Business logic in `/lib`
- API routes in `/app/api`
- State management in `/store`
- Clear responsibilities for each agent

---

## 4. Development Workflow

### Git Workflow (Feature Branch Model)

```
main (production-ready code)
  ↓
develop (integration branch)
  ↓
feature/task-name (individual features)
```

**Branching Strategy:**
1. `main` - Production-ready code, protected
2. `develop` - Integration branch for completed features
3. `feature/*` - Individual feature branches
4. `fix/*` - Bug fix branches
5. `hotfix/*` - Critical production fixes

**Workflow for Agents:**
1. Pull latest `develop` branch
2. Create feature branch: `git checkout -b feature/task-name`
3. Implement task with tests
4. Commit with descriptive message
5. Push and create Pull Request to `develop`
6. PM Agent reviews and merges
7. Periodically merge `develop` to `main`

### Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Example:**
```
feat(boards): implement board creation endpoint

- Add POST /api/boards endpoint
- Implement board validation with Zod
- Add unit tests for board service
- Update API documentation

Closes #123
```

---

## 5. Task Breakdown by Section

### Section 0: Project Initialization (Week 1)

#### **Task 0.1: Repository Setup**
**Complexity:** Low  
**Agent:** Project Manager  
**Time:** 2 hours

**Subtasks:**
1. Create GitHub repository `trello-clone`
2. Initialize with README.md, .gitignore, LICENSE
3. Set up branch protection rules for `main` and `develop`
4. Create project board with columns: Backlog, In Progress, Review, Done
5. Add all team members as collaborators
6. Create issue templates for bugs and features

**Acceptance Criteria:**
- Repository is accessible to all agents
- Branch protection prevents direct pushes to main
- Project board is set up and visible
- README contains project description and setup instructions

**Files Created:**
- `README.md`
- `.gitignore`
- `LICENSE`
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`

---

#### **Task 0.2: Initialize Next.js Project**
**Complexity:** Low  
**Agent:** DevOps/Full-Stack Agent  
**Time:** 1 hour

**Subtasks:**
1. Run `npx create-next-app@latest trello-clone --typescript --tailwind --app --eslint`
2. Configure TypeScript with strict mode
3. Set up Tailwind CSS with custom configuration
4. Install core dependencies:
   ```bash
   npm install zustand @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   npm install prisma @prisma/client
   npm install zod react-hook-form @hookform/resolvers
   npm install bcryptjs jsonwebtoken
   npm install -D @types/bcryptjs @types/jsonwebtoken
   ```
5. Configure ESLint and Prettier
6. Set up absolute imports with `@/` prefix

**Acceptance Criteria:**
- `npm run dev` starts development server
- TypeScript compilation has no errors
- Tailwind CSS is working
- ESLint and Prettier are configured
- All dependencies installed successfully

**Files Created/Modified:**
- `package.json`
- `tsconfig.json`
- `next.config.js`
- `tailwind.config.js`
- `.eslintrc.json`
- `.prettierrc`

---

#### **Task 0.3: Docker & Database Setup**
**Complexity:** Medium  
**Agent:** DevOps/Full-Stack Agent  
**Time:** 2 hours

**Subtasks:**
1. Create `docker-compose.yml` with PostgreSQL service
2. Create `.env.example` file with all required variables
3. Copy `.env.example` to `.env.local` and fill in values
4. Start Docker containers: `docker-compose up -d`
5. Initialize Prisma: `npx prisma init`
6. Configure Prisma to use PostgreSQL
7. Test database connection: `npx prisma db push`
8. Create `src/lib/db.ts` for Prisma client singleton

**Acceptance Criteria:**
- Docker containers start successfully
- PostgreSQL is accessible on localhost:5432
- Prisma can connect to database
- Database client is properly configured
- All environment variables are documented

**Files Created:**
- `docker-compose.yml`
- `.env.example`
- `.env.local` (gitignored)
- `prisma/schema.prisma`
- `src/lib/db.ts`

**Code Example - `src/lib/db.ts`:**
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

#### **Task 0.4: Project Structure Setup**
**Complexity:** Low  
**Agent:** Project Manager  
**Time:** 1 hour

**Subtasks:**
1. Create all directories as per project structure
2. Create placeholder `index.ts` or `.gitkeep` files in empty directories
3. Set up path aliases in `tsconfig.json`
4. Create initial `README.md` with setup instructions
5. Create `CONTRIBUTING.md` with guidelines for agents
6. Document coding standards and conventions

**Acceptance Criteria:**
- All directories exist as specified
- Path aliases work correctly
- README has clear setup instructions
- Contributing guidelines are documented

**Files Created:**
- Directory structure (as outlined above)
- `README.md`
- `CONTRIBUTING.md`
- `docs/ARCHITECTURE.md`
- `docs/API_DOCUMENTATION.md`

---

### Section 1: Database Schema & Models (Week 1)

#### **Task 1.1: Design and Implement User Model**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 3 hours

**Subtasks:**
1. Define User model in `prisma/schema.prisma`
2. Add fields: id, email, password, name, avatar, createdAt, updatedAt
3. Add unique constraint on email
4. Add indexes for performance
5. Create migration: `npx prisma migrate dev --name create_users`
6. Generate Prisma client: `npx prisma generate`
7. Create TypeScript types in `src/types/user.ts`
8. Write unit tests for User model

**Acceptance Criteria:**
- User table exists in database
- All fields are properly typed
- Email uniqueness is enforced
- Migration runs successfully
- Types are generated and available

**Files Created/Modified:**
- `prisma/schema.prisma`
- `prisma/migrations/XXX_create_users/migration.sql`
- `src/types/user.ts`
- `tests/unit/models/user.test.ts`

**Code Example - User Model:**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  workspaceMembers WorkspaceMember[]
  boardMembers     BoardMember[]
  cards            CardMember[]
  comments         Comment[]

  @@index([email])
}
```

---

#### **Task 1.2: Implement Workspace Model**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 3 hours

**Subtasks:**
1. Define Workspace model in Prisma schema
2. Add fields: id, name, description, ownerId, createdAt, updatedAt
3. Create WorkspaceMember junction table for many-to-many relationship
4. Add role field to WorkspaceMember (ADMIN, MEMBER, VIEWER)
5. Set up foreign key constraints
6. Create migration
7. Create TypeScript types
8. Write unit tests

**Acceptance Criteria:**
- Workspace table exists with all fields
- WorkspaceMember junction table created
- Foreign keys properly configured
- Role-based access is modeled
- Types are properly defined

**Files Created/Modified:**
- `prisma/schema.prisma`
- `prisma/migrations/XXX_create_workspaces/migration.sql`
- `src/types/workspace.ts`
- `tests/unit/models/workspace.test.ts`

**Code Example - Workspace Models:**
```prisma
enum WorkspaceRole {
  ADMIN
  MEMBER
  VIEWER
}

model Workspace {
  id          String   @id @default(cuid())
  name        String
  description String?
  ownerId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  members WorkspaceMember[]
  boards  Board[]

  @@index([ownerId])
}

model WorkspaceMember {
  id          String        @id @default(cuid())
  workspaceId String
  userId      String
  role        WorkspaceRole @default(MEMBER)
  joinedAt    DateTime      @default(now())

  // Relations
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
  @@index([workspaceId])
  @@index([userId])
}
```

---

#### **Task 1.3: Implement Board Model**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 3 hours

**Subtasks:**
1. Define Board model in Prisma schema
2. Add fields: id, title, workspaceId, background, visibility, starred, createdAt, updatedAt
3. Create BoardMember junction table
4. Add visibility enum (PUBLIC, PRIVATE, WORKSPACE)
5. Set up cascade delete for workspace relationship
6. Create migration
7. Create TypeScript types
8. Write unit tests

**Acceptance Criteria:**
- Board table exists with all fields
- BoardMember junction table created
- Visibility options properly modeled
- Cascade deletes configured
- Starred functionality supported

**Files Created/Modified:**
- `prisma/schema.prisma`
- `prisma/migrations/XXX_create_boards/migration.sql`
- `src/types/board.ts`
- `tests/unit/models/board.test.ts`

**Code Example - Board Models:**
```prisma
enum BoardVisibility {
  PUBLIC
  PRIVATE
  WORKSPACE
}

enum BoardRole {
  ADMIN
  MEMBER
  VIEWER
}

model Board {
  id          String          @id @default(cuid())
  title       String
  workspaceId String
  background  String?         // Color hex or image URL
  visibility  BoardVisibility @default(PRIVATE)
  starred     Boolean         @default(false)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  // Relations
  workspace Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  members   BoardMember[]
  lists     List[]

  @@index([workspaceId])
  @@index([starred])
}

model BoardMember {
  id        String    @id @default(cuid())
  boardId   String
  userId    String
  role      BoardRole @default(MEMBER)
  joinedAt  DateTime  @default(now())

  // Relations
  board Board @relation(fields: [boardId], references: [id], onDelete: Cascade)
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([boardId, userId])
  @@index([boardId])
  @@index([userId])
}
```

---

#### **Task 1.4: Implement List Model**
**Complexity:** Low  
**Agent:** Backend Agent  
**Time:** 2 hours

**Subtasks:**
1. Define List model in Prisma schema
2. Add fields: id, title, boardId, position, archived, createdAt, updatedAt
3. Set up cascade delete for board relationship
4. Add position field for ordering
5. Create migration
6. Create TypeScript types
7. Write unit tests

**Acceptance Criteria:**
- List table exists with all fields
- Position ordering is supported
- Archive functionality is available
- Cascade deletes work correctly

**Files Created/Modified:**
- `prisma/schema.prisma`
- `prisma/migrations/XXX_create_lists/migration.sql`
- `src/types/list.ts`
- `tests/unit/models/list.test.ts`

**Code Example - List Model:**
```prisma
model List {
  id        String   @id @default(cuid())
  title     String
  boardId   String
  position  Int      // For ordering lists
  archived  Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  board Board  @relation(fields: [boardId], references: [id], onDelete: Cascade)
  cards Card[]

  @@index([boardId])
  @@index([boardId, position])
}
```

---

#### **Task 1.5: Implement Card Model**
**Complexity:** High  
**Agent:** Backend Agent  
**Time:** 4 hours

**Subtasks:**
1. Define Card model in Prisma schema
2. Add fields: id, title, description, listId, position, dueDate, cover, archived, createdAt, updatedAt
3. Create CardMember junction table for assignments
4. Create Label model and CardLabel junction table
5. Create Checklist and ChecklistItem models
6. Create Attachment model
7. Set up all relationships and cascade deletes
8. Create migration
9. Create TypeScript types for all models
10. Write comprehensive unit tests

**Acceptance Criteria:**
- Card table with all fields exists
- All related tables created (labels, checklists, attachments)
- Relationships properly configured
- Position ordering works
- All types are properly defined

**Files Created/Modified:**
- `prisma/schema.prisma`
- `prisma/migrations/XXX_create_cards/migration.sql`
- `src/types/card.ts`
- `src/types/label.ts`
- `src/types/checklist.ts`
- `src/types/attachment.ts`
- `tests/unit/models/card.test.ts`

**Code Example - Card Models:**
```prisma
model Card {
  id          String    @id @default(cuid())
  title       String
  description String?   @db.Text
  listId      String
  position    Int       // For ordering cards
  dueDate     DateTime?
  cover       String?   // Image URL
  archived    Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  // Relations
  list        List           @relation(fields: [listId], references: [id], onDelete: Cascade)
  members     CardMember[]
  labels      CardLabel[]
  checklists  Checklist[]
  attachments Attachment[]
  comments    Comment[]

  @@index([listId])
  @@index([listId, position])
  @@index([dueDate])
}

model CardMember {
  id        String   @id @default(cuid())
  cardId    String
  userId    String
  assignedAt DateTime @default(now())

  // Relations
  card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([cardId, userId])
  @@index([cardId])
  @@index([userId])
}

model Label {
  id        String   @id @default(cuid())
  name      String
  color     String   // Hex color code
  boardId   String
  createdAt DateTime @default(now())

  // Relations
  cards CardLabel[]

  @@index([boardId])
}

model CardLabel {
  id      String @id @default(cuid())
  cardId  String
  labelId String

  // Relations
  card  Card  @relation(fields: [cardId], references: [id], onDelete: Cascade)
  label Label @relation(fields: [labelId], references: [id], onDelete: Cascade)

  @@unique([cardId, labelId])
  @@index([cardId])
  @@index([labelId])
}

model Checklist {
  id        String   @id @default(cuid())
  title     String
  cardId    String
  position  Int
  createdAt DateTime @default(now())

  // Relations
  card  Card            @relation(fields: [cardId], references: [id], onDelete: Cascade)
  items ChecklistItem[]

  @@index([cardId])
}

model ChecklistItem {
  id          String   @id @default(cuid())
  text        String
  checklistId String
  completed   Boolean  @default(false)
  position    Int
  createdAt   DateTime @default(now())

  // Relations
  checklist Checklist @relation(fields: [checklistId], references: [id], onDelete: Cascade)

  @@index([checklistId])
}

model Attachment {
  id        String   @id @default(cuid())
  name      String
  url       String
  cardId    String
  uploadedBy String
  createdAt DateTime @default(now())

  // Relations
  card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)

  @@index([cardId])
}

model Comment {
  id        String   @id @default(cuid())
  text      String   @db.Text
  cardId    String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([cardId])
  @@index([userId])
}
```

---

#### **Task 1.6: Create Database Seed File**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 2 hours

**Subtasks:**
1. Create `prisma/seed.ts` file
2. Create sample users with hashed passwords
3. Create sample workspaces
4. Create sample boards with different visibility levels
5. Create sample lists and cards
6. Add some labels, checklists, and comments
7. Configure seed script in package.json
8. Test seed script: `npx prisma db seed`

**Acceptance Criteria:**
- Seed file creates realistic sample data
- All relationships are properly connected
- Passwords are hashed using bcrypt
- Seed can be run multiple times (idempotent if possible)
- Sample data is useful for development

**Files Created:**
- `prisma/seed.ts`
- `package.json` (modify)

**Code Example - Seed Script:**
```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.comment.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.checklistItem.deleteMany()
  await prisma.checklist.deleteMany()
  await prisma.cardLabel.deleteMany()
  await prisma.label.deleteMany()
  await prisma.cardMember.deleteMany()
  await prisma.card.deleteMany()
  await prisma.list.deleteMany()
  await prisma.boardMember.deleteMany()
  await prisma.board.deleteMany()
  await prisma.workspaceMember.deleteMany()
  await prisma.workspace.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const password = await bcrypt.hash('password123', 10)
  
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      password,
      name: 'Alice Johnson',
    },
  })

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password,
      name: 'Bob Smith',
    },
  })

  // Create workspace
  const workspace = await prisma.workspace.create({
    data: {
      name: 'Development Team',
      description: 'Software development workspace',
      ownerId: alice.id,
      members: {
        create: [
          { userId: alice.id, role: 'ADMIN' },
          { userId: bob.id, role: 'MEMBER' },
        ],
      },
    },
  })

  // Create board
  const board = await prisma.board.create({
    data: {
      title: 'Project Alpha',
      workspaceId: workspace.id,
      background: '#0079BF',
      visibility: 'WORKSPACE',
      members: {
        create: [
          { userId: alice.id, role: 'ADMIN' },
          { userId: bob.id, role: 'MEMBER' },
        ],
      },
    },
  })

  // Create labels
  const labels = await Promise.all([
    prisma.label.create({ data: { name: 'Bug', color: '#EB5A46', boardId: board.id } }),
    prisma.label.create({ data: { name: 'Feature', color: '#61BD4F', boardId: board.id } }),
  ])

  // Create lists
  const todoList = await prisma.list.create({
    data: {
      title: 'To Do',
      boardId: board.id,
      position: 0,
    },
  })

  const inProgressList = await prisma.list.create({
    data: {
      title: 'In Progress',
      boardId: board.id,
      position: 1,
    },
  })

  // Create cards
  const card1 = await prisma.card.create({
    data: {
      title: 'Set up authentication',
      description: 'Implement JWT authentication with refresh tokens',
      listId: todoList.id,
      position: 0,
      members: {
        create: { userId: alice.id },
      },
      labels: {
        create: { labelId: labels[1].id },
      },
    },
  })

  // Add checklist
  await prisma.checklist.create({
    data: {
      title: 'Tasks',
      cardId: card1.id,
      position: 0,
      items: {
        create: [
          { text: 'Set up NextAuth.js', position: 0, completed: true },
          { text: 'Create login API', position: 1, completed: false },
          { text: 'Add protected routes', position: 2, completed: false },
        ],
      },
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

---

### Section 2: Authentication System (Week 2)

#### **Task 2.1: Set Up NextAuth.js**
**Complexity:** High  
**Agent:** Backend Agent  
**Time:** 4 hours

**Subtasks:**
1. Install NextAuth.js: `npm install next-auth @auth/prisma-adapter`
2. Create `src/app/api/auth/[...nextauth]/route.ts`
3. Configure NextAuth with credentials provider
4. Set up Prisma adapter for session storage
5. Configure JWT strategy
6. Add Google OAuth provider
7. Create authentication utilities in `src/lib/auth.ts`
8. Set up middleware for protected routes
9. Create types for session user
10. Write tests for auth functions

**Acceptance Criteria:**
- NextAuth is fully configured
- Credentials login works
- Google OAuth works
- Sessions are stored in database
- Protected routes redirect to login
- Types are properly defined

**Files Created/Modified:**
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/lib/auth.ts`
- `src/middleware.ts`
- `src/types/next-auth.d.ts`
- `tests/unit/lib/auth.test.ts`

**Code Example - NextAuth Configuration:**
```typescript
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

---

#### **Task 2.2: Create Registration API**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 3 hours

**Subtasks:**
1. Create validation schema with Zod in `src/lib/validations.ts`
2. Create `/api/auth/register` endpoint
3. Implement email validation
4. Implement password hashing with bcrypt
5. Check for existing users
6. Create user in database
7. Return appropriate error messages
8. Add rate limiting to prevent abuse
9. Write integration tests
10. Document API endpoint

**Acceptance Criteria:**
- Registration endpoint works correctly
- Passwords are hashed before storage
- Email uniqueness is enforced
- Validation errors are clear
- API is documented
- Tests pass

**Files Created/Modified:**
- `src/app/api/auth/register/route.ts`
- `src/lib/validations.ts`
- `tests/integration/auth/register.test.ts`
- `docs/API_DOCUMENTATION.md`

**Code Example - Registration Endpoint:**
```typescript
// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/db'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { message: 'User created successfully', user },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

#### **Task 2.3: Create Login/Logout UI Components**
**Complexity:** Medium  
**Agent:** Frontend Agent  
**Time:** 4 hours

**Subtasks:**
1. Create `src/app/(auth)/login/page.tsx`
2. Create `src/app/(auth)/register/page.tsx`
3. Create `src/components/auth/LoginForm.tsx`
4. Create `src/components/auth/RegisterForm.tsx`
5. Implement form validation with React Hook Form + Zod
6. Add loading states and error handling
7. Style with Tailwind CSS
8. Add Google OAuth button
9. Implement client-side navigation
10. Write component tests

**Acceptance Criteria:**
- Login and register pages are functional
- Forms have proper validation
- Error messages display correctly
- Loading states work
- Styling is clean and responsive
- OAuth integration works

**Files Created:**
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/layout.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/auth/RegisterForm.tsx`
- `tests/unit/components/auth/LoginForm.test.tsx`

**Code Example - Login Form:**
```typescript
// src/components/auth/LoginForm.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Log in to Trello Clone
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            {/* Google icon SVG */}
          </svg>
          Sign in with Google
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
```

---

### Section 3: Workspace & Board Management (Week 3)

#### **Task 3.1: Create Workspace API Endpoints**
**Complexity:** High  
**Agent:** Backend Agent  
**Time:** 6 hours

**Subtasks:**
1. Create `/api/workspaces` endpoints (POST, GET, PATCH, DELETE)
2. Create `/api/workspaces/[id]/members` endpoints
3. Implement workspace creation with owner assignment
4. Implement workspace member management (add, remove, update role)
5. Add authorization checks (only owner can delete, admins can manage)
6. Create validation schemas for all endpoints
7. Implement proper error handling
8. Write integration tests
9. Document all endpoints

**Acceptance Criteria:**
- CRUD operations for workspaces work
- Member management is functional
- Authorization is properly enforced
- All endpoints validated
- Tests pass
- API documented

**Files Created:**
- `src/app/api/workspaces/route.ts`
- `src/app/api/workspaces/[id]/route.ts`
- `src/app/api/workspaces/[id]/members/route.ts`
- `src/lib/validations/workspace.ts`
- `tests/integration/api/workspaces.test.ts`

**Code Example - Workspace Creation:**
```typescript
// src/app/api/workspaces/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = createWorkspaceSchema.parse(body)

    const workspace = await prisma.workspace.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'ADMIN',
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(workspace, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Workspace creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        boards: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(workspaces)
  } catch (error) {
    console.error('Workspace fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

#### **Task 3.2: Create Board API Endpoints**
**Complexity:** High  
**Agent:** Backend Agent  
**Time:** 6 hours

**Subtasks:**
1. Create `/api/boards` endpoints (POST, GET, PATCH, DELETE)
2. Create `/api/boards/[id]/members` endpoints
3. Create `/api/boards/[id]/star` endpoint
4. Implement board creation within workspace
5. Implement board member management
6. Add visibility checks and permissions
7. Create validation schemas
8. Implement starring/unstarring
9. Write integration tests
10. Document endpoints

**Acceptance Criteria:**
- CRUD operations work correctly
- Visibility rules are enforced
- Member management functions
- Starring works
- All operations validated
- Tests pass

**Files Created:**
- `src/app/api/boards/route.ts`
- `src/app/api/boards/[id]/route.ts`
- `src/app/api/boards/[id]/members/route.ts`
- `src/app/api/boards/[id]/star/route.ts`
- `src/lib/validations/board.ts`
- `tests/integration/api/boards.test.ts`

---

#### **Task 3.3: Create Workspace UI Components**
**Complexity:** Medium  
**Agent:** Frontend Agent  
**Time:** 5 hours

**Subtasks:**
1. Create `src/app/(dashboard)/workspaces/page.tsx`
2. Create `src/components/workspaces/WorkspaceList.tsx`
3. Create `src/components/workspaces/WorkspaceCard.tsx`
4. Create `src/components/workspaces/CreateWorkspaceModal.tsx`
5. Create `src/components/workspaces/WorkspaceSettings.tsx`
6. Implement workspace creation form
7. Implement workspace list with grid layout
8. Add loading and error states
9. Style with Tailwind CSS
10. Write component tests

**Acceptance Criteria:**
- Workspace list displays correctly
- Create workspace modal works
- Forms are validated
- UI is responsive
- Loading states work
- Tests pass

**Files Created:**
- `src/app/(dashboard)/workspaces/page.tsx`
- `src/components/workspaces/WorkspaceList.tsx`
- `src/components/workspaces/WorkspaceCard.tsx`
- `src/components/workspaces/CreateWorkspaceModal.tsx`
- `tests/unit/components/workspaces/WorkspaceList.test.tsx`

---

#### **Task 3.4: Create Board UI Components**
**Complexity:** High  
**Agent:** Frontend Agent  
**Time:** 6 hours

**Subtasks:**
1. Create `src/app/(dashboard)/boards/page.tsx`
2. Create `src/app/(dashboard)/boards/[id]/page.tsx`
3. Create `src/components/boards/BoardList.tsx`
4. Create `src/components/boards/BoardCard.tsx`
5. Create `src/components/boards/CreateBoardModal.tsx`
6. Create `src/components/boards/BoardHeader.tsx`
7. Implement board creation with background selector
8. Implement board starring
9. Add filtering by workspace
10. Style components
11. Write tests

**Acceptance Criteria:**
- Board list shows all accessible boards
- Board creation modal works with background selection
- Starring toggles correctly
- Board header displays correctly
- Responsive design
- Tests pass

**Files Created:**
- `src/app/(dashboard)/boards/page.tsx`
- `src/app/(dashboard)/boards/[id]/page.tsx`
- `src/components/boards/BoardList.tsx`
- `src/components/boards/BoardCard.tsx`
- `src/components/boards/CreateBoardModal.tsx`
- `src/components/boards/BoardHeader.tsx`
- `tests/unit/components/boards/BoardList.test.tsx`

---

### Section 4: List Management (Week 4)

#### **Task 4.1: Create List API Endpoints**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 4 hours

**Subtasks:**
1. Create `/api/lists` endpoints (POST, GET, PATCH, DELETE)
2. Create `/api/lists/[id]/reorder` endpoint
3. Implement list creation with position
4. Implement list archiving
5. Implement list reordering logic
6. Add board permission checks
7. Create validation schemas
8. Write integration tests
9. Document endpoints

**Acceptance Criteria:**
- CRUD operations work
- Reordering maintains correct positions
- Archive functionality works
- Permissions enforced
- Tests pass

**Files Created:**
- `src/app/api/lists/route.ts`
- `src/app/api/lists/[id]/route.ts`
- `src/app/api/lists/[id]/reorder/route.ts`
- `src/lib/validations/list.ts`
- `tests/integration/api/lists.test.ts`

**Code Example - List Reordering:**
```typescript
// src/app/api/lists/[id]/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const reorderSchema = z.object({
  newPosition: z.number().int().min(0),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { newPosition } = reorderSchema.parse(body)

    // Get the list and verify permissions
    const list = await prisma.list.findUnique({
      where: { id: params.id },
      include: {
        board: {
          include: {
            members: {
              where: { userId: session.user.id },
            },
          },
        },
      },
    })

    if (!list) {
      return NextResponse.json(
        { error: 'List not found' },
        { status: 404 }
      )
    }

    if (list.board.members.length === 0) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const oldPosition = list.position

    // Reorder lists
    if (newPosition > oldPosition) {
      // Moving down: shift lists between oldPosition and newPosition up
      await prisma.list.updateMany({
        where: {
          boardId: list.boardId,
          position: {
            gt: oldPosition,
            lte: newPosition,
          },
        },
        data: {
          position: { decrement: 1 },
        },
      })
    } else if (newPosition < oldPosition) {
      // Moving up: shift lists between newPosition and oldPosition down
      await prisma.list.updateMany({
        where: {
          boardId: list.boardId,
          position: {
            gte: newPosition,
            lt: oldPosition,
          },
        },
        data: {
          position: { increment: 1 },
        },
      })
    }

    // Update the list position
    const updatedList = await prisma.list.update({
      where: { id: params.id },
      data: { position: newPosition },
    })

    return NextResponse.json(updatedList)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('List reorder error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

#### **Task 4.2: Create List UI Components**
**Complexity:** Medium  
**Agent:** Frontend Agent  
**Time:** 5 hours

**Subtasks:**
1. Create `src/components/lists/List.tsx`
2. Create `src/components/lists/ListHeader.tsx`
3. Create `src/components/lists/CreateListButton.tsx`
4. Create `src/components/lists/ListMenu.tsx`
5. Implement list creation inline
6. Implement list editing
7. Implement list menu (archive, copy, etc.)
8. Style components
9. Add loading states
10. Write tests

**Acceptance Criteria:**
- Lists display correctly
- Inline creation works
- Editing is functional
- Menu operations work
- Responsive design
- Tests pass

**Files Created:**
- `src/components/lists/List.tsx`
- `src/components/lists/ListHeader.tsx`
- `src/components/lists/CreateListButton.tsx`
- `src/components/lists/ListMenu.tsx`
- `tests/unit/components/lists/List.test.tsx`

**Code Example - List Component:**
```typescript
// src/components/lists/List.tsx
'use client'

import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ListHeader from './ListHeader'
import Card from '../cards/Card'
import CreateCardButton from '../cards/CreateCardButton'
import type { List as ListType } from '@/types/list'
import type { Card as CardType } from '@/types/card'

interface ListProps {
  list: ListType & { cards: CardType[] }
  onUpdate: (listId: string, data: Partial<ListType>) => void
  onDelete: (listId: string) => void
}

export default function List({ list, onUpdate, onDelete }: ListProps) {
  const [isAddingCard, setIsAddingCard] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: 'list',
      list,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 rounded-lg w-72 flex-shrink-0 flex flex-col max-h-full"
    >
      <ListHeader
        list={list}
        onUpdate={onUpdate}
        onDelete={onDelete}
        dragHandleProps={{ ...attributes, ...listeners }}
      />

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <div className="space-y-2">
          {list.cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>

        {isAddingCard ? (
          <CreateCardButton
            listId={list.id}
            onClose={() => setIsAddingCard(false)}
          />
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full text-left px-2 py-1 text-gray-600 hover:bg-gray-200 rounded mt-2"
          >
            + Add a card
          </button>
        )}
      </div>
    </div>
  )
}
```

---

### Section 5: Card Management (Week 5-6)

#### **Task 5.1: Create Card API Endpoints**
**Complexity:** High  
**Agent:** Backend Agent  
**Time:** 8 hours

**Subtasks:**
1. Create `/api/cards` endpoints (POST, GET, PATCH, DELETE)
2. Create `/api/cards/[id]/reorder` endpoint
3. Create `/api/cards/[id]/move` endpoint (move between lists)
4. Implement card creation with position
5. Implement card update with all fields
6. Implement card reordering within list
7. Implement card moving between lists
8. Add permission checks
9. Create validation schemas
10. Write comprehensive integration tests
11. Document all endpoints

**Acceptance Criteria:**
- All CRUD operations work
- Reordering within list works
- Moving between lists works
- All fields can be updated
- Permissions enforced
- Tests pass

**Files Created:**
- `src/app/api/cards/route.ts`
- `src/app/api/cards/[id]/route.ts`
- `src/app/api/cards/[id]/reorder/route.ts`
- `src/app/api/cards/[id]/move/route.ts`
- `src/lib/validations/card.ts`
- `tests/integration/api/cards.test.ts`

---

#### **Task 5.2: Implement Label System**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 4 hours

**Subtasks:**
1. Create `/api/labels` endpoints
2. Create `/api/cards/[id]/labels` endpoints
3. Implement label CRUD operations
4. Implement adding/removing labels from cards
5. Add board-scoped labels
6. Create validation schemas
7. Write tests
8. Document endpoints

**Acceptance Criteria:**
- Labels can be created per board
- Labels can be added/removed from cards
- Color validation works
- Tests pass

**Files Created:**
- `src/app/api/labels/route.ts`
- `src/app/api/cards/[id]/labels/route.ts`
- `src/lib/validations/label.ts`
- `tests/integration/api/labels.test.ts`

---

#### **Task 5.3: Implement Checklist System**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 5 hours

**Subtasks:**
1. Create `/api/checklists` endpoints
2. Create `/api/checklists/[id]/items` endpoints
3. Implement checklist CRUD operations
4. Implement checklist item CRUD operations
5. Implement item completion toggle
6. Calculate completion percentage
7. Create validation schemas
8. Write tests
9. Document endpoints

**Acceptance Criteria:**
- Checklists can be created on cards
- Items can be added/removed/reordered
- Completion tracking works
- Tests pass

**Files Created:**
- `src/app/api/checklists/route.ts`
- `src/app/api/checklists/[id]/items/route.ts`
- `src/lib/validations/checklist.ts`
- `tests/integration/api/checklists.test.ts`

---

#### **Task 5.4: Create Card UI Components**
**Complexity:** High  
**Agent:** Frontend Agent  
**Time:** 8 hours

**Subtasks:**
1. Create `src/components/cards/Card.tsx`
2. Create `src/components/cards/CardModal.tsx`
3. Create `src/components/cards/CreateCardButton.tsx`
4. Create `src/components/cards/CardBadges.tsx` (for labels, due date, etc.)
5. Implement card preview with badges
6. Implement card modal with all details
7. Add drag handle for cards
8. Style components
9. Add loading states
10. Write tests

**Acceptance Criteria:**
- Cards display correctly with badges
- Modal opens and shows all details
- Creation is smooth
- Drag and drop works
- Responsive design
- Tests pass

**Files Created:**
- `src/components/cards/Card.tsx`
- `src/components/cards/CardModal.tsx`
- `src/components/cards/CreateCardButton.tsx`
- `src/components/cards/CardBadges.tsx`
- `tests/unit/components/cards/Card.test.tsx`

---

#### **Task 5.5: Create Card Detail Components**
**Complexity:** High  
**Agent:** Frontend Agent  
**Time:** 10 hours

**Subtasks:**
1. Create `src/components/cards/CardDescription.tsx`
2. Create `src/components/cards/CardLabels.tsx`
3. Create `src/components/cards/CardMembers.tsx`
4. Create `src/components/cards/CardDueDate.tsx`
5. Create `src/components/cards/CardChecklists.tsx`
6. Create `src/components/cards/CardAttachments.tsx`
7. Create `src/components/cards/CardComments.tsx`
8. Create `src/components/cards/CardActivity.tsx`
9. Implement markdown editor for description
10. Implement label selector
11. Implement member assignment
12. Implement date picker
13. Implement checklist functionality
14. Implement file upload
15. Implement commenting
16. Style all components
17. Write comprehensive tests

**Acceptance Criteria:**
- All card features work in modal
- Description supports markdown
- Labels can be selected
- Members can be assigned
- Due dates can be set
- Checklists are functional
- Files can be uploaded
- Comments can be added
- Activity log displays
- Tests pass

**Files Created:**
- Multiple component files (listed above)
- `tests/unit/components/cards/` (various test files)

---

### Section 6: Drag and Drop System (Week 7)

#### **Task 6.1: Set Up @dnd-kit Context**
**Complexity:** Medium  
**Agent:** Frontend Agent  
**Time:** 4 hours

**Subtasks:**
1. Create `src/components/boards/BoardDnDContext.tsx`
2. Set up DndContext with sensors
3. Configure collision detection
4. Add drag overlay for visual feedback
5. Create custom drag handles
6. Test basic drag functionality
7. Write tests

**Acceptance Criteria:**
- DnD context wraps board
- Sensors work correctly (mouse, touch, keyboard)
- Drag overlay appears
- Basic dragging works
- Tests pass

**Files Created:**
- `src/components/boards/BoardDnDContext.tsx`
- `src/hooks/useDragAndDrop.ts`
- `tests/unit/hooks/useDragAndDrop.test.ts`

**Code Example - DnD Context:**
```typescript
// src/components/boards/BoardDnDContext.tsx
'use client'

import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import List from '../lists/List'
import Card from '../cards/Card'

interface BoardDnDContextProps {
  lists: any[]
  onListReorder: (listId: string, newPosition: number) => void
  onCardMove: (cardId: string, newListId: string, newPosition: number) => void
}

export default function BoardDnDContext({
  lists,
  onListReorder,
  onCardMove,
}: BoardDnDContextProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<'list' | 'card' | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor)
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActiveId(active.id as string)
    setActiveType(active.data.current?.type)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    
    if (!over) return

    const activeType = active.data.current?.type
    const overType = over.data.current?.type

    // Handle card dragging over different lists
    if (activeType === 'card' && overType === 'list') {
      // Logic for moving card to different list
      console.log('Card over list')
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveId(null)
      setActiveType(null)
      return
    }

    const activeType = active.data.current?.type
    const overType = over.data.current?.type

    if (activeType === 'list' && overType === 'list') {
      // Reorder lists
      const oldIndex = lists.findIndex((l) => l.id === active.id)
      const newIndex = lists.findIndex((l) => l.id === over.id)

      if (oldIndex !== newIndex) {
        onListReorder(active.id as string, newIndex)
      }
    } else if (activeType === 'card') {
      // Move card
      const activeCard = active.data.current?.card
      const overList = over.data.current?.list || over.data.current?.card?.list

      if (overList) {
        const newPosition = calculateNewPosition(/* ... */)
        onCardMove(active.id as string, overList.id, newPosition)
      }
    }

    setActiveId(null)
    setActiveType(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={lists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
        <div className="flex gap-4 p-4 overflow-x-auto">
          {lists.map((list) => (
            <List key={list.id} list={list} />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeId && activeType === 'list' && (
          <div className="opacity-80">
            <List list={lists.find((l) => l.id === activeId)!} />
          </div>
        )}
        {activeId && activeType === 'card' && (
          <div className="opacity-80">
            <Card card={/* find card */} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
```

---

#### **Task 6.2: Implement List Drag and Drop**
**Complexity:** Medium  
**Agent:** Frontend Agent  
**Time:** 4 hours

**Subtasks:**
1. Make List component sortable
2. Implement horizontal sorting strategy
3. Handle drag handles in list header
4. Update list positions on drop
5. Implement optimistic updates
6. Add visual feedback during drag
7. Test thoroughly
8. Write tests

**Acceptance Criteria:**
- Lists can be dragged horizontally
- Order updates correctly
- Optimistic updates work
- Visual feedback is clear
- No bugs or glitches
- Tests pass

**Files Modified:**
- `src/components/lists/List.tsx`
- `src/components/boards/BoardDnDContext.tsx`
- `tests/unit/components/lists/List.test.tsx`

---

#### **Task 6.3: Implement Card Drag and Drop**
**Complexity:** High  
**Agent:** Frontend Agent  
**Time:** 6 hours

**Subtasks:**
1. Make Card component sortable
2. Implement vertical sorting within lists
3. Implement cross-list dragging
4. Handle position calculations
5. Implement optimistic updates
6. Handle edge cases (empty lists, single card)
7. Add visual feedback
8. Test all scenarios
9. Write comprehensive tests

**Acceptance Criteria:**
- Cards can be dragged within lists
- Cards can be moved between lists
- Positions update correctly
- Optimistic updates work
- Edge cases handled
- Visual feedback works
- Tests pass

**Files Modified:**
- `src/components/cards/Card.tsx`
- `src/components/boards/BoardDnDContext.tsx`
- `src/hooks/useDragAndDrop.ts`
- `tests/unit/components/cards/Card.test.tsx`

---

### Section 7: State Management & Real-time Updates (Week 8)

#### **Task 7.1: Set Up Zustand Stores**
**Complexity:** Medium  
**Agent:** Full-Stack Agent  
**Time:** 5 hours

**Subtasks:**
1. Create `src/store/boardStore.ts` for board state
2. Create `src/store/uiStore.ts` for UI state (modals, menus)
3. Implement board data fetching and caching
4. Implement optimistic updates
5. Implement error handling and rollback
6. Create selectors for efficient rendering
7. Write tests for stores

**Acceptance Criteria:**
- Stores manage state correctly
- Optimistic updates work
- Errors are handled gracefully
- Selectors work efficiently
- Tests pass

**Files Created:**
- `src/store/boardStore.ts`
- `src/store/uiStore.ts`
- `tests/unit/store/boardStore.test.ts`

**Code Example - Board Store:**
```typescript
// src/store/boardStore.ts
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type { Board, List, Card } from '@/types'

interface BoardState {
  currentBoard: Board | null
  lists: List[]
  cards: Record<string, Card[]> // Cards grouped by listId
  isLoading: boolean
  error: string | null

  // Actions
  setBoard: (board: Board) => void
  setLists: (lists: List[]) => void
  addList: (list: List) => void
  updateList: (listId: string, data: Partial<List>) => void
  deleteList: (listId: string) => void
  reorderList: (listId: string, newPosition: number) => void
  
  addCard: (card: Card) => void
  updateCard: (cardId: string, data: Partial<Card>) => void
  deleteCard: (cardId: string) => void
  moveCard: (cardId: string, newListId: string, newPosition: number) => void

  fetchBoard: (boardId: string) => Promise<void>
}

export const useBoardStore = create<BoardState>()(
  immer((set, get) => ({
    currentBoard: null,
    lists: [],
    cards: {},
    isLoading: false,
    error: null,

    setBoard: (board) => set({ currentBoard: board }),
    
    setLists: (lists) => set({ lists }),

    addList: (list) => set((state) => {
      state.lists.push(list)
      state.cards[list.id] = []
    }),

    updateList: (listId, data) => set((state) => {
      const list = state.lists.find((l) => l.id === listId)
      if (list) {
        Object.assign(list, data)
      }
    }),

    deleteList: (listId) => set((state) => {
      state.lists = state.lists.filter((l) => l.id !== listId)
      delete state.cards[listId]
    }),

    reorderList: (listId, newPosition) => set((state) => {
      const listIndex = state.lists.findIndex((l) => l.id === listId)
      if (listIndex !== -1) {
        const [list] = state.lists.splice(listIndex, 1)
        state.lists.splice(newPosition, 0, list)
        
        // Update positions
        state.lists.forEach((l, index) => {
          l.position = index
        })
      }
    }),

    addCard: (card) => set((state) => {
      if (!state.cards[card.listId]) {
        state.cards[card.listId] = []
      }
      state.cards[card.listId].push(card)
    }),

    updateCard: (cardId, data) => set((state) => {
      for (const listId in state.cards) {
        const card = state.cards[listId].find((c) => c.id === cardId)
        if (card) {
          Object.assign(card, data)
          break
        }
      }
    }),

    deleteCard: (cardId) => set((state) => {
      for (const listId in state.cards) {
        state.cards[listId] = state.cards[listId].filter((c) => c.id !== cardId)
      }
    }),

    moveCard: (cardId, newListId, newPosition) => set((state) => {
      // Find and remove card from old list
      let card: Card | undefined
      for (const listId in state.cards) {
        const index = state.cards[listId].findIndex((c) => c.id === cardId)
        if (index !== -1) {
          ;[card] = state.cards[listId].splice(index, 1)
          break
        }
      }

      if (card) {
        // Add to new list
        card.listId = newListId
        card.position = newPosition
        
        if (!state.cards[newListId]) {
          state.cards[newListId] = []
        }
        state.cards[newListId].splice(newPosition, 0, card)

        // Update positions in new list
        state.cards[newListId].forEach((c, index) => {
          c.position = index
        })
      }
    }),

    fetchBoard: async (boardId) => {
      set({ isLoading: true, error: null })
      
      try {
        const response = await fetch(`/api/boards/${boardId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch board')
        }

        const data = await response.json()
        
        set({
          currentBoard: data.board,
          lists: data.lists,
          cards: data.cards.reduce((acc: any, card: Card) => {
            if (!acc[card.listId]) {
              acc[card.listId] = []
            }
            acc[card.listId].push(card)
            return acc
          }, {}),
          isLoading: false,
        })
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Unknown error',
          isLoading: false,
        })
      }
    },
  }))
)
```

---

#### **Task 7.2: Implement Socket.io for Real-time Updates**
**Complexity:** High  
**Agent:** Backend Agent  
**Time:** 8 hours

**Subtasks:**
1. Set up standalone Express server for Socket.io
2. Create `src/server/socket.ts`
3. Implement authentication for socket connections
4. Create rooms based on board IDs
5. Implement events for all CRUD operations
6. Add presence tracking (who's viewing the board)
7. Handle disconnections and reconnections
8. Create socket client in `src/lib/socket.ts`
9. Integrate with Zustand store
10. Test real-time updates
11. Write tests

**Acceptance Criteria:**
- Socket server runs separately
- Authentication works
- Real-time updates propagate
- Presence tracking works
- Reconnection is handled
- Tests pass

**Files Created:**
- `src/server/socket.ts`
- `src/server/index.ts`
- `src/lib/socket.ts`
- `src/hooks/useSocket.ts`
- `tests/integration/socket.test.ts`

**Code Example - Socket Server:**
```typescript
// src/server/socket.ts
import { Server as SocketServer } from 'socket.io'
import { Server as HTTPServer } from 'http'
import jwt from 'jsonwebtoken'

interface SocketUser {
  id: string
  name: string
  avatar?: string
}

interface AuthenticatedSocket extends Socket {
  user?: SocketUser
}

export function initializeSocket(httpServer: HTTPServer) {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      credentials: true,
    },
  })

  // Authentication middleware
  io.use(async (socket: any, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error('Authentication error'))
    }

    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as SocketUser
      socket.user = decoded
      next()
    } catch (err) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.user?.name}`)

    // Join board room
    socket.on('join-board', (boardId: string) => {
      socket.join(`board:${boardId}`)
      
      // Broadcast presence
      socket.to(`board:${boardId}`).emit('user-joined', {
        userId: socket.user?.id,
        userName: socket.user?.name,
        userAvatar: socket.user?.avatar,
      })

      console.log(`${socket.user?.name} joined board ${boardId}`)
    })

    // Leave board room
    socket.on('leave-board', (boardId: string) => {
      socket.leave(`board:${boardId}`)
      
      socket.to(`board:${boardId}`).emit('user-left', {
        userId: socket.user?.id,
      })
    })

    // List operations
    socket.on('list:create', (boardId: string, list: any) => {
      socket.to(`board:${boardId}`).emit('list:created', list)
    })

    socket.on('list:update', (boardId: string, listId: string, data: any) => {
      socket.to(`board:${boardId}`).emit('list:updated', { listId, data })
    })

    socket.on('list:delete', (boardId: string, listId: string) => {
      socket.to(`board:${boardId}`).emit('list:deleted', listId)
    })

    socket.on('list:reorder', (boardId: string, listId: string, newPosition: number) => {
      socket.to(`board:${boardId}`).emit('list:reordered', { listId, newPosition })
    })

    // Card operations
    socket.on('card:create', (boardId: string, card: any) => {
      socket.to(`board:${boardId}`).emit('card:created', card)
    })

    socket.on('card:update', (boardId: string, cardId: string, data: any) => {
      socket.to(`board:${boardId}`).emit('card:updated', { cardId, data })
    })

    socket.on('card:delete', (boardId: string, cardId: string) => {
      socket.to(`board:${boardId}`).emit('card:deleted', cardId)
    })

    socket.on('card:move', (boardId: string, cardId: string, newListId: string, newPosition: number) => {
      socket.to(`board:${boardId}`).emit('card:moved', { cardId, newListId, newPosition })
    })

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.name}`)
    })
  })

  return io
}
```

---

#### **Task 7.3: Integrate Real-time Updates with UI**
**Complexity:** High  
**Agent:** Frontend Agent  
**Time:** 6 hours

**Subtasks:**
1. Create `src/hooks/useRealtimeBoard.ts`
2. Connect socket events to Zustand store
3. Handle incoming updates
4. Implement presence indicators
5. Show "User X is typing" indicators
6. Handle conflicts gracefully
7. Test with multiple users
8. Write tests

**Acceptance Criteria:**
- Real-time updates reflect in UI
- Presence indicators work
- Conflicts are handled
- Performance is good
- Tests pass

**Files Created:**
- `src/hooks/useRealtimeBoard.ts`
- `src/components/boards/BoardPresence.tsx`
- `tests/unit/hooks/useRealtimeBoard.test.ts`

---

### Section 8: Search & Filtering (Week 9)

#### **Task 8.1: Implement Search API**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 4 hours

**Subtasks:**
1. Create `/api/search` endpoint
2. Implement full-text search across cards and boards
3. Add filters for members, labels, due dates
4. Implement sorting options
5. Add pagination
6. Optimize with database indexes
7. Create validation schemas
8. Write tests
9. Document endpoint

**Acceptance Criteria:**
- Search works across all user's boards
- Filters work correctly
- Results are paginated
- Performance is good
- Tests pass

**Files Created:**
- `src/app/api/search/route.ts`
- `src/lib/validations/search.ts`
- `tests/integration/api/search.test.ts`

---

#### **Task 8.2: Create Search UI**
**Complexity:** Medium  
**Agent:** Frontend Agent  
**Time:** 5 hours

**Subtasks:**
1. Create `src/components/search/SearchBar.tsx`
2. Create `src/components/search/SearchModal.tsx`
3. Create `src/components/search/SearchResults.tsx`
4. Create `src/components/search/SearchFilters.tsx`
5. Implement debounced search
6. Implement keyboard shortcuts (Cmd/Ctrl + K)
7. Show recent searches
8. Style components
9. Write tests

**Acceptance Criteria:**
- Search UI is intuitive
- Debouncing works
- Keyboard shortcuts work
- Recent searches saved
- Tests pass

**Files Created:**
- `src/components/search/SearchBar.tsx`
- `src/components/search/SearchModal.tsx`
- `src/components/search/SearchResults.tsx`
- `src/components/search/SearchFilters.tsx`
- `src/hooks/useSearch.ts`
- `tests/unit/components/search/SearchBar.test.tsx`

---

### Section 9: File Upload & Attachments (Week 9)

#### **Task 9.1: Set Up File Upload Service**
**Complexity:** Medium  
**Agent:** DevOps/Backend Agent  
**Time:** 4 hours

**Subtasks:**
1. Set up AWS S3 bucket or alternative (Cloudinary)
2. Configure environment variables
3. Create `src/lib/upload.ts` utility
4. Implement secure file upload with signed URLs
5. Add file type validation
6. Add file size limits (10MB)
7. Implement file deletion
8. Write tests

**Acceptance Criteria:**
- File upload service configured
- Files upload successfully
- Validation works
- Deletion works
- Tests pass

**Files Created:**
- `src/lib/upload.ts`
- `tests/unit/lib/upload.test.ts`

---

#### **Task 9.2: Create Attachment API Endpoints**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 3 hours

**Subtasks:**
1. Create `/api/cards/[id]/attachments` endpoints
2. Implement file upload endpoint
3. Implement attachment deletion
4. Store attachment metadata in database
5. Create validation schemas
6. Write tests
7. Document endpoints

**Acceptance Criteria:**
- Attachments can be uploaded
- Metadata stored correctly
- Deletion works
- Tests pass

**Files Created:**
- `src/app/api/cards/[id]/attachments/route.ts`
- `src/lib/validations/attachment.ts`
- `tests/integration/api/attachments.test.ts`

---

#### **Task 9.3: Create Attachment UI**
**Complexity:** Medium  
**Agent:** Frontend Agent  
**Time:** 4 hours

**Subtasks:**
1. Create `src/components/attachments/AttachmentList.tsx`
2. Create `src/components/attachments/AttachmentUpload.tsx`
3. Create `src/components/attachments/AttachmentPreview.tsx`
4. Implement drag-and-drop upload
5. Show upload progress
6. Handle different file types
7. Style components
8. Write tests

**Acceptance Criteria:**
- Attachments display correctly
- Drag-and-drop works
- Progress indicators work
- Different file types handled
- Tests pass

**Files Created:**
- `src/components/attachments/AttachmentList.tsx`
- `src/components/attachments/AttachmentUpload.tsx`
- `src/components/attachments/AttachmentPreview.tsx`
- `tests/unit/components/attachments/AttachmentList.test.tsx`

---

### Section 10: Comments & Activity Log (Week 10)

#### **Task 10.1: Create Comment API Endpoints**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 3 hours

**Subtasks:**
1. Create `/api/cards/[id]/comments` endpoints
2. Implement comment CRUD operations
3. Add markdown support for comments
4. Create validation schemas
5. Write tests
6. Document endpoints

**Acceptance Criteria:**
- Comments can be created, edited, deleted
- Markdown support works
- Tests pass

**Files Created:**
- `src/app/api/cards/[id]/comments/route.ts`
- `src/lib/validations/comment.ts`
- `tests/integration/api/comments.test.ts`

---

#### **Task 10.2: Create Activity Log System**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 4 hours

**Subtasks:**
1. Create Activity model in Prisma schema
2. Create activity logging utilities
3. Log all card operations (create, update, move, etc.)
4. Create `/api/cards/[id]/activity` endpoint
5. Implement activity aggregation
6. Write tests

**Acceptance Criteria:**
- Activities logged automatically
- Activity feed works
- Aggregation is efficient
- Tests pass

**Files Created:**
- `prisma/schema.prisma` (update)
- `src/lib/activity.ts`
- `src/app/api/cards/[id]/activity/route.ts`
- `tests/unit/lib/activity.test.ts`

---

#### **Task 10.3: Create Comment & Activity UI**
**Complexity:** High  
**Agent:** Frontend Agent  
**Time:** 6 hours

**Subtasks:**
1. Create `src/components/comments/CommentList.tsx`
2. Create `src/components/comments/CommentForm.tsx`
3. Create `src/components/comments/CommentItem.tsx`
4. Create `src/components/activity/ActivityLog.tsx`
5. Create `src/components/activity/ActivityItem.tsx`
6. Implement markdown editor for comments
7. Implement real-time comment updates
8. Show activity timeline
9. Style components
10. Write tests

**Acceptance Criteria:**
- Comments display correctly
- Markdown rendering works
- Real-time updates work
- Activity log shows all actions
- Tests pass

**Files Created:**
- Multiple component files (listed above)
- `tests/unit/components/comments/CommentList.test.tsx`
- `tests/unit/components/activity/ActivityLog.test.tsx`

---

### Section 11: Testing & Quality Assurance (Week 11)

#### **Task 11.1: Write Comprehensive Unit Tests**
**Complexity:** High  
**Agent:** QA/Full-Stack Agent  
**Time:** 10 hours

**Subtasks:**
1. Set up Jest and React Testing Library
2. Write tests for all utilities
3. Write tests for all hooks
4. Write tests for API utilities
5. Write tests for stores
6. Achieve 80%+ code coverage
7. Set up test coverage reporting

**Acceptance Criteria:**
- All utilities tested
- All hooks tested
- 80%+ coverage
- All tests pass
- Coverage reports generated

**Files Created:**
- `jest.config.js`
- `tests/setup.ts`
- Multiple test files throughout codebase

---

#### **Task 11.2: Write Integration Tests**
**Complexity:** High  
**Agent:** QA/Full-Stack Agent  
**Time:** 8 hours

**Subtasks:**
1. Set up test database
2. Write API integration tests for all endpoints
3. Test authentication flows
4. Test authorization rules
5. Test data relationships
6. Test error cases
7. Set up test scripts

**Acceptance Criteria:**
- All API endpoints tested
- Auth flows tested
- Error cases covered
- Tests can run in CI/CD
- All tests pass

**Files Created:**
- `tests/integration/setup.ts`
- Multiple integration test files

---

#### **Task 11.3: Write End-to-End Tests**
**Complexity:** High  
**Agent:** QA/Full-Stack Agent  
**Time:** 10 hours

**Subtasks:**
1. Set up Playwright or Cypress
2. Write E2E tests for authentication
3. Write E2E tests for board creation
4. Write E2E tests for card management
5. Write E2E tests for drag and drop
6. Write E2E tests for collaboration
7. Test on multiple browsers
8. Set up E2E test scripts

**Acceptance Criteria:**
- Critical user flows tested
- Tests run on Chrome, Firefox, Safari
- All tests pass consistently
- Tests can run in CI/CD

**Files Created:**
- `playwright.config.ts` or `cypress.config.ts`
- `tests/e2e/` (multiple test files)

---

### Section 12: Performance Optimization (Week 12)

#### **Task 12.1: Optimize Database Queries**
**Complexity:** Medium  
**Agent:** Backend Agent  
**Time:** 4 hours

**Subtasks:**
1. Analyze slow queries with Prisma
2. Add missing indexes
3. Optimize N+1 queries with includes
4. Implement query result caching with Redis (optional)
5. Add database connection pooling
6. Test performance improvements
7. Document optimizations

**Acceptance Criteria:**
- All queries under 100ms (P95)
- No N+1 queries
- Indexes properly set
- Performance metrics improved

**Files Modified:**
- `prisma/schema.prisma`
- Various API route files

---

#### **Task 12.2: Optimize Frontend Performance**
**Complexity:** Medium  
**Agent:** Frontend Agent  
**Time:** 5 hours

**Subtasks:**
1. Implement React.memo for expensive components
2. Optimize re-renders with useMemo and useCallback
3. Implement virtual scrolling for long lists
4. Add code splitting with dynamic imports
5. Optimize images with Next.js Image component
6. Implement lazy loading for modals
7. Run Lighthouse audits
8. Fix performance issues

**Acceptance Criteria:**
- Page load under 2 seconds
- No unnecessary re-renders
- Lighthouse score 90+
- Smooth 60fps animations

**Files Modified:**
- Multiple component files
- `next.config.js`

---

#### **Task 12.3: Implement Caching Strategy**
**Complexity:** Medium  
**Agent:** DevOps/Backend Agent  
**Time:** 4 hours

**Subtasks:**
1. Set up Redis (optional, or use in-memory cache)
2. Implement API response caching
3. Add cache invalidation logic
4. Cache static assets with CDN headers
5. Implement stale-while-revalidate pattern
6. Test cache behavior
7. Document caching strategy

**Acceptance Criteria:**
- Frequently accessed data cached
- Cache invalidation works
- Performance improved
- Documentation complete

**Files Created:**
- `src/lib/cache.ts`
- `src/middleware/cache.ts`

---

### Section 13: Deployment & DevOps (Week 12)

#### **Task 13.1: Set Up CI/CD Pipeline**
**Complexity:** Medium  
**Agent:** DevOps Agent  
**Time:** 4 hours

**Subtasks:**
1. Create `.github/workflows/ci.yml`
2. Set up test automation
3. Set up linting and type checking
4. Add build verification
5. Set up automated deployment to Vercel
6. Configure environment variables
7. Test pipeline

**Acceptance Criteria:**
- CI runs on all PRs
- Tests must pass before merge
- Automatic deployment to preview
- Production deployment on merge to main

**Files Created:**
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

**Code Example - CI Pipeline:**
```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop, main]

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run TypeScript type check
        run: npm run type-check

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: trello_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Prisma migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/trello_test
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/trello_test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
```

---

#### **Task 13.2: Deploy to Production**
**Complexity:** Medium  
**Agent:** DevOps Agent  
**Time:** 3 hours

**Subtasks:**
1. Create Vercel project
2. Configure environment variables in Vercel
3. Set up production database
4. Run production migrations
5. Configure custom domain (if available)
6. Set up monitoring and alerts
7. Test production deployment
8. Create deployment documentation

**Acceptance Criteria:**
- Application deployed to production
- Database configured and seeded
- Environment variables set
- Domain configured (if applicable)
- Monitoring active
- Documentation complete

**Files Created:**
- `vercel.json`
- `docs/DEPLOYMENT.md`

---

#### **Task 13.3: Set Up Monitoring & Logging**
**Complexity:** Medium  
**Agent:** DevOps Agent  
**Time:** 3 hours

**Subtasks:**
1. Set up Sentry for error tracking
2. Configure logging with Winston or Pino
3. Set up performance monitoring
4. Create custom metrics dashboard
5. Set up alerts for critical errors
6. Test monitoring
7. Document monitoring setup

**Acceptance Criteria:**
- Errors tracked in Sentry
- Logs are structured and searchable
- Performance metrics visible
- Alerts configured
- Documentation complete

**Files Created:**
- `src/lib/logger.ts`
- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `docs/MONITORING.md`

---

## 6. Agent Role Definitions

### Agent 1: Project Manager (PM)

**Primary Responsibilities:**
- Project coordination and planning
- Code review and PR management
- Documentation maintenance
- Progress tracking
- Blockers resolution
- Quality assurance oversight

**Required Skills:**
1. Strong understanding of software development lifecycle
2. Git workflow management
3. Code review best practices
4. Technical writing
5. Task prioritization
6. Communication skills

**Tools:**
- Git/GitHub
- GitHub Projects
- Markdown
- Development tools for testing

**Daily Tasks:**
1. Review and merge PRs from other agents
2. Update project board and task statuses
3. Conduct code reviews for quality and standards
4. Update documentation
5. Coordinate between agents on dependencies
6. Run integration tests
7. Address blockers and conflicts

**Week 1 Focus:**
- Repository setup
- Project structure creation
- Initial documentation
- Team coordination setup

---

### Agent 2: Backend Specialist

**Primary Responsibilities:**
- Database schema design and implementation
- API endpoint development
- Authentication and authorization
- Real-time features with Socket.io
- Performance optimization
- Backend testing

**Required Skills:**
1. Node.js and TypeScript expertise
2. Prisma ORM proficiency
3. RESTful API design
4. JWT authentication
5. WebSocket/Socket.io
6. PostgreSQL knowledge
7. API security best practices
8. Backend testing (Jest)

**Tools:**
- Prisma Studio
- Postman/Insomnia for API testing
- PostgreSQL client
- Git

**Daily Tasks:**
1. Implement database models and migrations
2. Create and test API endpoints
3. Write API documentation
4. Implement authentication flows
5. Write unit and integration tests
6. Optimize database queries
7. Handle security concerns

**Week 1 Focus:**
- Database schema design
- Prisma setup
- User and Workspace models
- Authentication system setup

---

### Agent 3: Frontend Specialist

**Primary Responsibilities:**
- UI component development
- State management with Zustand
- Drag-and-drop implementation
- Real-time UI updates
- Responsive design
- Frontend testing

**Required Skills:**
1. React 18+ and Next.js expertise
2. TypeScript proficiency
3. Tailwind CSS mastery
4. Zustand state management
5. @dnd-kit drag-and-drop
6. React Hook Form
7. Component testing (React Testing Library)
8. Responsive design principles

**Tools:**
- React DevTools
- Browser DevTools
- Figma (for design reference)
- Git

**Daily Tasks:**
1. Build React components
2. Implement UI features
3. Connect components to state
4. Implement drag-and-drop
5. Style with Tailwind CSS
6. Write component tests
7. Ensure responsive design
8. Optimize performance

**Week 1 Focus:**
- Basic layout components
- Navigation setup
- Authentication UI
- Workspace and Board components

---

### Agent 4: DevOps/Full-Stack Specialist

**Primary Responsibilities:**
- Development environment setup
- CI/CD pipeline
- Deployment
- Performance monitoring
- File upload configuration
- Testing infrastructure
- Full-stack features (as needed)

**Required Skills:**
1. Docker and Docker Compose
2. CI/CD (GitHub Actions)
3. Cloud platforms (Vercel, AWS)
4. Database administration
5. Monitoring tools (Sentry)
6. Both frontend and backend skills
7. End-to-end testing (Playwright/Cypress)
8. Performance optimization

**Tools:**
- Docker
- GitHub Actions
- Vercel CLI
- AWS CLI (if using S3)
- Database tools
- Monitoring dashboards
- Git

**Daily Tasks:**
1. Maintain development environment
2. Update CI/CD pipelines
3. Monitor deployments
4. Configure cloud services
5. Assist with complex features
6. Run E2E tests
7. Performance optimization
8. Infrastructure documentation

**Week 1 Focus:**
- Docker setup
- Database configuration
- Development environment documentation
- CI/CD pipeline setup

---

## 7. Testing Strategy

### Unit Testing
- **Framework:** Jest + React Testing Library
- **Coverage Target:** 80%+
- **Focus Areas:**
  - Utility functions
  - React hooks
  - Store actions and selectors
  - Component logic

### Integration Testing
- **Framework:** Jest + Supertest
- **Focus Areas:**
  - API endpoints
  - Database operations
  - Authentication flows
  - Authorization rules

### End-to-End Testing
- **Framework:** Playwright (recommended) or Cypress
- **Focus Areas:**
  - User authentication
  - Board and card management
  - Drag and drop
  - Real-time collaboration
  - Critical user journeys

### Testing Commands
```bash
npm run test:unit          # Run unit tests
npm run test:integration   # Run integration tests
npm run test:e2e          # Run E2E tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
```

---

## 8. Deployment Plan

### Development Environment
- Local development with Docker
- Next.js dev server on port 3000
- PostgreSQL on port 5432
- Socket.io server on port 3001 (when implemented)

### Preview Environment (Vercel)
- Automatic deployment on PR to `develop`
- Preview URL for testing
- Uses preview database

### Production Environment (Vercel)
- Deployment on merge to `main`
- Production database
- Custom domain (optional)
- CDN enabled
- Monitoring active

### Environment Variables
```bash
# .env.production
DATABASE_URL=<production-postgres-url>
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=<secure-production-secret>
GOOGLE_CLIENT_ID=<production-google-client-id>
GOOGLE_CLIENT_SECRET=<production-google-client-secret>
AWS_ACCESS_KEY_ID=<aws-key>
AWS_SECRET_ACCESS_KEY=<aws-secret>
AWS_REGION=us-east-1
AWS_BUCKET_NAME=trello-clone-uploads
SENTRY_DSN=<sentry-dsn>
```

---

## Appendix A: Development Best Practices

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Meaningful variable names
- Write self-documenting code
- Add comments for complex logic

### Git Practices
- Write descriptive commit messages
- Keep commits focused and atomic
- Create feature branches
- Request reviews before merging
- Keep PRs small and focused
- Link PRs to issues

### Component Structure
```tsx
// Good component structure
import { useState } from 'react'
import type { ComponentProps } from '@/types'

interface MyComponentProps {
  // Props with JSDoc comments
  /** The title to display */
  title: string
  /** Click handler */
  onClick: () => void
}

/**
 * MyComponent - Brief description
 * 
 * Detailed description of what this component does
 */
export default function MyComponent({ title, onClick }: MyComponentProps) {
  // Hooks at the top
  const [state, setState] = useState(false)

  // Event handlers
  const handleClick = () => {
    // Logic
    onClick()
  }

  // Early returns
  if (!title) return null

  // Render
  return (
    <div className="...">
      <h2>{title}</h2>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}
```

### API Route Structure
```typescript
// Good API route structure
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// Validation schema
const schema = z.object({
  field: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Validation
    const body = await req.json()
    const data = schema.parse(body)

    // 3. Authorization (if needed)
    // Check if user has permission

    // 4. Business logic
    const result = await prisma.model.create({ data })

    // 5. Response
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    // Error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Appendix B: Troubleshooting Guide

### Common Issues and Solutions

**Issue: Prisma Client not found**
```bash
# Solution
npx prisma generate
```

**Issue: Database connection error**
```bash
# Check if PostgreSQL is running
docker ps

# Restart Docker services
docker-compose down
docker-compose up -d

# Check environment variables
cat .env.local
```

**Issue: Next.js build errors**
```bash
# Clear cache
rm -rf .next
npm run build
```

**Issue: Type errors after schema change**
```bash
# Regenerate Prisma types
npx prisma generate

# Restart TypeScript server in IDE
```

**Issue: Tests failing**
```bash
# Ensure test database is running
docker-compose up -d

# Reset test database
npx prisma migrate reset --force

# Run tests
npm test
```

---

## Appendix C: Resources and Documentation

### Official Documentation
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://docs.pmnd.rs/zustand)
- [@dnd-kit](https://docs.dndkit.com)
- [NextAuth.js](https://next-auth.js.org)
- [Socket.io](https://socket.io/docs)

### Tutorials and Guides
- Next.js App Router Tutorial
- Prisma Getting Started
- dnd-kit Examples
- TypeScript Handbook

### Tools
- [Prisma Studio](https://www.prisma.io/studio)
- [Postman](https://www.postman.com)
- [Vercel](https://vercel.com)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## Summary

This comprehensive plan breaks down the Trello clone development into:
- **13 major sections** covering all aspects of the MVP
- **100+ detailed tasks** with clear acceptance criteria
- **4 specialized AI agent roles** with specific responsibilities
- **Complete technology stack** with expert reasoning
- **Testing strategy** covering all layers
- **Deployment plan** for production

**Estimated Timeline:** 12 weeks for complete MVP

**Next Steps:**
1. Review this plan with all agents
2. Set up development environment (Section 0)
3. Begin with database schema (Section 1)
4. Follow sections sequentially
5. Daily standups to coordinate
6. Weekly reviews to assess progress

**Success Metrics:**
- All tasks completed with tests passing
- Code coverage >80%
- Performance targets met
- Deployed to production
- Documentation complete

Good luck with the build! 🚀
