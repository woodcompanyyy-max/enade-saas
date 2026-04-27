'use client';

import { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutDashboard, BookOpen, Loader2 } from 'lucide-react';

interface CourseOption {
  id: string;
  name: string;
}

interface Props {
  courses: CourseOption[];
}

export function DashboardCourseFilter({ courses }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCourseId = searchParams.get('courseId') || '';

  const handleCourseChange = (id: string) => {
    const params = new URLSearchParams(window.location.search);
    
    if (id) {
      params.set('courseId', id);
    } else {
      params.delete('courseId');
    }

    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  return (
    <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 p-1.5 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/50 rounded-xl text-zinc-400">
        {currentCourseId ? <BookOpen size={16} /> : <LayoutDashboard size={16} />}
        <span className="text-xs font-bold uppercase tracking-wider">Visualização</span>
      </div>

      <select
        value={currentCourseId}
        onChange={(e) => handleCourseChange(e.target.value)}
        className="bg-transparent border-none focus:ring-0 text-sm font-bold text-white pr-8 cursor-pointer min-w-[200px]"
        disabled={isPending}
      >
        <option value="" className="bg-zinc-900">Visão Geral (Institucional)</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id} className="bg-zinc-900">
            {course.name}
          </option>
        ))}
      </select>

      {isPending && (
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin mr-2" />
      )}
    </div>
  );
}
