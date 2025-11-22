"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { KanbanList } from "./kanban-list"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
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

const STORAGE_KEY = "taskflow-kanban-data"

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
  const [isLoaded, setIsLoaded] = useState(false)
  const [draggedTask, setDraggedTask] = useState<{
    task: Task
    sourceColumnId: string
  } | null>(null)
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null)

  // Add card dialog state
  const [addCardDialogOpen, setAddCardDialogOpen] = useState(false)
  const [addCardColumnId, setAddCardColumnId] = useState<string | null>(null)
  const [newCardTitle, setNewCardTitle] = useState("")
  const [newCardDescription, setNewCardDescription] = useState("")
  const [newCardPriority, setNewCardPriority] = useState<"low" | "medium" | "high">("medium")
  const [newCardAssignee, setNewCardAssignee] = useState("")

  // Add list dialog state
  const [addListDialogOpen, setAddListDialogOpen] = useState(false)
  const [newListTitle, setNewListTitle] = useState("")

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setColumns(parsed)
      } catch (e) {
        console.error("Failed to parse saved data:", e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever columns change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(columns))
    }
  }, [columns, isLoaded])

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

  const handleOpenAddCard = (columnId: string) => {
    setAddCardColumnId(columnId)
    setAddCardDialogOpen(true)
  }

  const handleAddCard = () => {
    if (!newCardTitle.trim() || !addCardColumnId) return

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newCardTitle.trim(),
      description: newCardDescription.trim() || undefined,
      priority: newCardPriority,
      assignee: newCardAssignee.trim() || undefined,
    }

    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === addCardColumnId
          ? { ...col, tasks: [...col.tasks, newTask] }
          : col
      )
    )

    // Reset form
    setNewCardTitle("")
    setNewCardDescription("")
    setNewCardPriority("medium")
    setNewCardAssignee("")
    setAddCardDialogOpen(false)
    setAddCardColumnId(null)
  }

  const handleAddList = () => {
    if (!newListTitle.trim()) return

    const newColumn: Column = {
      id: `list-${Date.now()}`,
      title: newListTitle.trim(),
      tasks: [],
    }

    setColumns((prevColumns) => [...prevColumns, newColumn])

    // Reset form
    setNewListTitle("")
    setAddListDialogOpen(false)
  }

  const handleDeleteCard = (columnId: string, taskId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === columnId
          ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) }
          : col
      )
    )
  }

  const handleDeleteList = (columnId: string) => {
    setColumns((prevColumns) => prevColumns.filter((col) => col.id !== columnId))
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
            onAddCard={() => handleOpenAddCard(column.id)}
            onDeleteCard={(taskId) => handleDeleteCard(column.id, taskId)}
            onDeleteList={() => handleDeleteList(column.id)}
          />
        ))}

        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            className="h-full min-w-[280px] border-2 border-dashed text-muted-foreground hover:border-primary hover:text-foreground"
            onClick={() => setAddListDialogOpen(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            {"Add another list"}
          </Button>
        </div>
      </div>

      {/* Add Card Dialog */}
      <Dialog open={addCardDialogOpen} onOpenChange={setAddCardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter card title..."
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCard()}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter description (optional)..."
                value={newCardDescription}
                onChange={(e) => setNewCardDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={newCardPriority} onValueChange={(v) => setNewCardPriority(v as "low" | "medium" | "high")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                placeholder="Enter assignee name (optional)..."
                value={newCardAssignee}
                onChange={(e) => setNewCardAssignee(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCardDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCard} disabled={!newCardTitle.trim()}>
              Add Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add List Dialog */}
      <Dialog open={addListDialogOpen} onOpenChange={setAddListDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New List</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="list-title">List Title</Label>
              <Input
                id="list-title"
                placeholder="Enter list title..."
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddList()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddListDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddList} disabled={!newListTitle.trim()}>
              Add List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
