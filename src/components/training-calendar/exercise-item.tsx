"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Exercise } from "@/contexts/training-context";

interface ExerciseItemProps {
  exercise: Exercise;
  workoutId: string;
  isDragging?: boolean;
  position: number;
}

export const ExerciseItem = ({ exercise, workoutId, isDragging = false, position }: ExerciseItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isBeingDragged,
  } = useSortable({
    id: exercise.id,
    data: {
      type: "exercise",
      fromWorkoutId: workoutId,
      position,
    },
  });

  const setsDisplay = exercise.sets.map((set) => `${set.weight} lb x ${set.reps}`).join(", ");
  const dragState = isDragging || isBeingDragged;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-end bg-white rounded-card px-[8px] py-[5px] border border-border shadow-card ${
        dragState ? "opacity-50 scale-105" : ""
      } ${isBeingDragged ? "z-50" : "z-0"}`}
    >
      <div className="text-ten text-exerciseItemSets mr-3 whitespace-nowrap font-bold">{exercise.sets.length}x</div>
      <div className="min-w-0 flex-1 flex flex-col justify-start truncate text-end">
        <div className="text-sm font-semibold text-black truncate" title={exercise.name}>
          {exercise.name}
        </div>
        <div className="text-ten text-exerciseItemNumber truncate mt-0.5 font-normal" title={setsDisplay}>
          {setsDisplay}
        </div>
      </div>
    </div>
  );
};
