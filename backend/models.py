from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Student(db.Model):
    __tablename__ = "students"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), nullable=False, unique=True)

    roll_number = db.Column(
        db.String(50),
        nullable=False,
        unique=True
    )

    department = db.Column(
        db.String(100),
        nullable=False
    )

    semester = db.Column(
        db.Integer,
        nullable=False
    )

    course = db.Column(
        db.String(100),
        nullable=False
    )

    cgpa = db.Column(
        db.Float,
        nullable=False
    )

    phone = db.Column(
        db.String(20),
        nullable=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "rollNumber": self.roll_number,
            "department": self.department,
            "semester": self.semester,
            "course": self.course,
            "cgpa": self.cgpa,
            "phone": self.phone,
        }