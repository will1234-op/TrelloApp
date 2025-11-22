"use client"

import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { Clock, Trash2 } from "lucide-react"
import type { Task } from "./kanban-board"
import { cn } from "@/lib/utils"

type KanbanCardProps = {
  task: Task
  onDragStart: () => void
  onDragEnd: () => void
  onDelete: () => void
}

const priorityColors = {
  low: "bg-blue-500/10 text-blue-700 hover:bg-blue-500/20",
  medium: "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20",
  high: "bg-red-500/10 text-red-700 hover:bg-red-500/20",
}

export function KanbanCard({ task, onDragStart, onDragEnd, onDelete }: KanbanCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="group relative cursor-grab rounded-lg border bg-card p-3 shadow-sm transition-all hover:shadow-md active:cursor-grabbing active:opacity-50"
    >
      {/* Delete button - shown on hover */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-1 top-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Title */}
      <h4 className="mb-2 font-medium leading-snug text-card-foreground pr-6">{task.title}</h4>

      {/* Description */}
      {task.description && <p className="mb-3 text-sm text-muted-foreground">{task.description}</p>}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {task.priority && (
            <Badge variant="secondary" className={cn("text-xs", priorityColors[task.priority])}>
              {task.priority}
            </Badge>
          )}
        </div>

        {task.assignee && (
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {task.assignee.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      {task.dueDate && (
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{task.dueDate}</span>
        </div>
      )}
    </div>
  )
}
