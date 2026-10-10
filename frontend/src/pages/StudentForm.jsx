import { useEffect, useState } from "react";
import { ArrowLeft, Save, UserPlus } from "lucide-react";

const EMPTY_FORM = {
  name: "",
  email: "",
  rollNumber: "",
  department: "",
  semester: "",
  course: "",
  cgpa: "",
  phone: "",
};

export default function StudentForm({
  student = null,
  onBack,
  onSubmit,
  loading = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(student);

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || "",
        email: student.email || "",
        rollNumber: student.rollNumber || "",
        department: student.department || "",
        semester: student.semester || "",
        course: student.course || "",
        cgpa: student.cgpa ?? "",
        phone: student.phone || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setErrors({});
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required";
    }

    if (!form.department) {
      newErrors.department = "Select a department";
    }

    if (!form.semester) {
      newErrors.semester = "Select a semester";
    }

    if (!form.course.trim()) {
      newErrors.course = "Course is required";
    }

    if (form.cgpa === "") {
      newErrors.cgpa = "CGPA is required";
    } else if (Number(form.cgpa) < 0 || Number(form.cgpa) > 10) {
      newErrors.cgpa = "CGPA must be between 0 and 10";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const payload = {
      ...form,
      cgpa: Number(form.cgpa),
      semester: Number(form.semester),
    };

    await onSubmit?.(payload);
  };

  const inputClass = (field) =>
    `mt-2 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-700 outline-none transition ${
      errors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-slate-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
    }`;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          type="button"
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <p className="text-sm font-medium text-cyan-600">
            {isEditing ? "Student Management" : "Student Management"}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {isEditing ? "Edit Student" : "Add Student"}
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {isEditing
              ? "Update the student's information."
              : "Enter the details to create a new student record."}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        {/* Personal Information */}
        <div className="border-b border-slate-100 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
              <UserPlus className="h-5 w-5 text-cyan-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Student Information
              </h2>

              <p className="text-sm text-slate-500">
                Basic personal and academic details
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={inputClass("name")}
              />

              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email <span className="text-red-500">*</span>
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="student@example.com"
                className={inputClass("email")}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Roll Number */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Roll Number <span className="text-red-500">*</span>
              </label>

              <input
                name="rollNumber"
                value={form.rollNumber}
                onChange={handleChange}
                placeholder="e.g. 22MUJ1234"
                className={inputClass("rollNumber")}
              />

              {errors.rollNumber && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.rollNumber}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className={inputClass("phone")}
              />
            </div>

            {/* Department */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Department <span className="text-red-500">*</span>
              </label>

              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className={inputClass("department")}
              >
                <option value="">Select department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">
                  Information Technology
                </option>
                <option value="Artificial Intelligence">
                  Artificial Intelligence
                </option>
                <option value="Electronics & Communication">
                  Electronics & Communication
                </option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
                <option value="Civil Engineering">
                  Civil Engineering
                </option>
              </select>

              {errors.department && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.department}
                </p>
              )}
            </div>

            {/* Course */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Course <span className="text-red-500">*</span>
              </label>

              <input
                name="course"
                value={form.course}
                onChange={handleChange}
                placeholder="e.g. B.Tech CSE"
                className={inputClass("course")}
              />

              {errors.course && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.course}
                </p>
              )}
            </div>

            {/* Semester */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Semester <span className="text-red-500">*</span>
              </label>

              <select
                name="semester"
                value={form.semester}
                onChange={handleChange}
                className={inputClass("semester")}
              >
                <option value="">Select semester</option>
                {Array.from({ length: 8 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Semester {index + 1}
                  </option>
                ))}
              </select>

              {errors.semester && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.semester}
                </p>
              )}
            </div>

            {/* CGPA */}
            <div>
              <label className="text-sm font-semibold text-slate-700">
                CGPA <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="cgpa"
                value={form.cgpa}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.01"
                placeholder="e.g. 8.45"
                className={inputClass("cgpa")}
              />

              {errors.cgpa && (
                <p className="mt-1.5 text-xs text-red-500">{errors.cgpa}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 bg-slate-50/70 p-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />

            {loading
              ? "Saving..."
              : isEditing
                ? "Update Student"
                : "Save Student"}
          </button>
        </div>
      </form>
    </div>
  );
}