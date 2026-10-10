import {
  ArrowLeft,
  Pencil,
  Trash2,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Hash,
  Building2,
} from "lucide-react";

export default function StudentDetails({
  student,
  onBack,
  onEdit,
  onDelete,
}) {
  if (!student) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-slate-800">
          Student not found
        </h2>

        <button
          onClick={onBack}
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          Back to Students
        </button>
      </div>
    );
  }

  const initials =
    student.name
      ?.split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const details = [
    {
      label: "Roll Number",
      value: student.rollNumber,
      icon: Hash,
    },
    {
      label: "Department",
      value: student.department,
      icon: Building2,
    },
    {
      label: "Course",
      value: student.course,
      icon: BookOpen,
    },
    {
      label: "Semester",
      value: student.semester
        ? `Semester ${student.semester}`
        : "—",
      icon: GraduationCap,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <p className="text-sm font-medium text-cyan-600">
            Student Directory
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Student Details
          </h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-linear-to-r from-cyan-600 to-slate-800" />

        <div className="px-6 pb-6">
          <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-cyan-100 text-2xl font-bold text-cyan-700 shadow-sm">
                {initials}
              </div>

              <div className="pb-1">
                <h2 className="text-2xl font-bold text-slate-900">
                  {student.name}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {student.course || "Student"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(student)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              <button
                onClick={() => onDelete?.(student)}
                className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>

          {/* Contact */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                <Mail className="h-4 w-4 text-cyan-600" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">Email</p>
                <p className="truncate text-sm font-medium text-slate-700">
                  {student.email || "—"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                <Phone className="h-4 w-4 text-cyan-600" />
              </div>

              <div>
                <p className="text-xs text-slate-400">Phone</p>
                <p className="text-sm font-medium text-slate-700">
                  {student.phone || "—"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Information */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          Academic Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Current academic details for this student.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {details.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4"
              >
                <Icon className="h-5 w-5 text-cyan-600" />

                <p className="mt-4 text-xs font-medium text-slate-400">
                  {item.label}
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {item.value || "—"}
                </p>
              </div>
            );
          })}
        </div>

        {/* CGPA */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-5">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Current CGPA
            </p>

            <p className="mt-1 text-xs text-emerald-600">
              Out of 10.00
            </p>
          </div>

          <p className="text-3xl font-bold text-emerald-700">
            {student.cgpa ?? "—"}
          </p>
        </div>
      </div>
    </div>
  );
}