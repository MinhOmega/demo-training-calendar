'use client';

import { Calendar } from '@/components/training-calendar/calendar';
import { TrainingProvider } from '@/contexts/training-context';

export default function Home() {
  return (
    <TrainingProvider>
      <main className="container mx-auto py-8 bg-white min-h-screen">
        <Calendar />
      </main>
    </TrainingProvider>
  );
}
