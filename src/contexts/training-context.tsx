"use client";

import { createContext, useContext, ReactNode, useState } from "react";
import { sampleWorkouts } from "@/data/sample-workouts";

export type Exercise = {
  id: string;
  name: string;
  position: number;
  sets: {
    reps: number;
    weight: number;
  }[];
};

export type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
  position: number;
};

export type DayWorkouts = {
  date: Date;
  workouts: Workout[];
};

type TrainingContextType = {
  weekWorkouts: DayWorkouts[];
  moveWorkout: (fromDay: Date, toDay: Date, workoutId: string) => void;
  moveExercise: (fromWorkoutId: string, toWorkoutId: string, exerciseId: string) => void;
  reorderWorkout: (dayDate: Date, fromPosition: number, toPosition: number) => void;
  reorderExercise: (workoutId: string, fromPosition: number, toPosition: number) => void;
};

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error("useTraining must be used within a TrainingProvider");
  }
  return context;
};

const generateInitialWeek = (): DayWorkouts[] => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(monday.getDate() - monday.getDay() + 1); // Start with Monday

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);

    // Distribute workouts across specific days
    let workouts: Workout[] = [];
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 2) {
      // Tuesday
      workouts = [sampleWorkouts[0]]; // CHEST DAY
    } else if (dayOfWeek === 3) {
      // Wednesday
      workouts = [sampleWorkouts[1], sampleWorkouts[2]]; // LEG DAY and ARM DAY
    }

    return {
      date,
      workouts,
    };
  });
};

const initialWeekWorkouts = generateInitialWeek();

export const TrainingProvider = ({ children }: { children: ReactNode }) => {
  const [weekWorkouts, setWeekWorkouts] = useState<DayWorkouts[]>(initialWeekWorkouts);

  const moveWorkout = (fromDay: Date, toDay: Date, workoutId: string) => {
    setWeekWorkouts((prev) => {
      const newWeekWorkouts = [...prev];
      const fromDayIndex = newWeekWorkouts.findIndex((d) => d.date.toDateString() === fromDay.toDateString());
      const toDayIndex = newWeekWorkouts.findIndex((d) => d.date.toDateString() === toDay.toDateString());

      if (fromDayIndex === -1 || toDayIndex === -1) return prev;

      const fromWorkouts = [...newWeekWorkouts[fromDayIndex].workouts];
      const toWorkouts = [...newWeekWorkouts[toDayIndex].workouts];

      // Find and remove workout from source day
      const workoutIndex = fromWorkouts.findIndex((w) => w?.id === workoutId);
      if (workoutIndex === -1) return prev;

      const [movedWorkout] = fromWorkouts.splice(workoutIndex, 1);
      if (!movedWorkout) return prev;

      // Update positions in source day
      fromWorkouts.forEach((workout, index) => {
        workout.position = index;
      });

      // Add workout to target day at the end
      movedWorkout.position = toWorkouts.length;
      toWorkouts.push(movedWorkout);

      // Update both days
      newWeekWorkouts[fromDayIndex] = {
        ...newWeekWorkouts[fromDayIndex],
        workouts: fromWorkouts,
      };

      newWeekWorkouts[toDayIndex] = {
        ...newWeekWorkouts[toDayIndex],
        workouts: toWorkouts,
      };

      return newWeekWorkouts;
    });
  };

  const moveExercise = (fromWorkoutId: string, toWorkoutId: string, exerciseId: string) => {
    setWeekWorkouts((prev) => {
      const newWeekWorkouts = [...prev];

      // Find source workout
      const fromDayIndex = newWeekWorkouts.findIndex((day) => day.workouts.some((w) => w.id === fromWorkoutId));
      if (fromDayIndex === -1) return prev;

      const fromWorkoutIndex = newWeekWorkouts[fromDayIndex].workouts.findIndex((w) => w.id === fromWorkoutId);
      if (fromWorkoutIndex === -1) return prev;

      // Find target workout
      const toDayIndex = newWeekWorkouts.findIndex((day) => day.workouts.some((w) => w.id === toWorkoutId));
      if (toDayIndex === -1) return prev;

      const toWorkoutIndex = newWeekWorkouts[toDayIndex].workouts.findIndex((w) => w.id === toWorkoutId);
      if (toWorkoutIndex === -1) return prev;

      // Find and remove exercise from source
      const fromWorkout = newWeekWorkouts[fromDayIndex].workouts[fromWorkoutIndex];
      const exerciseIndex = fromWorkout.exercises.findIndex((e) => e.id === exerciseId);
      if (exerciseIndex === -1) return prev;

      const [exercise] = fromWorkout.exercises.splice(exerciseIndex, 1);

      // Update positions for remaining exercises in source workout
      fromWorkout.exercises.forEach((ex, idx) => {
        ex.position = idx;
      });

      // Add exercise to target workout
      const toWorkout = newWeekWorkouts[toDayIndex].workouts[toWorkoutIndex];
      const newPosition = toWorkout.exercises.length;
      toWorkout.exercises.push({
        ...exercise,
        position: newPosition,
      });

      // Update both workouts
      newWeekWorkouts[fromDayIndex].workouts[fromWorkoutIndex] = fromWorkout;
      newWeekWorkouts[toDayIndex].workouts[toWorkoutIndex] = toWorkout;

      return newWeekWorkouts;
    });
  };

  const reorderWorkout = (dayDate: Date, fromPosition: number, toPosition: number) => {
    setWeekWorkouts((prev) => {
      const newWeekWorkouts = [...prev];
      const dayIndex = newWeekWorkouts.findIndex((d) => d.date.toDateString() === dayDate.toDateString());

      if (dayIndex === -1) return prev;

      const dayWorkouts = [...newWeekWorkouts[dayIndex].workouts];

      // Ensure positions are within bounds
      if (
        fromPosition < 0 ||
        fromPosition >= dayWorkouts.length ||
        toPosition < 0 ||
        toPosition >= dayWorkouts.length
      ) {
        return prev;
      }

      // Remove workout from old position
      const [movedWorkout] = dayWorkouts.splice(fromPosition, 1);

      // Insert workout at new position
      dayWorkouts.splice(toPosition, 0, movedWorkout);

      // Update positions for all workouts in the day
      dayWorkouts.forEach((workout, index) => {
        workout.position = index;
      });

      // Update the day's workouts
      newWeekWorkouts[dayIndex] = {
        ...newWeekWorkouts[dayIndex],
        workouts: dayWorkouts,
      };

      return newWeekWorkouts;
    });
  };

  const reorderExercise = (workoutId: string, fromPosition: number, toPosition: number) => {
    setWeekWorkouts((prev) => {
      // Deep clone to ensure state updates
      const newWeekWorkouts = structuredClone(prev);

      // Find the workout containing the exercise
      const workoutDayIndex = newWeekWorkouts.findIndex((day) => day.workouts.some((w) => w.id === workoutId));

      if (workoutDayIndex === -1) return prev;

      const workoutIndex = newWeekWorkouts[workoutDayIndex].workouts.findIndex((w) => w.id === workoutId);
      if (workoutIndex === -1) return prev;

      const workout = newWeekWorkouts[workoutDayIndex].workouts[workoutIndex];
      const exercises = workout.exercises;

      // Ensure positions are within bounds
      if (fromPosition < 0 || fromPosition >= exercises.length || toPosition < 0 || toPosition >= exercises.length) {
        return prev;
      }

      // Remove exercise from old position and insert at new position
      const [movedExercise] = exercises.splice(fromPosition, 1);
      exercises.splice(toPosition, 0, movedExercise);

      // Update positions for all exercises
      exercises.forEach((exercise, index) => {
        exercise.position = index;
      });

      // Update the workout directly in the newWeekWorkouts array
      newWeekWorkouts[workoutDayIndex].workouts[workoutIndex].exercises = exercises;

      return newWeekWorkouts;
    });
  };

  return (
    <TrainingContext.Provider value={{ weekWorkouts, moveWorkout, moveExercise, reorderWorkout, reorderExercise }}>
      {children}
    </TrainingContext.Provider>
  );
};
