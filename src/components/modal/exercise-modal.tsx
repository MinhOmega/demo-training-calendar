"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exerciseName: string, weight: number, reps: number) => void;
  workoutName: string;
}

export const ExerciseModal = ({ isOpen, onClose, onSubmit, workoutName }: ExerciseModalProps) => {
  const [exerciseName, setExerciseName] = useState("");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exerciseName.trim() && !isNaN(Number(weight)) && !isNaN(Number(reps))) {
      onSubmit(exerciseName.trim(), Number(weight), Number(reps));
      setExerciseName("");
      setWeight("");
      setReps("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-workout w-full max-w-md mx-4 transform transition-all duration-200 ease-out"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Add Exercise to {workoutName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <Image src="/icons/ic-close.svg" alt="Close" width={16} height={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="exerciseName" className="block text-sm font-medium text-gray-700 mb-2">
                  Exercise Name
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  id="exerciseName"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-black"
                  placeholder="Enter exercise name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (lb)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-black"
                    placeholder="Enter weight"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="reps" className="block text-sm font-medium text-gray-700 mb-2">
                    Reps
                  </label>
                  <input
                    type="number"
                    id="reps"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-black"
                    placeholder="Enter reps"
                    required
                    min="1"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-purple rounded-md hover:bg-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple"
              >
                Add Exercise
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 