"use client";

import { createContext, useContext, ReactNode, useState } from "react";

export type Exercise = {
  id: string;
  name: string;
  sets: {
    reps: number;
    weight: number;
  }[];
};

export type Workout = {
  id: string;
  name: string;
  exercises: Exercise[];
};

export type DayWorkouts = {
  date: Date;
  workouts: Workout[];
};

type TrainingContextType = {
  weekWorkouts: DayWorkouts[];
  moveWorkout: (fromDay: Date, toDay: Date, workoutId: string) => void;
  moveExercise: (fromWorkoutId: string, toWorkoutId: string, exerciseId: string) => void;
};

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export const useTraining = () => {
  const context = useContext(TrainingContext);
  if (!context) {
    throw new Error("useTraining must be used within a TrainingProvider");
  }
  return context;
};

const generateSampleWorkouts = (): Workout[] => {
  return [
    {
      id: "w1",
      name: "CHEST DAY - WITH ARM EXERCISES",
      exercises: [
        {
          id: "e1",
          name: "Bench Press Medium Grip",
          sets: [
            { weight: 50, reps: 5 },
            { weight: 60, reps: 5 },
            { weight: 70, reps: 5 },
          ],
        },
        {
          id: "e2",
          name: "Exercise B",
          sets: [{ weight: 40, reps: 10 }],
        },
      ],
    },
    {
      id: "w2",
      name: "LEG DAY",
      exercises: [
        {
          id: "e3",
          name: "Exercise C",
          sets: [{ weight: 30, reps: 6 }],
        },
        {
          id: "e4",
          name: "Exercise D",
          sets: [{ weight: 40, reps: 5 }],
        },
        {
          id: "e5",
          name: "Exercise E",
          sets: [{ weight: 50, reps: 5 }],
        },
      ],
    },
    {
      id: "w3",
      name: "ARM DAY",
      exercises: [
        {
          id: "e6",
          name: "Exercise F",
          sets: [{ weight: 60, reps: 6 }],
        },
      ],
    },
  ];
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
      workouts = [generateSampleWorkouts()[0]]; // CHEST DAY
    } else if (dayOfWeek === 3) {
      // Wednesday
      workouts = [generateSampleWorkouts()[1], generateSampleWorkouts()[2]]; // LEG DAY and ARM DAY
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

      // Return if invalid indices
      if (fromDayIndex === -1 || toDayIndex === -1) return prev;

      const fromWorkouts = [...newWeekWorkouts[fromDayIndex].workouts];
      const workoutIndex = fromWorkouts.findIndex((w) => w?.id === workoutId);

      // Return if workout not found
      if (workoutIndex === -1) return prev;

      const [workout] = fromWorkouts.splice(workoutIndex, 1);

      // Ensure workout exists before moving
      if (!workout) return prev;

      newWeekWorkouts[fromDayIndex] = {
        ...newWeekWorkouts[fromDayIndex],
        workouts: fromWorkouts,
      };

      newWeekWorkouts[toDayIndex] = {
        ...newWeekWorkouts[toDayIndex],
        workouts: [...newWeekWorkouts[toDayIndex].workouts, workout],
      };

      return newWeekWorkouts;
    });
  };

  const moveExercise = (fromWorkoutId: string, toWorkoutId: string, exerciseId: string) => {
    setWeekWorkouts((prev) => {
      // Find the exercise first to ensure it exists
      const sourceWorkout = prev.flatMap((d) => d.workouts).find((w) => w?.id === fromWorkoutId);

      const exercise = sourceWorkout?.exercises.find((e) => e?.id === exerciseId);

      // Return if exercise not found
      if (!exercise) return prev;

      return prev.map((day) => ({
        ...day,
        workouts: day.workouts
          .map((workout) => {
            if (workout?.id === fromWorkoutId) {
              return {
                ...workout,
                exercises: workout.exercises.filter((e) => e?.id !== exerciseId),
              };
            }
            if (workout?.id === toWorkoutId) {
              return {
                ...workout,
                exercises: [...workout.exercises, exercise],
              };
            }
            return workout;
          })
          .filter(Boolean) as Workout[],
      }));
    });
  };

  return (
    <TrainingContext.Provider value={{ weekWorkouts, moveWorkout, moveExercise }}>{children}</TrainingContext.Provider>
  );
};
