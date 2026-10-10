import {
  Users,
  UserPlus,
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

export default function Dashboard({ students = [], onNavigate }) {
  const totalStudents = students.length;

  const averageCgpa =
    totalStudents > 0
      ? (
          students.reduce(
            (sum, student) => sum + Number(student.cgpa || 0),
            0
          ) / totalStudents
        ).toFixed(2)
      : "0.00";

  const departments = new Set(
    students.map((student) => student.department).filter(Boolean)
  ).size;

  const recentStudents = [...students].slice(-5).reverse();

  const stats = [
    {
      label: "Total Students",
      value: totalStudents,
      icon: Users,
      description: "Registered students",
    },
    {
      label: "Average CGPA",
      value: averageCgpa,
      icon: TrendingUp,
      description: "Across all students",
    },
    {
      label: "Departments",
      value: departments,
      icon: GraduationCap,
      description: "Active departments",
    },
    {
      label: "Quick Action",
      value: "+",
      icon: UserPlus,
      description: "Add a new student",
      action: () => onNavigate?.("add"),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-cyan-600">Overview</p>

        <div className="mt-1 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage your student records from one place.
            </p>
          </div>

          <button
            onClick={() => onNavigate?.("add")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <UserPlus className="h-4 w-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <button
              key={stat.label}
              onClick={stat.action}
              className={`rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition ${
                stat.action
                  ? "hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                  <Icon className="h-5 w-5 text-cyan-600" />
                </div>

                {stat.action && (
                  <ArrowUpRight className="h-5 w-5 text-slate-400" />
                )}
              </div>

              <p className="mt-5 text-sm font-medium text-slate-500">
                {stat.label}
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                {stat.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Recent Students */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Students
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Recently added student records
            </p>
          </div>

          <button
            onClick={() => onNavigate?.("students")}
            className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 hover:text-cyan-700"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {recentStudents.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 font-medium text-slate-700">
              No students yet
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Add your first student to get started.
            </p>

            <button
              onClick={() => onNavigate?.("add")}
              className="mt-5 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700"
            >
              Add Student
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-700">
                  {student.name
                    ?.split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {student.name}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {student.email}
                  </p>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-700">
                    {student.department || "—"}
                  </p>

                  <p className="text-xs text-slate-400">
                    CGPA: {student.cgpa ?? "—"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}