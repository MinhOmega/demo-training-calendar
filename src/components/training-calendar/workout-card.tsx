"use client";

import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Workout } from "@/contexts/training-context";
import { ExerciseItem } from "./exercise-item";
import Image from "next/image";

interface WorkoutCardProps {
  workout: Workout;
  fromDay: Date;
  isDragging?: boolean;
}

export const WorkoutCard = ({ workout, fromDay, isDragging = false }: WorkoutCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging: isBeingDragged,
  } = useDraggable({
    id: workout.id,
    data: { type: "workout", fromDay },
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `workout-${workout.id}`,
    data: { type: "workout", workoutId: workout.id },
  });

  const setRefs = (node: HTMLDivElement) => {
    setDragRef(node);
    setDropRef(node);
  };

  const dragState = isDragging || isBeingDragged;

  return (
    <div
      ref={setRefs}
      {...listeners}
      {...attributes}
      className={`bg-white rounded-workout border border-border2 ${dragState ? "opacity-50 scale-105" : ""} ${
        isOver ? "bg-gray-50" : ""
      }`}
    >
      <div className="py-[5px]">
        <div className="flex items-center justify-between mb-2 px-[7px]">
          <h3 className="text-purple text-sm font-semibold truncate flex-1 pr-2">{workout.name}</h3>
          <button className="text-gray-400 hover:text-gray-600" aria-label="More options">
            <Image src="/icons/ic-drag.svg" alt="Drag" width={12} height={3} />
          </button>
        </div>

        <div className="space-y-2 px-[3px]">
          {workout.exercises.map((exercise) => (
            <ExerciseItem key={exercise.id} exercise={exercise} workoutId={workout.id} />
          ))}
        </div>
      </div>

      {/* Add exercise button */}
      <button className="w-full h-5 flex items-center justify-end pr-1" aria-label="Add exercise">
        <Image src="/icons/ic-add.svg" alt="Add" width={13} height={14} />
      </button>
    </div>
  );
};
