import Link from "next/link";
import { COURSES, Course } from "@/lib/courses";
import { GraduationCap, BookOpen, Laptop, Users, TrendingUp } from "lucide-react";

export default function CoursesPage() {
  const categories: Course["type"][] = ["Bacharelado", "Licenciatura", "Tecnológico"];

  return (
    <div className="space-y-12 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Catálogo de Cursos</h2>
        <p className="text-sm text-muted-foreground">Visão geral de todos os cursos de graduação da instituição.</p>
      </div>

      {categories.map((category) => (
        <section key={category} className="space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-2">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">{category}s</h3>
            <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-xs font-bold text-zinc-500">
              {COURSES.filter(c => c.type === category).length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COURSES.filter((course) => course.type === category).map((course) => (
              <Link key={course.id} href={`/cursos/${course.id}`}>
                <CourseCard course={course} />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="group bg-white dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-2xl p-6 hover:shadow-lg hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden">
      {/* Visual Preview Bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex justify-between items-start mb-4">
        <div className="space-y-1">
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
            {course.name}
          </h4>
          <div className="flex items-center gap-2">
            {course.modality === "Presencial" && <Users size={14} className="text-zinc-400" />}
            {course.modality === "EaD" && <Laptop size={14} className="text-zinc-400" />}
            {course.modality === "Semipresencial" && <BookOpen size={14} className="text-zinc-400" />}
            <span className="text-xs text-muted-foreground font-medium">{course.modality}</span>
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 p-2 rounded-lg">
          <GraduationCap size={18} />
        </div>
      </div>

      {/* Mini Preview Stats */}
      <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs">
        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground">Nota ENADE</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
            3.8 <TrendingUp size={12} className="text-green-500" />
          </span>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <span className="text-muted-foreground mr-1">Risco</span>
          <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold">
            Baixo
          </span>
        </div>
      </div>
    </div>
  );
}
