import os

from flask import Flask, jsonify, request
from flask_cors import CORS

from models import db, Student


app = Flask(__name__)
CORS(app)


# --------------------------------------------------
# Database configuration
# --------------------------------------------------

DB_USER = os.getenv("MYSQL_USER", "student_user")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "student_password")
DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_PORT = os.getenv("MYSQL_PORT", "3306")
DB_NAME = os.getenv("MYSQL_DATABASE", "student_management")

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}"
    f"@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "message": "Student Management API is running"
    })


# --------------------------------------------------
# Get all students
# --------------------------------------------------

@app.route("/api/students", methods=["GET"])
def get_students():
    students = Student.query.order_by(Student.id.desc()).all()

    return jsonify([
        student.to_dict()
        for student in students
    ])


# --------------------------------------------------
# Get one student
# --------------------------------------------------

@app.route("/api/students/<int:student_id>", methods=["GET"])
def get_student(student_id):
    student = db.session.get(Student, student_id)

    if not student:
        return jsonify({
            "message": "Student not found"
        }), 404

    return jsonify(student.to_dict())


# --------------------------------------------------
# Create student
# --------------------------------------------------

@app.route("/api/students", methods=["POST"])
def create_student():
    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body is required"
        }), 400

    required_fields = [
        "name",
        "email",
        "rollNumber",
        "department",
        "semester",
        "course",
        "cgpa",
    ]

    for field in required_fields:
        if data.get(field) in (None, ""):
            return jsonify({
                "message": f"{field} is required"
            }), 400

    existing_email = Student.query.filter_by(
        email=data["email"]
    ).first()

    if existing_email:
        return jsonify({
            "message": "A student with this email already exists"
        }), 409

    existing_roll = Student.query.filter_by(
        roll_number=data["rollNumber"]
    ).first()

    if existing_roll:
        return jsonify({
            "message": "A student with this roll number already exists"
        }), 409

    try:
        student = Student(
            name=data["name"].strip(),
            email=data["email"].strip(),
            roll_number=data["rollNumber"].strip(),
            department=data["department"].strip(),
            semester=int(data["semester"]),
            course=data["course"].strip(),
            cgpa=float(data["cgpa"]),
            phone=data.get("phone", "").strip() or None,
        )

        db.session.add(student)
        db.session.commit()

        return jsonify(student.to_dict()), 201

    except (ValueError, TypeError):
        db.session.rollback()

        return jsonify({
            "message": "Invalid semester or CGPA value"
        }), 400


# --------------------------------------------------
# Update student
# --------------------------------------------------

@app.route("/api/students/<int:student_id>", methods=["PUT"])
def update_student(student_id):
    student = db.session.get(Student, student_id)

    if not student:
        return jsonify({
            "message": "Student not found"
        }), 404

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Request body is required"
        }), 400

    try:
        if "name" in data:
            student.name = data["name"].strip()

        if "email" in data:
            email = data["email"].strip()

            existing_email = Student.query.filter(
                Student.email == email,
                Student.id != student_id
            ).first()

            if existing_email:
                return jsonify({
                    "message": "A student with this email already exists"
                }), 409

            student.email = email

        if "rollNumber" in data:
            roll_number = data["rollNumber"].strip()

            existing_roll = Student.query.filter(
                Student.roll_number == roll_number,
                Student.id != student_id
            ).first()

            if existing_roll:
                return jsonify({
                    "message": "A student with this roll number already exists"
                }), 409

            student.roll_number = roll_number

        if "department" in data:
            student.department = data["department"].strip()

        if "semester" in data:
            student.semester = int(data["semester"])

        if "course" in data:
            student.course = data["course"].strip()

        if "cgpa" in data:
            student.cgpa = float(data["cgpa"])

        if "phone" in data:
            student.phone = data["phone"].strip() or None

        db.session.commit()

        return jsonify(student.to_dict())

    except (ValueError, TypeError):
        db.session.rollback()

        return jsonify({
            "message": "Invalid semester or CGPA value"
        }), 400


# --------------------------------------------------
# Delete student
# --------------------------------------------------

@app.route("/api/students/<int:student_id>", methods=["DELETE"])
def delete_student(student_id):
    student = db.session.get(Student, student_id)

    if not student:
        return jsonify({
            "message": "Student not found"
        }), 404

    db.session.delete(student)
    db.session.commit()

    return jsonify({
        "message": "Student deleted successfully"
    })


# --------------------------------------------------
# Create database tables
# --------------------------------------------------

with app.app_context():
    db.create_all()


# --------------------------------------------------
# Run application
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )