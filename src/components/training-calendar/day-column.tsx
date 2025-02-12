"use client";

import { DayWorkouts, Workout } from "@/contexts/training-context";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Image from "next/image";
import { WorkoutCard } from "./workout-card";
import { useState } from "react";
import { useTraining } from "@/contexts/training-context";
import { WorkoutModal } from "../modal/workout-modal";

interface DayColumnProps {
  day: DayWorkouts;
}

export const DayColumn = ({ day }: DayColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: day.date.toISOString(),
    data: {
      type: "day",
      date: day.date,
      isColumn: true,
    },
  });

  const { createWorkout } = useTraining();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isToday = day.date.toDateString() === new Date().toDateString();

  // Sort workouts by position
  const sortedWorkouts = [...day.workouts]
    .filter((workout): workout is Workout => Boolean(workout && workout.id))
    .sort((a, b) => a.position - b.position);

  const handleCreateWorkout = (workoutName: string) => {
    createWorkout(day.date, workoutName);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Day header outside the droppable area */}
      <div className="flex items-center mb-[9px]">
        <div className="text-ten font-semibold text-dateHeader">
          {day.date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()}
        </div>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={`relative flex-1 min-h-[calc(100vh-10rem)] rounded-workout ${isOver ? "bg-gray-50/50" : "bg-main"}`}
      >
        <div className="flex px-[10px] pb-[4px] pt-[10px] justify-between items-center">
          {/* Date indicator */}
          <div className={`text-eleven ${isToday ? "text-purple font-bold" : "text-dateIndicator font-semibold"}`}>
            {day.date.getDate().toString().padStart(2, "0")}
          </div>

          {/* Add workout button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center rounded"
            aria-label="Add workout"
          >
            <Image src="/icons/ic-add.svg" alt="Add" width={12} height={12} />
          </button>
        </div>

        <SortableContext items={sortedWorkouts.map((w) => w.id)} strategy={verticalListSortingStrategy}>
          <div className="px-2 pb-2 space-y-1.5">
            {sortedWorkouts.map((workout, index) => (
              <WorkoutCard key={workout.id} workout={workout} fromDay={day.date} position={index} />
            ))}
          </div>
        </SortableContext>

        <WorkoutModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateWorkout}
          date={day.date}
        />
      </div>
    </div>
  );
};
