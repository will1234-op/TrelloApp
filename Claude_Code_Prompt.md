# Claude Code Prompt: Build Trello Clone MVP

## Context

I want to build a Trello clone web application. I have complete documentation including:
- Product Requirements Document (PRD)
- Complete Development Plan with 100+ detailed tasks
- Implementation Guide with complete code examples
- Quick Reference Guide
- Task Tracking Checklist

All documentation is available in the project knowledge base.

## Project Overview

**Technology Stack:**
- Frontend: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- State Management: Zustand
- Drag & Drop: @dnd-kit
- Backend: Next.js API Routes (initially), Express + Socket.io (for real-time)
- Database: PostgreSQL with Prisma ORM
- Authentication: NextAuth.js
- Deployment: Vercel

**Core Features (MVP):**
1. User authentication (email/password + Google OAuth)
2. Workspaces to organize boards
3. Boards with customizable backgrounds
4. Lists within boards
5. Cards within lists with drag & drop
6. Card details: description, due dates, labels, members, checklists, attachments, comments
7. Real-time collaboration
8. Search functionality
9. Activity logging

## Your Role

You are an expert full-stack developer. This is my first app, so:
- Follow industry best practices
- Write clean, maintainable code
- Include proper error handling
- Write tests for all features
- Add helpful comments
- Follow the exact structure in the Implementation Guide

## Current Task: Week 1 - Foundation Setup

Please complete the following tasks in order:

### Task 0: Project Setup (You are DevOps Agent)

1. **Verify Prerequisites**
   - Check that Node.js 18+, Docker, and Git are installed
   - If missing, tell me what to install

2. **Initialize Project**
   ```bash
   # Create and initialize Next.js project with TypeScript, Tailwind, App Router
   # Install ALL dependencies listed in Implementation_Guide.md Section 1
   # Create .env.local with all required variables
   # Create docker-compose.yml for PostgreSQL
   # Start Docker container
   ```

3. **Setup Prisma**
   - Copy the COMPLETE schema from Implementation_Guide.md Section 2
   - Initialize Prisma: `npx prisma init`
   - Create initial migration: `npx prisma migrate dev --name init`
   - Generate Prisma Client: `npx prisma generate`
   - Create Prisma client singleton at `src/lib/db.ts`

4. **Configuration Files**
   - Copy all config files from Implementation_Guide.md Section 4:
     - `next.config.js`
     - `tsconfig.json`
     - `tailwind.config.js`
     - `.prettierrc`
     - `.eslintrc.json`

5. **Project Structure**
   - Create the following directory structure:
   ```
   src/
   ├── app/
   │   ├── (auth)/
   │   ├── (dashboard)/
   │   └── api/
   ├── components/
   │   ├── ui/
   │   ├── boards/
   │   ├── lists/
   │   └── cards/
   ├── lib/
   ├── store/
   ├── hooks/
   ├── types/
   └── server/
   ```

6. **Type Definitions**
   - Create `src/types/index.ts` with ALL types from Implementation_Guide.md Section 3

**Acceptance Criteria:**
- [ ] All dependencies installed successfully
- [ ] Docker container running PostgreSQL
- [ ] Prisma schema created and migrated
- [ ] All configuration files in place
- [ ] Directory structure created
- [ ] Type definitions file created
- [ ] `npm run dev` starts without errors
- [ ] Database connection working

### Task 1: Database Seed (You are Backend Agent)

1. **Create Seed File**
   - Create `prisma/seed.ts`
   - Add sample data:
     - 2-3 users with hashed passwords (use bcrypt)
     - 1 workspace
     - 2 boards
     - 3 lists per board
     - 5-6 cards per list
     - Some labels, checklists, comments

2. **Configure Seed Script**
   - Add to `package.json`:
   ```json
   "prisma": {
     "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
   }
   ```

3. **Run Seed**
   ```bash
   npx prisma db seed
   ```

**Acceptance Criteria:**
- [ ] Seed file creates realistic data
- [ ] All relationships work correctly
- [ ] Can view data in Prisma Studio: `npx prisma studio`

---

## Important Instructions

### Code Quality Standards
1. **Always use TypeScript** - No `any` types without good reason
2. **Add error handling** - Try/catch blocks, proper error messages
3. **Validate inputs** - Use Zod schemas for all API routes
4. **Follow naming conventions**:
   - Components: PascalCase (`BoardCard.tsx`)
   - Functions: camelCase (`getUserById`)
   - Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
   - Files: kebab-case for non-components (`api-client.ts`)

### File Organization
- Keep files under 300 lines
- One component per file
- Co-locate tests with code
- Use barrel exports (`index.ts`) for clean imports

### Git Workflow
```bash
# For each task:
git checkout -b feature/task-name
# Make changes
git add .
git commit -m "feat(scope): description"
git push origin feature/task-name
# Create PR, request review
```

### Reference Documentation
- For ANY uncertainty, reference: Implementation_Guide.md
- Complete Prisma schema: Section 2
- Type definitions: Section 3
- Drag & drop implementation: Section 5
- Socket.io setup: Section 6
- API route patterns: Section 8

### Testing Requirements
- Write unit tests for utilities
- Write integration tests for API routes
- Aim for 80%+ code coverage
- Use examples from Implementation_Guide.md Section 7

---

## What to Do Next

1. **Confirm you understand** the task and the technology stack
2. **Ask any clarifying questions** before starting
3. **Complete Task 0** (Project Setup) step by step
4. **Verify everything works** by running `npm run dev`
5. **Report completion** with:
   - What was completed
   - Any issues encountered
   - Next steps

After Task 0 is complete, I'll give you Task 1 (Authentication System).

---

## Communication Style

- **Be explicit**: Tell me exactly what commands to run
- **Explain why**: Help me understand the decisions
- **Show examples**: Provide code snippets when helpful
- **Report progress**: Let me know what you're working on
- **Ask questions**: If anything is unclear, ask before proceeding

---

## Emergency Commands

If something goes wrong:
```bash
# Reset database
npx prisma migrate reset --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart Docker
docker-compose down
docker-compose up -d

# Clear Next.js cache
rm -rf .next
```

---

## Success Criteria for Week 1

By end of Week 1, we should have:
- ✅ Working Next.js project with TypeScript and Tailwind
- ✅ PostgreSQL database with complete schema
- ✅ Prisma ORM configured and working
- ✅ Sample data seeded in database
- ✅ All dependencies installed
- ✅ Project structure in place
- ✅ Development environment running smoothly

---

## Ready to Start?

Please begin with Task 0 (Project Setup). Let me know:
1. If you need me to install any prerequisites
2. If you have questions about the tech stack
3. When you're ready to start implementing

Let's build this! 🚀
