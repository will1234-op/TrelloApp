# Trello Clone - Implementation Guide (Part 2)
## Sections 7-10: Testing, APIs, Components & Utilities

---

## 7. Testing Examples

### Jest Configuration

Create `jest.config.js`:

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/_*.{js,jsx,ts,tsx}',
  ],
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.test.{js,jsx,ts,tsx}',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

Create `jest.setup.js`:

```javascript
// jest.setup.js
import '@testing-library/jest-dom'
```

### Unit Test Example - Utility Function

```typescript
// tests/unit/lib/position.test.ts
import { calculateNewPosition, reorderItems } from '@/lib/position'

describe('calculateNewPosition', () => {
  it('should calculate position between two items', () => {
    const result = calculateNewPosition(1, 3)
    expect(result).toBe(2)
  })

  it('should calculate position before first item', () => {
    const result = calculateNewPosition(null, 5)
    expect(result).toBeLessThan(5)
  })

  it('should calculate position after last item', () => {
    const result = calculateNewPosition(10, null)
    expect(result).toBeGreaterThan(10)
  })
})

describe('reorderItems', () => {
  const items = [
    { id: '1', position: 0 },
    { id: '2', position: 1 },
    { id: '3', position: 2 },
  ]

  it('should reorder items correctly', () => {
    const result = reorderItems(items, 0, 2)
    
    expect(result[0].id).toBe('2')
    expect(result[1].id).toBe('3')
    expect(result[2].id).toBe('1')
  })

  it('should update positions', () => {
    const result = reorderItems(items, 0, 2)
    
    expect(result[0].position).toBe(0)
    expect(result[1].position).toBe(1)
    expect(result[2].position).toBe(2)
  })
})
```

### Integration Test Example - API Route

```typescript
// tests/integration/api/cards.test.ts
import { createMocks } from 'node-mocks-http'
import { POST } from '@/app/api/cards/route'
import { prisma } from '@/lib/db'
import { createTestUser, createTestBoard, createTestList } from '../helpers'

describe('/api/cards', () => {
  let user: any
  let board: any
  let list: any

  beforeAll(async () => {
    user = await createTestUser()
    board = await createTestBoard(user.id)
    list = await createTestList(board.id)
  })

  afterAll(async () => {
    await prisma.card.deleteMany()
    await prisma.list.deleteMany()
    await prisma.board.deleteMany()
    await prisma.user.deleteMany()
  })

  describe('POST /api/cards', () => {
    it('should create a new card', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          title: 'Test Card',
          listId: list.id,
        },
      })

      // Mock session
      jest.mock('next-auth', () => ({
        getServerSession: jest.fn(() => Promise.resolve({
          user: { id: user.id, email: user.email }
        }))
      }))

      await POST(req as any)

      expect(res._getStatusCode()).toBe(201)
      const data = JSON.parse(res._getData())
      expect(data.title).toBe('Test Card')
      expect(data.listId).toBe(list.id)
    })

    it('should return 401 if not authenticated', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          title: 'Test Card',
          listId: list.id,
        },
      })

      jest.mock('next-auth', () => ({
        getServerSession: jest.fn(() => Promise.resolve(null))
      }))

      await POST(req as any)

      expect(res._getStatusCode()).toBe(401)
    })

    it('should validate required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          // Missing title
          listId: list.id,
        },
      })

      await POST(req as any)

      expect(res._getStatusCode()).toBe(400)
      const data = JSON.parse(res._getData())
      expect(data.error).toBe('Validation error')
    })
  })
})
```

### Component Test Example

```typescript
// tests/unit/components/cards/Card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Card from '@/components/cards/Card'
import { DndContext } from '@dnd-kit/core'

const mockCard = {
  id: '1',
  title: 'Test Card',
  description: 'Test description',
  listId: 'list-1',
  position: 0,
  dueDate: null,
  cover: null,
  archived: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  _count: {
    members: 0,
    labels: 0,
    checklists: 0,
    attachments: 0,
    comments: 0,
  },
}

describe('Card Component', () => {
  it('renders card title', () => {
    render(
      <DndContext>
        <Card card={mockCard} />
      </DndContext>
    )

    expect(screen.getByText('Test Card')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()

    render(
      <DndContext>
        <Card card={mockCard} onClick={handleClick} />
      </DndContext>
    )

    fireEvent.click(screen.getByText('Test Card'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('displays cover image when provided', () => {
    const cardWithCover = {
      ...mockCard,
      cover: 'https://example.com/image.jpg',
    }

    render(
      <DndContext>
        <Card card={cardWithCover} />
      </DndContext>
    )

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', cardWithCover.cover)
  })

  it('displays due date badge', () => {
    const cardWithDueDate = {
      ...mockCard,
      dueDate: new Date('2025-12-31'),
    }

    render(
      <DndContext>
        <Card card={cardWithDueDate} />
      </DndContext>
    )

    expect(screen.getByText(/Dec 31/)).toBeInTheDocument()
  })
})
```

### E2E Test Example with Playwright

```typescript
// tests/e2e/board.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Board Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('http://localhost:3000/login')
    await page.fill('input[name="email"]', '[email protected]')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/dashboard')
  })

  test('should create a new board', async ({ page }) => {
    // Click create board button
    await page.click('button:has-text("Create Board")')

    // Fill in board form
    await page.fill('input[name="title"]', 'Test Board')
    await page.click('button:has-text("Create")')

    // Verify board was created
    await expect(page.locator('h1:has-text("Test Board")')).toBeVisible()
  })

  test('should create a list', async ({ page }) => {
    // Go to existing board
    await page.goto('http://localhost:3000/boards/test-board-id')

    // Click add list
    await page.click('button:has-text("Add a list")')

    // Fill in list name
    await page.fill('input[placeholder="Enter list title"]', 'To Do')
    await page.press('input[placeholder="Enter list title"]', 'Enter')

    // Verify list was created
    await expect(page.locator('text=To Do')).toBeVisible()
  })

  test('should create a card', async ({ page }) => {
    await page.goto('http://localhost:3000/boards/test-board-id')

    // Click add card in first list
    await page.click('button:has-text("Add a card")')

    // Fill in card title
    await page.fill('textarea[placeholder="Enter a title"]', 'Test Card')
    await page.click('button:has-text("Add card")')

    // Verify card was created
    await expect(page.locator('text=Test Card')).toBeVisible()
  })

  test('should drag and drop a card', async ({ page }) => {
    await page.goto('http://localhost:3000/boards/test-board-id')

    // Get card and target list
    const card = page.locator('text=Test Card').first()
    const targetList = page.locator('[data-list-id="list-2"]')

    // Perform drag and drop
    await card.dragTo(targetList)

    // Verify card moved
    await expect(targetList.locator('text=Test Card')).toBeVisible()
  })
})
```

---

## 8. Complete API Route Examples

### Card API - Complete Implementation

```typescript
// src/app/api/cards/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const createCardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  listId: z.string().cuid(),
  position: z.number().int().min(0).optional(),
  dueDate: z.string().datetime().optional(),
  cover: z.string().url().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = createCardSchema.parse(body)

    // Verify user has access to the list's board
    const list = await prisma.list.findUnique({
      where: { id: validatedData.listId },
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
      return NextResponse.json({ error: 'List not found' }, { status: 404 })
    }

    if (list.board.members.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get the position for the new card
    const position = validatedData.position ?? (
      await prisma.card.count({ where: { listId: validatedData.listId } })
    )

    // Create the card
    const card = await prisma.card.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        listId: validatedData.listId,
        position,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
        cover: validatedData.cover,
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
        labels: {
          include: {
            label: true,
          },
        },
        _count: {
          select: {
            members: true,
            labels: true,
            checklists: true,
            attachments: true,
            comments: true,
          },
        },
      },
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        action: 'created',
        entityType: 'card',
        entityId: card.id,
        cardId: card.id,
        userId: session.user.id,
        metadata: {
          cardTitle: card.title,
          listId: card.listId,
        },
      },
    })

    return NextResponse.json(card, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Card creation error:', error)
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const boardId = searchParams.get('boardId')
    const listId = searchParams.get('listId')
    const search = searchParams.get('search')

    let where: any = {}

    if (listId) {
      where.listId = listId
    } else if (boardId) {
      where.list = {
        boardId,
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const cards = await prisma.card.findMany({
      where,
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
        labels: {
          include: {
            label: true,
          },
        },
        _count: {
          select: {
            members: true,
            labels: true,
            checklists: true,
            attachments: true,
            comments: true,
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    })

    return NextResponse.json(cards)
  } catch (error) {
    console.error('Cards fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Card Move API

```typescript
// src/app/api/cards/[id]/move/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const moveCardSchema = z.object({
  destinationListId: z.string().cuid(),
  newPosition: z.number().int().min(0),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { destinationListId, newPosition } = moveCardSchema.parse(body)

    // Get the card and verify permissions
    const card = await prisma.card.findUnique({
      where: { id: params.id },
      include: {
        list: {
          include: {
            board: {
              include: {
                members: {
                  where: { userId: session.user.id },
                },
              },
            },
          },
        },
      },
    })

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    }

    if (card.list.board.members.length === 0) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const sourceListId = card.listId
    const sourcePosition = card.position

    // Use a transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // If moving within the same list
      if (sourceListId === destinationListId) {
        if (newPosition > sourcePosition) {
          // Moving down: decrease positions between old and new
          await tx.card.updateMany({
            where: {
              listId: sourceListId,
              position: {
                gt: sourcePosition,
                lte: newPosition,
              },
            },
            data: {
              position: { decrement: 1 },
            },
          })
        } else if (newPosition < sourcePosition) {
          // Moving up: increase positions between new and old
          await tx.card.updateMany({
            where: {
              listId: sourceListId,
              position: {
                gte: newPosition,
                lt: sourcePosition,
              },
            },
            data: {
              position: { increment: 1 },
            },
          })
        }
      } else {
        // Moving to different list
        // Decrease positions in source list
        await tx.card.updateMany({
          where: {
            listId: sourceListId,
            position: { gt: sourcePosition },
          },
          data: {
            position: { decrement: 1 },
          },
        })

        // Increase positions in destination list
        await tx.card.updateMany({
          where: {
            listId: destinationListId,
            position: { gte: newPosition },
          },
          data: {
            position: { increment: 1 },
          },
        })
      }

      // Update the card itself
      await tx.card.update({
        where: { id: params.id },
        data: {
          listId: destinationListId,
          position: newPosition,
        },
      })

      // Create activity log
      await tx.activity.create({
        data: {
          action: 'moved',
          entityType: 'card',
          entityId: params.id,
          cardId: params.id,
          userId: session.user.id,
          metadata: {
            from: { listId: sourceListId, position: sourcePosition },
            to: { listId: destinationListId, position: newPosition },
          },
        },
      })
    })

    // Fetch updated card
    const updatedCard = await prisma.card.findUnique({
      where: { id: params.id },
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
        labels: {
          include: {
            label: true,
          },
        },
        _count: {
          select: {
            members: true,
            labels: true,
            checklists: true,
            attachments: true,
            comments: true,
          },
        },
      },
    })

    return NextResponse.json(updatedCard)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Card move error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 9. Complete Component Implementations

### CardModal - Full Implementation

```typescript
// src/components/cards/CardModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/Dialog'
import { X, Calendar, Tag, User, Paperclip, CheckSquare, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import CardDescription from './CardDescription'
import CardLabels from './CardLabels'
import CardMembers from './CardMembers'
import CardDueDate from './CardDueDate'
import CardChecklists from './CardChecklists'
import CardAttachments from './CardAttachments'
import CardComments from './CardComments'
import CardActivity from './CardActivity'
import type { CardWithDetails } from '@/types'

interface CardModalProps {
  card: CardWithDetails
  isOpen: boolean
  onClose: () => void
  onUpdate: (cardId: string, data: any) => Promise<void>
}

export default function CardModal({ card, isOpen, onClose, onUpdate }: CardModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'activity'>('details')
  const [title, setTitle] = useState(card.title)
  const [isEditingTitle, setIsEditingTitle] = useState(false)

  useEffect(() => {
    setTitle(card.title)
  }, [card.title])

  const handleTitleSave = async () => {
    if (title.trim() && title !== card.title) {
      await onUpdate(card.id, { title: title.trim() })
    }
    setIsEditingTitle(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            {/* Card Title */}
            <div className="flex-1">
              {isEditingTitle ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSave()
                    if (e.key === 'Escape') {
                      setTitle(card.title)
                      setIsEditingTitle(false)
                    }
                  }}
                  className="w-full text-xl font-semibold px-2 py-1 border-2 border-blue-500 rounded"
                  autoFocus
                />
              ) : (
                <h2
                  onClick={() => setIsEditingTitle(true)}
                  className="text-xl font-semibold cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                >
                  {card.title}
                </h2>
              )}
              <p className="text-sm text-gray-500 mt-1 px-2">
                in list <span className="underline">{card.list?.title}</span>
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4 p-6">
            {/* Main Column */}
            <div className="col-span-2 space-y-6">
              {/* Labels */}
              {card.labels.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Labels
                  </h3>
                  <CardLabels card={card} onUpdate={onUpdate} />
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Description</h3>
                <CardDescription card={card} onUpdate={onUpdate} />
              </div>

              {/* Checklists */}
              {card.checklists.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Checklists
                  </h3>
                  <CardChecklists card={card} onUpdate={onUpdate} />
                </div>
              )}

              {/* Attachments */}
              {card.attachments.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    Attachments
                  </h3>
                  <CardAttachments card={card} onUpdate={onUpdate} />
                </div>
              )}

              {/* Tabs */}
              <div className="border-t pt-4">
                <div className="flex gap-4 border-b mb-4">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`pb-2 px-1 border-b-2 transition-colors ${
                      activeTab === 'details'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-600'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Comments
                  </button>
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`pb-2 px-1 border-b-2 transition-colors ${
                      activeTab === 'activity'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-600'
                    }`}
                  >
                    Activity
                  </button>
                </div>

                {activeTab === 'details' && <CardComments card={card} />}
                {activeTab === 'activity' && <CardActivity card={card} />}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2">
                  Add to card
                </h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Members
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Labels
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2">
                    <CheckSquare className="w-4 h-4" />
                    Checklist
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </button>
                  <button className="w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    Attachment
                  </button>
                </div>
              </div>

              {/* Card Info */}
              <div className="border-t pt-4">
                <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2">
                  Card Info
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {card.dueDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Due {format(new Date(card.dueDate), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  {card.members.length > 0 && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{card.members.length} member(s)</span>
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-4">
                    Created {format(new Date(card.createdAt), 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

---

## 10. Utilities and Helpers

### Position Calculation Utility

```typescript
// src/lib/position.ts

/**
 * Calculate a new position between two items
 * Used for drag-and-drop positioning
 */
export function calculateNewPosition(
  beforePosition: number | null,
  afterPosition: number | null
): number {
  // If no items before, place before the first item
  if (beforePosition === null && afterPosition !== null) {
    return afterPosition / 2
  }

  // If no items after, place after the last item
  if (beforePosition !== null && afterPosition === null) {
    return beforePosition + 1000
  }

  // If between two items, find the middle
  if (beforePosition !== null && afterPosition !== null) {
    return (beforePosition + afterPosition) / 2
  }

  // If list is empty, start at position 1000
  return 1000
}

/**
 * Reorder an array of items and update their positions
 */
export function reorderItems<T extends { position: number }>(
  items: T[],
  startIndex: number,
  endIndex: number
): T[] {
  const result = Array.from(items)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  // Update positions
  return result.map((item, index) => ({
    ...item,
    position: index,
  }))
}

/**
 * Move an item between two arrays
 */
export function moveItemBetweenArrays<T extends { position: number }>(
  source: T[],
  destination: T[],
  sourceIndex: number,
  destIndex: number
): { source: T[]; destination: T[] } {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)

  const [removed] = sourceClone.splice(sourceIndex, 1)
  destClone.splice(destIndex, 0, removed)

  // Update positions
  const newSource = sourceClone.map((item, index) => ({
    ...item,
    position: index,
  }))

  const newDest = destClone.map((item, index) => ({
    ...item,
    position: index,
  }))

  return {
    source: newSource,
    destination: newDest,
  }
}
```

### API Client Utility

```typescript
// src/lib/api-client.ts

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}

class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(`/api${endpoint}`, config)

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(response.status, data.error || 'Request failed', data.details)
    }

    return data as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    throw new ApiError(500, 'Network error occurred', error)
  }
}

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  
  post: <T = any>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, { method: 'POST', body }),
  
  put: <T = any>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, { method: 'PUT', body }),
  
  patch: <T = any>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body }),
  
  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
}
```

### Date Formatting Utility

```typescript
// src/lib/date-utils.ts
import { format, formatDistance, isPast, isToday, isTomorrow, isThisWeek } from 'date-fns'

export function formatDueDate(date: Date): string {
  if (isToday(date)) {
    return 'Today'
  }

  if (isTomorrow(date)) {
    return 'Tomorrow'
  }

  if (isThisWeek(date)) {
    return format(date, 'EEEE') // Day name
  }

  return format(date, 'MMM d')
}

export function formatRelativeTime(date: Date): string {
  return formatDistance(date, new Date(), { addSuffix: true })
}

export function isDueSoon(date: Date): boolean {
  const now = new Date()
  const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60)
  return diffHours >= 0 && diffHours <= 24
}

export function isOverdue(date: Date): boolean {
  return isPast(date)
}

export function getDueDateColor(date: Date): 'red' | 'yellow' | 'green' {
  if (isOverdue(date)) return 'red'
  if (isDueSoon(date)) return 'yellow'
  return 'green'
}
```

### Validation Schemas

```typescript
// src/lib/validations.ts
import { z } from 'zod'

// Auth
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
})

// Workspace
export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
})

// Board
export const createBoardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  workspaceId: z.string().cuid(),
  background: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'WORKSPACE']).default('PRIVATE'),
})

// List
export const createListSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  boardId: z.string().cuid(),
  position: z.number().int().min(0).optional(),
})

// Card
export const createCardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  listId: z.string().cuid(),
  position: z.number().int().min(0).optional(),
  dueDate: z.string().datetime().optional(),
  cover: z.string().url().optional(),
})

export const updateCardSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  cover: z.string().url().nullable().optional(),
  archived: z.boolean().optional(),
})
```

---

## Summary

This Implementation Guide provides **complete, working code** for:

✅ **Complete Prisma Schema** - Every model, relationship, and index  
✅ **All Type Definitions** - Full TypeScript types for the entire app  
✅ **Configuration Files** - Next.js, TypeScript, Tailwind, ESLint, Prettier  
✅ **Drag & Drop** - Complete dnd-kit implementation with hooks and components  
✅ **Real-time** - Full Socket.io server and client implementation  
✅ **Testing** - Unit, integration, and E2E test examples  
✅ **API Routes** - Complete examples with validation and error handling  
✅ **Components** - Full CardModal implementation  
✅ **Utilities** - Position calculations, API client, date formatting, validations  

## Next Steps

1. **Copy the complete Prisma schema** (Section 2) to your project
2. **Create all type definition files** (Section 3)
3. **Set up configuration files** (Section 4)
4. **Implement drag and drop** using the complete code (Section 5)
5. **Set up real-time** with Socket.io (Section 6)
6. **Write tests** using the examples (Section 7)
7. **Implement API routes** following the patterns (Section 8)
8. **Build components** using the complete implementations (Section 9)
9. **Add utilities** from Section 10

**You now have everything you need to build the Trello clone!** 🚀

---

**Files Location:**
- `Implementation_Guide.md` - Part 1 (Sections 1-6)
- `Implementation_Guide_Part2.md` - Part 2 (Sections 7-10)
