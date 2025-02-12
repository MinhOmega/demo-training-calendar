"use client";

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { DayColumn } from "./day-column";
import { useTraining } from "@/contexts/training-context";
import { useState } from "react";
import { WorkoutCard } from "./workout-card";
import { ExerciseItem } from "./exercise-item";

export const Calendar = () => {
  const { weekWorkouts, moveWorkout, moveExercise, reorderWorkout, reorderExercise } = useTraining();
  const [activeItem, setActiveItem] = useState<{
    id: string;
    type: "workout" | "exercise";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  } | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveItem({
      id: active.id as string,
      type: active.data.current?.type,
      data: active.data.current,
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.data.current?.type === "workout") {
      const fromDay = active.data.current.fromDay;
      const fromPosition = active.data.current.position;

      // Handle dropping on a workout
      if (over.data.current?.type === "workout") {
        const toDay = over.data.current.date;
        const toPosition = over.data.current.position;

        if (fromDay.toDateString() === toDay.toDateString()) {
          // Same day - reorder
          if (fromPosition !== toPosition) {
            reorderWorkout(fromDay, fromPosition, toPosition);
          }
        } else {
          // Different day - move
          moveWorkout(fromDay, toDay, active.id as string);
        }
      }
      // Handle dropping on a column
      else if (over.data.current?.isColumn) {
        const toDay = over.data.current.date;
        const dayWorkouts = weekWorkouts.find((d) => d.date.toDateString() === toDay.toDateString())?.workouts;

        if (dayWorkouts) {
          if (fromDay.toDateString() === toDay.toDateString()) {
            // If dropping in the same day column, move to the end
            reorderWorkout(fromDay, fromPosition, dayWorkouts.length - 1);
          } else {
            moveWorkout(fromDay, toDay, active.id as string);
          }
        }
      }
    } else if (active.data.current?.type === "exercise") {
      const fromWorkoutId = active.data.current.fromWorkoutId;
      const fromPosition = active.data.current.position;

      if (over.data.current?.type === "exercise") {
        const toWorkoutId = over.data.current.fromWorkoutId;
        const toPosition = over.data.current.position;

        if (fromWorkoutId === toWorkoutId) {
          // Same workout - reorder
          if (fromPosition !== toPosition) {
            reorderExercise(fromWorkoutId, fromPosition, toPosition);
          }
        } else {
          // Different workout - move
          moveExercise(fromWorkoutId, toWorkoutId, active.id as string);
        }
      }
    }

    setActiveItem(null);
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[snapCenterToCursor]}
      collisionDetection={closestCenter}
    >
      <div className="grid grid-cols-7 gap-4 p-6">
        {weekWorkouts.map((day) => (
          <DayColumn key={day.date.toISOString()} day={day} />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeItem && activeItem.type === "workout" && (
          <WorkoutCard
            workout={weekWorkouts.flatMap((d) => d.workouts).find((w) => w.id === activeItem.id)!}
            fromDay={activeItem.data.fromDay}
            position={activeItem.data.position}
            isDragging
          />
        )}
        {activeItem && activeItem.type === "exercise" && (
          <ExerciseItem
            exercise={
              weekWorkouts
                .flatMap((d) => d.workouts)
                .flatMap((w) => w.exercises)
                .find((e) => e.id === activeItem.id)!
            }
            workoutId={activeItem.data.fromWorkoutId}
            position={activeItem.data.position}
            isDragging
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};
