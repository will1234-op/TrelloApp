# Trello Clone - Complete Implementation Guide
## Fill-in-the-Gaps: Everything You Need to Build

This guide provides **complete, working code** for all the complex parts of your Trello clone. Use this alongside the Development Plan for a complete build guide.

---

## Table of Contents
1. [Complete Project Setup](#1-complete-project-setup)
2. [Complete Prisma Schema](#2-complete-prisma-schema)
3. [Complete Type Definitions](#3-complete-type-definitions)
4. [Configuration Files](#4-configuration-files)
5. [Drag and Drop Implementation](#5-drag-and-drop-complete-implementation)
6. [Real-time Implementation](#6-real-time-implementation-complete)
7. [Testing Examples](#7-testing-examples)
8. [Complete API Route Examples](#8-complete-api-route-examples)
9. [Complete Component Implementations](#9-complete-component-implementations)
10. [Utilities and Helpers](#10-utilities-and-helpers)

---

## 1. Complete Project Setup

### Step 1: Initialize Project (Run these exact commands)

```bash
# Create project directory
mkdir trello-clone
cd trello-clone

# Initialize Next.js with all options
npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir

# When prompted, choose:
# - TypeScript: Yes
# - ESLint: Yes
# - Tailwind CSS: Yes
# - `src/` directory: Yes
# - App Router: Yes
# - Customize default import alias: No

# Install all dependencies
npm install zustand@4.4.7
npm install @dnd-kit/core@6.1.0 @dnd-kit/sortable@8.0.0 @dnd-kit/utilities@3.2.2
npm install prisma@5.7.1 @prisma/client@5.7.1
npm install zod@3.22.4 react-hook-form@7.49.2 @hookform/resolvers@3.3.3
npm install bcryptjs@2.4.3 jsonwebtoken@9.0.2
npm install next-auth@4.24.5
npm install socket.io@4.6.0 socket.io-client@4.6.0
npm install date-fns@3.0.6
npm install react-markdown@9.0.1

# Install dev dependencies
npm install -D @types/bcryptjs@2.4.6
npm install -D @types/jsonwebtoken@9.0.5
npm install -D jest@29.7.0 @testing-library/react@14.1.2 @testing-library/jest-dom@6.1.5
npm install -D @types/jest@29.5.11
npm install -D prettier@3.1.1 eslint-config-prettier@9.1.0

# Initialize Prisma
npx prisma init

# Create .env.local file
cat > .env.local << 'EOF'
DATABASE_URL="postgresql://trello_user:trello_password@localhost:5432/trello_clone"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: trello_postgres
    environment:
      POSTGRES_DB: trello_clone
      POSTGRES_USER: trello_user
      POSTGRES_PASSWORD: trello_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U trello_user -d trello_clone"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
EOF

# Start Docker
docker-compose up -d

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 5
```

---

## 2. Complete Prisma Schema

Replace everything in `prisma/schema.prisma` with this **complete schema**:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Enums
enum WorkspaceRole {
  ADMIN
  MEMBER
  VIEWER
}

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

// User Model
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  emailVerified DateTime?
  password      String?  // Null for OAuth users
  name          String?
  avatar        String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  workspaceMembers WorkspaceMember[]
  boardMembers     BoardMember[]
  cardMembers      CardMember[]
  comments         Comment[]
  activities       Activity[]
  ownedWorkspaces  Workspace[]       @relation("WorkspaceOwner")

  // OAuth
  accounts Account[]
  sessions Session[]

  @@index([email])
  @@map("users")
}

// NextAuth Models
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

// Workspace Model
model Workspace {
  id          String   @id @default(cuid())
  name        String
  description String?
  ownerId     String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  owner   User              @relation("WorkspaceOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  members WorkspaceMember[]
  boards  Board[]

  @@index([ownerId])
  @@map("workspaces")
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
  @@map("workspace_members")
}

// Board Model
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
  labels    Label[]

  @@index([workspaceId])
  @@index([starred])
  @@map("boards")
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
  @@map("board_members")
}

// List Model
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
  @@index([boardId, archived])
  @@map("lists")
}

// Card Model
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
  activities  Activity[]

  @@index([listId])
  @@index([listId, position])
  @@index([dueDate])
  @@index([archived])
  @@map("cards")
}

model CardMember {
  id         String   @id @default(cuid())
  cardId     String
  userId     String
  assignedAt DateTime @default(now())

  // Relations
  card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([cardId, userId])
  @@index([cardId])
  @@index([userId])
  @@map("card_members")
}

// Label Model
model Label {
  id        String   @id @default(cuid())
  name      String
  color     String   // Hex color code
  boardId   String
  createdAt DateTime @default(now())

  // Relations
  board Board       @relation(fields: [boardId], references: [id], onDelete: Cascade)
  cards CardLabel[]

  @@index([boardId])
  @@map("labels")
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
  @@map("card_labels")
}

// Checklist Model
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
  @@index([cardId, position])
  @@map("checklists")
}

model ChecklistItem {
  id          String   @id @default(cuid())
  text        String
  checklistId String
  completed   Boolean  @default(false)
  position    Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  checklist Checklist @relation(fields: [checklistId], references: [id], onDelete: Cascade)

  @@index([checklistId])
  @@index([checklistId, position])
  @@map("checklist_items")
}

// Attachment Model
model Attachment {
  id         String   @id @default(cuid())
  name       String
  url        String
  mimeType   String?
  size       Int?     // File size in bytes
  cardId     String
  uploadedBy String
  createdAt  DateTime @default(now())

  // Relations
  card Card @relation(fields: [cardId], references: [id], onDelete: Cascade)

  @@index([cardId])
  @@map("attachments")
}

// Comment Model
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
  @@index([cardId, createdAt])
  @@map("comments")
}

// Activity Model for audit log
model Activity {
  id        String   @id @default(cuid())
  action    String   // 'created', 'updated', 'moved', 'archived', etc.
  entityType String  // 'card', 'list', 'board'
  entityId  String
  cardId    String?  // Optional reference to card for filtering
  userId    String
  metadata  Json?    // Store additional context
  createdAt DateTime @default(now())

  // Relations
  user User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  card Card? @relation(fields: [cardId], references: [id], onDelete: Cascade)

  @@index([cardId])
  @@index([userId])
  @@index([createdAt])
  @@index([entityType, entityId])
  @@map("activities")
}
```

### Create Migration

```bash
# Create and run migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

---

## 3. Complete Type Definitions

Create these type definition files:

### `src/types/index.ts`

```typescript
// src/types/index.ts
import { Prisma } from '@prisma/client'

// User Types
export type User = {
  id: string
  email: string
  name: string | null
  avatar: string | null
  createdAt: Date
  updatedAt: Date
}

export type SafeUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

// Workspace Types
export type Workspace = {
  id: string
  name: string
  description: string | null
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

export type WorkspaceWithMembers = Workspace & {
  members: WorkspaceMemberWithUser[]
  boards: Board[]
  _count: {
    members: number
    boards: number
  }
}

export type WorkspaceMemberWithUser = {
  id: string
  role: string
  joinedAt: Date
  user: User
}

// Board Types
export type Board = {
  id: string
  title: string
  workspaceId: string
  background: string | null
  visibility: string
  starred: boolean
  createdAt: Date
  updatedAt: Date
}

export type BoardWithLists = Board & {
  lists: ListWithCards[]
  members: BoardMemberWithUser[]
  labels: Label[]
}

export type BoardMemberWithUser = {
  id: string
  role: string
  joinedAt: Date
  user: User
}

// List Types
export type List = {
  id: string
  title: string
  boardId: string
  position: number
  archived: boolean
  createdAt: Date
  updatedAt: Date
}

export type ListWithCards = List & {
  cards: Card[]
  _count: {
    cards: number
  }
}

// Card Types
export type Card = {
  id: string
  title: string
  description: string | null
  listId: string
  position: number
  dueDate: Date | null
  cover: string | null
  archived: boolean
  createdAt: Date
  updatedAt: Date
}

export type CardWithDetails = Card & {
  members: CardMemberWithUser[]
  labels: CardLabelWithLabel[]
  checklists: ChecklistWithItems[]
  attachments: Attachment[]
  comments: CommentWithUser[]
  _count: {
    members: number
    labels: number
    checklists: number
    attachments: number
    comments: number
  }
}

export type CardMemberWithUser = {
  id: string
  assignedAt: Date
  user: User
}

// Label Types
export type Label = {
  id: string
  name: string
  color: string
  boardId: string
  createdAt: Date
}

export type CardLabelWithLabel = {
  id: string
  label: Label
}

// Checklist Types
export type Checklist = {
  id: string
  title: string
  cardId: string
  position: number
  createdAt: Date
}

export type ChecklistWithItems = Checklist & {
  items: ChecklistItem[]
  _count: {
    items: number
  }
}

export type ChecklistItem = {
  id: string
  text: string
  checklistId: string
  completed: boolean
  position: number
  createdAt: Date
  updatedAt: Date
}

// Attachment Types
export type Attachment = {
  id: string
  name: string
  url: string
  mimeType: string | null
  size: number | null
  cardId: string
  uploadedBy: string
  createdAt: Date
}

// Comment Types
export type Comment = {
  id: string
  text: string
  cardId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export type CommentWithUser = Comment & {
  user: User
}

// Activity Types
export type Activity = {
  id: string
  action: string
  entityType: string
  entityId: string
  cardId: string | null
  userId: string
  metadata: Prisma.JsonValue | null
  createdAt: Date
}

export type ActivityWithUser = Activity & {
  user: User
}

// API Response Types
export type ApiResponse<T = any> = {
  data?: T
  error?: string
  message?: string
}

export type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalItems: number
  }
}

// Form Types
export type LoginInput = {
  email: string
  password: string
}

export type RegisterInput = {
  email: string
  password: string
  name: string
}

export type CreateWorkspaceInput = {
  name: string
  description?: string
}

export type CreateBoardInput = {
  title: string
  workspaceId: string
  background?: string
  visibility?: 'PUBLIC' | 'PRIVATE' | 'WORKSPACE'
}

export type CreateListInput = {
  title: string
  boardId: string
  position?: number
}

export type CreateCardInput = {
  title: string
  listId: string
  position?: number
  description?: string
  dueDate?: Date
}

export type UpdateCardInput = Partial<{
  title: string
  description: string | null
  dueDate: Date | null
  cover: string | null
  archived: boolean
}>

export type MoveCardInput = {
  sourceListId: string
  destinationListId: string
  sourcePosition: number
  destinationPosition: number
}

// Drag and Drop Types
export type DragItem = {
  id: string
  type: 'card' | 'list'
  data: Card | List
}

export type DropResult = {
  source: {
    droppableId: string
    index: number
  }
  destination: {
    droppableId: string
    index: number
  } | null
}
```

---

## 4. Configuration Files

### `next.config.js`

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `tailwind.config.js`

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        trello: {
          blue: '#0079BF',
          'blue-dark': '#026AA7',
          green: '#61BD4F',
          yellow: '#F2D600',
          orange: '#FF9F1A',
          red: '#EB5A46',
          purple: '#C377E0',
          pink: '#FF78CB',
          sky: '#00C2E0',
          lime: '#51E898',
        },
      },
    },
  },
  plugins: [],
}
```

### `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always"
}
```

### `.eslintrc.json`

```json
{
  "extends": ["next/core-web-vitals", "prettier"],
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-html-link-for-pages": "off"
  }
}
```

### `src/lib/db.ts` - Prisma Client Singleton

```typescript
// src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

---

## 5. Drag and Drop Complete Implementation

This is a **complete, working implementation** of drag and drop for the Trello clone.

### `src/hooks/useDragAndDrop.ts`

```typescript
// src/hooks/useDragAndDrop.ts
import { useState, useCallback } from 'react'
import { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import type { Card, List } from '@/types'

interface UseDragAndDropProps {
  lists: List[]
  onListReorder: (listId: string, newPosition: number) => Promise<void>
  onCardMove: (cardId: string, sourceListId: string, destListId: string, newPosition: number) => Promise<void>
}

export function useDragAndDrop({ lists, onListReorder, onCardMove }: UseDragAndDropProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event
    setOverId(over ? (over.id as string) : null)
  }, [])

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event

      if (!over || active.id === over.id) {
        setActiveId(null)
        setOverId(null)
        return
      }

      const activeData = active.data.current
      const overData = over.data.current

      // Handle List Reordering
      if (activeData?.type === 'list' && overData?.type === 'list') {
        const oldIndex = lists.findIndex((list) => list.id === active.id)
        const newIndex = lists.findIndex((list) => list.id === over.id)

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          await onListReorder(active.id as string, newIndex)
        }
      }

      // Handle Card Moving
      if (activeData?.type === 'card') {
        const sourceListId = activeData.card.listId
        let destListId: string
        let newPosition: number

        // Dropped on a list
        if (overData?.type === 'list') {
          destListId = over.id as string
          const destList = lists.find((l) => l.id === destListId)
          newPosition = destList?.cards?.length || 0
        }
        // Dropped on a card
        else if (overData?.type === 'card') {
          destListId = overData.card.listId
          const destList = lists.find((l) => l.id === destListId)
          const overCardIndex = destList?.cards?.findIndex((c) => c.id === over.id) || 0
          newPosition = overCardIndex
        } else {
          setActiveId(null)
          setOverId(null)
          return
        }

        // Only move if actually changing position or list
        const activeCard = activeData.card
        if (
          sourceListId !== destListId ||
          activeCard.position !== newPosition
        ) {
          await onCardMove(active.id as string, sourceListId, destListId, newPosition)
        }
      }

      setActiveId(null)
      setOverId(null)
    },
    [lists, onListReorder, onCardMove]
  )

  const handleDragCancel = useCallback(() => {
    setActiveId(null)
    setOverId(null)
  }, [])

  return {
    activeId,
    overId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  }
}
```

### `src/components/boards/BoardDnDContext.tsx`

```typescript
// src/components/boards/BoardDnDContext.tsx
'use client'

import { ReactNode } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from '@dnd-kit/core'
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { useDragAndDrop } from '@/hooks/useDragAndDrop'
import List from '@/components/lists/List'
import Card from '@/components/cards/Card'
import type { ListWithCards } from '@/types'

interface BoardDnDContextProps {
  lists: ListWithCards[]
  children: ReactNode
  onListReorder: (listId: string, newPosition: number) => Promise<void>
  onCardMove: (cardId: string, sourceListId: string, destListId: string, newPosition: number) => Promise<void>
}

export default function BoardDnDContext({
  lists,
  children,
  onListReorder,
  onCardMove,
}: BoardDnDContextProps) {
  const {
    activeId,
    overId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
  } = useDragAndDrop({
    lists,
    onListReorder,
    onCardMove,
  })

  // Configure sensors for different input methods
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Find the active item being dragged
  const activeList = lists.find((list) => list.id === activeId)
  const activeCard = lists
    .flatMap((list) => list.cards)
    .find((card) => card.id === activeId)

  // Measuring configuration for better performance
  const measuring = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={lists.map((l) => l.id)} strategy={horizontalListSortingStrategy}>
        {children}
      </SortableContext>

      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeId && activeList && (
          <div className="opacity-50 rotate-3">
            <List list={activeList} isDragging />
          </div>
        )}
        {activeId && activeCard && !activeList && (
          <div className="opacity-90 rotate-2 cursor-grabbing">
            <Card card={activeCard} isDragging />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  )
}
```

### `src/components/lists/List.tsx` - Sortable List

```typescript
// src/components/lists/List.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import ListHeader from './ListHeader'
import Card from '../cards/Card'
import CreateCardButton from '../cards/CreateCardButton'
import type { ListWithCards } from '@/types'

interface ListProps {
  list: ListWithCards
  isDragging?: boolean
}

export default function List({ list, isDragging = false }: ListProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: list.id,
    data: {
      type: 'list',
      list,
    },
    disabled: isDragging,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.3 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-100 rounded-lg w-72 flex-shrink-0 flex flex-col max-h-full"
    >
      <ListHeader
        list={list}
        dragHandleProps={{ ...attributes, ...listeners }}
      />

      <SortableContext items={list.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-2">
          {list.cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>

      <div className="p-2">
        <CreateCardButton listId={list.id} />
      </div>
    </div>
  )
}
```

### `src/components/cards/Card.tsx` - Sortable Card

```typescript
// src/components/cards/Card.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Calendar, Paperclip, MessageSquare, CheckSquare } from 'lucide-react'
import { format } from 'date-fns'
import type { Card as CardType } from '@/types'

interface CardProps {
  card: CardType
  isDragging?: boolean
  onClick?: () => void
}

export default function Card({ card, isDragging = false, onClick }: CardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
    disabled: isDragging,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 border border-gray-200 group"
    >
      {card.cover && (
        <img
          src={card.cover}
          alt={card.title}
          className="w-full h-32 object-cover rounded mb-2"
        />
      )}

      <h3 className="text-sm font-medium text-gray-900 mb-2">{card.title}</h3>

      {/* Card Badges */}
      <div className="flex items-center gap-2 text-xs text-gray-600">
        {card.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{format(new Date(card.dueDate), 'MMM d')}</span>
          </div>
        )}

        {card._count?.checklists > 0 && (
          <div className="flex items-center gap-1">
            <CheckSquare className="w-3 h-3" />
            <span>{card._count.checklists}</span>
          </div>
        )}

        {card._count?.comments > 0 && (
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            <span>{card._count.comments}</span>
          </div>
        )}

        {card._count?.attachments > 0 && (
          <div className="flex items-center gap-1">
            <Paperclip className="w-3 h-3" />
            <span>{card._count.attachments}</span>
          </div>
        )}
      </div>

      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {card.labels.map((labelRel) => (
            <span
              key={labelRel.id}
              className="px-2 py-1 rounded text-xs font-medium"
              style={{
                backgroundColor: labelRel.label.color,
                color: '#fff',
              }}
            >
              {labelRel.label.name}
            </span>
          ))}
        </div>
      )}

      {/* Members */}
      {card.members && card.members.length > 0 && (
        <div className="flex -space-x-2 mt-2">
          {card.members.slice(0, 3).map((member) => (
            <div
              key={member.id}
              className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center border-2 border-white"
              title={member.user.name || member.user.email}
            >
              {member.user.name?.[0] || member.user.email[0]}
            </div>
          ))}
          {card.members.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-700 text-xs flex items-center justify-center border-2 border-white">
              +{card.members.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

---

## 6. Real-time Implementation Complete

### Express Server with Socket.io

Create `src/server/index.ts`:

```typescript
// src/server/index.ts
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server as SocketIOServer } from 'socket.io'
import { initializeSocket } from './socket'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.io
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      credentials: true,
    },
  })

  initializeSocket(io)

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
    console.log(`> Socket.io server running`)
  })
})
```

### `src/server/socket.ts` - Complete Socket.io Handler

```typescript
// src/server/socket.ts
import { Server as SocketIOServer, Socket } from 'socket.io'
import { verify } from 'jsonwebtoken'

interface SocketUser {
  id: string
  email: string
  name: string | null
}

interface AuthenticatedSocket extends Socket {
  user?: SocketUser
}

export function initializeSocket(io: SocketIOServer) {
  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token

      if (!token) {
        return next(new Error('Authentication required'))
      }

      const decoded = verify(token, process.env.NEXTAUTH_SECRET!) as SocketUser
      socket.user = decoded
      next()
    } catch (error) {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.user?.email} (${socket.id})`)

    // Join board room
    socket.on('board:join', (boardId: string) => {
      socket.join(`board:${boardId}`)
      console.log(`${socket.user?.email} joined board ${boardId}`)

      // Broadcast user presence
      socket.to(`board:${boardId}`).emit('board:user-joined', {
        userId: socket.user?.id,
        userName: socket.user?.name,
        socketId: socket.id,
      })

      // Send current active users in the room
      io.in(`board:${boardId}`).fetchSockets().then((sockets) => {
        const activeUsers = sockets
          .filter((s) => s.id !== socket.id)
          .map((s) => ({
            userId: (s as any).user?.id,
            userName: (s as any).user?.name,
            socketId: s.id,
          }))

        socket.emit('board:active-users', activeUsers)
      })
    })

    // Leave board room
    socket.on('board:leave', (boardId: string) => {
      socket.leave(`board:${boardId}`)
      socket.to(`board:${boardId}`).emit('board:user-left', {
        userId: socket.user?.id,
        socketId: socket.id,
      })
    })

    // List events
    socket.on('list:created', (boardId: string, list: any) => {
      socket.to(`board:${boardId}`).emit('list:created', list)
    })

    socket.on('list:updated', (boardId: string, listId: string, data: any) => {
      socket.to(`board:${boardId}`).emit('list:updated', { listId, data })
    })

    socket.on('list:deleted', (boardId: string, listId: string) => {
      socket.to(`board:${boardId}`).emit('list:deleted', listId)
    })

    socket.on('list:reordered', (boardId: string, listId: string, newPosition: number) => {
      socket.to(`board:${boardId}`).emit('list:reordered', { listId, newPosition })
    })

    // Card events
    socket.on('card:created', (boardId: string, card: any) => {
      socket.to(`board:${boardId}`).emit('card:created', card)
    })

    socket.on('card:updated', (boardId: string, cardId: string, data: any) => {
      socket.to(`board:${boardId}`).emit('card:updated', { cardId, data })
    })

    socket.on('card:deleted', (boardId: string, cardId: string) => {
      socket.to(`board:${boardId}`).emit('card:deleted', cardId)
    })

    socket.on('card:moved', (boardId: string, data: {
      cardId: string
      sourceListId: string
      destListId: string
      newPosition: number
    }) => {
      socket.to(`board:${boardId}`).emit('card:moved', data)
    })

    // Card typing indicator
    socket.on('card:typing', (boardId: string, cardId: string, isTyping: boolean) => {
      socket.to(`board:${boardId}`).emit('card:typing', {
        cardId,
        userId: socket.user?.id,
        userName: socket.user?.name,
        isTyping,
      })
    })

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user?.email}`)

      // Notify all boards the user was in
      socket.rooms.forEach((room) => {
        if (room.startsWith('board:')) {
          socket.to(room).emit('board:user-left', {
            userId: socket.user?.id,
            socketId: socket.id,
          })
        }
      })
    })
  })

  return io
}
```

### `src/lib/socket-client.ts` - Client-side Socket

```typescript
// src/lib/socket-client.ts
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(token: string): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      auth: {
        token,
      },
      autoConnect: true,
    })

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id)
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message)
    })
  }

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
```

### `src/hooks/useRealtimeBoard.ts` - React Hook for Real-time

```typescript
// src/hooks/useRealtimeBoard.ts
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getSocket } from '@/lib/socket-client'
import { useBoardStore } from '@/store/boardStore'
import type { Card, List } from '@/types'

export function useRealtimeBoard(boardId: string) {
  const { data: session } = useSession()
  const { addList, updateList, deleteList, addCard, updateCard, deleteCard, moveCard } = useBoardStore()

  useEffect(() => {
    if (!session?.user || !boardId) return

    const token = (session as any).token
    const socket = getSocket(token)

    // Join board room
    socket.emit('board:join', boardId)

    // List events
    socket.on('list:created', (list: List) => {
      addList(list)
    })

    socket.on('list:updated', ({ listId, data }: { listId: string; data: Partial<List> }) => {
      updateList(listId, data)
    })

    socket.on('list:deleted', (listId: string) => {
      deleteList(listId)
    })

    // Card events
    socket.on('card:created', (card: Card) => {
      addCard(card)
    })

    socket.on('card:updated', ({ cardId, data }: { cardId: string; data: Partial<Card> }) => {
      updateCard(cardId, data)
    })

    socket.on('card:deleted', (cardId: string) => {
      deleteCard(cardId)
    })

    socket.on('card:moved', (data: {
      cardId: string
      sourceListId: string
      destListId: string
      newPosition: number
    }) => {
      moveCard(data.cardId, data.destListId, data.newPosition)
    })

    // Cleanup
    return () => {
      socket.emit('board:leave', boardId)
      socket.off('list:created')
      socket.off('list:updated')
      socket.off('list:deleted')
      socket.off('card:created')
      socket.off('card:updated')
      socket.off('card:deleted')
      socket.off('card:moved')
    }
  }, [boardId, session, addList, updateList, deleteList, addCard, updateCard, deleteCard, moveCard])
}
```

---

**Continue in next message due to length...**

Would you like me to continue with sections 7-10 (Testing Examples, Complete API Routes, Component Implementations, and Utilities)?