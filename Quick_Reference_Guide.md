# Trello Clone - Quick Reference Guide

## Technology Stack Summary

| Category | Choice | Why |
|----------|--------|-----|
| **Frontend Framework** | Next.js 14+ | Built-in routing, API routes, SSR, industry standard |
| **Language** | TypeScript | Type safety, better tooling, maintainability |
| **Styling** | Tailwind CSS | Utility-first, fast development, consistent design |
| **State Management** | Zustand | Simple, minimal boilerplate, perfect for MVP |
| **Drag & Drop** | @dnd-kit | Modern, TypeScript support, accessibility |
| **Forms** | React Hook Form + Zod | Best performance, runtime validation |
| **Backend Runtime** | Next.js API Routes → Express | Start simple, scale when needed |
| **Database** | PostgreSQL | Relational data, ACID compliance, industry standard |
| **ORM** | Prisma | Best TypeScript ORM, auto-generated types |
| **Authentication** | NextAuth.js + JWT | Industry standard, OAuth support |
| **Real-time** | Socket.io | Websockets, fallback support, room-based |
| **Deployment** | Vercel | Zero-config, automatic deployments, CDN |

---

## 12-Week Development Timeline

### **Week 1: Foundation**
- Repository and project setup
- Database schema design
- Development environment with Docker
- User and Workspace models

### **Week 2: Authentication**
- NextAuth.js setup
- Login/Register UI
- OAuth integration (Google)
- Protected routes

### **Week 3: Workspaces & Boards**
- Workspace CRUD APIs
- Board CRUD APIs
- Workspace UI components
- Board UI components

### **Week 4: Lists**
- List CRUD APIs
- List reordering logic
- List UI components
- Inline list creation

### **Week 5-6: Cards** 
- Card CRUD APIs
- Label system
- Checklist system
- Card UI components
- Card modal with all details

### **Week 7: Drag & Drop**
- @dnd-kit setup
- List drag & drop
- Card drag & drop
- Cross-list card movement

### **Week 8: Real-time**
- Socket.io server setup
- Real-time updates integration
- Presence indicators
- State management optimization

### **Week 9: Search & Files**
- Search API and UI
- File upload service (S3/Cloudinary)
- Attachment functionality
- Search filters

### **Week 10: Activity**
- Comment system
- Activity logging
- Comment UI
- Activity timeline

### **Week 11: Testing**
- Unit tests (80%+ coverage)
- Integration tests
- E2E tests (Playwright)
- Test automation

### **Week 12: Production**
- Performance optimization
- CI/CD pipeline
- Production deployment
- Monitoring setup

---

## Task Complexity Guide

### Low Complexity (1-2 hours)
- Simple CRUD endpoints
- Basic UI components
- Configuration files
- Documentation updates

### Medium Complexity (3-5 hours)
- Complex API endpoints with validation
- State management integration
- Form components with validation
- Database migrations

### High Complexity (6-10 hours)
- Real-time features
- Drag and drop implementation
- Complex UI with multiple interactions
- Authentication flows
- Testing suites

---

## Agent Responsibilities Matrix

| Task Type | PM | Backend | Frontend | DevOps |
|-----------|----|---------|---------:|--------|
| Code Review | ✓ | | | |
| API Development | | ✓ | | |
| UI Components | | | ✓ | |
| Database Design | | ✓ | | |
| State Management | | | ✓ | |
| Real-time Features | | ✓ | ✓ | |
| Deployment | ✓ | | | ✓ |
| Testing | ✓ | ✓ | ✓ | ✓ |
| CI/CD | | | | ✓ |
| Documentation | ✓ | ✓ | ✓ | ✓ |

---

## Critical Path Tasks

These tasks block other work and should be prioritized:

1. **Week 1**: Database schema design → Blocks all backend work
2. **Week 2**: Authentication system → Blocks all protected features
3. **Week 3**: Board API → Blocks list and card development
4. **Week 4**: List API → Blocks card development
5. **Week 7**: Drag & drop → Core feature, needed for MVP
6. **Week 8**: Real-time → Differentiating feature

---

## Daily Workflow for Agents

### Morning (Start of Day)
1. Pull latest changes from `develop`
2. Check assigned tasks on project board
3. Move task to "In Progress"
4. Create feature branch
5. Begin implementation

### During Day
1. Commit changes frequently with good messages
2. Write tests alongside code
3. Update documentation as needed
4. Ask for help if blocked (tag PM)

### End of Day
1. Push changes to feature branch
2. Create PR if task is complete
3. Update task status
4. Document any blockers
5. Plan next day's work

---

## Git Workflow

```bash
# Start new task
git checkout develop
git pull origin develop
git checkout -b feature/task-name

# During development
git add .
git commit -m "feat(scope): descriptive message"
git push origin feature/task-name

# When ready for review
# Create PR on GitHub
# PM reviews and merges

# After merge
git checkout develop
git pull origin develop
# Start next task
```

---

## Common Commands Reference

### Development
```bash
# Start development server
npm run dev

# Start database
docker-compose up -d

# View database
npx prisma studio

# Create migration
npx prisma migrate dev --name migration_name

# Generate Prisma client
npx prisma generate

# Seed database
npx prisma db seed
```

### Testing
```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix lint issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

### Deployment
```bash
# Build production
npm run build

# Start production server
npm start

# Deploy to Vercel
vercel --prod
```

---

## Key File Locations

### Configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind configuration
- `prisma/schema.prisma` - Database schema
- `.env.local` - Environment variables (gitignored)
- `.env.example` - Environment template

### Source Code
- `src/app/` - Next.js app router pages
- `src/app/api/` - API endpoints
- `src/components/` - React components
- `src/lib/` - Utilities and helpers
- `src/store/` - Zustand stores
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript types

### Testing
- `tests/unit/` - Unit tests
- `tests/integration/` - Integration tests
- `tests/e2e/` - End-to-end tests

### Documentation
- `README.md` - Project overview
- `CONTRIBUTING.md` - Contribution guidelines
- `docs/` - Detailed documentation

---

## Database Schema Quick Reference

```
User
├── email (unique)
├── password
├── name
└── avatar

Workspace
├── name
├── description
├── ownerId → User
└── members → WorkspaceMember[]

Board
├── title
├── workspaceId → Workspace
├── background
├── visibility (PUBLIC/PRIVATE/WORKSPACE)
├── starred
└── members → BoardMember[]

List
├── title
├── boardId → Board
├── position
└── cards → Card[]

Card
├── title
├── description
├── listId → List
├── position
├── dueDate
├── cover
├── members → CardMember[]
├── labels → CardLabel[]
├── checklists → Checklist[]
└── attachments → Attachment[]
```

---

## API Endpoint Quick Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (handled by NextAuth)
- `POST /api/auth/logout` - Logout

### Workspaces
- `GET /api/workspaces` - List user's workspaces
- `POST /api/workspaces` - Create workspace
- `PATCH /api/workspaces/[id]` - Update workspace
- `DELETE /api/workspaces/[id]` - Delete workspace
- `POST /api/workspaces/[id]/members` - Add member
- `DELETE /api/workspaces/[id]/members/[userId]` - Remove member

### Boards
- `GET /api/boards` - List user's boards
- `POST /api/boards` - Create board
- `GET /api/boards/[id]` - Get board details
- `PATCH /api/boards/[id]` - Update board
- `DELETE /api/boards/[id]` - Delete board
- `POST /api/boards/[id]/star` - Toggle star

### Lists
- `POST /api/lists` - Create list
- `PATCH /api/lists/[id]` - Update list
- `DELETE /api/lists/[id]` - Delete list
- `PATCH /api/lists/[id]/reorder` - Reorder list

### Cards
- `POST /api/cards` - Create card
- `GET /api/cards/[id]` - Get card details
- `PATCH /api/cards/[id]` - Update card
- `DELETE /api/cards/[id]` - Delete card
- `PATCH /api/cards/[id]/move` - Move to different list
- `POST /api/cards/[id]/labels` - Add label
- `POST /api/cards/[id]/members` - Assign member
- `POST /api/cards/[id]/comments` - Add comment
- `POST /api/cards/[id]/attachments` - Upload attachment

### Search
- `GET /api/search?q=query&filters=...` - Search cards and boards

---

## Testing Checklist

Before creating a PR, ensure:

- [ ] All new code has unit tests
- [ ] Integration tests pass for new APIs
- [ ] TypeScript compilation has no errors
- [ ] ESLint shows no warnings
- [ ] Code is formatted with Prettier
- [ ] All existing tests still pass
- [ ] New features are documented
- [ ] No console.log statements left
- [ ] Environment variables documented
- [ ] PR description is clear

---

## Performance Targets

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Page Load | < 2s | Lighthouse |
| API Response | < 200ms P95 | Logs/Monitoring |
| Test Coverage | > 80% | Jest coverage report |
| Lighthouse Score | > 90 | Lighthouse audit |
| Bundle Size | < 500KB | Next.js build output |

---

## Security Checklist

- [ ] All passwords hashed with bcrypt (10+ rounds)
- [ ] JWT secrets are strong and secure
- [ ] All API routes have authentication checks
- [ ] Authorization verified for user actions
- [ ] SQL injection prevented (Prisma handles this)
- [ ] XSS prevented (React handles this)
- [ ] CSRF tokens for state-changing operations
- [ ] Rate limiting on auth endpoints
- [ ] HTTPS enforced in production
- [ ] Sensitive data not logged
- [ ] Dependencies regularly updated
- [ ] Security headers configured

---

## Troubleshooting Quick Fixes

### "Prisma Client is not initialized"
```bash
npx prisma generate
```

### "Cannot find module '@/...'"
```bash
# Check tsconfig.json has correct paths
# Restart TypeScript server in IDE
```

### "Database connection failed"
```bash
# Check if Docker is running
docker ps

# Restart PostgreSQL
docker-compose restart postgres
```

### "Tests failing randomly"
```bash
# Reset test database
npx prisma migrate reset --force

# Clear test cache
npm run test -- --clearCache
```

### "Build fails in production"
```bash
# Clear Next.js cache
rm -rf .next

# Check environment variables
# Ensure DATABASE_URL is set correctly
```

---

## Communication Guidelines

### When to Ask PM
- Blocked on dependencies
- Unclear requirements
- Architecture decisions
- Conflicting implementations

### When to Ask Backend Agent
- API questions
- Database schema questions
- Authentication issues

### When to Ask Frontend Agent
- UI/UX questions
- Component architecture
- State management patterns

### When to Ask DevOps Agent
- Environment issues
- Deployment problems
- CI/CD questions
- Performance optimization

---

## Success Criteria for MVP Launch

### Functional Requirements
- [x] Users can register and login
- [x] Users can create workspaces
- [x] Users can create boards
- [x] Users can create lists on boards
- [x] Users can create cards on lists
- [x] Users can drag and drop cards
- [x] Users can add labels to cards
- [x] Users can add checklists to cards
- [x] Users can comment on cards
- [x] Users can attach files to cards
- [x] Real-time updates work
- [x] Search functionality works

### Non-Functional Requirements
- [x] 80%+ test coverage
- [x] < 2s page load time
- [x] < 200ms API response time
- [x] Mobile responsive
- [x] WCAG 2.1 Level AA compliance
- [x] Deployed to production
- [x] Monitoring active
- [x] Documentation complete

---

## Next Steps After MVP

### Phase 2 Enhancements (Months 4-6)
1. Board templates
2. Advanced search
3. Email notifications
4. Mobile app (React Native)
5. Keyboard shortcuts
6. Bulk operations

### Phase 3 Advanced Features (Months 7-9)
1. Automation rules (Butler)
2. Calendar view
3. Timeline/Gantt view
4. Third-party integrations
5. Analytics dashboard
6. Custom fields

---

## Resources

### Documentation
- [Full Development Plan](./Trello_Clone_Development_Plan.md)
- [Product Requirements Document](./Trello_Clone_PRD.md)
- [API Documentation](../docs/API_DOCUMENTATION.md)
- [Architecture Docs](../docs/ARCHITECTURE.md)

### Learning Resources
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com/docs
- dnd-kit: https://docs.dndkit.com

### Support
- Create an issue on GitHub for bugs
- Tag @PM for blockers
- Check troubleshooting guide first
- Search existing issues before creating new ones

---

**Remember: Build incrementally, test continuously, commit often! 🚀**
