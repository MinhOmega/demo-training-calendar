"use client";

import { Workout } from "@/contexts/training-context";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { ExerciseItem } from "./exercise-item";

interface WorkoutCardProps {
  workout: Workout;
  fromDay: Date;
  isDragging?: boolean;
  position: number;
}

export const WorkoutCard = ({ workout, fromDay, isDragging = false, position }: WorkoutCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isBeingDragged,
  } = useSortable({
    id: workout.id,
    data: {
      type: "workout",
      fromDay,
      position,
      workoutId: workout.id,
      date: fromDay,
    },
  });

  const dragState = isDragging || isBeingDragged;
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-main rounded-workout border border-border2 ${dragState ? "opacity-50 scale-105" : ""} ${
        isBeingDragged ? "z-50" : "z-0"
      }`}
    >
      <div className="py-[5px]">
        <div className="flex items-center justify-between mb-2 px-[7px]">
          <h3 className="text-purple text-sm font-bold truncate flex-1 pr-2">{workout.name}</h3>
          <button 
            className="text-gray-400 hover:text-gray-600" 
            aria-label="More options"
            {...listeners}
            {...attributes}
          >
            <Image src="/icons/ic-drag.svg" alt="Drag" width={12} height={3} />
          </button>
        </div>

        <SortableContext items={workout.exercises.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2 px-[3px]">
            {workout.exercises.map((exercise, index) => (
              <ExerciseItem key={exercise.id} exercise={exercise} workoutId={workout.id} position={index} />
            ))}
          </div>
        </SortableContext>
      </div>

      {/* Add exercise button */}
      <button className="w-full h-5 flex items-center justify-end pr-1" aria-label="Add exercise">
        <Image src="/icons/ic-add.svg" alt="Add" width={13} height={14} />
      </button>
    </div>
  );
};
