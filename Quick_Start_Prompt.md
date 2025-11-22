# Quick Start Prompt for Claude Code

Copy and paste this directly into Claude Code:

---

Hi! I need you to build a Trello clone web application. I have complete documentation with all the code examples and instructions.

**Tech Stack:**
- Next.js 14+ with TypeScript and Tailwind CSS
- PostgreSQL + Prisma ORM
- Zustand for state management
- @dnd-kit for drag and drop
- NextAuth for authentication
- Socket.io for real-time updates

**Project Documents Available:**
I've created complete guides in your downloads folder. They contain:
1. `Getting_Started.md` - Overview and first steps
2. `Implementation_Guide.md` + `Implementation_Guide_Part2.md` - Complete code examples
3. `Trello_Clone_Development_Plan.md` - Full task breakdown
4. `Quick_Reference_Guide.md` - Quick lookups
5. `Task_Tracking_Checklist.md` - Track your progress

**KEY FILE:** `Implementation_Guide_Part2.md` has ALL the code you need to copy.

**First Task - Project Setup:**

Please complete these steps:

1. **Initialize Next.js Project**
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --eslint --src-dir
   ```

2. **Install ALL Dependencies**
   ```bash
   npm install zustand@4.4.7 @dnd-kit/core@6.1.0 @dnd-kit/sortable@8.0.0 @dnd-kit/utilities@3.2.2
   npm install prisma@5.7.1 @prisma/client@5.7.1
   npm install zod@3.22.4 react-hook-form@7.49.2 @hookform/resolvers@3.3.3
   npm install bcryptjs@2.4.3 jsonwebtoken@9.0.2 next-auth@4.24.5
   npm install socket.io@4.6.0 socket.io-client@4.6.0
   npm install date-fns@3.0.6 react-markdown@9.0.1
   npm install -D @types/bcryptjs@2.4.6 @types/jsonwebtoken@9.0.5
   ```

3. **Create Docker PostgreSQL**
   Create `docker-compose.yml`:
   ```yaml
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

4. **Setup Prisma**
   - Run `npx prisma init`
   - **IMPORTANT:** Open the downloaded `Implementation_Guide_Part2.md` file (Section 2) for the COMPLETE Prisma schema
   - Copy that entire schema to `prisma/schema.prisma`
   - Create `.env.local` with: `DATABASE_URL="postgresql://trello_user:trello_password@localhost:5432/trello_clone"`

5. **Create Migration**
   ```bash
   docker-compose up -d
   npx prisma migrate dev --name init
   npx prisma generate
   ```

6. **Setup Project Structure**
   Create these directories:
   - `src/app/(auth)/` - Auth pages
   - `src/app/(dashboard)/` - Main app
   - `src/app/api/` - API routes
   - `src/components/ui/` - UI components
   - `src/components/boards/` - Board components
   - `src/components/lists/` - List components
   - `src/components/cards/` - Card components
   - `src/lib/` - Utilities
   - `src/store/` - Zustand stores
   - `src/hooks/` - Custom hooks
   - `src/types/` - TypeScript types

7. **Copy Configuration Files**
   From the downloaded `Implementation_Guide_Part2.md` (Section 4), copy:
   - `next.config.js`
   - `tsconfig.json`
   - `tailwind.config.js`
   - `.prettierrc`
   - `.eslintrc.json`

8. **Create Type Definitions**
   Create `src/types/index.ts` with ALL types from Section 3 of the Implementation Guide

9. **Create Prisma Client Singleton**
   Create `src/lib/db.ts` with the code from Section 4

**After completing these steps:**
- Run `npm run dev` to verify everything works
- Tell me what you completed and any issues
- I'll give you the next task (Authentication System)

**Important:**
- Read the Implementation Guide files for COMPLETE code examples
- Don't skip any steps
- Ask questions if anything is unclear
- Follow the exact code patterns shown in the guides

Ready to start? Let's build this! 🚀

---

**Additional Instructions:**

When implementing features:
1. **Always reference** the downloaded `Implementation_Guide_Part2.md` for complete code
2. **Use TypeScript strictly** - no `any` types
3. **Add error handling** to all API routes
4. **Write clean code** with comments
5. **Follow the patterns** shown in the examples exactly

For authentication (next task):
- Complete Prisma schema is already done (if you copied it)
- NextAuth configuration is in the guide
- API routes for register/login are shown
- React components for forms are included

For drag & drop (later):
- Complete @dnd-kit implementation in Section 5
- BoardDnDContext component fully shown
- Sortable List and Card components ready to copy

For real-time (later):
- Socket.io server setup in Section 6
- Client hooks provided
- Real-time board hook ready

Everything you need is in those guides! 📚
