from datetime import datetime, time
from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker


# Database setup
DATABASE_URL = "sqlite:///studentsData.db"

engine = create_engine(DATABASE_URL, echo=False)
Base = declarative_base()
Session = sessionmaker(bind=engine)


# Table definitions
class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, autoincrement=True)
    barcode = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)

    attendance_records = relationship("Attendance", back_populates="student")


class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    class_name = Column(String, nullable=False)
    period = Column(String, nullable=False)
    start_time = Column(String, nullable=False)   # format: "08:00"
    end_time = Column(String, nullable=False)     # format: "08:50"

    attendance_records = relationship("Attendance", back_populates="class_")


class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    class_id = Column(Integer, ForeignKey("classes.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.now().strftime("%x"))

    student = relationship("Student", back_populates="attendance_records")
    class_ = relationship("Class", back_populates="attendance_records")


# Create tables
Base.metadata.create_all(engine)


# Helper functions
def seed_data():
    """Adds sample students and classes if the tables are empty."""
    session = Session()

    if session.query(Student).count() == 0:
        students = [
            Student(barcode="996701", name="Sean Evans"),
            Student(barcode="1002", name="Brian Smith"),
            Student(barcode="1003", name="Carlos Lee"),
        ]
        session.add_all(students)

    if session.query(Class).count() == 0:
        classes = [
            Class(class_name="Math", period="1", start_time="08:00", end_time="08:50"),
            Class(class_name="English", period="2", start_time="09:00", end_time="09:50"),
            Class(class_name="Science", period="3", start_time="10:00", end_time="10:50"),
            Class(class_name="History", period="4", start_time="11:00", end_time="11:50"),
        ]
        session.add_all(classes)

    session.commit()
    session.close()


def get_current_class(session, current_time):
    """Returns the class that matches the current time."""
    all_classes = session.query(Class).all()

    for class_obj in all_classes:
        start = datetime.strptime(class_obj.start_time, "%H:%M").time()
        end = datetime.strptime(class_obj.end_time, "%H:%M").time()

        if start <= current_time <= end:
            return class_obj

    return None


def mark_attendance(barcode_number):
    """Looks up student by barcode and records attendance for the current class."""
    session = Session()

    try:
        student = session.query(Student).filter_by(barcode=barcode_number).first()

        if not student:
            print("Student not found.")
            return

        now = datetime.now()
        current_class = get_current_class(session, now.time())

        if not current_class:
            print(f"No class scheduled right now for {student.name}.")
            return

        record = Attendance(
            student_id=student.id,
            class_id=current_class.id,
            timestamp=datetime.now().strftime("%x")
        )

        session.add(record)
        session.commit()

        print(f"Attendance recorded:")
        print(f"Student: {student.name}")
        print(f"Class: {current_class.class_name}")
        print(f"Period: {current_class.period}")
        print(f"Time: {now}")

    finally:
        session.close()


def show_attendance():
    """Displays all attendance records."""
    session = Session()

    records = session.query(Attendance).all()

    print("\nAttendance Records")
    print("-" * 50)
    for record in records:
        print(
            f"{record.student.name} | "
            f"{record.class_.class_name} | "
            f"Period {record.class_.period} | "
            f"{record.timestamp}"
        )

    session.close()


# Main program
if __name__ == "__main__":
    seed_data()

    while True:
        print("\nAttendance Tracker")
        print("1. Scan ID")
        print("2. Show attendance")
        print("3. Quit")

        choice = input("Enter choice: ").strip()

        if choice == "1":
            barcode = input("Scan barcode / Enter student ID number: ").strip()
            mark_attendance(barcode)

        elif choice == "2":
            show_attendance()

        elif choice == "3":
            print("Goodbye.")
            break

        else:
            print("Invalid choice.")
