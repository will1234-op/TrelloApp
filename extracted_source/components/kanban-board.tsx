"use client"

import type React from "react"

import { useState } from "react"
import { KanbanList } from "./kanban-list"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"

export type Task = {
  id: string
  title: string
  description?: string
  priority?: "low" | "medium" | "high"
  assignee?: string
  dueDate?: string
  tags?: string[]
}

export type Column = {
  id: string
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [
      {
        id: "1",
        title: "Research competitor features",
        description: "Analyze top 3 competitors and identify key differentiators",
        priority: "medium",
        assignee: "Sarah",
        tags: ["research", "planning"],
        dueDate: "Dec 28",
      },
      {
        id: "2",
        title: "User interview sessions",
        description: "Schedule 5 user interviews to gather feedback",
        priority: "high",
        assignee: "Mike",
        tags: ["user research"],
        dueDate: "Dec 30",
      },
      {
        id: "3",
        title: "Define success metrics",
        description: "Establish KPIs for Q1 goals",
        priority: "medium",
        assignee: "Alex",
        tags: ["analytics"],
        dueDate: "Jan 5",
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    tasks: [
      {
        id: "4",
        title: "Design new dashboard layout",
        description: "Create wireframes and high-fidelity mockups",
        priority: "high",
        assignee: "Emma",
        tags: ["design", "ui"],
        dueDate: "Dec 24",
      },
      {
        id: "5",
        title: "Setup authentication flow",
        description: "Implement OAuth and SSO integration",
        priority: "high",
        assignee: "Alex",
        tags: ["backend", "security"],
        dueDate: "Dec 26",
      },
      {
        id: "11",
        title: "Database schema optimization",
        description: "Review and optimize query performance",
        priority: "medium",
        assignee: "Jordan",
        tags: ["backend", "performance"],
      },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: "6",
        title: "Implement drag and drop",
        description: "Add DnD functionality to kanban board with visual feedback",
        priority: "high",
        assignee: "Jordan",
        tags: ["frontend", "feature"],
        dueDate: "Dec 23",
      },
      {
        id: "7",
        title: "Write API documentation",
        description: "Document all REST endpoints with examples",
        priority: "medium",
        assignee: "Sam",
        tags: ["docs", "backend"],
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    tasks: [
      {
        id: "8",
        title: "Code review for payment integration",
        description: "Review Stripe integration implementation",
        priority: "high",
        assignee: "Chris",
        tags: ["review", "backend"],
        dueDate: "Dec 22",
      },
      {
        id: "12",
        title: "Security audit",
        description: "Review authentication and data validation",
        priority: "high",
        assignee: "Taylor",
        tags: ["security", "review"],
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "9",
        title: "Setup project repository",
        description: "Initialize Git repo with CI/CD configuration",
        priority: "medium",
        assignee: "Mike",
        tags: ["setup"],
      },
      {
        id: "10",
        title: "Configure CI/CD pipeline",
        description: "Setup automated testing and deployment",
        priority: "medium",
        assignee: "Taylor",
        tags: ["devops"],
      },
      {
        id: "13",
        title: "Design system foundation",
        description: "Create color palette and typography scale",
        priority: "low",
        assignee: "Emma",
        tags: ["design"],
      },
    ],
  },
]

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [draggedTask, setDraggedTask] = useState<{
    task: Task
    sourceColumnId: string
  } | null>(null)
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null)

  const handleDragStart = (task: Task, sourceColumnId: string) => {
    setDraggedTask({ task, sourceColumnId })
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDragOverColumnId(columnId)
  }

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask) return

    const { task, sourceColumnId } = draggedTask

    if (sourceColumnId === targetColumnId) {
      setDraggedTask(null)
      setDragOverColumnId(null)
      return
    }

    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((col) => {
        if (col.id === sourceColumnId) {
          return {
            ...col,
            tasks: col.tasks.filter((t) => t.id !== task.id),
          }
        }
        if (col.id === targetColumnId) {
          return {
            ...col,
            tasks: [...col.tasks, task],
          }
        }
        return col
      })
      return newColumns
    })

    setDraggedTask(null)
    setDragOverColumnId(null)
  }

  const handleDragEnd = () => {
    setDraggedTask(null)
    setDragOverColumnId(null)
  }

  return (
    <div className="h-full overflow-x-auto bg-background p-6">
      <div className="flex h-full gap-4">
        {columns.map((column) => (
          <KanbanList
            key={column.id}
            column={column}
            onDragStart={handleDragStart}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            isDraggingOver={dragOverColumnId === column.id}
            isDragging={draggedTask?.sourceColumnId === column.id}
          />
        ))}

        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            className="h-full min-w-[280px] border-2 border-dashed text-muted-foreground hover:border-primary hover:text-foreground"
          >
            <Plus className="mr-2 h-5 w-5" />
            {"Add another list"}
          </Button>
        </div>
      </div>
    </div>
  )
}
