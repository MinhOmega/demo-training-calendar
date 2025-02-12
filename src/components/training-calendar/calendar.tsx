'use client';

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { snapCenterToCursor } from '@dnd-kit/modifiers';
import { DayColumn } from './day-column';
import { useTraining } from '@/contexts/training-context';
import { useState } from 'react';
import { WorkoutCard } from './workout-card';
import { ExerciseItem } from './exercise-item';

export const Calendar = () => {
  const { weekWorkouts, moveWorkout, moveExercise } = useTraining();
  const [activeItem, setActiveItem] = useState<{
    id: string;
    type: 'workout' | 'exercise';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  } | null>(null);
  
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveItem({
      id: active.id as string,
      type: active.data.current?.type,
      data: active.data.current
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    if (active.data.current?.type === 'workout') {
      const fromDay = active.data.current.fromDay;
      const toDay = over.data.current?.date;
      if (toDay) {
        moveWorkout(fromDay, toDay, active.id as string);
      }
    } else if (active.data.current?.type === 'exercise') {
      const fromWorkoutId = active.data.current.fromWorkoutId;
      const toWorkoutId = over.data.current?.workoutId;
      if (toWorkoutId && fromWorkoutId !== toWorkoutId) {
        moveExercise(fromWorkoutId, toWorkoutId, active.id as string);
      }
    }
    setActiveItem(null);
  };

  if (!weekWorkouts) {
    return <div>Loading...</div>;
  }

  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[snapCenterToCursor]}
    >
      <div className="grid grid-cols-7 gap-4 p-6">
        {weekWorkouts.map((day) => (
          <DayColumn key={day.date.toISOString()} day={day} />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeItem && activeItem.type === 'workout' && (
          <WorkoutCard
            workout={weekWorkouts
              .flatMap(d => d.workouts)
              .find(w => w.id === activeItem.id)!}
            fromDay={activeItem.data.fromDay}
            isDragging
          />
        )}
        {activeItem && activeItem.type === 'exercise' && (
          <ExerciseItem
            exercise={weekWorkouts
              .flatMap(d => d.workouts)
              .flatMap(w => w.exercises)
              .find(e => e.id === activeItem.id)!}
            workoutId={activeItem.data.fromWorkoutId}
            isDragging
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}; 