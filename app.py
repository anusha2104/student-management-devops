from flask import Flask, jsonify

app = Flask(__name__)

students = [
    {"id": 1, "name": "Anusha", "course": "CSE"},
    {"id": 2, "name": "Rahul", "course": "CSE"}
]

@app.route("/")
def home():
    return "Student Management System is Running!"

@app.route("/students")
def get_students():
    return jsonify(students)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)