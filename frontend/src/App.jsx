import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,

  GraduationCap,
  Menu,
  X,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentForm from "./pages/StudentForm";
import StudentDetails from "./pages/StudentDetails";


import Toast from "./components/Toast";
import DeleteModal from "./components/DeleteModal";
import { studentApi } from "./services/studentApi";

const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "students",
    label: "Students",
    icon: Users,
  },
  {
    id: "add",
    label: "Add Student",
    icon: UserPlus,
  },

];

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [deleteStudent, setDeleteStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /*
   * Load students from Flask API.
   *
   * Flask API -> MySQL -> JSON -> React
   */
  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await studentApi.getStudents();

      setStudents(Array.isArray(data) ? data : data.students || []);
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Unable to connect to the backend. Make sure Flask is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        message: "",
        type: "success",
      });
    }, 3000);
  };

  const navigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);

    if (page !== "students") {
      setSelectedStudent(null);
    }

    if (page !== "add") {
      setEditingStudent(null);
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setActivePage("details");
    setSidebarOpen(false);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setActivePage("add");
    setSidebarOpen(false);
  };

  const handleSaveStudent = async (studentData) => {
    try {
      setSaving(true);

      if (editingStudent) {
        await studentApi.updateStudent(
          editingStudent.id,
          studentData
        );

        showToast("Student updated successfully.");
      } else {
        await studentApi.createStudent(studentData);

        showToast("Student added successfully.");
      }

      await loadStudents();

      setEditingStudent(null);
      setActivePage("students");
    } catch (err) {
      console.error(err);

      showToast(
        err.message || "Unable to save student.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!deleteStudent) return;

    try {
      setDeleting(true);

      await studentApi.deleteStudent(deleteStudent.id);

      await loadStudents();

      if (selectedStudent?.id === deleteStudent.id) {
        setSelectedStudent(null);
        setActivePage("students");
      }

      setDeleteStudent(null);

      showToast("Student deleted successfully.");
    } catch (err) {
      console.error(err);

      showToast(
        err.message || "Unable to delete student.",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const renderPage = () => {
    if (loading && activePage === "dashboard") {
      return (
        <LoadingState />
      );
    }

    if (activePage === "dashboard") {
      return (
        <Dashboard
          students={students}
          onNavigate={navigate}
        />
      );
    }

    if (activePage === "students") {
      return (
        <Students
          students={students}
          onNavigate={navigate}
          onView={handleViewStudent}
          onEdit={handleEditStudent}
          onDelete={setDeleteStudent}
        />
      );
    }

    if (activePage === "add") {
      return (
        <StudentForm
          student={editingStudent}
          loading={saving}
          onBack={() => {
            setEditingStudent(null);
            navigate("students");
          }}
          onSubmit={handleSaveStudent}
        />
      );
    }

    if (activePage === "details") {
      return (
        <StudentDetails
          student={selectedStudent}
          onBack={() => navigate("students")}
          onEdit={handleEditStudent}
          onDelete={setDeleteStudent}
        />
      );
    }



    return null;
  };

  const pageTitle =
    activePage === "details"
      ? "Student Details"
      : NAV_ITEMS.find((item) => item.id === activePage)?.label ||
        "Dashboard";

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5">
          <button
            onClick={() => navigate("dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div className="text-left">
              <p className="text-sm font-bold text-slate-900">
                UniCloud
              </p>

              <p className="text-xs text-slate-400">
                Student Portal
              </p>
            </div>
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu
          </p>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />

                <span>{item.label}</span>

                {active && (
                  <ChevronRight className="ml-auto h-4 w-4" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-700">
              Cloud-Based Student Management
            </p>

            <p className="mt-1 text-[11px] leading-4 text-slate-400">
              React Â· Flask Â· MySQL Â· Docker
            </p>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div>
              <p className="text-xs text-slate-400">
                UniCloud Portal
              </p>

              <p className="text-sm font-semibold text-slate-800">
                {pageTitle}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-medium text-slate-500">
              Student Management System
            </span>
          </div>
        </header>

        {/* Error banner */}
        {error && (
          <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6">
            <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

              <div className="flex-1">
                <p className="text-sm font-semibold text-red-700">
                  Backend connection failed
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>

                <button
                  onClick={loadStudents}
                  className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page content */}
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />

      {/* Delete confirmation */}
      <DeleteModal
        student={deleteStudent}
        loading={deleting}
        onConfirm={handleDeleteStudent}
        onCancel={() => {
          if (!deleting) {
            setDeleteStudent(null);
          }
        }}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-600" />
        </div>

        <p className="mt-4 text-sm font-medium text-slate-700">
          Loading students...
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Connecting to the Flask backend
        </p>
      </div>
    </div>
  );
}

export default App;
