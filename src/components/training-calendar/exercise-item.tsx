"use client";

import { useDraggable } from "@dnd-kit/core";
import { Exercise } from "@/contexts/training-context";

interface ExerciseItemProps {
  exercise: Exercise;
  workoutId: string;
  isDragging?: boolean;
}

export const ExerciseItem = ({ exercise, workoutId, isDragging = false }: ExerciseItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging: isBeingDragged,
  } = useDraggable({
    id: exercise.id,
    data: { type: "exercise", fromWorkoutId: workoutId },
  });

  const setsDisplay = exercise.sets.map((set) => `${set.weight} lb x ${set.reps}`).join(", ");

  const dragState = isDragging || isBeingDragged;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center bg-white rounded-card px-3 py-2 border border-border shadow-card ${
        dragState ? "opacity-50 scale-105" : ""
      }`}
    >
      <div className="text-xs text-gray-400 mr-3 whitespace-nowrap">{exercise.sets.length}x</div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900 truncate">{exercise.name}</div>
        <div className="text-xs text-gray-500 truncate mt-0.5">{setsDisplay}</div>
      </div>
    </div>
  );
};
