"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface WorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (workoutName: string) => void;
  date: Date;
}

export const WorkoutModal = ({ isOpen, onClose, onSubmit, date }: WorkoutModalProps) => {
  const [workoutName, setWorkoutName] = useState("");
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
    if (workoutName.trim()) {
      onSubmit(workoutName.trim());
      setWorkoutName("");
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
              Create Workout for {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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
            <div className="mb-6">
              <label htmlFor="workoutName" className="block text-sm font-medium text-gray-700 mb-2">
                Workout Name
              </label>
              <input
                ref={inputRef}
                type="text"
                id="workoutName"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent text-black"
                placeholder="Enter workout name"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
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
                Create Workout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 