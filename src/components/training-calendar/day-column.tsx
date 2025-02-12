'use client';

import { useDroppable } from '@dnd-kit/core';
import { DayWorkouts, Workout } from '@/contexts/training-context';
import { WorkoutCard } from './workout-card';
import Image from 'next/image';

interface DayColumnProps {
  day: DayWorkouts;
}

export const DayColumn = ({ day }: DayColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: day.date.toISOString(),
    data: { date: day.date },
  });

  const isToday = day.date.toDateString() === new Date().toDateString();
  
  return (
    <div className="flex flex-col h-full">
      {/* Day header outside the droppable area */}
      <div className="h-8 flex items-center">
        <div className="text-[13px] font-semibold text-dateHeader">
          {day.date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
        </div>
      </div>

      {/* Droppable area */}
      <div
        ref={setNodeRef}
        className={`relative flex-1 min-h-[calc(100vh-10rem)] rounded-workout ${
          isOver ? 'bg-gray-50/50' : 'bg-main'
        }`}
      >
        {/* Date indicator */}
        <div className="absolute top-2 left-2">
          <div
            className={`text-[15px] ${
              isToday ? 'text-purple font-semibold' : 'text-dateIndicator'
            }`}
          >
            {day.date.getDate().toString().padStart(2, '0')}
          </div>
        </div>

        {/* Add workout button */}
        <button 
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
          aria-label="Add workout"
        >
          <Image
            src="/icons/ic-add.svg"
            alt="Add"
            width={13}
            height={14}
          />
        </button>

        {/* Workouts section */}
        <div className="px-2 pt-12 pb-2 space-y-2">
          {day.workouts
            .filter((workout): workout is Workout => Boolean(workout && workout.id))
            .map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                fromDay={day.date}
              />
            ))}
        </div>
      </div>
    </div>
  );
};