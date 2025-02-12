import { Workout } from "@/contexts/training-context";

export const sampleWorkouts: Workout[] = [
  {
    id: "w1",
    name: "CHEST DAY - WITH ARM EXERCISES",
    position: 0,
    exercises: [
      {
        id: "e1",
        name: "Bench Press Medium Grip",
        position: 0,
        sets: [
          { weight: 50, reps: 5 },
          { weight: 60, reps: 5 },
          { weight: 70, reps: 5 },
        ],
      },
      {
        id: "e2",
        name: "Exercise B",
        position: 1,
        sets: [{ weight: 40, reps: 10 }],
      },
    ],
  },
  {
    id: "w2",
    name: "LEG DAY",
    position: 1,
    exercises: [
      {
        id: "e3",
        name: "Exercise C",
        position: 0,
        sets: [{ weight: 30, reps: 6 }],
      },
      {
        id: "e4",
        name: "Exercise D",
        position: 1,
        sets: [{ weight: 40, reps: 5 }],
      },
      {
        id: "e5",
        name: "Exercise E",
        position: 2,
        sets: [{ weight: 50, reps: 5 }],
      },
    ],
  },
  {
    id: "w3",
    name: "ARM DAY",
    position: 2,
    exercises: [
      {
        id: "e6",
        name: "Exercise F",
        position: 0,
        sets: [{ weight: 60, reps: 6 }],
      },
    ],
  },
]; 