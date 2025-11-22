"use client"

import type React from "react"

import { KanbanCard } from "./kanban-card"
import { Button } from "./ui/button"
import { MoreHorizontal, Plus, Trash2 } from "lucide-react"
import type { Column, Task } from "./kanban-board"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

type KanbanListProps = {
  column: Column
  onDragStart: (task: Task, columnId: string) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (columnId: string) => void
  onDragEnd: () => void
  isDraggingOver: boolean
  isDragging: boolean
  onAddCard: () => void
  onDeleteCard: (taskId: string) => void
  onDeleteList: () => void
}

export function KanbanList({
  column,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDraggingOver,
  isDragging,
  onAddCard,
  onDeleteCard,
  onDeleteList,
}: KanbanListProps) {
  return (
    <div
      className={cn(
        "flex h-full w-[320px] flex-shrink-0 flex-col rounded-xl bg-muted/50 p-3 transition-all",
        isDraggingOver && "ring-2 ring-primary/50 bg-primary/5",
        isDragging && "opacity-50",
      )}
      onDragOver={onDragOver}
      onDrop={() => onDrop(column.id)}
    >
      {/* List Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground">{column.title}</h3>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
            {column.tasks.length}
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onAddCard}>
              <Plus className="mr-2 h-4 w-4" />
              Add card
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDeleteList} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete list
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {column.tasks.map((task) => (
          <KanbanCard
            key={task.id}
            task={task}
            onDragStart={() => onDragStart(task, column.id)}
            onDragEnd={onDragEnd}
            onDelete={() => onDeleteCard(task.id)}
          />
        ))}
      </div>

      {/* Add Card Button */}
      <Button
        variant="ghost"
        size="sm"
        className="mt-2 w-full justify-start text-muted-foreground hover:text-foreground"
        onClick={onAddCard}
      >
        <Plus className="mr-2 h-4 w-4" />
        {"Add a card"}
      </Button>
    </div>
  )
}
