const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const studentApi = {
  getStudents: () => request("/students"),

  getStudent: (id) => request(`/students/${id}`),

  createStudent: (student) =>
    request("/students", {
      method: "POST",
      body: JSON.stringify(student),
    }),

  updateStudent: (id, student) =>
    request(`/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(student),
    }),

  deleteStudent: (id) =>
    request(`/students/${id}`, {
      method: "DELETE",
    }),
};