import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ChevronDown, ChevronUp, Copy, GripVertical, Pencil, Trash2 } from 'lucide-react'

import { typeLabel, usesOptions } from '../../../lib/form-field'
import type { FormField } from '../../../lib/types'
import { Button } from '../../ui/Button'
import { Badge } from '../../ui/Badge'

interface SortableFieldItemProps {
  field: FormField
  index: number
  total: number
  onEdit: (field: FormField) => void
  onDuplicate: (field: FormField) => void
  onDelete: (field: FormField) => void
  onMove: (index: number, direction: -1 | 1) => void
}

function SortableFieldItem({
  field,
  index,
  total,
  onEdit,
  onDuplicate,
  onDelete,
  onMove,
}: SortableFieldItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-3 rounded-lg border bg-surface p-4 transition-colors duration-200 ${
        isDragging ? 'border-emerald shadow-lift opacity-80' : 'border-hairline'
      }`}
    >
      <button
        type="button"
        aria-label={`Seret ${field.label}`}
        className="mt-0.5 grid size-8 shrink-0 cursor-grab place-items-center rounded-md text-muted-soft hover:bg-paper-deep hover:text-emerald active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" strokeWidth={1.6} aria-hidden="true" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-soft">{String(index + 1).padStart(2, '0')}</span>
          <p className="truncate text-sm font-medium text-ink">{field.label}</p>
          {field.required ? <Badge tone="emerald">Wajib</Badge> : null}
        </div>
        <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
          {typeLabel(field.type)}
          {usesOptions(field.type) ? ` · ${field.options?.length ?? 0} pilihan` : ''}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
          aria-label={`Pindah ${field.label} ke atas`}
        >
          <ChevronUp className="size-4" strokeWidth={1.6} aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onMove(index, 1)}
          disabled={index === total - 1}
          aria-label={`Pindah ${field.label} ke bawah`}
        >
          <ChevronDown className="size-4" strokeWidth={1.6} aria-hidden="true" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDuplicate(field)} aria-label={`Duplikasi ${field.label}`}>
          <Copy className="size-4" strokeWidth={1.6} aria-hidden="true" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onEdit(field)} aria-label={`Edit ${field.label}`}>
          <Pencil className="size-4" strokeWidth={1.6} aria-hidden="true" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(field)}
          aria-label={`Hapus ${field.label}`}
          className="text-clay hover:text-clay"
        >
          <Trash2 className="size-4" strokeWidth={1.6} aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}

interface FieldSortableListProps {
  fields: FormField[]
  onReorder: (fields: FormField[]) => void
  onEdit: (field: FormField) => void
  onDuplicate: (field: FormField) => void
  onDelete: (field: FormField) => void
}

export function FieldSortableList({
  fields,
  onReorder,
  onEdit,
  onDuplicate,
  onDelete,
}: FieldSortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = fields.findIndex((field) => field.id === active.id)
    const newIndex = fields.findIndex((field) => field.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorder(arrayMove(fields, oldIndex, newIndex))
  }

  function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= fields.length) return
    onReorder(arrayMove(fields, index, target))
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <SortableFieldItem
              key={field.id}
              field={field}
              index={index}
              total={fields.length}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onMove={handleMove}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}